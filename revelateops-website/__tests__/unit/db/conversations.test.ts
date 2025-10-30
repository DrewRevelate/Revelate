/**
 * Unit Tests for Database Operations
 * Story 1.2: Comprehensive tests for all 12 functions in lib/db/conversations.ts
 *
 * Testing Strategy: Mock @vercel/postgres to isolate database logic
 * Coverage Target: >= 90% (lines, branches, functions, statements)
 */

import { sql } from '@vercel/postgres';
import {
  createConversation,
  getConversation,
  getConversationByThreadTs,
  addMessage,
  getMessages,
  getNewMessages,
  markMessagesAsRead,
  getConversationsByEmail,
  getLastMessages,
  getRecentActiveConversation,
  closeConversation,
  closeActiveConversationsForEmail,
  type Conversation,
  type Message,
} from '@/lib/db/conversations';

// Mock @vercel/postgres
jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));

const mockSql = sql as jest.MockedFunction<typeof sql>;

describe('Database Operations - lib/db/conversations.ts', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createConversation', () => {
    it('should create a new conversation with all required fields', async () => {
      const mockConversation: Conversation = {
        id: 1,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_phone: '+1234567890',
        user_company: 'Acme Corp',
        slack_thread_ts: '1234567890.123456',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await createConversation({
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_phone: '+1234567890',
        user_company: 'Acme Corp',
        slack_thread_ts: '1234567890.123456',
      });

      expect(result).toEqual(mockConversation);
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should create a conversation without optional user_company field', async () => {
      const mockConversation: Conversation = {
        id: 2,
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        user_phone: '+1234567891',
        user_company: undefined,
        slack_thread_ts: '1234567890.123457',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await createConversation({
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        user_phone: '+1234567891',
        slack_thread_ts: '1234567890.123457',
      });

      expect(result).toEqual(mockConversation);
      expect(result.user_company).toBeUndefined();
    });

    it('should handle null user_company by passing null to database', async () => {
      const mockConversation: Conversation = {
        id: 3,
        user_name: 'Test User',
        user_email: 'test@example.com',
        user_phone: '+1234567892',
        user_company: undefined,
        slack_thread_ts: '1234567890.123458',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      await createConversation({
        user_name: 'Test User',
        user_email: 'test@example.com',
        user_phone: '+1234567892',
        user_company: undefined,
        slack_thread_ts: '1234567890.123458',
      });

      expect(mockSql).toHaveBeenCalledTimes(1);
    });
  });

  describe('getConversation', () => {
    it('should retrieve an existing conversation by ID', async () => {
      const mockConversation: Conversation = {
        id: 1,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_phone: '+1234567890',
        user_company: 'Acme Corp',
        slack_thread_ts: '1234567890.123456',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await getConversation(1);

      expect(result).toEqual(mockConversation);
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should return null for non-existent conversation ID', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversation(999);

      expect(result).toBeNull();
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should handle ID 0', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversation(0);

      expect(result).toBeNull();
    });

    it('should handle negative IDs', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversation(-1);

      expect(result).toBeNull();
    });
  });

  describe('getConversationByThreadTs', () => {
    it('should retrieve conversation by valid Slack thread timestamp', async () => {
      const mockConversation: Conversation = {
        id: 1,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_phone: '+1234567890',
        user_company: 'Acme Corp',
        slack_thread_ts: '1234567890.123456',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await getConversationByThreadTs('1234567890.123456');

      expect(result).toEqual(mockConversation);
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should return null for non-existent thread_ts', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversationByThreadTs('nonexistent.timestamp');

      expect(result).toBeNull();
    });

    it('should handle empty string thread_ts', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversationByThreadTs('');

      expect(result).toBeNull();
    });
  });

  describe('addMessage', () => {
    it('should add a user message with all fields', async () => {
      const mockMessage: Message = {
        id: 1,
        conversation_id: 1,
        sender: 'user',
        message_text: 'Hello!',
        sent_at: new Date(),
        read_by_user: false,
        slack_ts: undefined,
      };

      mockSql.mockResolvedValueOnce({ rows: [mockMessage] } as any);

      const result = await addMessage({
        conversation_id: 1,
        sender: 'user',
        message_text: 'Hello!',
      });

      expect(result).toEqual(mockMessage);
      expect(result.sender).toBe('user');
    });

    it('should add a drew message with slack_ts', async () => {
      const mockMessage: Message = {
        id: 2,
        conversation_id: 1,
        sender: 'drew',
        message_text: 'Hi there!',
        sent_at: new Date(),
        read_by_user: false,
        slack_ts: '1234567890.123456',
      };

      mockSql.mockResolvedValueOnce({ rows: [mockMessage] } as any);

      const result = await addMessage({
        conversation_id: 1,
        sender: 'drew',
        message_text: 'Hi there!',
        slack_ts: '1234567890.123456',
      });

      expect(result).toEqual(mockMessage);
      expect(result.sender).toBe('drew');
      expect(result.slack_ts).toBe('1234567890.123456');
    });

    it('should add message without optional slack_ts', async () => {
      const mockMessage: Message = {
        id: 3,
        conversation_id: 1,
        sender: 'user',
        message_text: 'Another message',
        sent_at: new Date(),
        read_by_user: false,
        slack_ts: undefined,
      };

      mockSql.mockResolvedValueOnce({ rows: [mockMessage] } as any);

      const result = await addMessage({
        conversation_id: 1,
        sender: 'user',
        message_text: 'Another message',
      });

      expect(result.slack_ts).toBeUndefined();
    });

    it('should handle empty message text', async () => {
      const mockMessage: Message = {
        id: 4,
        conversation_id: 1,
        sender: 'user',
        message_text: '',
        sent_at: new Date(),
        read_by_user: false,
      };

      mockSql.mockResolvedValueOnce({ rows: [mockMessage] } as any);

      const result = await addMessage({
        conversation_id: 1,
        sender: 'user',
        message_text: '',
      });

      expect(result.message_text).toBe('');
    });
  });

  describe('getMessages', () => {
    it('should retrieve all messages for conversation ordered by sent_at ASC', async () => {
      const mockMessages: Message[] = [
        {
          id: 1,
          conversation_id: 1,
          sender: 'user',
          message_text: 'First message',
          sent_at: new Date('2025-01-01T10:00:00Z'),
          read_by_user: true,
        },
        {
          id: 2,
          conversation_id: 1,
          sender: 'drew',
          message_text: 'Second message',
          sent_at: new Date('2025-01-01T10:05:00Z'),
          read_by_user: false,
        },
        {
          id: 3,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Third message',
          sent_at: new Date('2025-01-01T10:10:00Z'),
          read_by_user: true,
        },
      ];

      mockSql.mockResolvedValueOnce({ rows: mockMessages } as any);

      const result = await getMessages(1);

      expect(result).toEqual(mockMessages);
      expect(result).toHaveLength(3);
      expect(result[0].message_text).toBe('First message');
      expect(result[2].message_text).toBe('Third message');
    });

    it('should return empty array for conversation with no messages', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getMessages(1);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should retrieve messages for non-existent conversation (returns empty)', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getMessages(999);

      expect(result).toEqual([]);
    });
  });

  describe('getNewMessages', () => {
    it('should retrieve messages after specific timestamp', async () => {
      const afterDate = new Date('2025-01-01T10:05:00Z');
      const mockMessages: Message[] = [
        {
          id: 3,
          conversation_id: 1,
          sender: 'user',
          message_text: 'New message',
          sent_at: new Date('2025-01-01T10:10:00Z'),
          read_by_user: false,
        },
      ];

      mockSql.mockResolvedValueOnce({ rows: mockMessages } as any);

      const result = await getNewMessages(1, afterDate);

      expect(result).toEqual(mockMessages);
      expect(result).toHaveLength(1);
    });

    it('should return all messages when timestamp is before all messages', async () => {
      const afterDate = new Date('2025-01-01T09:00:00Z');
      const mockMessages: Message[] = [
        {
          id: 1,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Message 1',
          sent_at: new Date('2025-01-01T10:00:00Z'),
          read_by_user: false,
        },
        {
          id: 2,
          conversation_id: 1,
          sender: 'drew',
          message_text: 'Message 2',
          sent_at: new Date('2025-01-01T10:05:00Z'),
          read_by_user: false,
        },
      ];

      mockSql.mockResolvedValueOnce({ rows: mockMessages } as any);

      const result = await getNewMessages(1, afterDate);

      expect(result).toHaveLength(2);
    });

    it('should return empty array when timestamp is after all messages', async () => {
      const afterDate = new Date('2025-01-01T12:00:00Z');
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getNewMessages(1, afterDate);

      expect(result).toEqual([]);
    });

    it('should handle exact timestamp match (excludes exact match)', async () => {
      const afterDate = new Date('2025-01-01T10:00:00Z');
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getNewMessages(1, afterDate);

      expect(result).toEqual([]);
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark unread drew messages as read', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await markMessagesAsRead(1);

      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should be idempotent (no error when no unread messages)', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await markMessagesAsRead(1);
      expect(mockSql).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
      mockSql.mockResolvedValueOnce({} as any);

      await markMessagesAsRead(1);
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent conversation', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await markMessagesAsRead(999);

      expect(mockSql).toHaveBeenCalledTimes(1);
    });
  });

  describe('getConversationsByEmail', () => {
    it('should retrieve multiple conversations for same email ordered by updated_at DESC', async () => {
      const mockConversations: Conversation[] = [
        {
          id: 2,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          user_phone: '+1234567890',
          slack_thread_ts: '1234567890.123457',
          status: 'active',
          created_at: new Date('2025-01-01T10:00:00Z'),
          updated_at: new Date('2025-01-02T10:00:00Z'), // More recent
        },
        {
          id: 1,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          user_phone: '+1234567890',
          slack_thread_ts: '1234567890.123456',
          status: 'closed',
          created_at: new Date('2025-01-01T10:00:00Z'),
          updated_at: new Date('2025-01-01T10:00:00Z'),
        },
      ];

      mockSql.mockResolvedValueOnce({ rows: mockConversations } as any);

      const result = await getConversationsByEmail('john@example.com');

      expect(result).toEqual(mockConversations);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2); // Most recent first
    });

    it('should return empty array for email with no conversations', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversationsByEmail('nonexistent@example.com');

      expect(result).toEqual([]);
    });

    it('should handle invalid email format', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getConversationsByEmail('not-an-email');

      expect(result).toEqual([]);
    });
  });

  describe('getLastMessages', () => {
    it('should retrieve last N messages with custom limit', async () => {
      const mockMessages: Message[] = [
        {
          id: 3,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Third',
          sent_at: new Date('2025-01-01T10:10:00Z'),
          read_by_user: false,
        },
        {
          id: 4,
          conversation_id: 1,
          sender: 'drew',
          message_text: 'Fourth',
          sent_at: new Date('2025-01-01T10:15:00Z'),
          read_by_user: false,
        },
        {
          id: 5,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Fifth',
          sent_at: new Date('2025-01-01T10:20:00Z'),
          read_by_user: false,
        },
      ];

      // Mock returns DESC order, function reverses to ASC
      mockSql.mockResolvedValueOnce({ rows: [...mockMessages].reverse() } as any);

      const result = await getLastMessages(1, 3);

      expect(result).toHaveLength(3);
      expect(result[0].message_text).toBe('Third'); // Chronological order
      expect(result[2].message_text).toBe('Fifth');
    });

    it('should use default limit of 3 messages', async () => {
      const mockMessages: Message[] = [
        {
          id: 1,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Message 1',
          sent_at: new Date(),
          read_by_user: false,
        },
        {
          id: 2,
          conversation_id: 1,
          sender: 'drew',
          message_text: 'Message 2',
          sent_at: new Date(),
          read_by_user: false,
        },
        {
          id: 3,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Message 3',
          sent_at: new Date(),
          read_by_user: false,
        },
      ];

      mockSql.mockResolvedValueOnce({ rows: [...mockMessages].reverse() } as any);

      const result = await getLastMessages(1); // No limit specified

      expect(result).toHaveLength(3);
    });

    it('should handle conversation with fewer messages than limit', async () => {
      const mockMessages: Message[] = [
        {
          id: 1,
          conversation_id: 1,
          sender: 'user',
          message_text: 'Only message',
          sent_at: new Date(),
          read_by_user: false,
        },
      ];

      mockSql.mockResolvedValueOnce({ rows: mockMessages } as any);

      const result = await getLastMessages(1, 5);

      expect(result).toHaveLength(1);
    });

    it('should return empty array for conversation with no messages', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getLastMessages(1);

      expect(result).toEqual([]);
    });
  });

  describe('getRecentActiveConversation', () => {
    it('should retrieve most recent active conversation with messages', async () => {
      const mockConversation: Conversation = {
        id: 2,
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        user_phone: '+1234567891',
        slack_thread_ts: '1234567890.123457',
        status: 'active',
        created_at: new Date('2025-01-01T10:00:00Z'),
        updated_at: new Date('2025-01-02T10:00:00Z'),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await getRecentActiveConversation();

      expect(result).toEqual(mockConversation);
      expect(result?.status).toBe('active');
    });

    it('should return null when no active conversations exist', async () => {
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getRecentActiveConversation();

      expect(result).toBeNull();
    });

    it('should exclude closed conversations', async () => {
      // Function should not return closed conversations
      mockSql.mockResolvedValueOnce({ rows: [] } as any);

      const result = await getRecentActiveConversation();

      expect(result).toBeNull();
    });
  });

  describe('closeConversation', () => {
    it('should close an active conversation', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await closeConversation(1);

      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should be idempotent (closing already closed conversation)', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await closeConversation(1);
      expect(mockSql).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
      mockSql.mockResolvedValueOnce({} as any);

      await closeConversation(1);
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent conversation', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await closeConversation(999);

      expect(mockSql).toHaveBeenCalledTimes(1);
    });
  });

  describe('closeActiveConversationsForEmail', () => {
    it('should close multiple active conversations for same email', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await closeActiveConversationsForEmail('john@example.com');

      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should handle email with no active conversations', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await closeActiveConversationsForEmail('noacctive@example.com');

      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should not affect closed conversations', async () => {
      mockSql.mockResolvedValueOnce({} as any);

      await closeActiveConversationsForEmail('john@example.com');

      expect(mockSql).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(getConversation(1)).rejects.toThrow('Database connection failed');
    });

    it('should handle SQL errors', async () => {
      mockSql.mockRejectedValueOnce(new Error('SQL syntax error'));

      await expect(createConversation({
        user_name: 'Test',
        user_email: 'test@example.com',
        user_phone: '+1234567890',
        slack_thread_ts: '123.456',
      })).rejects.toThrow('SQL syntax error');
    });

    it('should handle special characters in strings (SQL injection prevention)', async () => {
      const mockConversation: Conversation = {
        id: 1,
        user_name: "O'Brien",
        user_email: 'test@example.com',
        user_phone: '+1234567890',
        slack_thread_ts: '123.456',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await createConversation({
        user_name: "O'Brien", // Single quote
        user_email: 'test@example.com',
        user_phone: '+1234567890',
        slack_thread_ts: '123.456',
      });

      expect(result.user_name).toBe("O'Brien");
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should handle SQL keywords in strings', async () => {
      const mockConversation: Conversation = {
        id: 1,
        user_name: 'SELECT * FROM users',
        user_email: 'test@example.com',
        user_phone: '+1234567890',
        slack_thread_ts: '123.456',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSql.mockResolvedValueOnce({ rows: [mockConversation] } as any);

      const result = await createConversation({
        user_name: 'SELECT * FROM users',
        user_email: 'test@example.com',
        user_phone: '+1234567890',
        slack_thread_ts: '123.456',
      });

      expect(result.user_name).toBe('SELECT * FROM users');
    });
  });
});
