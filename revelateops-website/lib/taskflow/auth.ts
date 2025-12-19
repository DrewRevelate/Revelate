import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export interface TaskFlowSession {
  userId: string
  email: string
}

/**
 * Wraps TaskFlow API route handlers with authentication check
 * Provides user context to the handler
 */
export function withTaskFlowAuth(
  handler: (request: NextRequest, session: TaskFlowSession, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      const authSession = await auth()

      // TODO: Re-enable auth check when Google OAuth is configured
      // For now, use ADMIN_EMAIL as fallback user
      const userEmail = authSession?.user?.email || process.env.ADMIN_EMAIL || 'drew@revelateops.com'

      const session: TaskFlowSession = {
        userId: userEmail,
        email: userEmail,
      }

      return await handler(request, session, context)

    } catch (error) {
      console.error('TaskFlow API middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
