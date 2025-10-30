import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      eventTypeId,
      start,
      responses,
      metadata,
      timeZone,
    } = body;

    if (!eventTypeId || !start || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields: eventTypeId, start, and responses' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CALCOM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      );
    }

    // Cal.com API v1 endpoint for creating bookings
    const calcomUrl = 'https://api.cal.com/v1/bookings';

    const bookingData = {
      eventTypeId,
      start,
      responses,
      metadata,
      timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const response = await fetch(calcomUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cal.com booking error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create booking with Cal.com', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating Cal.com booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
