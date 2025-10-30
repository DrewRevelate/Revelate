import { sql } from '@vercel/postgres';

export interface Conversation {
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

export interface Message {
  id: number;
  conversation_id: number;
  sender: 'user' | 'drew';
  message_text: string;
  sent_at: Date;
  read_by_user: boolean;
  slack_ts?: string;
}

/**
 * Create a new conversation
 */
export async function createConversation(data: {
  user_name: string;
  user_email: string;
  user_phone: string;
  user_company?: string;
  slack_thread_ts: string;
}): Promise<Conversation> {
  const result = await sql<Conversation>`
    INSERT INTO conversations (user_name, user_email, user_phone, user_company, slack_thread_ts)
    VALUES (${data.user_name}, ${data.user_email}, ${data.user_phone}, ${data.user_company || null}, ${data.slack_thread_ts})
    RETURNING *
  `;

  return result.rows[0];
}

/**
 * Get conversation by ID
 */
export async function getConversation(id: number): Promise<Conversation | null> {
  const result = await sql<Conversation>`
    SELECT * FROM conversations WHERE id = ${id}
  `;

  return result.rows[0] || null;
}

/**
 * Get conversation by Slack thread timestamp
 */
export async function getConversationByThreadTs(thread_ts: string): Promise<Conversation | null> {
  const result = await sql<Conversation>`
    SELECT * FROM conversations WHERE slack_thread_ts = ${thread_ts}
  `;

  return result.rows[0] || null;
}

/**
 * Add a message to a conversation
 */
export async function addMessage(data: {
  conversation_id: number;
  sender: 'user' | 'drew';
  message_text: string;
  slack_ts?: string;
}): Promise<Message> {
  const result = await sql<Message>`
    INSERT INTO messages (conversation_id, sender, message_text, slack_ts)
    VALUES (${data.conversation_id}, ${data.sender}, ${data.message_text}, ${data.slack_ts || null})
    RETURNING *
  `;

  return result.rows[0];
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversation_id: number): Promise<Message[]> {
  const result = await sql<Message>`
    SELECT * FROM messages
    WHERE conversation_id = ${conversation_id}
    ORDER BY sent_at ASC
  `;

  return result.rows;
}

/**
 * Get messages after a certain timestamp (for polling)
 */
export async function getNewMessages(conversation_id: number, after: Date): Promise<Message[]> {
  const result = await sql<Message>`
    SELECT * FROM messages
    WHERE conversation_id = ${conversation_id}
    AND sent_at > ${after.toISOString()}
    ORDER BY sent_at ASC
  `;

  return result.rows;
}

/**
 * Mark messages as read by user
 */
export async function markMessagesAsRead(conversation_id: number): Promise<void> {
  await sql`
    UPDATE messages
    SET read_by_user = true
    WHERE conversation_id = ${conversation_id}
    AND sender = 'drew'
    AND read_by_user = false
  `;
}

/**
 * Get all conversations for an email address (most recent first)
 */
export async function getConversationsByEmail(email: string): Promise<Conversation[]> {
  const result = await sql<Conversation>`
    SELECT * FROM conversations
    WHERE user_email = ${email}
    ORDER BY updated_at DESC
  `;

  return result.rows;
}

/**
 * Get the last N messages from a conversation
 */
export async function getLastMessages(conversation_id: number, limit: number = 3): Promise<Message[]> {
  const result = await sql<Message>`
    SELECT * FROM messages
    WHERE conversation_id = ${conversation_id}
    ORDER BY sent_at DESC
    LIMIT ${limit}
  `;

  // Reverse so they're in chronological order
  return result.rows.reverse();
}
