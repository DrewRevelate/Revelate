# Quick Guide: Find Your Slack User ID

You need your Slack User ID so contact form submissions are sent directly to you as DMs.

## Easiest Method: Use Slack Profile

1. **Open Slack** (desktop app or web)
2. **Click your profile picture** in the top right
3. **Select "Profile"**
4. **Click the three dots** (•••) next to "Edit Profile"
5. **Select "Copy member ID"**
6. Your User ID is now copied! It looks like `U1234567890`

## Alternative Method: Browser Console

1. Open Slack in your **web browser** (https://app.slack.com)
2. Press **F12** or **Right-click → Inspect** to open Developer Console
3. Click the **Console** tab
4. Type: `TS.model.user.id` and press **Enter**
5. Your User ID will appear - copy it!

## Alternative Method: Via API

If you already have your Slack token set up:

1. Go to: https://api.slack.com/methods/auth.test/test
2. Paste your token
3. Click "Test Method"
4. Look for `"user_id"` in the response

## Update Your Environment Variable

Once you have your User ID:

1. Open `.env.local` in revelateops-website
2. Update this line:
   ```env
   SLACK_USER_ID=U1234567890
   ```
3. Replace `U1234567890` with your actual User ID
4. **Restart your dev server**: `npm run dev`

## Test It!

1. Go to `/contact` on your website
2. Fill out the form (all fields required except Company)
3. Submit it
4. Check your **Slack DMs** (not channels!)
5. You should see a message from yourself or the bot

## Troubleshooting

**Q: I don't see "Copy member ID" option**
- Make sure you're using a recent version of Slack
- Try the browser console method instead

**Q: The console method doesn't work**
- Make sure you're on the Slack web app, not the desktop app
- Try refreshing the page and trying again

**Q: Still can't find it?**
- Use the API method (link above)
- Contact Slack support for help finding your User ID
