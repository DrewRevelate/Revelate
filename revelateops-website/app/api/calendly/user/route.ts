import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';

export const runtime = 'edge';

/**
 * GET /api/calendly/user
 * Returns current Calendly user information
 */
export async function GET() {
  try {
    const api = getCalendlyAPI();
    const user = await api.getCurrentUser();

    return NextResponse.json(user);
  } catch (error) {
    console.error('Calendly API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
