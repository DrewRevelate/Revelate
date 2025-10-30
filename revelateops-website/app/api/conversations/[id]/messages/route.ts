import { NextResponse } from 'next/server';
import { getMessages, addMessage, getConversation, markMessagesAsRead } from '@/lib/db/conversations';

export const runtime = 'nodejs';

/**
 * GET /api/conversations/[id]/messages
 * Fetch all messages for a conversation
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get all messages
    const messages = await getMessages(conversationId);

    // Mark Drew's messages as read
    await markMessagesAsRead(conversationId);

    return NextResponse.json({
      conversation,
      messages
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Send a new message in the conversation
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = parseInt(id);

    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Store message in database
    const newMessage = await addMessage({
      conversation_id: conversationId,
      sender: 'user',
      message_text: message.trim()
    });

    // Send message to Slack as a threaded reply
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackUserId = process.env.SLACK_USER_ID;

    if (!slackToken || !slackUserId) {
      console.error('Missing Slack configuration');
      return NextResponse.json(
        { error: 'Slack integration not configured' },
        { status: 500 }
      );
    }

    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: slackUserId,
        // Don't use thread_ts - send as separate messages so they're visible in main DM
        text: `💬 *${conversation.user_name}* (${conversation.user_email}):\n${message}`,
        unfurl_links: false,
        unfurl_media: false
      })
    });

    const slackData = await slackResponse.json();

    if (!slackData.ok) {
      console.error('Slack API error:', slackData.error);
      // Don't fail the request - message is already saved
    }

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
