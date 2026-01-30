import { NextResponse } from 'next/server';
import { createConversation, addMessage, closeActiveConversationsForEmail } from '@/lib/db/conversations';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext, hashEmail } from '@/lib/monitoring/log-utils';

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
  const startTime = performance.now();

  try {
    // Get Slack configuration from environment
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackUserId = process.env.SLACK_USER_ID;

    if (!slackToken || !slackUserId) {
      logger.error(
        createLogContext({
          action: 'slack_config_missing',
          endpoint: '/api/contact',
          hasToken: !!slackToken,
          hasUserId: !!slackUserId,
          duration_ms: performance.now() - startTime,
        }),
        'Slack integration not configured'
      );
      return NextResponse.json(
        { error: 'Slack integration not configured' },
        { status: 500 }
      );
    }

    logger.debug(
      createLogContext({
        action: 'slack_config_loaded',
        endpoint: '/api/contact',
        tokenPrefix: slackToken.substring(0, 10),
        userId: slackUserId,
      }),
      'Slack configuration loaded'
    );

    // Parse the form data
    const data: ContactFormData = await request.json();

    logger.info(
      createLogContext({
        action: 'contact_form_received',
        endpoint: '/api/contact',
        user_email: data.email,
        has_company: !!data.company,
      }),
      'Contact form submission received'
    );

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      logger.warn(
        createLogContext({
          action: 'validation_failed',
          endpoint: '/api/contact',
          user_email: data.email,
          duration_ms: performance.now() - startTime,
        }),
        'Contact form validation failed - missing required fields'
      );
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format (RFC 5322 simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      logger.warn(
        createLogContext({
          action: 'validation_failed',
          endpoint: '/api/contact',
          user_email: data.email,
          reason: 'invalid_email_format',
          duration_ms: performance.now() - startTime,
        }),
        'Contact form validation failed - invalid email format'
      );
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
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

    if (!slackData.ok) {
      logger.error(
        createLogContext({
          action: 'slack_api_error',
          endpoint: '/api/contact',
          user_email: data.email,
          slack_error: slackData.error,
          status: slackResponse.status,
          duration_ms: performance.now() - startTime,
        }),
        'Slack API request failed'
      );
      return NextResponse.json(
        { error: 'Failed to send message to Slack', details: slackData.error },
        { status: 500 }
      );
    }

    logger.info(
      createLogContext({
        action: 'slack_dm_sent',
        endpoint: '/api/contact',
        user_email: data.email,
        slack_ts: slackData.ts,
      }),
      'Slack DM sent successfully'
    );

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

    const duration = performance.now() - startTime;

    logger.info(
      createLogContext({
        action: 'contact_form_completed',
        endpoint: '/api/contact',
        conversation_id: conversation.id,
        user_email: data.email,
        duration_ms: duration,
      }),
      'Contact form processed successfully'
    );

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      conversation_id: conversation.id
    });

  } catch (error) {
    const duration = performance.now() - startTime;

    // Capture the exception in Sentry with context
    Sentry.captureException(error, {
      tags: {
        route: '/api/contact',
        action: 'contact_form_submission'
      },
      extra: {
        duration_ms: duration,
        slackConfigured: !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_USER_ID)
      }
    });

    logger.error(
      createLogContext({
        action: 'contact_form_error',
        endpoint: '/api/contact',
        error,
        duration_ms: duration,
      }),
      'Contact form processing failed'
    );

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
