import { NextRequest, NextResponse } from 'next/server';
import { companyRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/crm/companies
 *
 * Returns all companies with optional filters.
 * Requires admin authentication.
 *
 * Query Parameters:
 * - status: Filter by status (active, inactive, archived)
 * - industry: Filter by industry
 * - search: Search by name or website
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const industry = searchParams.get('industry') || undefined;
    const search = searchParams.get('search') || undefined;

    const companies = await companyRepo.getCompanies({
      status,
      industry,
      search,
    });

    logger.info(
      createLogContext({
        action: 'crm_api_request_completed',
        endpoint: '/api/crm/companies',
        method: 'GET',
        admin_user: auth.adminUser,
        count: companies.length,
        duration_ms: performance.now() - startTime,
      }),
      `Companies API: returned ${companies.length} companies`
    );

    return NextResponse.json({
      success: true,
      data: companies,
      meta: { count: companies.length },
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'crm_api_request_failed',
        endpoint: '/api/crm/companies',
        method: 'GET',
        error,
      }),
      'Companies API: GET request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch companies',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/companies
 *
 * Creates a new company.
 * Requires admin authentication.
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Company name is required',
        },
        { status: 400 }
      );
    }

    const company = await companyRepo.createCompany({
      ...body,
      createdBy: auth.adminUser,
    });

    logger.info(
      createLogContext({
        action: 'company_created',
        endpoint: '/api/crm/companies',
        company_id: company.id,
        company_name: company.name,
        admin_user: auth.adminUser,
        duration_ms: performance.now() - startTime,
      }),
      `Company created: ${company.name}`
    );

    return NextResponse.json(
      { success: true, data: company },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'company_creation_failed',
        endpoint: '/api/crm/companies',
        error,
      }),
      'Companies API: POST request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create company',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
