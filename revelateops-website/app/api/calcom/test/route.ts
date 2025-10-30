import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to verify Cal.com API key and fetch event types
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CALCOM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      );
    }

    console.log('Testing Cal.com API with key:', apiKey.substring(0, 20) + '...');

    // Try to fetch event types to verify API key works (using v1 API)
    const response = await fetch('https://api.cal.com/v1/event-types', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Cal.com API test response status:', response.status);

    const data = await response.json();
    console.log('Cal.com API test response:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      data: data,
      message: response.ok
        ? 'API key is valid! See event types below.'
        : 'API key test failed. Check the error details.',
    });

  } catch (error: any) {
    console.error('Cal.com API test error:', error);
    return NextResponse.json(
      {
        error: 'Test failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
