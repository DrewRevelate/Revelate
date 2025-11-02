import { NextRequest, NextResponse } from 'next/server';
import { scopingRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * PATCH /api/admin/scoping-rules/[id]
 *
 * Updates a scoping rule.
 * Requires admin authentication.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  const { id } = await params;

  // Authenticate admin
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate operator if provided
    if (body.operator) {
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

    // Update scoping rule
    const rule = await scopingRepo.updateScopingRule(id, body, auth.adminUser!);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/scoping-rules/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        rule_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Rules API: updated rule ${rule.ruleName}`
    );

    return NextResponse.json({
      success: true,
      data: rule,
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/scoping-rules/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Rules API: PATCH request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update scoping rule',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/scoping-rules/[id]
 *
 * Deletes a scoping rule.
 * Requires admin authentication.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  const { id } = await params;

  // Authenticate admin
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    await scopingRepo.deleteScopingRule(id, auth.adminUser!);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/scoping-rules/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        rule_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Rules API: deleted rule ${id}`
    );

    return NextResponse.json({
      success: true,
      message: 'Scoping rule deleted',
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/scoping-rules/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Rules API: DELETE request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete scoping rule',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
