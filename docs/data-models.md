# Data Models - Revelate Website

## Overview
PostgreSQL database schema for two-way chat and conversation management. Uses Vercel Postgres.

---

## Database Provider
**Platform:** Vercel Postgres
**Type:** PostgreSQL
**Client:** `@vercel/postgres` npm package
**Query Language:** SQL via tagged templates

---

## Tables

### conversations
**Purpose:** Tracks each chat session initiated via contact form

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing conversation ID |
| `user_name` | VARCHAR(255) | NOT NULL | Contact's full name |
| `user_email` | VARCHAR(255) | NOT NULL | Contact's email address |
| `user_phone` | VARCHAR(50) | NOT NULL | Contact's phone number |
| `user_company` | VARCHAR(255) | NULL | Optional company name |
| `slack_thread_ts` | VARCHAR(50) | UNIQUE, NOT NULL | Slack thread timestamp for threading |
| `status` | VARCHAR(20) | DEFAULT 'active' | Conversation status (active/closed) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When conversation started |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last activity timestamp |

**Indexes:**
- `idx_conversations_slack_thread` on `slack_thread_ts`

**Triggers:**
- `update_conversations_updated_at` - Auto-updates `updated_at` on row modification

**Constraints:**
- `slack_thread_ts` must be unique (one thread per conversation)
- Status enforced via application logic

**Business Rules:**
1. One active conversation per email at a time
2. Previous conversations closed when new one starts
3. Thread TS links conversation to Slack thread

---

### messages
**Purpose:** Stores all messages in conversations (bi-directional)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing message ID |
| `conversation_id` | INTEGER | FOREIGN KEY → conversations(id), NOT NULL | Parent conversation |
| `sender` | VARCHAR(10) | NOT NULL, CHECK(sender IN ('user', 'drew')) | Message sender |
| `message_text` | TEXT | NOT NULL | Message content |
| `sent_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When message was sent |
| `read_by_user` | BOOLEAN | DEFAULT FALSE | Whether user has seen Drew's reply |
| `slack_ts` | VARCHAR(50) | NULL | Slack message timestamp (for threading) |

**Indexes:**
- `idx_messages_conversation` on `conversation_id`
- `idx_messages_sent_at` on `sent_at`

**Foreign Keys:**
- `conversation_id` REFERENCES `conversations(id)` ON DELETE CASCADE

**Constraints:**
- `sender` must be either 'user' or 'drew' (CHECK constraint)

**Business Rules:**
1. Messages ordered chronologically by `sent_at`
2. User messages have `sender = 'user'`
3. Drew's replies have `sender = 'drew'`
4. `read_by_user` only applies to Drew's messages

---

## Database Functions

### update_updated_at_column()
**Type:** Trigger Function
**Language:** PL/pgSQL
**Purpose:** Automatically updates `updated_at` timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';
```

**Attached To:** `conversations` table (BEFORE UPDATE trigger)

---

## Data Access Layer

### TypeScript Interfaces

#### Conversation Interface
```typescript
interface Conversation {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_company?: string;
  slack_thread_ts: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
```

#### Message Interface
```typescript
interface Message {
  id: number;
  conversation_id: number;
  sender: 'user' | 'drew';
  message_text: string;
  sent_at: Date;
  read_by_user: boolean;
  slack_ts?: string;
}
```

---

## Database Operations

### Conversation Operations

| Function | Purpose | Returns |
|----------|---------|---------|
| `createConversation(data)` | Create new conversation | `Conversation` |
| `getConversation(id)` | Get conversation by ID | `Conversation \| null` |
| `getConversationByThreadTs(thread_ts)` | Get conversation by Slack thread | `Conversation \| null` |
| `getConversationsByEmail(email)` | Get all conversations for email | `Conversation[]` |
| `getRecentActiveConversation()` | Get most recently active conversation | `Conversation \| null` |
| `closeConversation(id)` | Set conversation status to 'closed' | `void` |
| `closeActiveConversationsForEmail(email)` | Close all active conversations for email | `void` |

### Message Operations

| Function | Purpose | Returns |
|----------|---------|---------|
| `addMessage(data)` | Add message to conversation | `Message` |
| `getMessages(conversation_id)` | Get all messages for conversation | `Message[]` |
| `getNewMessages(conversation_id, after)` | Get messages after timestamp | `Message[]` |
| `getLastMessages(conversation_id, limit)` | Get last N messages | `Message[]` |
| `markMessagesAsRead(conversation_id)` | Mark Drew's messages as read | `void` |

