import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withTaskFlowAuth } from '@/lib/taskflow/auth'
import { createProjectSchema } from '@/lib/taskflow/validation'

// GET /api/taskflow/projects - List all projects
export const GET = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {
      ownerId: session.userId,
    }

    if (status) where.status = status.toUpperCase()

    const projects = await prisma.tFProject.findMany({
      where,
      include: {
        _count: {
          select: { tasks: true }
        },
        tasks: {
          select: { status: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to match frontend expectations
    const transformedProjects = projects.map(project => {
      const totalTasks = project._count.tasks
      const completedTasks = project.tasks.filter(t => t.status === 'DONE').length

      return {
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
    })

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
})

// POST /api/taskflow/projects - Create new project
export const POST = withTaskFlowAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json()
    const validated = createProjectSchema.parse(body)

    const project = await prisma.tFProject.create({
      data: {
        name: validated.name,
        description: validated.description || null,
        color: validated.color || '#00d9ff',
        status: validated.status.toUpperCase() as any,
        ownerId: session.userId,
      }
    })

    // Create activity
    await prisma.tFActivity.create({
      data: {
        type: 'project_created',
        entityType: 'project',
        entityId: project.id,
        title: `Created project: ${project.name}`,
        userId: session.userId,
        projectId: project.id,
      }
    })

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
      task_count: 0,
      completed_tasks: 0,
      progress: 0,
    }

    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('POST project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
})
