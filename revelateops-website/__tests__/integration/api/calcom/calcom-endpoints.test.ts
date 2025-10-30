/**
 * Integration tests for Cal.com API proxy endpoints
 *
 * Tests all 3 Cal.com endpoints:
 * - GET /api/calcom/availability
 * - POST /api/calcom/booking
 * - GET /api/calcom/test
 */

import { NextRequest } from 'next/server';
import { GET as getAvailability } from '@/app/api/calcom/availability/route';
import { POST as createBooking } from '@/app/api/calcom/booking/route';
import { GET as testConnection } from '@/app/api/calcom/test/route';
import {
  mockFetch,
  resetFetchMocks,
  setTestEnv,
  restoreEnv,
  mockCalcomAvailabilityResponse,
  mockCalcomBookingResponse,
  assertResponse,
  assertErrorResponse,
} from '../test-helpers';

describe('Cal.com API Endpoints', () => {
  const mockApiKey = 'cal_test_api_key_12345';

  beforeEach(() => {
    jest.clearAllMocks();
    resetFetchMocks();

    setTestEnv({
      CALCOM_API_KEY: mockApiKey,
    });
  });

  afterEach(() => {
    restoreEnv();
  });

  describe('GET /api/calcom/availability', () => {
    it('should return availability successfully with valid parameters', async () => {
      mockFetch([
        {
          url: /api\.cal\.com.*slots\/available/,
          response: mockCalcomAvailabilityResponse,
        },
      ]);

      const url =
        'http://localhost:3000/api/calcom/availability?startTime=2025-10-30T00:00:00Z&endTime=2025-10-31T00:00:00Z&eventTypeId=123';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      const data = await assertResponse(response, 200);

      expect(data).toEqual(mockCalcomAvailabilityResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.cal.com/v1/slots/available'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
          }),
        })
      );
    });

    it('should work without eventTypeId parameter', async () => {
      mockFetch([
        {
          url: /api\.cal\.com.*slots\/available/,
          response: mockCalcomAvailabilityResponse,
        },
      ]);

      const url =
        'http://localhost:3000/api/calcom/availability?startTime=2025-10-30T00:00:00Z&endTime=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertResponse(response, 200);
    });

    it('should return 400 when startTime is missing', async () => {
      const url =
        'http://localhost:3000/api/calcom/availability?endTime=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 400, 'required parameters');
    });

    it('should return 400 when endTime is missing', async () => {
      const url =
        'http://localhost:3000/api/calcom/availability?startTime=2025-10-30T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 400, 'required parameters');
    });

    it('should return 500 when CALCOM_API_KEY is missing', async () => {
      delete process.env.CALCOM_API_KEY;

      const url =
        'http://localhost:3000/api/calcom/availability?startTime=2025-10-30T00:00:00Z&endTime=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 500, 'not configured');
    });

    it('should return error when Cal.com API fails', async () => {
      mockFetch([
        {
          url: /api\.cal\.com.*slots\/available/,
          response: { ok: false, error: 'Invalid API key' },
        },
      ]);

      const url =
        'http://localhost:3000/api/calcom/availability?startTime=2025-10-30T00:00:00Z&endTime=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return 500 when fetch fails with network error', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      const url =
        'http://localhost:3000/api/calcom/availability?startTime=2025-10-30T00:00:00Z&endTime=2025-10-31T00:00:00Z';
      const request = new NextRequest(url);

      const response = await getAvailability(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('POST /api/calcom/booking', () => {
    const validBookingData = {
      eventTypeId: 123,
      start: '2025-10-30T14:00:00Z',
      responses: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      metadata: {},
      timeZone: 'America/New_York',
    };

    it('should create booking successfully', async () => {
      mockFetch([
        {
          url: 'https://api.cal.com/v1/bookings',
          response: mockCalcomBookingResponse,
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(validBookingData),
      });

      const response = await createBooking(request);
      const data = await assertResponse(response, 200);

      expect(data).toEqual(mockCalcomBookingResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.cal.com/v1/bookings',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
          }),
          body: expect.stringContaining(String(validBookingData.eventTypeId)),
        })
      );
    });

    it('should use default timezone when not provided', async () => {
      mockFetch([
        {
          url: 'https://api.cal.com/v1/bookings',
          response: mockCalcomBookingResponse,
        },
      ]);

      const dataWithoutTimezone = { ...validBookingData };
      delete (dataWithoutTimezone as any).timeZone;

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(dataWithoutTimezone),
      });

      await createBooking(request);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const bodyString = fetchCall[1].body;
      const body = JSON.parse(bodyString);
      expect(body.timeZone).toBeDefined();
    });

    it('should return 400 when eventTypeId is missing', async () => {
      const invalidData = { ...validBookingData };
      delete (invalidData as any).eventTypeId;

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await createBooking(request);
      await assertErrorResponse(response, 400, 'required fields');
    });

    it('should return 400 when start is missing', async () => {
      const invalidData = { ...validBookingData };
      delete (invalidData as any).start;

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await createBooking(request);
      await assertErrorResponse(response, 400, 'required fields');
    });

    it('should return 400 when responses is missing', async () => {
      const invalidData = { ...validBookingData };
      delete (invalidData as any).responses;

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await createBooking(request);
      await assertErrorResponse(response, 400, 'required fields');
    });

    it('should return 500 when CALCOM_API_KEY is missing', async () => {
      delete process.env.CALCOM_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(validBookingData),
      });

      const response = await createBooking(request);
      await assertErrorResponse(response, 500, 'not configured');
    });

    it('should return error when Cal.com API fails', async () => {
      mockFetch([
        {
          url: 'https://api.cal.com/v1/bookings',
          response: { ok: false, error: 'Booking failed' },
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(validBookingData),
      });

      const response = await createBooking(request);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return 500 when fetch fails with network error', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      const request = new NextRequest('http://localhost:3000/api/calcom/booking', {
        method: 'POST',
        body: JSON.stringify(validBookingData),
      });

      const response = await createBooking(request);
      await assertErrorResponse(response, 500);
    });
  });

  describe('GET /api/calcom/test', () => {
    const mockEventTypesResponse = {
      event_types: [
        {
          id: 123,
          title: 'Test Event',
          length: 30,
        },
      ],
    };

    it('should return test result with valid API key', async () => {
      mockFetch([
        {
          url: 'https://api.cal.com/v1/event-types',
          response: mockEventTypesResponse,
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/calcom/test');

      const response = await testConnection(request);
      const data = await assertResponse(response, 200, ['status', 'ok', 'message']);

      expect(data.ok).toBe(true);
      expect(data.data).toEqual(mockEventTypesResponse);
      expect(data.message).toContain('valid');
    });

    it('should return test result with invalid API key', async () => {
      mockFetch([
        {
          url: 'https://api.cal.com/v1/event-types',
          response: { ok: false, error: 'Invalid API key' },
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/calcom/test');

      const response = await testConnection(request);
      const data = await assertResponse(response, 200, ['status', 'ok', 'message']);

      expect(data.ok).toBe(false);
      expect(data.message).toContain('failed');
    });

    it('should return 500 when CALCOM_API_KEY is missing', async () => {
      delete process.env.CALCOM_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/calcom/test');

      const response = await testConnection(request);
      await assertErrorResponse(response, 500, 'not configured');
    });

    it('should return 500 when fetch fails with network error', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      const request = new NextRequest('http://localhost:3000/api/calcom/test');

      const response = await testConnection(request);
      await assertErrorResponse(response, 500);
    });
  });
});
