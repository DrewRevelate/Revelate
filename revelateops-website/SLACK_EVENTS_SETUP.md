# Slack Events API Setup (Final Step!)

This allows your Slack replies to appear in the chat widget on your website.

## Step 1: Start ngrok (For Local Testing)

In a **new terminal window**, run:

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123def.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123def.ngrok-free.app`)

Keep this terminal window open!

## Step 2: Start Your Dev Server

In another terminal:

```bash
cd /Users/drewlambert/Desktop/Revelate/revelateops-website
npm run dev
```

## Step 3: Configure Slack Events API

1. **Go to your Slack App:** https://api.slack.com/apps
2. **Select your app** (the one you created earlier)
3. **Click "Event Subscriptions"** in the left sidebar
4. **Toggle "Enable Events" to ON**

5. **Add Request URL:**
   - Take your ngrok URL from Step 1
   - Add `/api/slack/events` to the end
   - Example: `https://abc123def.ngrok-free.app/api/slack/events`
   - Paste it in the "Request URL" field
   - Slack will verify it (you'll see ✅ Verified when successful)

6. **Subscribe to Bot Events:**
   - Scroll down to "Subscribe to bot events"
   - Click **"Add Bot User Event"**
   - Add: **`message.im`** (this is direct messages)
   - Click **"Save Changes"**

7. **Reinstall Your App:**
   - Slack will show a banner saying you need to reinstall
   - Click **"reinstall your app"**
   - Click **"Allow"**

## Step 4: Test the Complete Flow!

Now everything should work! Let's test:

1. **Go to:** http://localhost:3000/contact

2. **Fill out the form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: (555) 123-4567
   - Message: Testing my two-way chat!

3. **Click "Start Conversation"**
   - ✅ Form should transition to chat widget
   - ✅ You should see your first message in the chat

4. **Check Slack:**
   - ✅ You should receive a DM with the message

5. **Reply in Slack:**
   - Go to the Slack DM
   - Reply in the thread: "Hey! I got your message."

6. **Watch the magic!**
   - Within 5 seconds, your reply should appear in the chat widget!

7. **Continue the conversation:**
   - Type another message in the chat widget
   - It appears in Slack thread
   - Reply again in Slack
   - It appears in the chat widget

## Verification Checklist

- [ ] ngrok running (https URL showing)
- [ ] Dev server running (localhost:3000)
- [ ] Slack Events enabled
- [ ] Webhook URL verified (✅ in Slack)
- [ ] `message.im` event subscribed
- [ ] App reinstalled
- [ ] First message sent from website
- [ ] Message received in Slack
- [ ] Reply sent from Slack
- [ ] Reply appears in chat widget (within 5 seconds)

## Troubleshooting

### "Webhook verification failed"
- Make sure ngrok is running
- Make sure dev server is running
- Check the URL is correct: `https://your-ngrok-url.ngrok-free.app/api/slack/events`
- Check server logs for errors

### "Reply not appearing in chat"
- Check browser console for errors
- Verify the webhook URL shows ✅ Verified
- Check that you subscribed to `message.im` event
- Make sure you're replying in the thread (not a new message)
- Wait 5-10 seconds (polling interval)

### "Can't send messages from chat"
- Check that SLACK_BOT_TOKEN is in .env.local
- Verify token has `chat:write` scope
- Check server logs when sending

## For Production

When you deploy to Vercel:

1. **Update Slack Events URL:**
   - Change from ngrok URL to: `https://your-domain.vercel.app/api/slack/events`
   - Slack will verify it
   - Save changes

2. **No ngrok needed in production!**
   - Slack will send events directly to your Vercel URL

## Success! 🎉

If all checks pass, you now have a fully functional two-way chat system!

Users can message you through your website, and you can reply directly from Slack. They see your replies in real-time (within 5 seconds).
