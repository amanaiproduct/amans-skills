---
name: google-workspace
description: Read and manage Gmail, Google Calendar, Google Drive, Sheets, Docs, and Tasks using the gws CLI (@googleworkspace/cli). Use when checking email, reading inbox, listing calendar events, searching drive files, drafting email replies, creating calendar events, or working with spreadsheets. Triggers on "check my email", "what's on my calendar", "find in drive", "draft a reply", "create an event", "read that spreadsheet", "triage my inbox".
---

# Google Workspace CLI (gws)

Use `gws` for Gmail, Calendar, Drive, Sheets, Docs, and Tasks. Built-in helper commands (`+triage`, `+send`, `+agenda`, `+insert`) handle common workflows. Raw API access available for everything else.

## Prerequisites

- **gws CLI**: `npm install -g @googleworkspace/cli`
- **GCP Project** with required APIs enabled (Gmail, Calendar, Drive, etc.)
- **OAuth Desktop Client** credentials
- Authenticated via `gws auth login`

## Setup

### Quick Setup (recommended)

If `gcloud` is installed and authenticated:

```bash
gws auth setup              # Creates project, enables APIs, creates OAuth client
gws auth login              # Opens browser for OAuth consent
```

### Manual Setup

1. **Create GCP Project** at [console.cloud.google.com](https://console.cloud.google.com)
2. **Enable APIs**: Gmail, Calendar, Drive (and any others needed)
3. **Configure OAuth consent screen**: External user type, add test users
4. **Create OAuth Desktop client**: Credentials > Create > OAuth client ID > Desktop app
5. **Save client_secret.json**:
   - macOS: `~/Library/Application Support/gws/client_secret.json`
   - Linux: `~/.config/gws/client_secret.json`
   - Or set env vars: `GOOGLE_WORKSPACE_CLI_CLIENT_ID` and `GOOGLE_WORKSPACE_CLI_CLIENT_SECRET`
6. **Authenticate**:
   ```bash
   gws auth login                    # Default scopes
   gws auth login --readonly         # Read-only scopes only
   gws auth login --scopes gmail.readonly,calendar.readonly,drive.readonly  # Custom
   ```

### Headless / Remote Machine Setup

The `gws auth login` flow opens a browser. On headless machines:

1. Run `gws auth login` — it prints an OAuth URL and starts a local listener
2. Open that URL in any browser (can be on a different machine)
3. After consent, the browser redirects to `http://localhost:<port>?code=...`
4. If the redirect fails (different machine), copy the `code` parameter from the URL bar
5. Exchange manually:

```bash
# Set these from your OAuth client
export CLIENT_ID="your-client-id"
export CLIENT_SECRET="your-client-secret"
export AUTH_CODE="paste-code-here"

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

The credentials file must use `authorized_user` format with fields: `type`, `client_id`, `client_secret`, `refresh_token`, `token_uri`.

### Check Auth Status

```bash
gws auth status    # Shows authenticated account and scopes
gws auth export    # Prints decrypted credentials (for debugging)
```

## Usage

### Gmail

**Triage inbox** (read-only helper):
```bash
gws gmail +triage                              # Unread inbox summary
gws gmail +triage --max 5                      # Limit results
gws gmail +triage --query 'from:boss'          # Custom query
gws gmail +triage --query 'newer_than:1d'      # Last 24 hours
gws gmail +triage --format table               # Table output
gws gmail +triage --labels                     # Include label names
```

**Send email** (requires compose scope):
```bash
gws gmail +send --to alice@example.com --subject "Hi" --body "Hello!"
```

**Raw API** for advanced queries:
```bash
# List messages
gws gmail users messages list --params '{"userId": "me", "maxResults": 10, "q": "is:unread"}'

# Get message (metadata only)
gws gmail users messages get --params '{"userId": "me", "id": "MSG_ID", "format": "metadata", "metadataHeaders": ["From", "To", "Subject", "Date"]}'

# Get full message
gws gmail users messages get --params '{"userId": "me", "id": "MSG_ID", "format": "full"}'

# List labels
gws gmail users labels list --params '{"userId": "me"}'
```

**Common Gmail queries:**
- `is:unread` — unread messages
- `newer_than:1d` — last 24 hours
- `from:someone@example.com` — from specific sender
- `label:INBOX` — inbox only
- `is:unread -category:promotions -category:social` — unread, skip noise
- `has:attachment newer_than:7d` — recent with attachments

### Calendar

**Upcoming agenda** (helper):
```bash
gws calendar +agenda                           # Shows upcoming events across all calendars
```

**Create event** (helper):
```bash
gws calendar +insert --title "Lunch" --start "2024-03-15T12:00:00" --end "2024-03-15T13:00:00"
```

**Raw API:**
```bash
# List calendars
gws calendar calendarList list --params '{}'

# List events
gws calendar events list --params '{
  "calendarId": "primary",
  "maxResults": 10,
  "timeMin": "2024-01-01T00:00:00Z",
  "singleEvents": true,
  "orderBy": "startTime"
}'

