---
name: google-workspace
description: Read Gmail, Google Calendar, and Google Drive using the gws CLI and Gmail REST API. Use when checking email, reading inbox, listing calendar events, searching drive files, or drafting email replies. Triggers on "check my email", "what's on my calendar", "find in drive", "draft a reply".
---

# Google Workspace (Read-Only)

Read Gmail, Calendar, and Drive via OAuth. Supports multi-account setups where different Google accounts handle different services.

## Prerequisites

- **gws CLI**: `npm install -g @googleworkspace/cli`
- **GCP Project** with Gmail, Calendar, and Drive APIs enabled
- **OAuth Desktop Client** (client_secret.json)
- **Authenticated credentials** (see Setup)

## Setup

### 1. Install gws CLI

```bash
npm install -g @googleworkspace/cli
```

### 2. Create GCP Project & OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. Enable: Gmail API, Google Calendar API, Google Drive API
4. Go to Google Auth Platform > Branding > set app name
5. Go to Audience > add test users (the Google accounts you'll authenticate)
6. Go to Clients > Create Desktop client > download JSON
7. Save to: `~/Library/Application Support/gws/client_secret.json` (macOS) or `~/.config/gws/client_secret.json` (Linux)

### 3. Authenticate

Run the OAuth flow for each account you need. The gws CLI's built-in auth has a keyring issue on headless machines, so use this manual flow:

```bash
# Start a local callback server and open the OAuth URL in a browser
# Scopes: adjust based on needs (readonly, compose, etc.)
# After approval, exchange the auth code for tokens:

python3 -c "
import urllib.request, urllib.parse, json, os

code = 'PASTE_AUTH_CODE_HERE'
data = urllib.parse.urlencode({
    'code': code,
    'client_id': 'YOUR_CLIENT_ID',
    'client_secret': 'YOUR_CLIENT_SECRET',
    'redirect_uri': 'http://localhost:PORT',
    'grant_type': 'authorization_code'
}).encode()
req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data)
resp = urllib.request.urlopen(req)
tokens = json.loads(resp.read())

creds = {
    'type': 'authorized_user',
    'client_id': 'YOUR_CLIENT_ID',
    'client_secret': 'YOUR_CLIENT_SECRET',
    'refresh_token': tokens.get('refresh_token'),
    'token_uri': 'https://oauth2.googleapis.com/token'
}

path = os.path.expanduser('~/Library/Application Support/gws/credentials.json')
with open(path, 'w') as f:
    json.dump(creds, f, indent=2)
print('Saved')
"
```

**Important**: The credentials must use the `authorized_user` format with `type`, `client_id`, `client_secret`, `refresh_token`, and `token_uri` fields.

### 4. Multi-Account Setup

Store separate credential files for different accounts:
- `credentials.json` (default account)
- `credentials-secondaccount.json`

Switch accounts with: `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/path/to/credentials-other.json`

## Usage

### Gmail

**Known issue**: The gws CLI caches message IDs incorrectly when switching accounts. Use direct API calls for Gmail instead:

```python
import json, urllib.request, urllib.parse, os

def get_gmail_token(creds_path='~/Library/Application Support/gws/credentials.json'):
    path = os.path.expanduser(creds_path)
    with open(path) as f:
        creds = json.load(f)
    data = urllib.parse.urlencode({
        'client_id': creds['client_id'],
        'client_secret': creds['client_secret'],
        'refresh_token': creds['refresh_token'],
        'grant_type': 'refresh_token'
    }).encode()
    req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())['access_token']

def gmail_api(endpoint, token):
    req = urllib.request.Request(f'https://gmail.googleapis.com/gmail/v1/users/me/{endpoint}')
    req.add_header('Authorization', f'Bearer {token}')
    return json.loads(urllib.request.urlopen(req).read())

# Get profile
token = get_gmail_token()
profile = gmail_api('profile', token)

# List messages
msgs = gmail_api('messages?maxResults=10&q=is:unread', token)

# Get a message with headers
msg = gmail_api(f'messages/{msg_id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date', token)
headers = {h['name']: h['value'] for h in msg['payload']['headers']}

# Get full message body
msg = gmail_api(f'messages/{msg_id}?format=full', token)
```

**Common Gmail queries:**
- `is:unread` - unread messages
- `newer_than:1d` - last 24 hours
- `from:someone@example.com` - from specific sender
- `label:INBOX` - inbox only
- `is:unread -category:promotions -category:social` - unread, skip noise

### Calendar

The gws CLI works correctly for Calendar:

```bash
# List calendars
gws calendar calendarList list --params '{}'

# List upcoming events
gws calendar events list --params '{"calendarId": "primary", "maxResults": 10, "timeMin": "2024-01-01T00:00:00Z", "singleEvents": true, "orderBy": "startTime"}'

# Search events
gws calendar events list --params '{"calendarId": "primary", "q": "meeting", "timeMin": "2024-01-01T00:00:00Z"}'
```

**Shared calendars**: If reading another user's calendar, they must share it with your authenticated account. The shared calendar appears in `calendarList list`.

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
```

## Email Draft Workflow

When drafting replies without send access, write them as markdown files:

```markdown
## To: recipient@example.com
Subject: Re: Original Subject

Draft body here...
```

Save to an agreed-upon directory (e.g., an Obsidian vault, shared folder).

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

**Recommendation**: Start with readonly scopes and add more only as needed.

## Troubleshooting

- **"Access blocked: app not verified"**: Add the Google account as a test user in GCP > Auth Platform > Audience
- **"Delegation denied"**: You're trying to read another user's data. Use OAuth as that user directly, or set up forwarding/sharing
- **gws CLI returns wrong message IDs**: Known caching bug. Use direct Python/curl API calls for Gmail
- **Credentials not saving after login**: The gws CLI has keyring issues on headless machines. Save credentials manually in `authorized_user` JSON format
- **"Invalid scope"**: Use full scope URLs (e.g., `https://www.googleapis.com/auth/gmail.readonly`), not short names
