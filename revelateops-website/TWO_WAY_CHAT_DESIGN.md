# Two-Way Chat Design: Slack ↔️ Website

## What You Want

**Current:** User submits form → You get Slack DM → End
**New:** User submits form → You get Slack DM → You reply in Slack → User sees your reply on website

## Architecture Options

### Option 1: Simple (Email-style, Recommended to Start)
**How it works:**
- User fills contact form → Gets confirmation
- You receive Slack DM with their info
- You reply to them via **their email** (not through the site)
- Simple, works immediately, no complex infrastructure

**Pros:** Already works, no changes needed
**Cons:** Not real-time chat, requires email

---

### Option 2: Chat Widget with Polling (Medium Complexity)
**How it works:**
1. User opens chat widget on your site
2. They send a message → You get Slack DM
3. You reply in Slack → Slack webhook notifies your server
4. Website polls API every few seconds to check for new messages
5. User sees your reply appear in chat widget

**Requirements:**
- Database to store messages (Postgres, MongoDB, or Vercel KV)
- Slack Events API webhook endpoint
- Chat UI component
- Session/user identification

**Pros:** No external dependencies, works on any hosting
**Cons:** Slight delay (polling every 3-5 seconds)

---

### Option 3: Real-time Chat with WebSockets (Complex)
**How it works:**
1. User opens chat widget → Establishes WebSocket connection
2. They send message → You get Slack DM
3. You reply in Slack → Server immediately pushes to user's WebSocket
4. Message appears instantly

**Requirements:**
- Everything from Option 2, plus:
- WebSocket server (Pusher, Ably, or Socket.io)
- More complex infrastructure

**Pros:** True real-time, instant delivery
**Cons:** More complex, requires WebSocket service

---

## Recommended Approach: Option 2 (Polling)

For your use case (B2B consulting), Option 2 is the sweet spot:
- Users don't expect instant replies like consumer chat
- No WebSocket infrastructure needed
- Works with your current Vercel setup
- Can upgrade to WebSockets later if needed

## What Needs to Be Built

### 1. Database Setup
Store conversation threads:
```
conversations table:
- id
- user_email
- user_name
- user_phone
- slack_thread_ts (to link back to Slack)
- created_at

messages table:
- id
- conversation_id
- sender ('user' or 'drew')
- message_text
- sent_at
```

**Easiest options:**
- Vercel Postgres (built into Vercel)
- Supabase (free tier, easy setup)
- Vercel KV (Redis, simpler but less queryable)

### 2. Slack Events API Webhook
Set up Slack to notify your site when you reply:
- Create `/api/slack/events` endpoint
- Subscribe to `message.im` events
- When you reply in Slack DM, your endpoint receives it
- Store the message in your database

### 3. Chat Widget UI
Replace the contact form (or add chat icon):
- Shows conversation history
- Input box for new messages
- Polls `/api/messages?conversation_id=X` every 3-5 seconds
- Displays your replies when they arrive

### 4. Session Management
Track which user is which:
- Generate unique conversation ID when they first message
- Store in localStorage or session
- Include in all API calls

## Implementation Steps

### Phase 1: Database Setup (30 min)
1. Choose database (recommend Vercel Postgres)
2. Create tables
3. Add database connection to your API routes

### Phase 2: Enhanced Contact Form (1 hour)
1. When user submits, create conversation in DB
2. Send Slack DM with thread tracking
3. Return conversation ID to user
4. Show chat interface instead of "message sent"

### Phase 3: Slack Webhook (1 hour)
1. Create `/api/slack/events` endpoint
2. Set up Slack Events API subscription
3. Verify webhook signature
4. Store your replies in database

### Phase 4: Chat UI (2 hours)
1. Build chat component with message list
2. Add polling mechanism (every 5 seconds)
3. Show user's messages + your replies
4. Handle loading states

### Phase 5: Polish (1 hour)
1. Add typing indicators
2. Message timestamps
3. "Drew is typing..." when you're composing
4. Sound notifications for new replies

## Estimated Time: 5-6 hours

## Cost Considerations

**Database:**
- Vercel Postgres: Free tier includes 256 MB (plenty for chat)
- Supabase: Free tier includes 500 MB

**Hosting:**
- Current Vercel setup works fine
- No additional costs

**Slack:**
- Free plan works (Events API is free)

## Questions for You

1. **Database preference?**
   - Vercel Postgres (easiest, built-in)
   - Supabase (more features, separate service)
   - Something else?

2. **When to show chat?**
   - Replace current contact form with chat widget?
   - Add floating chat button on all pages?
   - Only on contact page?

3. **User identification?**
   - Anonymous until they provide email?
   - Require name/email before chatting?

4. **Message storage?**
   - Keep all history forever?
   - Delete after X days?

5. **Timeline?**
   - Want to build this now?
   - Or stick with current contact form for now?

## Alternative: Use Existing Service

**Instead of building**, you could use:
- **Intercom** ($39/mo) - Full chat solution
- **Crisp** (Free tier) - Chat widget with Slack integration
- **Plain** ($29/mo) - Customer support inbox with Slack

These handle all the complexity for you and integrate with Slack.

---

Let me know:
1. Do you want to build custom or use a service?
2. If custom, which database do you prefer?
3. Should we start building this now?
