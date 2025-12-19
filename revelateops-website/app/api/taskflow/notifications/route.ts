import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withTaskFlowAuth } from '@/lib/taskflow/auth'

// GET /api/taskflow/notifications - Get user notifications
export const GET = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      userId: session.userId,
    }

    if (unreadOnly) where.read = false

    const notifications = await prisma.tFNotification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Transform to match frontend expectations
    const transformedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      task_id: notification.taskId,
      user_id: notification.userId,
      created_date: notification.createdAt.toISOString(),
    }))

    return NextResponse.json(transformedNotifications)
  } catch (error) {
    console.error('GET notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
})

// PATCH /api/taskflow/notifications - Mark all as read
export const PATCH = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    await prisma.tFNotification.updateMany({
      where: {
        userId: session.userId,
        read: false,
      },
      data: {
        read: true,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
})
