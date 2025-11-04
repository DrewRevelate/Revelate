import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Activity Repository
 *
 * Handles all database operations for activity tracking and timeline.
 */

export type Activity = Prisma.ActivityGetPayload<{}>;
export type ActivityWithRelations = Prisma.ActivityGetPayload<{
  include: {
    company: true;
    contact: true;
    deal: true;
    project: true;
  };
}>;

export const ACTIVITY_TYPES = [
  'note',
  'call',
  'email',
  'meeting',
  'task',
  'stage_change',
] as const;

export type ActivityType = typeof ACTIVITY_TYPES[number];

export interface CreateActivityInput {
  companyId?: string;
  contactId?: string;
  dealId?: string;
  projectId?: string;
  type: ActivityType;
  subject: string;
  description?: string;
  activityDate?: Date;
  createdBy?: string;
}

export interface GetActivitiesFilters {
  companyId?: string;
  contactId?: string;
  dealId?: string;
  projectId?: string;
  type?: ActivityType;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Get activities with filters
 */
export async function getActivities(filters?: GetActivitiesFilters): Promise<Activity[]> {
  const startTime = performance.now();

  try {
    const where: Prisma.ActivityWhereInput = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }

    if (filters?.dealId) {
      where.dealId = filters.dealId;
    }

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      where.activityDate = {};
      if (filters.startDate) {
        where.activityDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.activityDate.lte = filters.endDate;
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        company: true,
        contact: true,
        deal: true,
        project: true,
      },
      orderBy: { activityDate: 'desc' },
      take: 100, // Limit to recent 100 activities
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActivities',
        filters,
        count: activities.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${activities.length} activities`
    );

    return activities;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActivities',
        error,
      }),
      'Failed to get activities'
    );
    throw error;
  }
}

/**
 * Get recent activities (last 50)
 */
export async function getRecentActivities(limit = 50): Promise<Activity[]> {
  const startTime = performance.now();

  try {
    const activities = await prisma.activity.findMany({
      include: {
        company: true,
        contact: true,
        deal: true,
        project: true,
      },
      orderBy: { activityDate: 'desc' },
      take: limit,
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getRecentActivities',
        count: activities.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${activities.length} recent activities`
    );

    return activities;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getRecentActivities',
        error,
      }),
      'Failed to get recent activities'
    );
    throw error;
  }
}

/**
 * Get activity by ID
 */
export async function getActivityById(id: string): Promise<Activity | null> {
  const startTime = performance.now();

  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActivityById',
        activity_id: id,
        found: !!activity,
        duration_ms: performance.now() - startTime,
      }),
      activity ? 'Activity found' : 'Activity not found'
    );

    return activity;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActivityById',
        activity_id: id,
        error,
      }),
      'Failed to get activity by ID'
    );
    throw error;
  }
}

/**
 * Get activity with all relations
 */
export async function getActivityWithRelations(id: string): Promise<ActivityWithRelations | null> {
  const startTime = performance.now();

  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        deal: true,
        project: true,
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActivityWithRelations',
        activity_id: id,
        found: !!activity,
        duration_ms: performance.now() - startTime,
      }),
      activity ? 'Activity with relations found' : 'Activity not found'
    );

    return activity;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActivityWithRelations',
        activity_id: id,
        error,
      }),
      'Failed to get activity with relations'
    );
    throw error;
  }
}

/**
 * Create a new activity
 */
export async function createActivity(data: CreateActivityInput): Promise<Activity> {
  const startTime = performance.now();

  try {
    // Validate that at least one entity is linked
    if (!data.companyId && !data.contactId && !data.dealId && !data.projectId) {
      throw new Error('Activity must be linked to at least one entity (company, contact, deal, or project)');
    }

    const activity = await prisma.activity.create({
      data,
    });

    logger.info(
      createLogContext({
        action: 'activity_created',
        activity_id: activity.id,
        activity_type: activity.type,
        activity_subject: activity.subject,
        duration_ms: performance.now() - startTime,
      }),
      `Activity created: ${activity.subject}`
    );

    return activity;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'activity_creation_failed',
        error,
      }),
      'Failed to create activity'
    );
    throw error;
  }
}

/**
 * Create a note activity
 */
export async function createNote(
  subject: string,
  description: string,
  entityIds: {
    companyId?: string;
    contactId?: string;
    dealId?: string;
    projectId?: string;
  },
  createdBy?: string
): Promise<Activity> {
  return createActivity({
    ...entityIds,
    type: 'note',
    subject,
    description,
    createdBy,
  });
}

/**
 * Create a call activity
 */
export async function createCall(
  subject: string,
  description: string,
  entityIds: {
    companyId?: string;
    contactId?: string;
    dealId?: string;
  },
  createdBy?: string
): Promise<Activity> {
  return createActivity({
    ...entityIds,
    type: 'call',
    subject,
    description,
    createdBy,
  });
}

/**
 * Create a meeting activity
 */
export async function createMeeting(
  subject: string,
  description: string,
  meetingDate: Date,
  entityIds: {
    companyId?: string;
    contactId?: string;
    dealId?: string;
  },
  createdBy?: string
): Promise<Activity> {
  return createActivity({
    ...entityIds,
    type: 'meeting',
    subject,
    description,
    activityDate: meetingDate,
    createdBy,
  });
}

/**
 * Delete an activity
 */
export async function deleteActivity(id: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.activity.delete({
      where: { id },
    });

    logger.warn(
      createLogContext({
        action: 'activity_deleted',
        activity_id: id,
        duration_ms: performance.now() - startTime,
      }),
      'Activity permanently deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'activity_deletion_failed',
        activity_id: id,
        error,
      }),
      'Failed to delete activity'
    );
    throw error;
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(filters?: {
  companyId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  totalActivities: number;
  activitiesByType: Record<ActivityType, number>;
  recentActivity: Date | null;
}> {
  const startTime = performance.now();

  try {
    const where: Prisma.ActivityWhereInput = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.activityDate = {};
      if (filters.startDate) {
        where.activityDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.activityDate.lte = filters.endDate;
      }
    }

    const activities = await prisma.activity.findMany({ where });

    const stats = {
      totalActivities: activities.length,
      activitiesByType: {} as Record<ActivityType, number>,
      recentActivity: activities.length > 0
        ? activities.reduce((latest, activity) =>
            activity.activityDate > latest ? activity.activityDate : latest,
            activities[0].activityDate
          )
        : null,
    };

    ACTIVITY_TYPES.forEach((type) => {
      stats.activitiesByType[type] = 0;
    });

    activities.forEach((activity) => {
      stats.activitiesByType[activity.type as ActivityType]++;
    });

    logger.debug(
      createLogContext({
        action: 'activity_stats_calculated',
        total_activities: stats.totalActivities,
        duration_ms: performance.now() - startTime,
      }),
      'Activity statistics calculated'
    );

    return stats;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'activity_stats_failed',
        error,
      }),
      'Failed to calculate activity statistics'
    );
    throw error;
  }
}
