import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';

export const runtime = 'edge';

/**
 * POST /api/calendly/scheduling-link
 * Creates a single-use scheduling link
 * Body: { event_type_uri: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type_uri } = body;

    if (!event_type_uri) {
      return NextResponse.json(
        { error: 'Missing required parameter: event_type_uri' },
        { status: 400 }
      );
    }

    const api = getCalendlyAPI();
    const schedulingLink = await api.createSchedulingLink({
      max_event_count: 1, // Single-use link
      owner: event_type_uri,
      owner_type: 'EventType',
    });

    return NextResponse.json(schedulingLink);
  } catch (error) {
    console.error('Calendly API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create scheduling link' },
      { status: 500 }
    );
  }
}
