import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withTaskFlowAuth } from '@/lib/taskflow/auth'
import { updateTaskSchema } from '@/lib/taskflow/validation'

// GET /api/taskflow/tasks/[id] - Get single task with comments
export const GET = withTaskFlowAuth(async (
  request: NextRequest,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const task = await prisma.tFTask.findFirst({
      where: {
        id,
        creatorId: session.userId,
      },
      include: {
        project: true,
        subtasks: true,
        comments: {
          orderBy: { createdAt: 'desc' }
        },
        parent: {
          select: { id: true, title: true }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Transform response
    const transformed = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      task_type: task.taskType.toLowerCase(),
      labels: task.labels,
      estimated_days: task.estimatedDays,
      order: task.order,
      due_date: task.dueDate?.toISOString().split('T')[0] || null,
      project_id: task.projectId,
      project: task.project ? {
        id: task.project.id,
        name: task.project.name,
        color: task.project.color,
      } : null,
      parent_id: task.parentId,
      parent: task.parent ? {
        id: task.parent.id,
        title: task.parent.title,
      } : null,
      dependencies: task.dependencies,
      assignee: task.assigneeId,
      created_by: task.creatorId,
      created_date: task.createdAt.toISOString(),
      updated_date: task.updatedAt.toISOString(),
      subtasks: task.subtasks.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        status: s.status.toLowerCase(),
        priority: s.priority.toLowerCase(),
      })),
      comments: task.comments.map(c => ({
        id: c.id,
        content: c.content,
        author_id: c.authorId,
        created_date: c.createdAt.toISOString(),
        updated_date: c.updatedAt.toISOString(),
      })),
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('GET task error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
})

// PATCH /api/taskflow/tasks/[id] - Update task
export const PATCH = withTaskFlowAuth(async (
  request: NextRequest,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = updateTaskSchema.parse(body)

    // Check task exists and belongs to user
    const existing = await prisma.tFTask.findFirst({
      where: { id, creatorId: session.userId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (validated.title !== undefined) updateData.title = validated.title
    if (validated.description !== undefined) updateData.description = validated.description
    if (validated.status !== undefined) updateData.status = validated.status.toUpperCase()
    if (validated.priority !== undefined) updateData.priority = validated.priority.toUpperCase()
    if (validated.taskType !== undefined) updateData.taskType = validated.taskType.toUpperCase()
    if (validated.labels !== undefined) updateData.labels = validated.labels
    if (validated.estimatedDays !== undefined) updateData.estimatedDays = validated.estimatedDays
    if (validated.order !== undefined) updateData.order = validated.order
    if (validated.dueDate !== undefined) {
      updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null
    }
    if (validated.projectId !== undefined) updateData.projectId = validated.projectId
    if (validated.parentId !== undefined) updateData.parentId = validated.parentId
    if (validated.dependencies !== undefined) updateData.dependencies = validated.dependencies
    if (validated.assigneeId !== undefined) updateData.assigneeId = validated.assigneeId

    const task = await prisma.tFTask.update({
      where: { id },
      data: updateData,
      include: { project: true }
    })

    // Create activity for status changes
    if (validated.status && validated.status.toUpperCase() !== existing.status) {
      await prisma.tFActivity.create({
        data: {
          type: 'task_status_changed',
          entityType: 'task',
          entityId: task.id,
          title: `Changed status to ${validated.status}`,
          description: `Task "${task.title}" moved from ${existing.status.toLowerCase()} to ${validated.status.toLowerCase()}`,
          metadata: {
            oldStatus: existing.status.toLowerCase(),
            newStatus: validated.status.toLowerCase(),
          },
          userId: session.userId,
          projectId: task.projectId,
          taskId: task.id,
        }
      })
    }

    // Transform response
    const transformed = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      task_type: task.taskType.toLowerCase(),
      labels: task.labels,
      estimated_days: task.estimatedDays,
      order: task.order,
      due_date: task.dueDate?.toISOString().split('T')[0] || null,
      project_id: task.projectId,
      project: task.project ? {
        id: task.project.id,
        name: task.project.name,
        color: task.project.color,
      } : null,
      parent_id: task.parentId,
      dependencies: task.dependencies,
      assignee: task.assigneeId,
      created_by: task.creatorId,
      created_date: task.createdAt.toISOString(),
      updated_date: task.updatedAt.toISOString(),
    }

    return NextResponse.json(transformed)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('PATCH task error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
})

// DELETE /api/taskflow/tasks/[id] - Delete task
export const DELETE = withTaskFlowAuth(async (
  request: NextRequest,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    // Check task exists and belongs to user
    const existing = await prisma.tFTask.findFirst({
      where: { id, creatorId: session.userId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    await prisma.tFTask.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE task error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
})
