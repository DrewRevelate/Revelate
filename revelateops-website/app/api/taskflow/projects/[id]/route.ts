import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withTaskFlowAuth } from '@/lib/taskflow/auth'
import { updateProjectSchema } from '@/lib/taskflow/validation'

// GET /api/taskflow/projects/[id] - Get single project with tasks
export const GET = withTaskFlowAuth(async (
  request: NextRequest,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const project = await prisma.tFProject.findFirst({
      where: {
        id,
        ownerId: session.userId,
      },
      include: {
        tasks: {
          orderBy: [{ status: 'asc' }, { order: 'asc' }],
          include: {
            _count: { select: { comments: true } }
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length

    // Transform response
    const transformed = {
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      status: project.status.toLowerCase(),
      owner_id: project.ownerId,
      created_date: project.createdAt.toISOString(),
      updated_date: project.updatedAt.toISOString(),
      task_count: totalTasks,
      completed_tasks: completedTasks,
      progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      tasks: project.tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status.toLowerCase(),
        priority: t.priority.toLowerCase(),
        task_type: t.taskType.toLowerCase(),
        labels: t.labels,
        due_date: t.dueDate?.toISOString().split('T')[0] || null,
        order: t.order,
        comment_count: t._count.comments,
      }))
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('GET project error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
})

// PATCH /api/taskflow/projects/[id] - Update project
export const PATCH = withTaskFlowAuth(async (
  request: NextRequest,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = updateProjectSchema.parse(body)

    // Check project exists and belongs to user
    const existing = await prisma.tFProject.findFirst({
      where: { id, ownerId: session.userId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.description !== undefined) updateData.description = validated.description
    if (validated.color !== undefined) updateData.color = validated.color
    if (validated.status !== undefined) updateData.status = validated.status.toUpperCase()

    const project = await prisma.tFProject.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } }
      }
    })

    const totalTasks = project._count.tasks
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length

    // Transform response
    const transformed = {
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      status: project.status.toLowerCase(),
      owner_id: project.ownerId,
      created_date: project.createdAt.toISOString(),
      updated_date: project.updatedAt.toISOString(),
      task_count: totalTasks,
      completed_tasks: completedTasks,
      progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    }

    return NextResponse.json(transformed)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('PATCH project error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
})

// DELETE /api/taskflow/projects/[id] - Delete project
export const DELETE = withTaskFlowAuth(async (
  request: NextRequest,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    // Check project exists and belongs to user
    const existing = await prisma.tFProject.findFirst({
      where: { id, ownerId: session.userId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // This will cascade delete all tasks in the project
    await prisma.tFProject.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE project error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
})
