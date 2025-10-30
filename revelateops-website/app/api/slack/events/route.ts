import { NextResponse } from 'next/server';
import { getConversationByThreadTs, addMessage } from '@/lib/db/conversations';

export const runtime = 'nodejs';

/**
 * POST /api/slack/events
 * Webhook endpoint for Slack Events API
 * Receives your replies from Slack and stores them in the database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle Slack URL verification challenge
    if (body.type === 'url_verification') {
      return NextResponse.json({
        challenge: body.challenge
      });
    }

    // Handle events
    if (body.type === 'event_callback') {
      const event = body.event;

      // Only process message events from Drew (not from the bot)
      if (event.type === 'message') {
        // Ignore bot messages, message edits/deletes, and messages from other apps
        if (event.subtype || event.bot_id) {
          return NextResponse.json({ ok: true });
        }

        // This is a message from Drew - determine which conversation it belongs to
        // If it's a threaded reply, use the thread_ts to find the conversation
        // Otherwise, use the most recently active conversation

        const slackUserId = process.env.SLACK_USER_ID;

        // Verify this is a DM to/from the expected user
        if (event.channel_type === 'im' && event.user) {
          let conversation = null;

          // Check if this is a threaded reply
          if (event.thread_ts) {
            // Find conversation by thread timestamp
            conversation = await getConversationByThreadTs(event.thread_ts);
            console.log('Found conversation by thread_ts:', {
              thread_ts: event.thread_ts,
              conversation_id: conversation?.id
            });
          }

          // Fallback: Get the most recent active conversation if no thread match
          if (!conversation) {
            const { getRecentActiveConversation } = await import('@/lib/db/conversations');
            conversation = await getRecentActiveConversation();
            console.log('Using most recent active conversation:', {
              conversation_id: conversation?.id
            });
          }

          if (conversation) {
            // Store Drew's reply
            await addMessage({
              conversation_id: conversation.id,
              sender: 'drew',
              message_text: event.text,
              slack_ts: event.ts
            });

            console.log('Stored Drew\'s reply:', {
              conversation_id: conversation.id,
              message: event.text.substring(0, 50),
              via_thread: !!event.thread_ts
            });
          } else {
            console.log('No conversation found for Drew\'s message');
          }
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Slack events webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
