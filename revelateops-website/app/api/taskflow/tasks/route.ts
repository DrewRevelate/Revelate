import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withTaskFlowAuth } from '@/lib/taskflow/auth'
import { createTaskSchema, reorderTasksSchema } from '@/lib/taskflow/validation'

// GET /api/taskflow/tasks - List all tasks with filters
export const GET = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigneeId = searchParams.get('assigneeId')
    const sortBy = searchParams.get('sortBy') || '-created_date'
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {
      creatorId: session.userId,
    }

    if (projectId) where.projectId = projectId
    if (status) where.status = status
    if (priority) where.priority = priority
    if (assigneeId) where.assigneeId = assigneeId

    // Parse sort parameter
    const orderBy: any[] = []
    if (sortBy.startsWith('-')) {
      orderBy.push({ [sortBy.slice(1).replace('_date', 'At')]: 'desc' })
    } else {
      orderBy.push({ [sortBy.replace('_date', 'At')]: 'asc' })
    }
    orderBy.push({ order: 'asc' })

    const tasks = await prisma.tFTask.findMany({
      where,
      include: {
        project: true,
        subtasks: {
          select: { id: true, title: true, status: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy,
      take: limit,
    })

    // Transform to match frontend expectations
    const transformedTasks = tasks.map(task => ({
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
      subtasks: task.subtasks.map(s => ({
        id: s.id,
        title: s.title,
        status: s.status.toLowerCase(),
      })),
      comment_count: task._count.comments,
    }))

    return NextResponse.json(transformedTasks)
  } catch (error) {
    console.error('GET tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
})

// POST /api/taskflow/tasks - Create new task
export const POST = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json()
    const validated = createTaskSchema.parse(body)

    const task = await prisma.tFTask.create({
      data: {
        title: validated.title,
        description: validated.description || null,
        status: validated.status.toUpperCase() as any,
        priority: validated.priority.toUpperCase() as any,
        taskType: validated.taskType.toUpperCase() as any,
        labels: validated.labels,
        estimatedDays: validated.estimatedDays,
        order: validated.order,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        projectId: validated.projectId,
        parentId: validated.parentId,
        dependencies: validated.dependencies,
        assigneeId: validated.assigneeId,
        creatorId: session.userId,
      },
      include: {
        project: true,
      }
    })

    // Create activity
    await prisma.tFActivity.create({
      data: {
        type: 'task_created',
        entityType: 'task',
        entityId: task.id,
        title: `Created task: ${task.title}`,
        userId: session.userId,
        projectId: task.projectId,
        taskId: task.id,
      }
    })

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

    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('POST task error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
})

// PATCH /api/taskflow/tasks - Batch reorder tasks
export const PATCH = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json()
    const validated = reorderTasksSchema.parse(body)

    // Update all tasks in a transaction
    await prisma.$transaction(
      validated.tasks.map(task =>
        prisma.tFTask.update({
          where: {
            id: task.id,
            creatorId: session.userId, // Ensure user owns the task
          },
          data: {
            status: task.status.toUpperCase() as any,
            order: task.order,
          }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('PATCH tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to reorder tasks' },
      { status: 500 }
    )
  }
})
