---
name: google-workspace
description: Set up and authenticate the gws CLI (@googleworkspace/cli) for Google Workspace access. Use when setting up OAuth, authenticating on headless machines, configuring multi-account credentials, or troubleshooting gws auth issues. For daily Gmail/Calendar/Drive usage, defer to the official gws skills (gws-gmail, gws-calendar, gws-drive, etc.) shipped with the CLI.
---

# Google Workspace Setup Guide

This skill covers **setup, authentication, and configuration** for the [gws CLI](https://github.com/googleworkspace/cli). For daily usage (reading email, checking calendar, managing drive), use the official skills that ship with the CLI:

```bash
gws generate-skills    # Creates per-service skills in ./skills/
```

This produces modular skills for every service (`gws-gmail`, `gws-calendar`, `gws-drive`, `gws-sheets`, etc.), helper commands (`gws-gmail-triage`, `gws-calendar-agenda`, etc.), workflow automations (`gws-workflow-standup-report`, `gws-workflow-meeting-prep`), and persona bundles (`persona-exec-assistant`). See the [full skills index](https://github.com/googleworkspace/cli/blob/main/docs/skills.md).

## Install

```bash
npm install -g @googleworkspace/cli
```

## Setup

### Quick Setup (gcloud available)

If `gcloud` is installed and authenticated with a GCP project owner account:

```bash
gws auth setup              # Creates GCP project, enables APIs, creates OAuth client
gws auth login              # Opens browser for OAuth consent
```

### Manual Setup

When `gws auth setup` fails (permissions, existing project, or you want control):

1. **GCP Project**: Create at [console.cloud.google.com](https://console.cloud.google.com) or use existing
2. **Enable APIs**: Gmail, Calendar, Drive, and any others needed
3. **OAuth consent screen**: Set to External user type, add your Google account(s) as test users (Auth Platform > Audience)
4. **Create OAuth client**: Credentials > Create > OAuth client ID > Desktop app
5. **Save client_secret.json**:
   - macOS: `~/Library/Application Support/gws/client_secret.json`
   - Linux: `~/.config/gws/client_secret.json`
   - Or use env vars: `GOOGLE_WORKSPACE_CLI_CLIENT_ID` + `GOOGLE_WORKSPACE_CLI_CLIENT_SECRET`
6. **Authenticate**:
   ```bash
   gws auth login                    # All default scopes
   gws auth login --readonly         # Read-only scopes only
   gws auth login --scopes gmail.readonly,calendar.readonly  # Custom scopes
   ```

### Headless / Remote Machine Setup

`gws auth login` opens a browser and listens on localhost for the OAuth redirect. On headless machines, the browser can't open locally. Two approaches:

#### Option A: Agent browser (recommended for OpenClaw)

If your agent has browser access (e.g., OpenClaw's `user` profile with Chrome DevTools MCP):

1. Run `gws auth login` in the background. It prints an OAuth URL and starts a localhost listener.
2. Use the agent's browser tool to open the OAuth URL in the user's Chrome session.
3. The agent clicks through the account chooser and consent screens.
4. The localhost redirect completes automatically since the browser and CLI are on the same machine.

This works because the browser tool controls the real Chrome session on the same host, so `localhost` redirects resolve correctly.

#### Option B: Manual token exchange (no browser access)

1. Run `gws auth login` on the headless machine. It prints an OAuth URL and starts listening.
2. Open that URL in a browser on **any machine** (your laptop, phone, etc.)
3. Approve the consent screen. The browser tries to redirect to `http://localhost:<port>?code=...`
4. If the redirect fails (different machine), copy the **full redirect URL** from the browser's address bar. Extract the `code` parameter.
5. Exchange the code manually on the headless machine:

```bash
export CLIENT_ID="your-client-id"
export CLIENT_SECRET="your-client-secret"
export AUTH_CODE="paste-auth-code-here"

python3 -c "
import urllib.request, urllib.parse, json, os
data = urllib.parse.urlencode({
    'code': os.environ['AUTH_CODE'],
    'client_id': os.environ['CLIENT_ID'],
    'client_secret': os.environ['CLIENT_SECRET'],
    'redirect_uri': 'http://localhost',
    'grant_type': 'authorization_code'
}).encode()
req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data)
tokens = json.loads(urllib.request.urlopen(req).read())
creds = {
    'type': 'authorized_user',
    'client_id': os.environ['CLIENT_ID'],
    'client_secret': os.environ['CLIENT_SECRET'],
    'refresh_token': tokens['refresh_token'],
    'token_uri': 'https://oauth2.googleapis.com/token'
}
path = os.path.expanduser('~/Library/Application Support/gws/credentials.json')
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, 'w') as f:
    json.dump(creds, f, indent=2)
print('Saved credentials to', path)
"
```

The credentials file **must** use `authorized_user` format with fields: `type`, `client_id`, `client_secret`, `refresh_token`, `token_uri`.

### Verify Auth

```bash
gws auth status    # Shows authenticated account and active scopes
gws auth export    # Prints decrypted credentials (debugging only)
```

### Credential Storage

`gws auth login` saves credentials encrypted by default (AES-256-GCM, key in OS Keyring or local `.encryption_key`):

- Encrypted: `~/Library/Application Support/gws/credentials.enc`
- Plaintext fallback: `~/Library/Application Support/gws/credentials.json`

The CLI handles decryption and token refresh automatically. Prefer encrypted storage for agent machines.

## Multi-Account Setup

To use multiple Google accounts (e.g., a read-only service account + your personal account):

```bash
# Default credentials
~/Library/Application Support/gws/credentials.json

# Switch per-command via env var
GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=~/path/to/other-credentials.json gws gmail +triage

# Or use a pre-obtained token
GOOGLE_WORKSPACE_CLI_TOKEN="ya29.xxx" gws gmail +triage
```

Repeat the auth flow (login or manual exchange) for each account, saving to separate credential files.

## Read-Only Mode & Email Drafts

When operating without send/compose scopes (recommended for AI assistants):

- Authenticate with `gws auth login --readonly` or `--scopes gmail.readonly,calendar.readonly,drive.readonly`
- Write email drafts as local markdown files instead of sending:

```markdown
---
to: recipient@example.com
subject: Re: Original Subject
in_reply_to: <message-id@mail.gmail.com>
date: 2026-03-05
---

Draft body here...
```

Save to an agreed-upon directory (e.g., Obsidian vault). The user reviews and sends manually.

## Reading Another User's Data (Agent Account Pattern)

The recommended pattern for AI assistants: **authenticate as a dedicated agent account** (e.g., `agent@gmail.com`) and have the user share access to their data. The user's credentials never touch the agent's machine.

### Gmail: Delegation (recommended)

Gmail delegation gives the agent account full read access to the user's entire inbox:

1. User goes to Gmail > Settings > Accounts > "Grant access to your account"
2. User adds the agent's email address
3. Agent account receives an invitation email with an acceptance link
4. After accepting, it takes up to 30 minutes to propagate
5. Agent reads the user's inbox via: `userId: "user@gmail.com"` in API calls

```bash
# Read the user's inbox (not the agent's)
gws gmail +triage --params '{"userId": "user@gmail.com"}'
gws gmail users messages list --params '{"userId": "user@gmail.com", "maxResults": 10}'
```

**Security note:** Delegation technically grants send access, but if the agent authenticates with `gmail.readonly` scope, the API will reject any write attempt. This gives two layers of protection: scope restriction + your ability to revoke delegation at any time.

**Why not forwarding?** Forwarding only captures new incoming mail. With delegation, the agent can read the full inbox, sent mail, and thread history, which is critical for triage (checking if the user already replied to a thread).

### Calendar: Sharing

User shares specific calendars with the agent account:
- Google Calendar > Settings > "Share with specific people" > add agent email
- Choose "See all event details" (read) or "Make changes to events" (write)

```bash
gws calendar events list --params '{"calendarId": "user@gmail.com", "timeMin": "...", "singleEvents": true, "orderBy": "startTime"}'
```

### Drive: Sharing

User shares specific folders with the agent account:
- Right-click folder > Share > add agent email as Viewer or Editor

```bash
gws drive files list --params '{"q": "'\''user@gmail.com'\'' in owners"}'
```

### Other options

| Method | Pros | Cons |
|--------|------|------|
| **Delegation** (Gmail) | Full inbox read, real-time, thread history | Up to 30 min propagation, technically grants send (mitigated by readonly scope) |
| **Forwarding** (Gmail) | Simple setup | New mail only, no sent/thread history, breaks triage |
| **Direct OAuth as user** | Full access | User's credentials on agent machine (security risk) |
| **Domain-wide delegation** | No user interaction needed | Google Workspace orgs only, not personal accounts |

## Scopes Reference

| Scope | Access |
|-------|--------|
| `gmail.readonly` | Read email only |
| `gmail.compose` | Read + create drafts + send |
| `gmail.modify` | Read + send + delete + manage labels |
| `calendar.readonly` | Read calendar events |
| `calendar` | Full calendar access |
| `drive.readonly` | Read drive files |
| `drive` | Full drive access |
| `tasks.readonly` | Read tasks |
| `tasks` | Full task access |

Start with `--readonly` and expand only as needed.

## Daily Usage

After setup, use the official gws skills and helpers for daily work:

| Task | Command |
|------|---------|
| Triage inbox | `gws gmail +triage` |
| Send email | `gws gmail +send --to x --subject y --body z` |
| Today's agenda | `gws calendar +agenda --today` |
| Create event | `gws calendar +insert --title "..." --start ... --end ...` |
| Upload file | `gws drive +upload /path/to/file` |
| Standup summary | `gws workflow +standup-report` |
| Meeting prep | `gws workflow +meeting-prep` |
| Weekly digest | `gws workflow +weekly-digest` |
| Email to task | `gws workflow +email-to-task` |
| Discover API | `gws schema gmail.users.messages.list` |

For full usage details, run `gws generate-skills` and read the per-service skills, or see the [skills index](https://github.com/googleworkspace/cli/blob/main/docs/skills.md).

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Access blocked: app not verified" | Add the Google account as a test user in GCP > Auth Platform > Audience |
| "Google hasn't verified this app" | Expected for personal GCP projects. Click Continue (safe for your own app) |
| `gws auth setup` permission denied | The gcloud-authenticated account needs Owner/Editor role on the GCP project |
| Credentials not saving after `gws auth login` | Keyring issue on headless machines. Use the manual token exchange above |
| 403 on API calls | Check that the required API is enabled in GCP console |
| 403 "Delegation denied" | Delegation takes up to 30 min to propagate after acceptance |
| Wrong account's data returned | Verify which credential file is active with `gws auth status` |
| "Invalid scope" | Use short names with `gws auth login --scopes` (e.g., `gmail.readonly`). For raw API, use full URLs |
| Redirect fails during auth | Headless machine. Use agent browser (Option A) or manual token exchange (Option B) |
| Both credential files show same account | Check with `gws auth status`. Re-run auth flow selecting the correct account |
