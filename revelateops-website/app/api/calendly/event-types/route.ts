import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';

export const runtime = 'edge';

/**
 * GET /api/calendly/event-types
 * Returns active event types for the current user
 */
export async function GET() {
  try {
    const api = getCalendlyAPI();

    // First get current user to get their URI
    const userResponse = await api.getCurrentUser();
    const userUri = userResponse.resource.uri;

    // Then get their event types
    const eventTypes = await api.getEventTypes(userUri);

    return NextResponse.json(eventTypes);
  } catch (error) {
    console.error('Calendly API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}