# Search events
gws calendar events list --params '{"calendarId": "primary", "q": "standup", "timeMin": "2024-01-01T00:00:00Z"}'

# Create event
gws calendar events insert --params '{"calendarId": "primary"}' --json '{
  "summary": "Team Sync",
  "start": {"dateTime": "2024-03-15T10:00:00-05:00"},
  "end": {"dateTime": "2024-03-15T10:30:00-05:00"}
}'
```

**Shared calendars**: The other user must share their calendar with your authenticated account. Shared calendars appear in `calendarList list`.

### Drive

```bash
# List files
gws drive files list --params '{"pageSize": 10}'

# Search files
gws drive files list --params '{"q": "name contains '\''report'\''", "pageSize": 10}'

# Get file metadata
gws drive files get --params '{"fileId": "FILE_ID"}'

# Export Google Docs as text
gws drive files export --params '{"fileId": "FILE_ID", "mimeType": "text/plain"}' --output /tmp/doc.txt

# Download binary file
gws drive files get --params '{"fileId": "FILE_ID", "alt": "media"}' --output /tmp/file.pdf
```

**Shared Drive files**: The other user must share folders/files with your authenticated account (Viewer for read-only).

### Sheets

```bash
# Get spreadsheet metadata
gws sheets spreadsheets get --params '{"spreadsheetId": "SHEET_ID"}'

# Read a range
gws sheets spreadsheets values get --params '{"spreadsheetId": "SHEET_ID", "range": "Sheet1!A1:D10"}'

# Write values
gws sheets spreadsheets values update --params '{"spreadsheetId": "SHEET_ID", "range": "Sheet1!A1:B2", "valueInputOption": "USER_ENTERED"}' --json '{"values": [["A","B"],["1","2"]]}'

# Append rows
gws sheets spreadsheets values append --params '{"spreadsheetId": "SHEET_ID", "range": "Sheet1!A:C", "valueInputOption": "USER_ENTERED", "insertDataOption": "INSERT_ROWS"}' --json '{"values": [["x","y","z"]]}'
```

### Docs

```bash
# Read document content
gws docs documents get --params '{"documentId": "DOC_ID"}'

# Export as plain text (via Drive)
gws drive files export --params '{"fileId": "DOC_ID", "mimeType": "text/plain"}' --output /tmp/doc.txt
```

### Tasks

```bash
# List task lists
gws tasks tasklists list --params '{}'

# List tasks in a list
gws tasks tasks list --params '{"tasklist": "TASKLIST_ID"}'

# Create task
gws tasks tasks insert --params '{"tasklist": "TASKLIST_ID"}' --json '{"title": "Buy groceries", "due": "2024-03-15T00:00:00Z"}'
```

## Output Formats

All commands support `--format`:
- `json` (default) — machine-readable
- `table` — human-readable columns
- `yaml` — YAML output
- `csv` — comma-separated

For scripting, use `--format json` and pipe to `jq`.

## Pagination

For large result sets:
```bash
gws drive files list --params '{"pageSize": 100}' --page-all --page-limit 5
```

`--page-all` auto-paginates (NDJSON, one JSON object per page). `--page-limit` caps pages fetched.

## Multi-Account Setup

Use separate credential files per account:
```bash
GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=~/path/to/other-creds.json gws gmail +triage
```

Or use a pre-obtained token:
```bash
GOOGLE_WORKSPACE_CLI_TOKEN="ya29.xxx" gws gmail +triage
```

## Email Draft Workflow (Read-Only Mode)

When operating without send/compose scopes, write email drafts as local markdown files instead of sending:

```markdown
---
to: recipient@example.com
subject: Re: Original Subject
in_reply_to: <message-id@mail.gmail.com>
---

Draft body here...
```

Save to an agreed-upon directory (e.g., Obsidian vault, shared folder). The user reviews and sends manually.

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

Start with `--readonly` and add scopes only as needed.

## Reading Another User's Data

For personal Gmail accounts, you cannot directly read another user's inbox via OAuth. Options:

1. **Email forwarding** (recommended): Forward from their account to yours. Cleanest, no API workarounds needed.
2. **Calendar/Drive sharing**: The other user shares specific calendars or folders with your account (read-only).
3. **Gmail delegation**: Available but grants send access too (security concern). Personal account delegates take up to 24 hours to activate, invitations expire in 7 days.
4. **Domain-wide delegation**: Google Workspace only (not personal accounts).

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Access blocked: app not verified" | Add account as test user in GCP > Auth Platform > Audience |
| "Delegation denied" | Can't read another user's data via OAuth. Use forwarding or sharing instead |
| Credentials not saving after `gws auth login` | Known keyring issue on headless machines. Use the manual token exchange method above |
| "Invalid scope" | Use short names (`gmail.readonly`) with `gws auth login --scopes`. For raw API, use full URLs |
| 403 on API calls | Check that the required API is enabled in GCP console |
| Wrong account's data returned | Set `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` to the correct credentials file |
| `gws auth setup` permission denied | The authenticated gcloud account needs project Owner/Editor role |
