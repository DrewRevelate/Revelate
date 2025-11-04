import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Task Repository
 *
 * Handles all database operations for task management.
 */

export type Task = Prisma.TaskGetPayload<{}>;
export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    project: { include: { company: true } };
    deal: { include: { company: true } };
  };
}>;

export const TASK_STATUSES = ['todo', 'in_progress', 'blocked', 'completed', 'cancelled'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type TaskStatus = typeof TASK_STATUSES[number];
export type TaskPriority = typeof TASK_PRIORITIES[number];

export interface CreateTaskInput {
  projectId?: string;
  dealId?: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  assignedTo?: string;
  notes?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateTaskInput {
  projectId?: string;
  dealId?: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  assignedTo?: string;
  notes?: string;
  tags?: string[];
  updatedBy?: string;
}

/**
 * Get all tasks
 */
export async function getTasks(filters?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  dealId?: string;
  assignedTo?: string;
}): Promise<Task[]> {
  const startTime = performance.now();

  try {
    const where: Prisma.TaskWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.dealId) {
      where.dealId = filters.dealId;
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          include: { company: true },
        },
        deal: {
          include: { company: true },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getTasks',
        filters,
        count: tasks.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${tasks.length} tasks`
    );

    return tasks;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getTasks',
        error,
      }),
      'Failed to get tasks'
    );
    throw error;
  }
}

/**
 * Get active tasks (not completed or cancelled)
 */
export async function getActiveTasks(): Promise<Task[]> {
  const startTime = performance.now();

  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: {
          notIn: ['completed', 'cancelled'],
        },
      },
      include: {
        project: {
          include: { company: true },
        },
        deal: {
          include: { company: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActiveTasks',
        count: tasks.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${tasks.length} active tasks`
    );

    return tasks;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActiveTasks',
        error,
      }),
      'Failed to get active tasks'
    );
    throw error;
  }
}

/**
 * Get overdue tasks
 */
