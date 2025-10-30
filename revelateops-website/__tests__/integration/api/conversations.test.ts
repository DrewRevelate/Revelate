/**
 * Integration tests for /api/conversations/[id]/messages endpoint
 *
 * Tests both GET and POST methods:
 * - GET: Retrieve messages for a conversation
 * - POST: Add a new message to a conversation
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/conversations/[id]/messages/route';
import * as dbConversations from '@/lib/db/conversations';
import {
  mockFetch,
  resetFetchMocks,
  setTestEnv,
  restoreEnv,
  createMockConversation,
  createMockMessage,
  mockSlackResponse,
  mockSlackErrorResponse,
  assertResponse,
  assertErrorResponse,
} from './test-helpers';

// Mock the database module
jest.mock('@/lib/db/conversations');

describe('GET /api/conversations/[id]/messages', () => {
  const mockConv = createMockConversation({ id: 1 });
  const mockMessages = [
    createMockMessage({ id: 1, sender: 'user', message_text: 'First message' }),
    createMockMessage({ id: 2, sender: 'drew', message_text: 'Reply message' }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (dbConversations.getConversation as jest.Mock).mockResolvedValue(mockConv);
    (dbConversations.getMessages as jest.Mock).mockResolvedValue(mockMessages);
    (dbConversations.markMessagesAsRead as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Success scenarios', () => {
    it('should return conversation and messages successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages');
      const params = Promise.resolve({ id: '1' });

      const response = await GET(request, { params });
      const data = await assertResponse(response, 200, ['conversation', 'messages']);

      expect(data.conversation).toEqual(mockConv);
      expect(data.messages).toEqual(mockMessages);
      expect(dbConversations.getConversation).toHaveBeenCalledWith(1);
      expect(dbConversations.getMessages).toHaveBeenCalledWith(1);
      expect(dbConversations.markMessagesAsRead).toHaveBeenCalledWith(1);
    });

    it('should mark messages as read by default', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages');
      const params = Promise.resolve({ id: '1' });

      await GET(request, { params });

      expect(dbConversations.markMessagesAsRead).toHaveBeenCalledWith(1);
    });

    it('should not mark messages as read when markAsRead=false', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/conversations/1/messages?markAsRead=false'
      );
      const params = Promise.resolve({ id: '1' });

      await GET(request, { params });

      expect(dbConversations.markMessagesAsRead).not.toHaveBeenCalled();
    });
  });

  describe('Validation errors (400)', () => {
    it('should return 400 for invalid conversation ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/invalid/messages');
      const params = Promise.resolve({ id: 'invalid' });

      const response = await GET(request, { params });
      await assertErrorResponse(response, 400, 'Invalid conversation ID');
    });

    it('should return 400 for non-numeric conversation ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/abc/messages');
      const params = Promise.resolve({ id: 'abc' });

      const response = await GET(request, { params });
      await assertErrorResponse(response, 400);
    });
  });

  describe('Not found errors (404)', () => {
    it('should return 404 when conversation does not exist', async () => {
      (dbConversations.getConversation as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/conversations/999/messages');
      const params = Promise.resolve({ id: '999' });

      const response = await GET(request, { params });
      await assertErrorResponse(response, 404, 'not found');
    });
  });

  describe('Database errors (500)', () => {
    it('should return 500 when getConversation fails', async () => {
      (dbConversations.getConversation as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages');
      const params = Promise.resolve({ id: '1' });

      const response = await GET(request, { params });
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when getMessages fails', async () => {
      (dbConversations.getMessages as jest.Mock).mockRejectedValue(
        new Error('Database query error')
      );

      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages');
      const params = Promise.resolve({ id: '1' });

      const response = await GET(request, { params });
      await assertErrorResponse(response, 500);
    });
  });
});

describe('POST /api/conversations/[id]/messages', () => {
  const mockConv = createMockConversation({ id: 1, slack_thread_ts: '1234567890.123456' });
  const mockNewMessage = createMockMessage({ id: 3, message_text: 'New message' });
  const mockSlackToken = 'xoxb-test-token';
  const mockSlackUserId = 'U1234567890';

  beforeEach(() => {
    jest.clearAllMocks();
    resetFetchMocks();

    setTestEnv({
      SLACK_BOT_TOKEN: mockSlackToken,
      SLACK_USER_ID: mockSlackUserId,
    });

    (dbConversations.getConversation as jest.Mock).mockResolvedValue(mockConv);
    (dbConversations.addMessage as jest.Mock).mockResolvedValue(mockNewMessage);

    mockFetch([
      {
        url: 'https://slack.com/api/chat.postMessage',
        response: mockSlackResponse,
      },
    ]);
  });

  afterEach(() => {
    restoreEnv();
  });

  describe('Success scenarios', () => {
    it('should add message and send Slack notification successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'New test message' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      const data = await assertResponse(response, 200, ['success', 'message']);

      expect(data.success).toBe(true);
      expect(data.message).toEqual(mockNewMessage);

      // Verify database calls
      expect(dbConversations.getConversation).toHaveBeenCalledWith(1);
      expect(dbConversations.addMessage).toHaveBeenCalledWith({
        conversation_id: 1,
        sender: 'user',
        message_text: 'New test message',
      });

      // Verify Slack API was called with thread_ts
      expect(global.fetch).toHaveBeenCalledWith(
        'https://slack.com/api/chat.postMessage',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('1234567890.123456'), // thread_ts
        })
      );
    });

    it('should trim whitespace from message', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: '  Message with spaces  ' }),
      });
      const params = Promise.resolve({ id: '1' });

      await POST(request, { params });

      expect(dbConversations.addMessage).toHaveBeenCalledWith({
        conversation_id: 1,
        sender: 'user',
        message_text: 'Message with spaces',
      });
    });

    it('should return warning when Slack API fails but still save message', async () => {
      mockFetch([
        {
          url: 'https://slack.com/api/chat.postMessage',
          response: mockSlackErrorResponse,
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test message' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      const data = await assertResponse(response, 200, ['success', 'message', 'slack_warning']);

      expect(data.success).toBe(true);
      expect(data.slack_warning).toContain('Slack notification failed');

      // Message should still be saved
      expect(dbConversations.addMessage).toHaveBeenCalled();
    });
  });

  describe('Validation errors (400)', () => {
    it('should return 400 for invalid conversation ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/invalid/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test' }),
      });
      const params = Promise.resolve({ id: 'invalid' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 400, 'Invalid conversation ID');
    });

    it('should return 400 when message is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 400 when message is empty string', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: '' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 400 when message is only whitespace', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: '   ' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 400 when message is not a string', async () => {
      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 123 }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 400, 'required');
    });
  });

  describe('Not found errors (404)', () => {
    it('should return 404 when conversation does not exist', async () => {
      (dbConversations.getConversation as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/conversations/999/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test' }),
      });
      const params = Promise.resolve({ id: '999' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 404, 'not found');
    });
  });

  describe('Configuration errors (500)', () => {
    it('should return 500 when SLACK_BOT_TOKEN is missing', async () => {
      delete process.env.SLACK_BOT_TOKEN;

      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 500, 'not configured');

      // Message should already be saved before Slack check
      expect(dbConversations.addMessage).toHaveBeenCalled();
    });

    it('should return 500 when SLACK_USER_ID is missing', async () => {
      delete process.env.SLACK_USER_ID;

      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 500, 'not configured');
    });
  });

  describe('Database errors (500)', () => {
    it('should return 500 when addMessage fails', async () => {
      (dbConversations.addMessage as jest.Mock).mockRejectedValue(
        new Error('Database insert error')
      );

      const request = new NextRequest('http://localhost:3000/api/conversations/1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test' }),
      });
      const params = Promise.resolve({ id: '1' });

      const response = await POST(request, { params });
      await assertErrorResponse(response, 500);
    });
  });
});
