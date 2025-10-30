# Alternative: Use Slack Webhook (Simpler!)

Instead of dealing with OAuth tokens and scopes, you can use a **Slack Webhook** which is much simpler for contact forms.

## Setup (2 minutes)

### Step 1: Create an Incoming Webhook

1. Go to: https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name it: "Contact Form" (or whatever you like)
4. Select your workspace
5. Click **"Create App"**

### Step 2: Enable Incoming Webhooks

1. In the left sidebar, click **"Incoming Webhooks"**
2. Toggle **"Activate Incoming Webhooks"** to **ON**
3. Click **"Add New Webhook to Workspace"**
4. Select where you want messages sent:
   - Choose **"Slackbot"** to send to yourself as DMs
   - Or choose a specific channel
5. Click **"Allow"**

### Step 3: Copy Your Webhook URL

You'll see a **Webhook URL** that looks like:
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

**Copy this entire URL**

### Step 4: Update `.env.local`

Replace your current Slack configuration with just the webhook:

```env
# Slack Webhook for Contact Form
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

That's it! Much simpler than OAuth tokens.

## Benefits of Webhooks

- ✅ No OAuth scopes to manage
- ✅ Never expires (unless you revoke it)
- ✅ Simpler to set up
- ✅ Perfect for one-way messaging (contact forms)
- ✅ More secure (can only send to pre-configured destination)

## Next Steps

Once you have the webhook URL, let me know and I'll update the API route to use it instead of the OAuth token.
