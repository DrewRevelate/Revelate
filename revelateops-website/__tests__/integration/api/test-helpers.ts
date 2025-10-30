/**
 * Test helpers and mocks for API integration tests
 *
 * This file provides:
 * - Mock factories for database responses
 * - Mock factories for external API responses (Slack, Calendly, Cal.com)
 * - Utility functions for creating test requests
 * - Reusable assertion helpers
 */

import { Conversation, Message } from '@/lib/db/conversations';

// ==========================================
// Database Mock Factories
// ==========================================

export const mockConversation: Conversation = {
  id: 1,
  user_name: 'Test User',
  user_email: 'test@example.com',
  user_phone: '+1234567890',
  user_company: 'Test Company',
  slack_thread_ts: '1234567890.123456',
  status: 'active',
  created_at: new Date('2025-10-30T12:00:00Z'),
  updated_at: new Date('2025-10-30T12:00:00Z'),
};

export const mockMessage: Message = {
  id: 1,
  conversation_id: 1,
  sender: 'user',
  message_text: 'Test message',
  sent_at: new Date('2025-10-30T12:00:00Z'),
  read_by_user: false,
  slack_ts: '1234567890.123456',
};

export function createMockConversation(overrides?: Partial<Conversation>): Conversation {
  return {
    ...mockConversation,
    ...overrides,
  };
}

export function createMockMessage(overrides?: Partial<Message>): Message {
  return {
    ...mockMessage,
    ...overrides,
  };
}

// ==========================================
// External API Mock Factories
// ==========================================

export const mockSlackResponse = {
  ok: true,
  ts: '1234567890.123456',
  channel: 'U1234567890',
  message: {
    text: 'Test message',
    ts: '1234567890.123456',
  },
};

export const mockSlackErrorResponse = {
  ok: false,
  error: 'invalid_auth',
};

export function createMockSlackResponse(overrides?: Partial<typeof mockSlackResponse>) {
  return {
    ...mockSlackResponse,
    ...overrides,
  };
}

export const mockCalendlyAvailabilityResponse = {
  collection: [
    {
      start_time: '2025-10-30T14:00:00Z',
      end_time: '2025-10-30T15:00:00Z',
      status: 'available',
    },
  ],
  pagination: {
    count: 1,
    next_page: null,
  },
};

export const mockCalendlyEventTypesResponse = {
  collection: [
    {
      uri: 'https://api.calendly.com/event_types/123',
      name: 'Test Event',
      duration: 30,
      slug: 'test-event',
    },
  ],
};

export const mockCalcomAvailabilityResponse = {
  busy: [
    {
      start: '2025-10-30T14:00:00Z',
      end: '2025-10-30T15:00:00Z',
    },
  ],
  dateRanges: [
    {
      start: '2025-10-30T09:00:00Z',
      end: '2025-10-30T17:00:00Z',
    },
  ],
};

export const mockCalcomBookingResponse = {
  id: 123,
  uid: 'test-booking-uid',
  title: 'Test Booking',
  startTime: '2025-10-30T14:00:00Z',
  endTime: '2025-10-30T14:30:00Z',
  attendees: [
    {
      email: 'test@example.com',
      name: 'Test User',
    },
  ],
};

// ==========================================
// Mock Setup Utilities
// ==========================================

/**
 * Mock @vercel/postgres sql template tag
 */
export function mockVercelPostgres() {
  return jest.fn().mockImplementation(() => Promise.resolve({ rows: [] }));
}

/**
 * Setup mock for database module
 */
export function mockDatabaseFunctions() {
  return {
    createConversation: jest.fn().mockResolvedValue(mockConversation),
    getConversation: jest.fn().mockResolvedValue(mockConversation),
    getConversationByThreadTs: jest.fn().mockResolvedValue(mockConversation),
    addMessage: jest.fn().mockResolvedValue(mockMessage),
    getMessages: jest.fn().mockResolvedValue([mockMessage]),
    getNewMessages: jest.fn().mockResolvedValue([]),
    markMessagesAsRead: jest.fn().mockResolvedValue(undefined),
    getConversationsByEmail: jest.fn().mockResolvedValue([mockConversation]),
    getLastMessages: jest.fn().mockResolvedValue([mockMessage]),
    getRecentActiveConversation: jest.fn().mockResolvedValue(mockConversation),
    closeConversation: jest.fn().mockResolvedValue(undefined),
    closeActiveConversationsForEmail: jest.fn().mockResolvedValue(undefined),
  };
}

/**
 * Mock global fetch for external API calls
 */
export function mockFetch(responses: { url: string | RegExp; response: any }[]) {
  global.fetch = jest.fn((url: string | URL | Request) => {
    const urlString = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;

    for (const mockResponse of responses) {
      const matches =
        typeof mockResponse.url === 'string'
          ? urlString.includes(mockResponse.url)
          : mockResponse.url.test(urlString);

      if (matches) {
        return Promise.resolve({
          ok: mockResponse.response.ok !== false,
          status: mockResponse.response.ok === false ? 500 : 200,
          json: () => Promise.resolve(mockResponse.response),
          text: () => Promise.resolve(JSON.stringify(mockResponse.response)),
          headers: new Headers(),
        } as Response);
      }
    }

    // Default fallback
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not mocked' }),
      text: () => Promise.resolve(JSON.stringify({ error: 'Not mocked' })),
      headers: new Headers(),
    } as Response);
  }) as jest.Mock;
}

/**
 * Reset all fetch mocks
 */
export function resetFetchMocks() {
  if (global.fetch && jest.isMockFunction(global.fetch)) {
    (global.fetch as jest.Mock).mockClear();
  }
}

// ==========================================
// Environment Variable Utilities
// ==========================================

const originalEnv = { ...process.env };

export function setTestEnv(vars: Record<string, string>) {
  Object.assign(process.env, vars);
}

export function clearTestEnv(vars: string[]) {
  vars.forEach((key) => {
    delete process.env[key];
  });
}

export function restoreEnv() {
  process.env = { ...originalEnv };
}

// ==========================================
// Request/Response Utilities
// ==========================================

/**
 * Create a NextRequest for testing
 */
export function createTestRequest(
  url: string,
  options?: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  }
): Request {
  const { method = 'GET', body, headers = {} } = options || {};

  return new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Extract JSON from NextResponse
 */
export async function extractResponseData(response: Response) {
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}

// ==========================================
// Assertion Helpers
// ==========================================

/**
 * Assert response has expected status and structure
 */
export async function assertResponse(
  response: Response,
  expectedStatus: number,
  expectedKeys?: string[]
) {
  expect(response.status).toBe(expectedStatus);

  if (expectedKeys) {
    const data = await response.json();
    expectedKeys.forEach((key) => {
      expect(data).toHaveProperty(key);
    });
    return data;
  }

  return await response.json();
}

/**
 * Assert error response
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  errorMessageContains?: string
) {
  expect(response.status).toBe(expectedStatus);
  const data = await response.json();
  expect(data).toHaveProperty('error');

  if (errorMessageContains) {
    expect(data.error).toContain(errorMessageContains);
  }

  return data;
}

/**
 * Assert mock function was called with specific args
 */
export function assertMockCalledWith(
  mockFn: jest.Mock,
  expectedArgs: any[],
  callIndex = 0
) {
  expect(mockFn).toHaveBeenCalled();
  const actualCall = mockFn.mock.calls[callIndex];
  expectedArgs.forEach((expectedArg, index) => {
    expect(actualCall[index]).toEqual(expectedArg);
  });
}
