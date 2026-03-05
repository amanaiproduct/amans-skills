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

`gws auth login` opens a browser and listens on localhost for the OAuth redirect. On headless machines (SSH, remote Mac Mini, CI), the redirect can't reach the CLI. Workaround:

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

## Reading Another User's Data

For **personal Gmail accounts**, you cannot read another user's inbox via your own OAuth token. Options:

1. **Email forwarding** (recommended): Set up forwarding from their account to yours. Cleanest approach, no API workarounds, no security concerns.
2. **Calendar/Drive sharing**: The other user shares specific calendars (read-only) or Drive folders (Viewer) with your account. Shared items appear in `gws calendar calendarList list` and `gws drive files list`.
3. **Direct OAuth as that user**: Run the auth flow with their account. Requires their consent. Most complete access but requires their participation.
4. **Gmail delegation**: Available for personal accounts but grants send access too (security concern). Delegates take up to 24 hours to activate, invitation expires in 7 days.
5. **Domain-wide delegation**: Google Workspace organizations only. Not available for personal accounts.

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
| `gws auth setup` permission denied | The gcloud-authenticated account needs Owner/Editor role on the GCP project |
| Credentials not saving after `gws auth login` | Keyring issue on headless machines. Use the manual token exchange above |
| 403 on API calls | Check that the required API is enabled in GCP console |
| Wrong account's data returned | Verify which credential file is active with `gws auth status` |
| "Invalid scope" | Use short names with `gws auth login --scopes` (e.g., `gmail.readonly`). For raw API, use full URLs |
| Redirect fails during auth | Headless machine. Copy the code from the URL bar and exchange manually |
