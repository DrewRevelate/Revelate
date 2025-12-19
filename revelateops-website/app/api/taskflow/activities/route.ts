import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withTaskFlowAuth } from '@/lib/taskflow/auth'

// GET /api/taskflow/activities - Get activity feed
export const GET = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const taskId = searchParams.get('taskId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {
      userId: session.userId,
    }

    if (projectId) where.projectId = projectId
    if (taskId) where.taskId = taskId

    const activities = await prisma.tFActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        task: {
          select: { id: true, title: true }
        }
      }
    })

    // Transform to match frontend expectations
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      entity_type: activity.entityType,
      entity_id: activity.entityId,
      title: activity.title,
      description: activity.description,
      metadata: activity.metadata,
      user_id: activity.userId,
      project_id: activity.projectId,
      task_id: activity.taskId,
      task: activity.task ? {
        id: activity.task.id,
        title: activity.task.title,
      } : null,
      created_date: activity.createdAt.toISOString(),
    }))

    return NextResponse.json(transformedActivities)
  } catch (error) {
    console.error('GET activities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
})
