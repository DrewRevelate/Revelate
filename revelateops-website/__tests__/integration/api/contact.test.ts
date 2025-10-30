/**
 * Integration tests for POST /api/contact endpoint
 *
 * Tests the contact form submission flow including:
 * - Database conversation creation
 * - Slack notification sending
 * - Error handling for validation, Slack failures, and database errors
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';
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

describe('POST /api/contact', () => {
  const validContactData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    message: 'Test message',
    company: 'Test Company',
  };

  const mockSlackToken = 'xoxb-test-token';
  const mockSlackUserId = 'U1234567890';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    resetFetchMocks();

    // Setup environment variables
    setTestEnv({
      SLACK_BOT_TOKEN: mockSlackToken,
      SLACK_USER_ID: mockSlackUserId,
    });

    // Setup default successful database mocks
    (dbConversations.closeActiveConversationsForEmail as jest.Mock).mockResolvedValue(undefined);
    (dbConversations.createConversation as jest.Mock).mockResolvedValue(
      createMockConversation({ id: 1 })
    );
    (dbConversations.addMessage as jest.Mock).mockResolvedValue(
      createMockMessage({ id: 1 })
    );

    // Setup default successful Slack API mock
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
    it('should create conversation and send Slack notification successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      const data = await assertResponse(response, 200, ['success', 'message', 'conversation_id']);

      // Verify response
      expect(data.success).toBe(true);
      expect(data.conversation_id).toBe(1);

      // Verify database calls
      expect(dbConversations.closeActiveConversationsForEmail).toHaveBeenCalledWith(
        validContactData.email
      );
      expect(dbConversations.createConversation).toHaveBeenCalledWith({
        user_name: validContactData.name,
        user_email: validContactData.email,
        user_phone: validContactData.phone,
        user_company: validContactData.company,
        slack_thread_ts: mockSlackResponse.ts,
      });
      expect(dbConversations.addMessage).toHaveBeenCalledWith({
        conversation_id: 1,
        sender: 'user',
        message_text: validContactData.message,
        slack_ts: mockSlackResponse.ts,
      });

      // Verify Slack API was called
      expect(global.fetch).toHaveBeenCalledWith(
        'https://slack.com/api/chat.postMessage',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockSlackToken}`,
          }),
        })
      );
    });

    it('should handle contact without company field', async () => {
      const dataWithoutCompany = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1987654321',
        message: 'Test message without company',
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(dataWithoutCompany),
      });

      const response = await POST(request);
      const data = await assertResponse(response, 200);

      expect(data.success).toBe(true);
      expect(dbConversations.createConversation).toHaveBeenCalledWith(
        expect.objectContaining({
          user_company: undefined,
        })
      );
    });
  });

  describe('Validation errors (400)', () => {
    it('should return 400 when name is missing', async () => {
      const invalidData = { ...validContactData };
      delete (invalidData as any).name;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 400 when email is missing', async () => {
      const invalidData = { ...validContactData };
      delete (invalidData as any).email;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 400 when phone is missing', async () => {
      const invalidData = { ...validContactData };
      delete (invalidData as any).phone;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 400 when message is missing', async () => {
      const invalidData = { ...validContactData };
      delete (invalidData as any).message;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 400, 'required');
    });
  });

  describe('Configuration errors (500)', () => {
    it('should return 500 when SLACK_BOT_TOKEN is missing', async () => {
      delete process.env.SLACK_BOT_TOKEN;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500, 'not configured');
    });

    it('should return 500 when SLACK_USER_ID is missing', async () => {
      delete process.env.SLACK_USER_ID;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500, 'not configured');
    });
  });

  describe('Slack API errors (500)', () => {
    it('should return 500 when Slack API returns error', async () => {
      mockFetch([
        {
          url: 'https://slack.com/api/chat.postMessage',
          response: mockSlackErrorResponse,
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500, 'Slack');

      // Verify database functions were NOT called (Slack failed first)
      expect(dbConversations.createConversation).not.toHaveBeenCalled();
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });

    it('should return 500 when Slack API request fails', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('Database errors (500)', () => {
    it('should return 500 when createConversation fails', async () => {
      (dbConversations.createConversation as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when addMessage fails', async () => {
      (dbConversations.addMessage as jest.Mock).mockRejectedValue(
        new Error('Database insert error')
      );

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when closeActiveConversationsForEmail fails', async () => {
      (dbConversations.closeActiveConversationsForEmail as jest.Mock).mockRejectedValue(
        new Error('Database update error')
      );

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validContactData),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('Request parsing errors', () => {
    it('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      // Parsing error will be caught by try-catch
      expect(response.status).toBe(500);
    });
  });
});
