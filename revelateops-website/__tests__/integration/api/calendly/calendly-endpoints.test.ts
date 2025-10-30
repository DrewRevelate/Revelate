/**
 * Integration tests for Calendly API proxy endpoints
 *
 * Tests all 4 Calendly endpoints:
 * - GET /api/calendly/availability
 * - GET /api/calendly/event-types
 * - POST /api/calendly/scheduling-link
 * - GET /api/calendly/user
 */

import { NextRequest } from 'next/server';
import { GET as getAvailability } from '@/app/api/calendly/availability/route';
import { GET as getEventTypes } from '@/app/api/calendly/event-types/route';
import { POST as createSchedulingLink } from '@/app/api/calendly/scheduling-link/route';
import { GET as getUser } from '@/app/api/calendly/user/route';
import * as calendlyApi from '@/lib/calendly-api';
import {
  mockCalendlyAvailabilityResponse,
  mockCalendlyEventTypesResponse,
  assertResponse,
  assertErrorResponse,
} from '../test-helpers';

// Mock the Calendly API module
jest.mock('@/lib/calendly-api');

describe('Calendly API Endpoints', () => {
  const mockApi = {
    getAvailableTimes: jest.fn(),
    getEventTypes: jest.fn(),
    createSchedulingLink: jest.fn(),
    getCurrentUser: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (calendlyApi.getCalendlyAPI as jest.Mock).mockReturnValue(mockApi);
  });

  describe('GET /api/calendly/availability', () => {
    it('should return availability successfully with valid parameters', async () => {
      mockApi.getAvailableTimes.mockResolvedValue(mockCalendlyAvailabilityResponse);

      const url =
        'http://localhost:3000/api/calendly/availability?event_type_uri=https://api.calendly.com/event_types/123&start_time=2025-10-30T00:00:00Z&end_time=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      const data = await assertResponse(response, 200);

      expect(data).toEqual(mockCalendlyAvailabilityResponse);
      expect(mockApi.getAvailableTimes).toHaveBeenCalledWith(
        'https://api.calendly.com/event_types/123',
        '2025-10-30T00:00:00Z',
        '2025-10-31T00:00:00Z'
      );
    });

    it('should return 400 when event_type_uri is missing', async () => {
      const url =
        'http://localhost:3000/api/calendly/availability?start_time=2025-10-30T00:00:00Z&end_time=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 400, 'required parameters');
    });

    it('should return 400 when start_time is missing', async () => {
      const url =
        'http://localhost:3000/api/calendly/availability?event_type_uri=https://api.calendly.com/event_types/123&end_time=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 400, 'required parameters');
    });

    it('should return 400 when end_time is missing', async () => {
      const url =
        'http://localhost:3000/api/calendly/availability?event_type_uri=https://api.calendly.com/event_types/123&start_time=2025-10-30T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 400, 'required parameters');
    });

    it('should return 500 when Calendly API fails', async () => {
      mockApi.getAvailableTimes.mockRejectedValue(new Error('Calendly API error'));

      const url =
        'http://localhost:3000/api/calendly/availability?event_type_uri=https://api.calendly.com/event_types/123&start_time=2025-10-30T00:00:00Z&end_time=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when CALENDLY_API_TOKEN is missing', async () => {
      (calendlyApi.getCalendlyAPI as jest.Mock).mockImplementation(() => {
        throw new Error('CALENDLY_API_TOKEN environment variable is not set');
      });

      const url =
        'http://localhost:3000/api/calendly/availability?event_type_uri=https://api.calendly.com/event_types/123&start_time=2025-10-30T00:00:00Z&end_time=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('GET /api/calendly/event-types', () => {
    const mockUserResponse = {
      resource: {
        uri: 'https://api.calendly.com/users/123',
        name: 'Test User',
      },
    };

    it('should return event types successfully', async () => {
      mockApi.getCurrentUser.mockResolvedValue(mockUserResponse);
      mockApi.getEventTypes.mockResolvedValue(mockCalendlyEventTypesResponse);

      const url = 'http://localhost:3000/api/calendly/event-types';
      const request = new NextRequest(url);

      const response = await getEventTypes(request);
      const data = await assertResponse(response, 200);

      expect(data).toEqual(mockCalendlyEventTypesResponse);
      expect(mockApi.getCurrentUser).toHaveBeenCalled();
      expect(mockApi.getEventTypes).toHaveBeenCalledWith(mockUserResponse.resource.uri);
    });

    it('should return 500 when getCurrentUser fails', async () => {
      mockApi.getCurrentUser.mockRejectedValue(new Error('Calendly API error'));

      const url = 'http://localhost:3000/api/calendly/event-types';
      const request = new NextRequest(url);

      const response = await getEventTypes(request);
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when getEventTypes fails', async () => {
      mockApi.getCurrentUser.mockResolvedValue(mockUserResponse);
      mockApi.getEventTypes.mockRejectedValue(new Error('Calendly API error'));

      const url = 'http://localhost:3000/api/calendly/event-types';
      const request = new NextRequest(url);

      const response = await getEventTypes(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('POST /api/calendly/scheduling-link', () => {
    const validLinkData = {
      event_type_uri: 'https://api.calendly.com/event_types/123',
    };

    const mockLinkResponse = {
      resource: {
        booking_url: 'https://calendly.com/s/ABCD1234',
        owner: validLinkData.event_type_uri,
        owner_type: 'EventType',
      },
    };

    it('should create scheduling link successfully', async () => {
      mockApi.createSchedulingLink.mockResolvedValue(mockLinkResponse);

      const request = new NextRequest('http://localhost:3000/api/calendly/scheduling-link', {
        method: 'POST',
        body: JSON.stringify(validLinkData),
      });

      const response = await createSchedulingLink(request);
      const data = await assertResponse(response, 200);

      expect(data).toEqual(mockLinkResponse);
      expect(mockApi.createSchedulingLink).toHaveBeenCalledWith({
        max_event_count: 1,
        owner: validLinkData.event_type_uri,
        owner_type: 'EventType',
      });
    });

    it('should return 400 when event_type_uri is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/calendly/scheduling-link', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await createSchedulingLink(request);
      await assertErrorResponse(response, 400, 'required');
    });

    it('should return 500 when Calendly API fails', async () => {
      mockApi.createSchedulingLink.mockRejectedValue(new Error('Calendly API error'));

      const request = new NextRequest('http://localhost:3000/api/calendly/scheduling-link', {
        method: 'POST',
        body: JSON.stringify(validLinkData),
      });

      const response = await createSchedulingLink(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('GET /api/calendly/user', () => {
    const mockUserResponse = {
      resource: {
        uri: 'https://api.calendly.com/users/123',
        name: 'Test User',
        slug: 'test-user',
        email: 'test@example.com',
        scheduling_url: 'https://calendly.com/test-user',
        timezone: 'America/New_York',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      },
    };

    it('should return user information successfully', async () => {
      mockApi.getCurrentUser.mockResolvedValue(mockUserResponse);

      const request = new NextRequest('http://localhost:3000/api/calendly/user');

      const response = await getUser(request);
      const data = await assertResponse(response, 200);

      expect(data).toEqual(mockUserResponse);
      expect(mockApi.getCurrentUser).toHaveBeenCalled();
    });

    it('should return 500 when Calendly API fails', async () => {
      mockApi.getCurrentUser.mockRejectedValue(new Error('Calendly API error'));

      const request = new NextRequest('http://localhost:3000/api/calendly/user');

      const response = await getUser(request);
      await assertErrorResponse(response, 500);
    });

    it('should return 500 when CALENDLY_API_TOKEN is missing', async () => {
      (calendlyApi.getCalendlyAPI as jest.Mock).mockImplementation(() => {
        throw new Error('CALENDLY_API_TOKEN environment variable is not set');
      });

      const request = new NextRequest('http://localhost:3000/api/calendly/user');

      const response = await getUser(request);
      await assertErrorResponse(response, 500);
    });
  });
});
