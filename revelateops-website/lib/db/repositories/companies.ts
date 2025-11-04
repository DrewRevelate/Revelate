import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Company Repository
 *
 * Handles all database operations for B2B company accounts.
 */

export type Company = Prisma.CompanyGetPayload<{}>;
export type CompanyWithRelations = Prisma.CompanyGetPayload<{
  include: {
    contacts: true;
    deals: true;
    projects: true;
    activities: { take: 10; orderBy: { activityDate: 'desc' } };
  };
}>;

export interface CreateCompanyInput {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  arrRange?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  arrRange?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: string;
  notes?: string;
  tags?: string[];
  updatedBy?: string;
}

/**
 * Get all active companies
 */
export async function getActiveCompanies(): Promise<Company[]> {
  const startTime = performance.now();

  try {
    const companies = await prisma.company.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActiveCompanies',
        count: companies.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${companies.length} active companies`
    );

    return companies;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActiveCompanies',
        error,
      }),
      'Failed to get active companies'
    );
    throw error;
  }
}

/**
 * Get all companies with filters
 */
export async function getCompanies(filters?: {
  status?: string;
  industry?: string;
  search?: string;
}): Promise<Company[]> {
  const startTime = performance.now();

  try {
    const where: Prisma.CompanyWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.industry) {
      where.industry = filters.industry;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { website: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getCompanies',
        filters,
        count: companies.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${companies.length} companies with filters`
    );

    return companies;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getCompanies',
        error,
      }),
      'Failed to get companies'
    );
    throw error;
  }
}

/**
 * Get company by ID
 */
export async function getCompanyById(id: string): Promise<Company | null> {
  const startTime = performance.now();

  try {
    const company = await prisma.company.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getCompanyById',
        company_id: id,
        found: !!company,
        duration_ms: performance.now() - startTime,
      }),
      company ? 'Company found' : 'Company not found'
    );

    return company;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getCompanyById',
        company_id: id,
        error,
      }),
      'Failed to get company by ID'
    );
    throw error;
  }
}

/**
 * Get company with all relations
 */
export async function getCompanyWithRelations(id: string): Promise<CompanyWithRelations | null> {
  const startTime = performance.now();

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          where: { status: 'active' },
          orderBy: [{ isPrimary: 'desc' }, { firstName: 'asc' }],
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
        projects: {
          orderBy: { createdAt: 'desc' },
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
        query: 'getCompanyWithRelations',
        company_id: id,
        found: !!company,
        duration_ms: performance.now() - startTime,
      }),
      company ? 'Company with relations found' : 'Company not found'
    );

    return company;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getCompanyWithRelations',
        company_id: id,
        error,
      }),
      'Failed to get company with relations'
    );
    throw error;
  }
}

/**
 * Create a new company
 */
export async function createCompany(data: CreateCompanyInput): Promise<Company> {
  const startTime = performance.now();

  try {
    const company = await prisma.company.create({
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'company_created',
        company_id: company.id,
        company_name: company.name,
        duration_ms: performance.now() - startTime,
      }),
      `Company created: ${company.name}`
    );

    return company;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'company_creation_failed',
        error,
      }),
      'Failed to create company'
    );
    throw error;
  }
}

/**
 * Update a company
 */
export async function updateCompany(id: string, data: UpdateCompanyInput): Promise<Company> {
  const startTime = performance.now();

  try {
    const company = await prisma.company.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'company_updated',
        company_id: company.id,
        company_name: company.name,
        duration_ms: performance.now() - startTime,
      }),
      `Company updated: ${company.name}`
    );

    return company;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'company_update_failed',
        company_id: id,
        error,
      }),
      'Failed to update company'
    );
    throw error;
  }
}

/**
 * Delete a company (soft delete by setting status to 'archived')
 */
export async function archiveCompany(id: string, archivedBy?: string): Promise<Company> {
  const startTime = performance.now();

  try {
    const company = await prisma.company.update({
      where: { id },
      data: {
        status: 'archived',
        updatedBy: archivedBy,
      },
    });

    logger.info(
      createLogContext({
        action: 'company_archived',
        company_id: company.id,
        company_name: company.name,
        duration_ms: performance.now() - startTime,
      }),
      `Company archived: ${company.name}`
    );

    return company;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'company_archive_failed',
        company_id: id,
        error,
      }),
      'Failed to archive company'
    );
    throw error;
  }
}

/**
 * Hard delete a company (use with caution)
 */
export async function deleteCompany(id: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.company.delete({
      where: { id },
    });

    logger.warn(
      createLogContext({
        action: 'company_deleted',
        company_id: id,
        duration_ms: performance.now() - startTime,
      }),
      'Company permanently deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'company_deletion_failed',
        company_id: id,
        error,
      }),
      'Failed to delete company'
    );
    throw error;
  }
}
