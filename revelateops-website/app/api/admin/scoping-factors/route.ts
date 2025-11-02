import { NextRequest, NextResponse } from 'next/server';
import { scopingRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/admin/scoping-factors
 *
 * Returns scoping factors for a package.
 * Requires admin authentication.
 *
 * Query Parameters:
 * - packageId: (required) Package ID to get factors for
 * - activeOnly: (optional) Return only active factors (default: false for admin)
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  // Authenticate admin
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const packageId = searchParams.get('packageId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (!packageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter',
          message: 'packageId is required',
        },
        { status: 400 }
      );
    }

    const factors = await scopingRepo.getScopingFactorsForPackage(packageId, activeOnly);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/scoping-factors',
        method: 'GET',
        admin_user: auth.adminUser,
        package_id: packageId,
        factor_count: factors.length,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Factors API: returned ${factors.length} factors`
    );

    return NextResponse.json({
      success: true,
      data: factors,
      meta: {
        count: factors.length,
        packageId,
      },
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/scoping-factors',
        method: 'GET',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Factors API: GET request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scoping factors',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/scoping-factors
 *
 * Creates a new scoping factor (quiz question).
 * Requires admin authentication.
 *
 * Request Body:
 * {
 *   "packageId": "uuid",
 *   "factorKey": "team_size",
 *   "questionText": "How many team members use Salesforce?",
 *   "helpText": "Include all users who access the system regularly",
 *   "inputType": "select",
 *   "options": [
 *     { "value": "1-10", "label": "1-10 users" },
 *     { "value": "11-25", "label": "11-25 users" }
 *   ],
 *   "isRequired": true,
 *   "displayOrder": 1
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  // Authenticate admin
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.packageId || !body.factorKey || !body.questionText || !body.inputType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'packageId, factorKey, questionText, and inputType are required',
        },
        { status: 400 }
      );
    }

    // Validate inputType
    if (!['select', 'number', 'boolean', 'range'].includes(body.inputType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid inputType',
          message: 'inputType must be one of: select, number, boolean, range',
        },
        { status: 400 }
      );
    }

    // Create scoping factor
    const factor = await scopingRepo.createScopingFactor(
      {
        packageId: body.packageId,
        factorKey: body.factorKey,
        questionText: body.questionText,
        helpText: body.helpText,
        inputType: body.inputType,
        options: body.options,
        isRequired: body.isRequired,
        displayOrder: body.displayOrder,
      },
      auth.adminUser!
    );

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/scoping-factors',
        method: 'POST',
        admin_user: auth.adminUser,
        factor_id: factor.id,
        package_id: body.packageId,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Factors API: created factor ${factor.factorKey}`
    );

    return NextResponse.json(
      {
        success: true,
        data: factor,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/scoping-factors',
        method: 'POST',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Factors API: POST request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create scoping factor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
