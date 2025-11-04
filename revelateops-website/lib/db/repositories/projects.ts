import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Project Repository
 *
 * Handles all database operations for project management.
 */

export type Project = Prisma.ProjectGetPayload<{}>;
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    company: true;
    deal: true;
    tasks: true;
    activities: { take: 10; orderBy: { activityDate: 'desc' } };
  };
}>;

export const PROJECT_STATUSES = [
  'planning',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled',
] as const;

export type ProjectStatus = typeof PROJECT_STATUSES[number];

export interface CreateProjectInput {
  companyId: string;
  dealId?: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  dueDate?: Date;
  budget?: number;
  notes?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateProjectInput {
  companyId?: string;
  dealId?: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  dueDate?: Date;
  budget?: number;
  progressPercent?: number;
  notes?: string;
  tags?: string[];
  updatedBy?: string;
}

/**
 * Get all projects
 */
export async function getProjects(filters?: {
  status?: ProjectStatus;
  companyId?: string;
  dealId?: string;
}): Promise<Project[]> {
  const startTime = performance.now();

  try {
    const where: Prisma.ProjectWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.dealId) {
      where.dealId = filters.dealId;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        company: true,
        deal: true,
      },
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getProjects',
        filters,
        count: projects.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${projects.length} projects`
    );

    return projects;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getProjects',
        error,
      }),
      'Failed to get projects'
    );
    throw error;
  }
}

/**
 * Get active projects (in_progress or planning)
 */
export async function getActiveProjects(): Promise<Project[]> {
  return getProjects({
    status: 'in_progress' as ProjectStatus,
  });
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getProjectById',
        project_id: id,
        found: !!project,
        duration_ms: performance.now() - startTime,
      }),
      project ? 'Project found' : 'Project not found'
    );

    return project;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getProjectById',
        project_id: id,
        error,
      }),
      'Failed to get project by ID'
    );
    throw error;
  }
}

/**
 * Get project with all relations
 */
export async function getProjectWithRelations(id: string): Promise<ProjectWithRelations | null> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        company: true,
        deal: true,
        tasks: {
          orderBy: [
            { status: 'asc' },
            { priority: 'desc' },
            { dueDate: 'asc' },
          ],
        },
        activities: {
          take: 10,
          orderBy: { activityDate: 'desc' },
        },
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getProjectWithRelations',
        project_id: id,
        found: !!project,
        duration_ms: performance.now() - startTime,
      }),
      project ? 'Project with relations found' : 'Project not found'
    );

    return project;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getProjectWithRelations',
        project_id: id,
        error,
      }),
      'Failed to get project with relations'
    );
    throw error;
  }
}

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectInput): Promise<Project> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.create({
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'project_created',
        project_id: project.id,
        project_name: project.name,
        duration_ms: performance.now() - startTime,
      }),
      `Project created: ${project.name}`
    );

    return project;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_creation_failed',
        error,
      }),
      'Failed to create project'
    );
    throw error;
  }
}

/**
 * Update a project
 */
export async function updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'project_updated',
        project_id: project.id,
        project_name: project.name,
        duration_ms: performance.now() - startTime,
      }),
      `Project updated: ${project.name}`
    );

    return project;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_update_failed',
        project_id: id,
        error,
      }),
      'Failed to update project'
    );
    throw error;
  }
}

/**
 * Update project progress
 */
export async function updateProjectProgress(id: string, progressPercent: number): Promise<Project> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { progressPercent: Math.min(100, Math.max(0, progressPercent)) },
    });

    logger.info(
      createLogContext({
        action: 'project_progress_updated',
        project_id: project.id,
        progress_percent: project.progressPercent,
        duration_ms: performance.now() - startTime,
      }),
      `Project progress updated to ${project.progressPercent}%`
    );

    return project;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_progress_update_failed',
        project_id: id,
        error,
      }),
      'Failed to update project progress'
    );
    throw error;
  }
}

/**
 * Calculate and update project progress based on tasks
 */
export async function calculateProjectProgress(id: string): Promise<Project> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const totalTasks = project.tasks.length;
    if (totalTasks === 0) {
      return project;
    }

    const completedTasks = project.tasks.filter((task) => task.status === 'completed').length;
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { progressPercent },
    });

    logger.info(
      createLogContext({
        action: 'project_progress_calculated',
        project_id: id,
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        progress_percent: progressPercent,
        duration_ms: performance.now() - startTime,
      }),
      `Project progress calculated: ${progressPercent}%`
    );

    return updatedProject;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_progress_calculation_failed',
        project_id: id,
        error,
      }),
      'Failed to calculate project progress'
    );
    throw error;
  }
}

/**
 * Mark project as completed
 */
export async function completeProject(id: string, updatedBy?: string): Promise<Project> {
  const startTime = performance.now();

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        status: 'completed',
        endDate: new Date(),
        progressPercent: 100,
        updatedBy,
      },
    });

    logger.info(
      createLogContext({
        action: 'project_completed',
        project_id: project.id,
        project_name: project.name,
        duration_ms: performance.now() - startTime,
      }),
      `Project completed: ${project.name}`
    );

    return project;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_completion_failed',
        project_id: id,
        error,
      }),
      'Failed to complete project'
    );
    throw error;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.project.delete({
      where: { id },
    });

    logger.warn(
      createLogContext({
        action: 'project_deleted',
        project_id: id,
        duration_ms: performance.now() - startTime,
      }),
      'Project permanently deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_deletion_failed',
        project_id: id,
        error,
      }),
      'Failed to delete project'
    );
    throw error;
  }
}

/**
 * Get project summary statistics
 */
export async function getProjectStats(): Promise<{
  totalProjects: number;
  projectsByStatus: Record<ProjectStatus, number>;
  averageProgress: number;
}> {
  const startTime = performance.now();

  try {
    const projects = await prisma.project.findMany();

    const stats = {
      totalProjects: projects.length,
      projectsByStatus: {} as Record<ProjectStatus, number>,
      averageProgress: 0,
    };

    PROJECT_STATUSES.forEach((status) => {
      stats.projectsByStatus[status] = 0;
    });

    let totalProgress = 0;

    projects.forEach((project) => {
      stats.projectsByStatus[project.status as ProjectStatus]++;
      totalProgress += project.progressPercent;
    });

    stats.averageProgress = projects.length > 0 ? totalProgress / projects.length : 0;

    logger.debug(
      createLogContext({
        action: 'project_stats_calculated',
        total_projects: stats.totalProjects,
        duration_ms: performance.now() - startTime,
      }),
      'Project statistics calculated'
    );

    return stats;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'project_stats_failed',
        error,
      }),
      'Failed to calculate project statistics'
    );
    throw error;
  }
}
