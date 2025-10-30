/**
 * Integration tests for POST /api/slack/events webhook endpoint
 *
 * Tests the Slack Events API webhook including:
 * - URL verification challenge
 * - Message event handling
 * - Conversation matching (threaded and non-threaded)
 * - Bot message filtering
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/slack/events/route';
import * as dbConversations from '@/lib/db/conversations';
import {
  setTestEnv,
  restoreEnv,
  createMockConversation,
  createMockMessage,
  assertResponse,
  assertErrorResponse,
} from '../test-helpers';

// Mock the database module
jest.mock('@/lib/db/conversations');

describe('POST /api/slack/events', () => {
  const mockSlackUserId = 'U1234567890';
  const mockConv = createMockConversation({
    id: 1,
    slack_thread_ts: '1234567890.123456',
  });

  beforeEach(() => {
    jest.clearAllMocks();

    setTestEnv({
      SLACK_USER_ID: mockSlackUserId,
    });

    // Setup default database mocks
    (dbConversations.getConversationByThreadTs as jest.Mock).mockResolvedValue(mockConv);
    (dbConversations.getRecentActiveConversation as jest.Mock).mockResolvedValue(mockConv);
    (dbConversations.addMessage as jest.Mock).mockResolvedValue(createMockMessage());
  });

  afterEach(() => {
    restoreEnv();
  });

  describe('URL Verification Challenge', () => {
    it('should respond to URL verification challenge', async () => {
      const challengePayload = {
        type: 'url_verification',
        challenge: 'test_challenge_123',
        token: 'verification_token',
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(challengePayload),
      });

      const response = await POST(request);
      const data = await assertResponse(response, 200, ['challenge']);

      expect(data.challenge).toBe('test_challenge_123');

      // Should not call any database functions during verification
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('Message Event Handling', () => {
    it('should store message from threaded reply', async () => {
      const messagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          user: mockSlackUserId,
          text: 'This is a reply from Drew',
          ts: '1234567890.654321',
          thread_ts: '1234567890.123456', // Threaded reply
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(messagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200, ['ok']);

      // Should find conversation by thread_ts
      expect(dbConversations.getConversationByThreadTs).toHaveBeenCalledWith(
        '1234567890.123456'
      );

      // Should store the message
      expect(dbConversations.addMessage).toHaveBeenCalledWith({
        conversation_id: 1,
        sender: 'drew',
        message_text: 'This is a reply from Drew',
        slack_ts: '1234567890.654321',
      });
    });

    it('should use most recent conversation when not threaded', async () => {
      const messagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          user: mockSlackUserId,
          text: 'Non-threaded message from Drew',
          ts: '1234567890.654321',
          // No thread_ts
        },
      };

      (dbConversations.getConversationByThreadTs as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(messagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200);

      // Should fall back to most recent active conversation
      expect(dbConversations.getRecentActiveConversation).toHaveBeenCalled();

      // Should still store the message
      expect(dbConversations.addMessage).toHaveBeenCalledWith({
        conversation_id: 1,
        sender: 'drew',
        message_text: 'Non-threaded message from Drew',
        slack_ts: '1234567890.654321',
      });
    });

    it('should handle message when no conversation found', async () => {
      const messagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          user: mockSlackUserId,
          text: 'Message with no conversation',
          ts: '1234567890.654321',
        },
      };

      (dbConversations.getConversationByThreadTs as jest.Mock).mockResolvedValue(null);
      (dbConversations.getRecentActiveConversation as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(messagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200, ['ok']);

      // Should not store message when no conversation found
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('Bot Message Filtering', () => {
    it('should ignore bot messages', async () => {
      const botMessagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          user: mockSlackUserId,
          text: 'Message from bot',
          ts: '1234567890.654321',
          bot_id: 'B1234567890', // Bot message
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(botMessagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200, ['ok']);

      // Should not store bot messages
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });

    it('should ignore messages with subtype (edits, deletes, etc)', async () => {
      const editMessagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          user: mockSlackUserId,
          text: 'Edited message',
          ts: '1234567890.654321',
          subtype: 'message_changed', // Message edit
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(editMessagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200);

      // Should not store edited messages
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('Non-DM Messages', () => {
    it('should ignore messages not in DM channel', async () => {
      const channelMessagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'channel', // Not a DM
          user: mockSlackUserId,
          text: 'Channel message',
          ts: '1234567890.654321',
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(channelMessagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200, ['ok']);

      // Should not store channel messages
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });

    it('should ignore messages without user', async () => {
      const messagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          // No user field
          text: 'Message without user',
          ts: '1234567890.654321',
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(messagePayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200);

      // Should not store messages without user
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('Non-Message Events', () => {
    it('should handle non-message events gracefully', async () => {
      const appMentionPayload = {
        type: 'event_callback',
        event: {
          type: 'app_mention', // Different event type
          user: mockSlackUserId,
          text: 'App mention',
          ts: '1234567890.654321',
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(appMentionPayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200, ['ok']);

      // Should not process non-message events
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when database error occurs', async () => {
      (dbConversations.addMessage as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const messagePayload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          user: mockSlackUserId,
          text: 'Test message',
          ts: '1234567890.654321',
          thread_ts: '1234567890.123456',
        },
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(messagePayload),
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when JSON parsing fails', async () => {
      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('Unknown Event Types', () => {
    it('should handle unknown event types gracefully', async () => {
      const unknownPayload = {
        type: 'unknown_type',
        data: 'some data',
      };

      const request = new NextRequest('http://localhost:3000/api/slack/events', {
        method: 'POST',
        body: JSON.stringify(unknownPayload),
      });

      const response = await POST(request);
      await assertResponse(response, 200, ['ok']);

      // Should not process unknown event types
      expect(dbConversations.addMessage).not.toHaveBeenCalled();
    });
  });
});
