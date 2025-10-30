import { NextResponse } from 'next/server';
import { createConversation, addMessage, closeActiveConversationsForEmail } from '@/lib/db/conversations';

// Note: Changed from 'edge' to 'nodejs' to support Vercel Postgres
export const runtime = 'nodejs';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  company?: string;
}

/**
 * POST /api/contact
 * Sends contact form data as a direct message to you via Slack chat.postMessage API
 */
export async function POST(request: Request) {
  try {
    // Get Slack configuration from environment
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackUserId = process.env.SLACK_USER_ID;

    if (!slackToken || !slackUserId) {
      console.error('Missing Slack configuration', {
        hasToken: !!slackToken,
        hasUserId: !!slackUserId,
        tokenPrefix: slackToken?.substring(0, 10)
      });
      return NextResponse.json(
        { error: 'Slack integration not configured' },
        { status: 500 }
      );
    }

    console.log('Slack config loaded', {
      tokenPrefix: slackToken.substring(0, 10),
      userId: slackUserId
    });

    // Parse the form data
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required' },
        { status: 400 }
      );
    }

    // Format the message for Slack DM using blocks
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📬 New Contact Form Message',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*\n${data.name}`
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n<mailto:${data.email}|${data.email}>`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Phone:*\n${data.phone}`
          },
          ...(data.company ? [{
            type: 'mrkdwn',
            text: `*Company:*\n${data.company}`
          }] : [])
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n${data.message}`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Submitted via contact form • ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`
          }
        ]
      }
    ];

    // Create fallback text for notifications and accessibility
    const fallbackText = `New message from ${data.name} (${data.email}, ${data.phone}): ${data.message.substring(0, 100)}${data.message.length > 100 ? '...' : ''}`;

    // Send DM to your Slack user
    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: slackUserId,
        text: fallbackText,
        blocks: blocks,
        unfurl_links: false,
        unfurl_media: false
      })
    });

    const slackData = await slackResponse.json();

    console.log('Slack API response:', {
      ok: slackData.ok,
      error: slackData.error,
      status: slackResponse.status,
      ts: slackData.ts
    });

    if (!slackData.ok) {
      console.error('Slack API error:', slackData);
      return NextResponse.json(
        { error: 'Failed to send message to Slack', details: slackData.error },
        { status: 500 }
      );
    }

    // Close any previous active conversations for this email
    // This enforces one active conversation per user
    await closeActiveConversationsForEmail(data.email);

    // Create new conversation in database
    const conversation = await createConversation({
      user_name: data.name,
      user_email: data.email,
      user_phone: data.phone,
      user_company: data.company,
      slack_thread_ts: slackData.ts  // Slack message timestamp for threading
    });

    // Store the initial message
    await addMessage({
      conversation_id: conversation.id,
      sender: 'user',
      message_text: data.message,
      slack_ts: slackData.ts
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      conversation_id: conversation.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
