import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Deal Repository
 *
 * Handles all database operations for CRM deals/opportunities.
 * Pipeline stages: lead → qualified → proposal → negotiation → closed_won/closed_lost
 */

export type Deal = Prisma.DealGetPayload<{}>;
export type DealWithRelations = Prisma.DealGetPayload<{
  include: {
    company: true;
    contact: true;
    quote: true;
    projects: true;
    tasks: true;
    activities: { take: 10; orderBy: { activityDate: 'desc' } };
  };
}>;

export const DEAL_STAGES = [
  'lead',
  'qualified',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
] as const;

export type DealStage = typeof DEAL_STAGES[number];

export interface CreateDealInput {
  companyId: string;
  contactId?: string;
  quoteId?: string;
  name: string;
  description?: string;
  value?: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: Date;
  notes?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateDealInput {
  companyId?: string;
  contactId?: string;
  quoteId?: string;
  name?: string;
  description?: string;
  value?: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  lossReason?: string;
  notes?: string;
  tags?: string[];
  updatedBy?: string;
}

/**
 * Get all deals
 */
export async function getDeals(filters?: {
  stage?: DealStage;
  companyId?: string;
  contactId?: string;
}): Promise<Deal[]> {
  const startTime = performance.now();

  try {
    const where: Prisma.DealWhereInput = {};

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        company: true,
        contact: true,
      },
      orderBy: [
        { stage: 'asc' },
        { expectedCloseDate: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getDeals',
        filters,
        count: deals.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${deals.length} deals`
    );

    return deals;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getDeals',
        error,
      }),
      'Failed to get deals'
    );
    throw error;
  }
}

/**
 * Get deals grouped by stage (for pipeline view)
 */
export async function getDealsByStage(): Promise<Record<DealStage, Deal[]>> {
  const startTime = performance.now();

  try {
    const deals = await prisma.deal.findMany({
      where: {
        stage: {
          in: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
        },
      },
      include: {
        company: true,
        contact: true,
      },
      orderBy: [
        { expectedCloseDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const dealsByStage: Record<string, Deal[]> = {
      lead: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      closed_won: [],
      closed_lost: [],
    };

    deals.forEach((deal) => {
      if (dealsByStage[deal.stage]) {
        dealsByStage[deal.stage].push(deal);
      }
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getDealsByStage',
        total_deals: deals.length,
        duration_ms: performance.now() - startTime,
      }),
      'Retrieved deals grouped by stage'
    );

    return dealsByStage as Record<DealStage, Deal[]>;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getDealsByStage',
        error,
      }),
      'Failed to get deals by stage'
    );
    throw error;
  }
}

/**
 * Get deal by ID
 */
export async function getDealById(id: string): Promise<Deal | null> {
  const startTime = performance.now();

  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getDealById',
        deal_id: id,
        found: !!deal,
        duration_ms: performance.now() - startTime,
      }),
      deal ? 'Deal found' : 'Deal not found'
    );

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getDealById',
        deal_id: id,
        error,
      }),
      'Failed to get deal by ID'
    );
    throw error;
  }
}

/**
 * Get deal with all relations
 */
export async function getDealWithRelations(id: string): Promise<DealWithRelations | null> {
  const startTime = performance.now();

  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        quote: true,
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: [
            { status: 'asc' },
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
        query: 'getDealWithRelations',
        deal_id: id,
        found: !!deal,
        duration_ms: performance.now() - startTime,
      }),
      deal ? 'Deal with relations found' : 'Deal not found'
    );

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getDealWithRelations',
        deal_id: id,
        error,
      }),
      'Failed to get deal with relations'
    );
    throw error;
  }
}

/**
 * Get deal by quote ID
 */
export async function getDealByQuoteId(quoteId: string): Promise<Deal | null> {
  const startTime = performance.now();

  try {
    const deal = await prisma.deal.findUnique({
      where: { quoteId },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getDealByQuoteId',
        quote_id: quoteId,
        found: !!deal,
        duration_ms: performance.now() - startTime,
      }),
      deal ? 'Deal found by quote' : 'Deal not found by quote'
    );

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getDealByQuoteId',
        error,
      }),
      'Failed to get deal by quote ID'
    );
    throw error;
  }
}

/**
 * Create a new deal
 */
export async function createDeal(data: CreateDealInput): Promise<Deal> {
  const startTime = performance.now();

  try {
    const deal = await prisma.deal.create({
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'deal_created',
        deal_id: deal.id,
        deal_name: deal.name,
        stage: deal.stage,
        duration_ms: performance.now() - startTime,
      }),
      `Deal created: ${deal.name}`
    );

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'deal_creation_failed',
        error,
      }),
      'Failed to create deal'
    );
    throw error;
  }
}

/**
 * Update a deal
 */
export async function updateDeal(id: string, data: UpdateDealInput): Promise<Deal> {
  const startTime = performance.now();

  try {
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'deal_updated',
        deal_id: deal.id,
        deal_name: deal.name,
        stage: deal.stage,
        duration_ms: performance.now() - startTime,
      }),
      `Deal updated: ${deal.name}`
    );

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'deal_update_failed',
        deal_id: id,
        error,
      }),
      'Failed to update deal'
    );
    throw error;
  }
}

/**
 * Move deal to a new stage
 */
export async function moveDealToStage(
  id: string,
  newStage: DealStage,
  updatedBy?: string
): Promise<Deal> {
  const startTime = performance.now();

  try {
    const updates: Prisma.DealUpdateInput = {
      stage: newStage,
      updatedBy,
    };

    // Auto-set close date for won/lost deals
    if (newStage === 'closed_won' || newStage === 'closed_lost') {
      updates.actualCloseDate = new Date();
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: updates,
    });

    logger.info(
      createLogContext({
        action: 'deal_stage_changed',
        deal_id: deal.id,
        new_stage: newStage,
        duration_ms: performance.now() - startTime,
      }),
      `Deal moved to ${newStage}`
    );

    // Create activity for stage change
    await prisma.activity.create({
      data: {
        dealId: id,
        type: 'stage_change',
        subject: `Deal moved to ${newStage}`,
        description: `Deal stage changed to ${newStage}`,
        createdBy: updatedBy,
      },
    });

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'deal_stage_change_failed',
        deal_id: id,
        error,
      }),
      'Failed to move deal to new stage'
    );
    throw error;
  }
}

/**
 * Mark deal as won
 */
export async function markDealAsWon(id: string, updatedBy?: string): Promise<Deal> {
  return moveDealToStage(id, 'closed_won', updatedBy);
}

/**
 * Mark deal as lost
 */
export async function markDealAsLost(
  id: string,
  lossReason?: string,
  updatedBy?: string
): Promise<Deal> {
  const startTime = performance.now();

  try {
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        stage: 'closed_lost',
        actualCloseDate: new Date(),
        lossReason,
        updatedBy,
      },
    });

    logger.info(
      createLogContext({
        action: 'deal_lost',
        deal_id: deal.id,
        loss_reason: lossReason,
        duration_ms: performance.now() - startTime,
      }),
      'Deal marked as lost'
    );

    return deal;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'deal_lost_failed',
        deal_id: id,
        error,
      }),
      'Failed to mark deal as lost'
    );
    throw error;
  }
}

/**
 * Delete a deal
 */
export async function deleteDeal(id: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.deal.delete({
      where: { id },
    });

    logger.warn(
      createLogContext({
        action: 'deal_deleted',
        deal_id: id,
        duration_ms: performance.now() - startTime,
      }),
      'Deal permanently deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'deal_deletion_failed',
        deal_id: id,
        error,
      }),
      'Failed to delete deal'
    );
    throw error;
  }
}

/**
 * Get pipeline metrics
 */
export async function getPipelineMetrics(): Promise<{
  totalValue: number;
  dealCountByStage: Record<DealStage, number>;
  valueByStage: Record<DealStage, number>;
  averageDealSize: number;
}> {
  const startTime = performance.now();

  try {
    const deals = await prisma.deal.findMany({
      where: {
        stage: {
          notIn: ['closed_won', 'closed_lost'],
        },
      },
    });

    const metrics = {
      totalValue: 0,
      dealCountByStage: {} as Record<DealStage, number>,
      valueByStage: {} as Record<DealStage, number>,
      averageDealSize: 0,
    };

    DEAL_STAGES.forEach((stage) => {
      metrics.dealCountByStage[stage] = 0;
      metrics.valueByStage[stage] = 0;
    });

    deals.forEach((deal) => {
      const value = deal.value ? Number(deal.value) : 0;
      metrics.totalValue += value;
      metrics.dealCountByStage[deal.stage as DealStage]++;
      metrics.valueByStage[deal.stage as DealStage] += value;
    });

    metrics.averageDealSize = deals.length > 0 ? metrics.totalValue / deals.length : 0;

    logger.debug(
      createLogContext({
        action: 'pipeline_metrics_calculated',
        total_deals: deals.length,
        total_value: metrics.totalValue,
        duration_ms: performance.now() - startTime,
      }),
      'Pipeline metrics calculated'
    );

    return metrics;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'pipeline_metrics_failed',
        error,
      }),
      'Failed to calculate pipeline metrics'
    );
    throw error;
  }
}
