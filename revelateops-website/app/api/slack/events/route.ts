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

      // Only process message events
      if (event.type === 'message') {
        // Ignore bot messages and message edits/deletes
        if (event.subtype || event.bot_id) {
          return NextResponse.json({ ok: true });
        }

        // Check if this is a threaded message (reply)
        if (event.thread_ts) {
          // Find the conversation by thread timestamp
          const conversation = await getConversationByThreadTs(event.thread_ts);

          if (conversation) {
            // This is a reply from Drew
            await addMessage({
              conversation_id: conversation.id,
              sender: 'drew',
              message_text: event.text,
              slack_ts: event.ts
            });

            console.log('Stored Drew\'s reply:', {
              conversation_id: conversation.id,
              message: event.text.substring(0, 50)
            });
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
