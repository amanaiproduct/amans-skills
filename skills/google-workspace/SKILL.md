---
name: google-workspace
description: Set up and authenticate the gws CLI (@googleworkspace/cli) for Google Workspace access. Use when setting up OAuth, authenticating on headless/remote machines, configuring agent account access, or troubleshooting gws auth issues. For daily Gmail/Calendar/Drive usage, defer to the official gws skills shipped with the CLI.
---

# Google Workspace Setup Guide

Setup and auth for the [gws CLI](https://github.com/googleworkspace/cli). For daily usage, generate the official per-service skills:

```bash
gws generate-skills    # Creates gws-gmail, gws-calendar, gws-drive, etc.
```

See the [full skills index](https://github.com/googleworkspace/cli/blob/main/docs/skills.md).

## Install

```bash
npm install -g @googleworkspace/cli
```

## Setup

### Quick Setup

```bash
gws auth setup    # Creates GCP project, enables APIs, creates OAuth client (needs gcloud)
gws auth login    # Opens browser for OAuth consent
```

### Manual Setup

When `gws auth setup` fails or you want control:

1. **GCP Project**: Create at [console.cloud.google.com](https://console.cloud.google.com) or use existing
2. **Enable APIs**: Gmail, Calendar, Drive, etc.
3. **OAuth consent screen**: External user type, add your account(s) as test users
4. **Create OAuth client**: Credentials > OAuth client ID > Desktop app
5. **Save `client_secret.json`** to `~/Library/Application Support/gws/` (macOS) or `~/.config/gws/` (Linux)
6. **Authenticate**:
   ```bash
   gws auth login                              # All default scopes
   gws auth login --readonly                   # Read-only scopes
   gws auth login --scopes gmail.readonly,calendar,drive,tasks  # Custom
   ```

### Headless / Remote Machine Auth

`gws auth login` needs a browser. On headless machines:

**With agent browser (OpenClaw):** Run `gws auth login` in the background, open the printed OAuth URL via the browser tool (`profile="user"`), click through consent. Localhost redirect completes automatically since browser and CLI share the same host.

**Without browser:** Run `gws auth login`, open the URL on any machine, approve consent, copy the full redirect URL from the browser bar, extract the `code` param, and exchange it manually with `curl` or Python against `https://oauth2.googleapis.com/token`. Save the resulting refresh token as `credentials.json`.

### Credential Storage

Credentials are encrypted by default (AES-256-GCM). The CLI handles decryption and token refresh.

```bash
gws auth status    # Shows account, scopes, credential location
gws auth export    # Prints decrypted credentials (debugging only)
```

## Agent Account Pattern

Recommended for AI assistants: authenticate as a **dedicated agent account** (e.g., `agent@gmail.com`). The user shares access to their data. User credentials never touch the agent machine.

Start with minimal scopes: `gmail.readonly, drive, calendar, tasks`

### Gmail: Delegation

Gives the agent full read access to the user's entire inbox, sent mail, and thread history.

1. User: Gmail > Settings > Accounts > "Grant access to your account" > add agent email
2. Agent receives invitation email, accepts via link
3. Propagates in up to 30 minutes
4. Read user's inbox: `gws gmail +triage` with `userId: "user@gmail.com"`

```bash
gws gmail users messages list --params '{"userId": "user@gmail.com", "maxResults": 10}'
```

**Security:** Delegation technically grants send, but `gmail.readonly` scope rejects any write attempt at the API level. Two layers of protection.

**Why not forwarding?** Forwarding only gets new mail. Delegation reads the full inbox and thread history, which is critical for triage.

### Calendar & Drive: Sharing

- **Calendar**: User shares via Settings > "Share with specific people" > agent email
- **Drive**: User shares specific folders with agent email

```bash
gws calendar events list --params '{"calendarId": "user@gmail.com", "singleEvents": true, "orderBy": "startTime", "timeMin": "..."}'
gws drive files list --params '{"q": "'\''user@gmail.com'\'' in owners"}'
```

### Email Drafts (No Send)

With readonly scopes, write drafts as local markdown files for the user to review and send:

```markdown
---
to: recipient@example.com
subject: Re: Original Subject
---
Draft body here...
```

## Scopes Reference

| Scope | Access |
|-------|--------|
| `gmail.readonly` | Read email only |
| `gmail.modify` | Read + send + delete + labels |
| `calendar` / `calendar.readonly` | Full / read-only calendar |
| `drive` / `drive.readonly` | Full / read-only drive |
| `tasks` / `tasks.readonly` | Full / read-only tasks |

Start with `--readonly` and expand only as needed.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Access blocked: app not verified" | Add account as test user in GCP > Auth Platform > Audience |
| "Google hasn't verified this app" | Expected for personal projects. Click Continue |
| 403 on API calls | Check API is enabled in GCP console |
| 403 "Delegation denied" | Takes up to 30 min to propagate after acceptance |
| Wrong account's data | `gws auth status` to check active credentials |
| Redirect fails during auth | Headless machine, use agent browser or manual exchange |
