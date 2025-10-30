import { NextResponse } from 'next/server';
import { getConversationsByEmail, getLastMessages } from '@/lib/db/conversations';

export const runtime = 'nodejs';

/**
 * POST /api/conversations/find-by-email
 * Find ACTIVE conversation for a given email address with recent messages
 * Only returns the active conversation (if any) - enforces one conversation per user
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find all conversations for this email
    const conversations = await getConversationsByEmail(email);

    // Filter for active conversations only
    const activeConversations = conversations.filter(c => c.status === 'active');

    if (activeConversations.length === 0) {
      return NextResponse.json({
        found: false,
        conversation: null
      });
    }

    // Get the most recent active conversation with its last few messages
    const mostRecent = activeConversations[0];
    const recentMessages = await getLastMessages(mostRecent.id, 3);

    return NextResponse.json({
      found: true,
      conversation: {
        ...mostRecent,
        recentMessages
      }
    });

  } catch (error) {
    console.error('Error finding conversations:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to find conversations' },
      { status: 500 }
    );
  }
}
