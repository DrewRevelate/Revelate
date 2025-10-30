import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';

export const runtime = 'edge';

/**
 * GET /api/calendly/availability?event_type_uri={uri}&start_time={iso}&end_time={iso}
 * Returns available time slots for an event type
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventTypeUri = searchParams.get('event_type_uri');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');

    if (!eventTypeUri || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required parameters: event_type_uri, start_time, end_time' },
        { status: 400 }
      );
    }

    const api = getCalendlyAPI();
    const availability = await api.getAvailableTimes(eventTypeUri, startTime, endTime);

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Calendly API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
