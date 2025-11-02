import { NextRequest, NextResponse } from 'next/server';
import { scopingRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/admin/scoping-rules
 *
 * Returns scoping rules for a package.
 * Requires admin authentication.
 *
 * Query Parameters:
 * - packageId: (required) Package ID to get rules for
 * - activeOnly: (optional) Return only active rules (default: false for admin)
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

    const rules = await scopingRepo.getScopingRulesForPackage(packageId, activeOnly);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/scoping-rules',
        method: 'GET',
        admin_user: auth.adminUser,
        package_id: packageId,
        rule_count: rules.length,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Rules API: returned ${rules.length} rules`
    );

    return NextResponse.json({
      success: true,
      data: rules,
      meta: {
        count: rules.length,
        packageId,
      },
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/scoping-rules',
        method: 'GET',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Rules API: GET request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scoping rules',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/scoping-rules
 *
 * Creates a new scoping rule (pricing/timeline adjustment logic).
 * Requires admin authentication.
 *
 * Request Body:
 * {
 *   "packageId": "uuid",
 *   "ruleName": "Large Team Multiplier",
 *   "factorKey": "team_size",
 *   "operator": "in_range",
 *   "conditionValue": { "min": 25, "max": 50 },
 *   "priceAdjustmentType": "multiplier",
 *   "priceAdjustmentValue": 1.25,
 *   "timelineAdjustmentWeeks": 2,
 *   "adjustmentLabel": "Team size 25-50: +25% cost, +2 weeks",
 *   "priority": 1
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
    if (
      !body.packageId ||
      !body.ruleName ||
      !body.factorKey ||
      !body.operator ||
      !body.conditionValue
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message:
            'packageId, ruleName, factorKey, operator, and conditionValue are required',
        },
        { status: 400 }
      );
    }

    // Validate operator
    const validOperators = ['equals', 'greater_than', 'less_than', 'in_range', 'contains'];
    if (!validOperators.includes(body.operator)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid operator',
          message: `operator must be one of: ${validOperators.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate adjustment type if provided
    if (body.priceAdjustmentType) {
      const validTypes = ['multiplier', 'fixed_add', 'fixed_subtract'];
      if (!validTypes.includes(body.priceAdjustmentType)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid priceAdjustmentType',
            message: `priceAdjustmentType must be one of: ${validTypes.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    // Create scoping rule
    const rule = await scopingRepo.createScopingRule(
      {
        packageId: body.packageId,
        ruleName: body.ruleName,
        factorKey: body.factorKey,
        operator: body.operator,
        conditionValue: body.conditionValue,
        priceAdjustmentType: body.priceAdjustmentType,
        priceAdjustmentValue: body.priceAdjustmentValue,
        timelineAdjustmentWeeks: body.timelineAdjustmentWeeks,
        adjustmentLabel: body.adjustmentLabel,
        priority: body.priority,
      },
      auth.adminUser!
    );

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/scoping-rules',
        method: 'POST',
        admin_user: auth.adminUser,
        rule_id: rule.id,
        package_id: body.packageId,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Rules API: created rule ${rule.ruleName}`
    );

    return NextResponse.json(
      {
        success: true,
        data: rule,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/scoping-rules',
        method: 'POST',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Rules API: POST request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create scoping rule',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
