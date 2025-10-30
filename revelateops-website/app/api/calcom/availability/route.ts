import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const eventTypeId = searchParams.get('eventTypeId');

    console.log('Availability request params:', { startTime, endTime, eventTypeId });

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required parameters: startTime and endTime' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CALCOM_API_KEY;
    if (!apiKey) {
      console.error('Cal.com API key not found in environment variables');
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      );
    }

    console.log('Using API key:', apiKey.substring(0, 20) + '...');

    // Cal.com API v1 endpoint for slots
    // Format: /v1/slots/available?eventTypeId=X&startTime=ISO&endTime=ISO
    const calcomUrl = new URL(`https://api.cal.com/v1/slots/available`);

    // Required parameters for Cal.com v1 API
    if (eventTypeId) {
      calcomUrl.searchParams.append('eventTypeId', eventTypeId);
    }
    calcomUrl.searchParams.append('startTime', startTime);
    calcomUrl.searchParams.append('endTime', endTime);

    console.log('Calling Cal.com API:', calcomUrl.toString());

    const response = await fetch(calcomUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Cal.com API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cal.com API error response:', errorText);
      console.error('Cal.com API error status:', response.status);
      console.error('Cal.com API error headers:', Object.fromEntries(response.headers.entries()));

      return NextResponse.json(
        {
          error: 'Failed to fetch availability from Cal.com',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Cal.com API success response:', JSON.stringify(data).substring(0, 200));

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error fetching Cal.com availability:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
