# API Contracts - Revelate Website

## Overview
REST API endpoints built with Next.js App Router Route Handlers. All endpoints return JSON responses.

## Authentication & Configuration

### Environment Variables Required
- `SLACK_BOT_TOKEN` - Slack Bot User OAuth Token (xoxb-*)
- `SLACK_USER_ID` - Slack User ID for DM notifications
- `CALENDLY_API_TOKEN` - Calendly Personal Access Token
- `CALCOM_API_KEY` - Cal.com API Key

---

## Contact & Chat Endpoints

### POST /api/contact
**Purpose:** Submit contact form and create new conversation

**Runtime:** Node.js (for database support)

**Request Body:**
```typescript
{
  name: string;          // Required
  email: string;         // Required
  phone: string;         // Required
  message: string;       // Required
  company?: string;      // Optional
}
```

**Success Response (200):**
```typescript
{
  success: true;
  message: "Your message has been sent successfully!";
  conversation_id: number;
}
```

**Error Responses:**
- `400` - Missing required fields
- `500` - Slack integration not configured / Failed to send

**Side Effects:**
1. Closes any previous active conversations for the email
2. Creates new conversation in database
3. Sends formatted Slack DM to configured user
4. Creates Slack thread for conversation
5. Stores initial message in database

**Slack Message Format:**
- Header: "📬 New Contact Form Message"
- Structured blocks with name, email, phone, company, message
- Timestamp in Eastern Time
- Thread TS stored for replies

---

### GET /api/conversations/[id]/messages
**Purpose:** Fetch all messages for a conversation

**Runtime:** Node.js

**Parameters:**
- `id` (path parameter) - Conversation ID (integer)

**Success Response (200):**
```typescript
{
  conversation: {
    id: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_company?: string;
    slack_thread_ts: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  messages: Array<{
    id: number;
    conversation_id: number;
    sender: 'user' | 'drew';
    message_text: string;
    slack_ts?: string;
    created_at: string;
    is_read: boolean;
  }>;
}
```

**Error Responses:**
- `400` - Invalid conversation ID
- `404` - Conversation not found
- `500` - Failed to fetch messages

**Side Effects:**
- Marks Drew's messages as read

---

### POST /api/conversations/[id]/messages
**Purpose:** Send a new message in an existing conversation

**Runtime:** Node.js

**Parameters:**
- `id` (path parameter) - Conversation ID (integer)

**Request Body:**
```typescript
{
  message: string;  // Required, non-empty
}
```

**Success Response (200):**
```typescript
{
  success: true;
  message: {
    id: number;
    conversation_id: number;
    sender: 'user';
    message_text: string;
    created_at: string;
  };
  slack_warning?: string;  // Present if Slack notification failed
}
```

**Error Responses:**
- `400` - Invalid conversation ID or missing message
- `404` - Conversation not found
- `500` - Slack integration not configured

**Side Effects:**
1. Stores message in database
2. Sends threaded reply to Slack DM
3. Continues conversation thread using `slack_thread_ts`

---

## Calendly Integration Endpoints

### GET /api/calendly/availability
**Purpose:** Get available time slots for a Calendly event type

**Runtime:** Edge

**Query Parameters:**
- `event_type_uri` (required) - Calendly event type URI
- `start_time` (required) - ISO 8601 datetime
- `end_time` (required) - ISO 8601 datetime

**Success Response (200):**
Returns Calendly availability data structure

**Error Responses:**
- `400` - Missing required parameters
- `500` - Failed to fetch from Calendly API

---

### GET /api/calendly/user
**Purpose:** Get Calendly user information

**Runtime:** Edge

**Success Response (200):**
Returns Calendly user data

---

### GET /api/calendly/event-types
**Purpose:** Get list of Calendly event types

**Runtime:** Edge

**Success Response (200):**
Returns list of event types

---

### GET /api/calendly/scheduling-link
**Purpose:** Generate a Calendly scheduling link

**Runtime:** Edge

**Success Response (200):**
Returns scheduling link URL

---

## Cal.com Integration Endpoints

### GET /api/calcom/availability
**Purpose:** Get available time slots from Cal.com

**Runtime:** Node.js

**Query Parameters:**
- `startTime` (required) - ISO 8601 datetime
- `endTime` (required) - ISO 8601 datetime
- `eventTypeId` (optional) - Cal.com event type ID

**Success Response (200):**
Returns Cal.com slots data from `/v1/slots/available` endpoint

**Error Responses:**
- `400` - Missing required parameters (startTime, endTime)
- `500` - Cal.com API key not configured / API error

**Cal.com API Used:**
- Endpoint: `https://api.cal.com/v1/slots/available`
- Authentication: Bearer token in Authorization header

---

### POST /api/calcom/booking
**Purpose:** Create a booking in Cal.com

**Runtime:** Node.js

**Request Body:**
Cal.com booking payload (varies by event type)

**Success Response (200):**
Returns Cal.com booking confirmation

---

### GET /api/calcom/test
**Purpose:** Test Cal.com API connectivity

**Runtime:** Node.js

**Success Response (200):**
Returns test result

---

## Slack Webhook Endpoints

### POST /api/slack/events
**Purpose:** Handle Slack event webhooks (for two-way chat)

**Runtime:** Node.js

**Request Body:**
Slack Events API payload

**Response:**
Varies based on event type (URL verification, message events, etc.)

**Events Handled:**
- URL verification challenge
- Message events (for Drew's replies)
- Other Slack events

---

## API Architecture Notes

### Runtime Selection
- **Edge Runtime:** Used for Calendly endpoints (stateless, fast)
- **Node.js Runtime:** Used for database operations (conversations, contact) and Cal.com

### Error Handling Pattern
All endpoints follow consistent error handling:
```typescript
try {
  // Operation
  return NextResponse.json({ success: true, ... });
} catch (error) {
  console.error('Context:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Generic message' },
    { status: 500 }
  );
}
```

### Slack Integration Architecture
1. **Contact Form → Slack DM**
   - Uses `chat.postMessage` API
   - Sends to user ID (not channel)
   - Creates thread with `ts` timestamp

2. **Conversation Threading**
   - All messages in same conversation use same `thread_ts`
   - Maintains context in single Slack thread

3. **Two-Way Communication**
   - User messages → Slack (via API calls)
   - Drew's replies → Website (via Slack Events API webhook)

### Database Integration
- Uses Vercel Postgres (inferred from `nodejs` runtime requirement)
- Functions imported from `@/lib/db/conversations`:
  - `createConversation()`
  - `addMessage()`
  - `getMessages()`
  - `getConversation()`
  - `markMessagesAsRead()`
  - `closeActiveConversationsForEmail()`

### External API Clients
- Calendly: Custom client at `@/lib/calendly-api`
- Cal.com: Direct API calls with Bearer authentication
- Slack: Direct API calls with Bot Token authentication

---

## Security Considerations

1. **Environment Variables:** All sensitive credentials in env vars
2. **Input Validation:** All endpoints validate required fields
3. **Error Messages:** Generic error messages to users, detailed logs server-side
4. **CORS:** Handled by Next.js (same-origin by default)
5. **Rate Limiting:** Should be implemented at edge/infrastructure level

---

*Last Updated: 2025-10-30*
*Total Endpoints: 10*
*Scan Level: Deep*
