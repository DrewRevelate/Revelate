import { NextRequest, NextResponse } from 'next/server';
import { scopingRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * PATCH /api/admin/scoping-factors/[id]
 *
 * Updates a scoping factor.
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

    // Validate inputType if provided
    if (body.inputType && !['select', 'number', 'boolean', 'range'].includes(body.inputType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid inputType',
          message: 'inputType must be one of: select, number, boolean, range',
        },
        { status: 400 }
      );
    }

    // Update scoping factor
    const factor = await scopingRepo.updateScopingFactor(id, body, auth.adminUser!);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/scoping-factors/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        factor_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Factors API: updated factor ${factor.factorKey}`
    );

    return NextResponse.json({
      success: true,
      data: factor,
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/scoping-factors/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Factors API: PATCH request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update scoping factor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/scoping-factors/[id]
 *
 * Deletes a scoping factor.
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
    await scopingRepo.deleteScopingFactor(id, auth.adminUser!);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/scoping-factors/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        factor_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Scoping Factors API: deleted factor ${id}`
    );

    return NextResponse.json({
      success: true,
      message: 'Scoping factor deleted',
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/scoping-factors/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Scoping Factors API: DELETE request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete scoping factor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