export async function getOverdueTasks(): Promise<Task[]> {
  const startTime = performance.now();

  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: {
          notIn: ['completed', 'cancelled'],
        },
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        project: {
          include: { company: true },
        },
        deal: {
          include: { company: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getOverdueTasks',
        count: tasks.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${tasks.length} overdue tasks`
    );

    return tasks;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getOverdueTasks',
        error,
      }),
      'Failed to get overdue tasks'
    );
    throw error;
  }
}

/**
 * Get task by ID
 */
export async function getTaskById(id: string): Promise<Task | null> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getTaskById',
        task_id: id,
        found: !!task,
        duration_ms: performance.now() - startTime,
      }),
      task ? 'Task found' : 'Task not found'
    );

    return task;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getTaskById',
        task_id: id,
        error,
      }),
      'Failed to get task by ID'
    );
    throw error;
  }
}

/**
 * Get task with all relations
 */
export async function getTaskWithRelations(id: string): Promise<TaskWithRelations | null> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: { company: true },
        },
        deal: {
          include: { company: true },
        },
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getTaskWithRelations',
        task_id: id,
        found: !!task,
        duration_ms: performance.now() - startTime,
      }),
      task ? 'Task with relations found' : 'Task not found'
    );

    return task;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getTaskWithRelations',
        task_id: id,
        error,
      }),
      'Failed to get task with relations'
    );
    throw error;
  }
}

/**
 * Create a new task
 */
export async function createTask(data: CreateTaskInput): Promise<Task> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.create({
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'task_created',
        task_id: task.id,
        task_title: task.title,
        priority: task.priority,
        duration_ms: performance.now() - startTime,
      }),
      `Task created: ${task.title}`
    );

    return task;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'task_creation_failed',
        error,
      }),
      'Failed to create task'
    );
    throw error;
  }
}

/**
 * Update a task
 */
export async function updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'task_updated',
        task_id: task.id,
        task_title: task.title,
        status: task.status,
        duration_ms: performance.now() - startTime,
      }),
      `Task updated: ${task.title}`
    );

    return task;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'task_update_failed',
        task_id: id,
        error,
      }),
      'Failed to update task'
    );
    throw error;
  }
}

/**
 * Complete a task
 */
export async function completeTask(id: string, updatedBy?: string): Promise<Task> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        updatedBy,
      },
    });

    logger.info(
      createLogContext({
        action: 'task_completed',
        task_id: task.id,
        task_title: task.title,
        duration_ms: performance.now() - startTime,
      }),
      `Task completed: ${task.title}`
    );

    // Update project progress if task belongs to a project
    if (task.projectId) {
      const { calculateProjectProgress } = await import('./projects');
      await calculateProjectProgress(task.projectId);
    }

    return task;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'task_completion_failed',
        task_id: id,
        error,
      }),
      'Failed to complete task'
    );
    throw error;
  }
}

/**
 * Reopen a completed task
 */
export async function reopenTask(id: string, updatedBy?: string): Promise<Task> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        status: 'todo',
        completedAt: null,
        updatedBy,
      },
    });

    logger.info(
      createLogContext({
        action: 'task_reopened',
        task_id: task.id,
        task_title: task.title,
        duration_ms: performance.now() - startTime,
      }),
      `Task reopened: ${task.title}`
    );

    // Update project progress if task belongs to a project
    if (task.projectId) {
      const { calculateProjectProgress } = await import('./projects');
      await calculateProjectProgress(task.projectId);
    }

    return task;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'task_reopen_failed',
        task_id: id,
        error,
      }),
      'Failed to reopen task'
    );
    throw error;
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  const startTime = performance.now();

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    const projectId = task?.projectId;

    await prisma.task.delete({
      where: { id },
    });

    logger.warn(
      createLogContext({
        action: 'task_deleted',
        task_id: id,
        duration_ms: performance.now() - startTime,
      }),
      'Task permanently deleted'
    );

    // Update project progress if task belonged to a project
    if (projectId) {
      const { calculateProjectProgress } = await import('./projects');
      await calculateProjectProgress(projectId);
    }
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'task_deletion_failed',
        task_id: id,
        error,
      }),
      'Failed to delete task'
    );
    throw error;
  }
}

/**
 * Get task statistics
 */
export async function getTaskStats(): Promise<{
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  completionRate: number;
  overdueCount: number;
}> {
  const startTime = performance.now();

  try {
    const [allTasks, overdueTasks] = await Promise.all([
      prisma.task.findMany(),
      prisma.task.findMany({
        where: {
          status: { notIn: ['completed', 'cancelled'] },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    const stats = {
      totalTasks: allTasks.length,
      tasksByStatus: {} as Record<TaskStatus, number>,
      tasksByPriority: {} as Record<TaskPriority, number>,
      completionRate: 0,
      overdueCount: overdueTasks.length,
    };

    TASK_STATUSES.forEach((status) => {
      stats.tasksByStatus[status] = 0;
    });

    TASK_PRIORITIES.forEach((priority) => {
      stats.tasksByPriority[priority] = 0;
    });

    let completedCount = 0;

    allTasks.forEach((task) => {
      stats.tasksByStatus[task.status as TaskStatus]++;
      stats.tasksByPriority[task.priority as TaskPriority]++;
      if (task.status === 'completed') {
        completedCount++;
      }
    });

    stats.completionRate = allTasks.length > 0 ? (completedCount / allTasks.length) * 100 : 0;

    logger.debug(
      createLogContext({
        action: 'task_stats_calculated',
        total_tasks: stats.totalTasks,
        overdue_count: stats.overdueCount,
        duration_ms: performance.now() - startTime,
      }),
      'Task statistics calculated'
    );

    return stats;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'task_stats_failed',
        error,
      }),
      'Failed to calculate task statistics'
    );
    throw error;
  }
}
