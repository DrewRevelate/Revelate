# Slack Contact Form Integration Setup

This guide will help you set up Slack integration so contact form submissions from your website are sent **directly to you as private DMs in Slack** - like text messages, not in a channel.

## Prerequisites

- A Slack workspace where you have admin permissions
- Access to create Slack apps

## Step 1: Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter:
   - **App Name**: "Revelate Contact Form" (or any name you prefer)
   - **Workspace**: Select your workspace
5. Click **"Create App"**

## Step 2: Add Bot Token Scopes

1. In your app settings, go to **"OAuth & Permissions"** (left sidebar)
2. Scroll down to **"Scopes"** → **"Bot Token Scopes"**
3. Click **"Add an OAuth Scope"** and add:
   - `chat:write` - To post messages to channels
4. You may also want to add:
   - `chat:write.public` - To post in public channels without joining them first (optional)

## Step 3: Install App to Workspace

1. Scroll to the top of the **"OAuth & Permissions"** page
2. Click **"Install to Workspace"**
3. Review the permissions and click **"Allow"**
4. You'll see a **Bot User OAuth Token** that starts with `xoxb-`
5. **Copy this token** - you'll need it for your `.env.local` file

## Step 4: Get Your Slack User ID

Since messages will be sent as **direct messages to you**, you need your Slack User ID (not a channel ID).

### Find Your User ID:

**Method 1: Via Slack App (Easiest)**
1. Open Slack
2. Click on your profile picture (top right)
3. Select **"Profile"**
4. Click the three dots (**•••**) next to your name
5. Select **"Copy member ID"**
6. Your User ID looks like `U1234567890`

**Method 2: Via Browser Console**
1. Open Slack in your web browser
2. Open Developer Console (F12 or Right-click → Inspect)
3. Type in console: `TS.model.user.id`
4. Press Enter - this will show your User ID

**Method 3: Via API (If you have the token already)**
1. Go to: https://api.slack.com/methods/users.identity/test
2. Use your token to call the API
3. Your User ID will be in the response

## Step 5: Configure Environment Variables

1. Open your `.env.local` file in the revelateops-website directory
2. Add or update these variables:

```env
# Slack Integration for Contact Form
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here
SLACK_USER_ID=U1234567890
```

**Important Notes:**
- Use the actual Bot User OAuth Token (starts with `xoxb-` for bot tokens or `xoxe.xoxp-` for user tokens)
- Use your User ID (starts with `U`, like `U1234567890`)
- Never commit your `.env.local` file to version control

## Step 6: Test the Integration

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/contact` on your website
3. Fill out the form (name, email, phone, and message are all required)
4. Submit the form
5. **Check your Slack DMs** - you should receive a private message from yourself (or the bot) with the contact form details

## Message Format

Contact form submissions will appear **as DMs to you** in Slack with:
- 📬 Header indicating it's a new contact form message
- Name, Email, and Phone of the submitter (all required)
- Company (if provided)
- The complete message
- Timestamp of submission
- Clean formatting with sections and dividers

**Privacy:** Each submission creates a separate DM conversation. Users cannot see each other's messages.

## Troubleshooting

### "Slack integration not configured" error
- Make sure both `SLACK_BOT_TOKEN` and `SLACK_USER_ID` are set in `.env.local`
- Restart your development server after adding environment variables

### "channel_not_found" or "user_not_found" error
- Verify your User ID is correct (should start with `U`)
- Try the different methods in Step 4 to confirm your User ID
- Make sure you copied the User ID, not a channel ID

### "not_authed" or "invalid_auth" error
- Double-check your Bot User OAuth Token
- Make sure you copied the entire token (they're long!)
- Verify the token starts with `xoxb-`

### Messages not appearing in DMs
- Check the bot/user token has the `chat:write` scope
- Verify your User ID is correct
- Check your Slack DMs (not channels)
- Check your server logs for errors

## Rate Limits

The Slack API allows:
- 1 message per second to a specific channel
- Several hundred messages per minute workspace-wide
- Burst behavior is supported

This should be more than sufficient for a contact form.

## Security Notes

- **Never** commit your `.env.local` file
- Keep your Bot User OAuth Token secret
- Consider adding rate limiting to your contact form to prevent abuse
- The API route validates required fields before sending to Slack

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add the environment variables in your hosting platform:
   - For Vercel: Project Settings → Environment Variables
   - Add `SLACK_BOT_TOKEN` and `SLACK_USER_ID`

2. Redeploy your application

## Additional Resources

- [Slack API Documentation](https://api.slack.com/docs)
- [chat.postMessage API Reference](https://api.slack.com/methods/chat.postMessage)
- [Block Kit Builder](https://app.slack.com/block-kit-builder) - Design custom message layouts