---

## Data Flow

### New Conversation Creation
```
1. User submits contact form
2. POST /api/contact
3. closeActiveConversationsForEmail(email)  ← Enforces one active conversation
4. createConversation({ ...data, slack_thread_ts })
5. addMessage({ conversation_id, sender: 'user', message_text })
6. Return conversation_id to client
```

### Message Exchange
```
User → Website:
1. POST /api/conversations/[id]/messages
2. addMessage({ conversation_id, sender: 'user', message_text })
3. Send to Slack (threaded reply)

Drew → Website (via Slack Events API):
1. POST /api/slack/events (webhook)
2. Extract thread_ts from Slack event
3. getConversationByThreadTs(thread_ts)
4. addMessage({ conversation_id, sender: 'drew', message_text })
5. Notify client (polling or websocket)
```

### Message Polling
```
1. Client: GET /api/conversations/[id]/messages
2. getMessages(conversation_id)
3. markMessagesAsRead(conversation_id)  ← Auto-mark Drew's messages
4. Return messages[] + conversation
```

---

## Indexing Strategy

### Performance Optimizations
1. **Slack Thread Lookup** - `idx_conversations_slack_thread` enables fast webhook processing
2. **Message Retrieval** - `idx_messages_conversation` for efficient message queries
3. **Time-based Queries** - `idx_messages_sent_at` for chronological sorting and polling

### Query Patterns
```sql
-- Fast: Uses idx_conversations_slack_thread
SELECT * FROM conversations WHERE slack_thread_ts = ?

-- Fast: Uses idx_messages_conversation + idx_messages_sent_at
SELECT * FROM messages
WHERE conversation_id = ?
ORDER BY sent_at ASC

-- Fast: Uses idx_messages_conversation + idx_messages_sent_at
SELECT * FROM messages
WHERE conversation_id = ? AND sent_at > ?
ORDER BY sent_at ASC
```

---

## Data Integrity

### Foreign Key Cascade
- **ON DELETE CASCADE** - Deleting conversation automatically deletes all messages
- Prevents orphaned messages
- Simplifies conversation cleanup

### Constraints
1. **Unique Slack Thread** - Prevents duplicate conversations for same thread
2. **Sender Validation** - CHECK constraint ensures only 'user' or 'drew'
3. **Required Fields** - NOT NULL on critical fields (name, email, phone, message_text)

---

## Migration Strategy

### Initial Setup
1. Create Vercel Postgres database
2. Run `lib/db/schema.sql`
3. Verify tables, indexes, and triggers created
4. Test with sample data

### Schema Versioning
**Current Version:** 1.0
**No Migration Tool:** Direct SQL execution
**Recommendation:** Implement migration tool (e.g., `node-pg-migrate`) for future changes

---

## Security Considerations

### SQL Injection Protection
- Uses Vercel Postgres tagged templates
- All queries use parameterized placeholders: `${value}`
- No string concatenation in SQL

### Data Privacy
- Email addresses stored for conversation tracking
- Phone numbers stored for contact purposes
- **Recommendation:** Implement data retention policy (auto-delete after N days)
- **Recommendation:** Add GDPR compliance (delete user data on request)

### Access Control
- No row-level security implemented
- **Recommendation:** Implement RLS policies in PostgreSQL
- **Current:** Security via application logic only

---

## Scaling Considerations

### Current Capacity
- **Small-scale:** Suitable for hundreds to thousands of conversations
- **Indexes:** Support efficient queries at current scale

### Future Enhancements
1. **Partitioning:** Partition messages by date for large-scale
2. **Archiving:** Move closed conversations to archive table
3. **Read Replicas:** For high read volumes
4. **Connection Pooling:** Already handled by Vercel Postgres

---

## Backup & Recovery

### Vercel Postgres Features
- Automatic backups (managed by Vercel)
- Point-in-time recovery available
- **Recommendation:** Document backup retention policy

---

## Monitoring & Observability

### Recommended Metrics
1. Active conversations count
2. Messages per day
3. Average response time (Drew → User)
4. Unread message count
5. Database query performance

### Logging
- Application logs include conversation_id for tracing
- SQL errors logged with context
- **Recommendation:** Implement structured logging

---

*Last Updated: 2025-10-30*
*Tables: 2*
*Total Functions: 14*
*Scan Level: Deep*
