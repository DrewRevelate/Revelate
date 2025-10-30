# Fix Slack Token Scope Issue

## Problem Found ✓

Your Slack token is working, but it's **missing the required permissions** to send messages.

**Current scopes:**
- ❌ identify
- ❌ app_configurations:read
- ❌ app_configurations:write

**Required scope:**
- ✅ **chat:write** (to send messages)

## How to Fix This

### Step 1: Go to Your Slack App

1. Open https://api.slack.com/apps
2. Find and click on your app (or create a new one if needed)

### Step 2: Add the Required Scope

1. In the left sidebar, click **"OAuth & Permissions"**
2. Scroll down to **"Scopes"** section
3. Under **"User Token Scopes"** (since you have a user token), click **"Add an OAuth Scope"**
4. Add: **`chat:write`**

**Alternative:** If you want to use a Bot Token instead (recommended):
- Under **"Bot Token Scopes"**, add **`chat:write`**
- Bot tokens are simpler and more reliable for this use case

### Step 3: Reinstall the App

1. Scroll back to the top of the **"OAuth & Permissions"** page
2. Click **"Reinstall to Workspace"**
3. Review the new permissions
4. Click **"Allow"**

### Step 4: Copy Your New Token

After reinstalling, you'll see either:
- **Bot User OAuth Token** (starts with `xoxb-`) - Recommended
- **User OAuth Token** (starts with `xoxp-`)

Copy the token you want to use.

### Step 5: Update Your `.env.local`

Replace the `SLACK_BOT_TOKEN` value in your `.env.local` file:

```env
SLACK_BOT_TOKEN=xoxb-your-new-token-here
# OR if using user token:
SLACK_BOT_TOKEN=xoxp-your-new-token-here
```

### Step 6: Test Again

Run the test script:
```bash
node test-slack.js
```

You should see:
```
✅ Success! Message sent to your Slack DMs
```

### Step 7: Test the Contact Form

1. Restart your dev server (if running)
2. Go to http://localhost:3000/contact
3. Fill out the form
4. Submit
5. Check your Slack DMs!

## Why This Happened

The token you're using was created for app configuration, not for sending messages. By adding the `chat:write` scope, you're giving your app permission to send messages on your behalf.

## Bot Token vs User Token

**Bot Token (Recommended):**
- Simpler to set up
- Doesn't expire as frequently
- Starts with `xoxb-`
- Messages appear from a bot

**User Token:**
- Messages appear as if you sent them
- Starts with `xoxp-`
- May need periodic refresh

For a contact form, **Bot Token is recommended** because it's more reliable.

## Still Having Issues?

If you're still getting errors after following these steps:

1. Double-check the scope is added (look for `chat:write` in the scopes list)
2. Make sure you reinstalled the app after adding the scope
3. Verify you copied the full token
4. Run `node test-slack.js` to see the exact error
5. Check that SLACK_USER_ID is correct (U09J8RBV18T)

## Next Steps

Once the test script shows ✅ Success, your contact form will work perfectly!
