import { NextRequest, NextResponse } from 'next/server';
import { packageRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Serialize package data for JSON response
 * Converts BigInt values to strings
 */
function serializePackage(pkg: any) {
  return {
    ...pkg,
    targetArrMin: pkg.targetArrMin ? pkg.targetArrMin.toString() : null,
    targetArrMax: pkg.targetArrMax ? pkg.targetArrMax.toString() : null,
  };
}

/**
 * GET /api/admin/packages/[id]
 *
 * Returns a single package with all related data.
 * Requires admin authentication.
 */
export async function GET(
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
    const pkg = await packageRepo.getPackageWithAll(id);

    if (!pkg) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
          message: `No package found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    logger.debug(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/packages/${id}`,
        method: 'GET',
        admin_user: auth.adminUser,
        package_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Packages API: returned package ${pkg.name}`
    );

    return NextResponse.json({
      success: true,
      data: serializePackage(pkg),
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/packages/${id}`,
        method: 'GET',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Packages API: GET request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/packages/[id]
 *
 * Updates a package.
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

    // Convert ARR values to BigInt if provided
    const updateData = { ...body };
    if (body.targetArrMin !== undefined) {
      updateData.targetArrMin = BigInt(body.targetArrMin);
    }
    if (body.targetArrMax !== undefined) {
      updateData.targetArrMax = BigInt(body.targetArrMax);
    }

    // Update package
    const pkg = await packageRepo.updatePackage(id, {
      ...updateData,
      updatedBy: auth.adminUser,
    });

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/packages/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        package_id: id,
        package_name: pkg.name,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Packages API: updated package ${pkg.name}`
    );

    return NextResponse.json({
      success: true,
      data: serializePackage(pkg),
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/packages/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Packages API: PATCH request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/packages/[id]
 *
 * Deletes a package (hard delete).
 * Requires admin authentication.
 *
 * NOTE: Prefer using PATCH with isActive=false for soft delete.
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
    await packageRepo.deletePackage(id, auth.adminUser!);

    logger.warn(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/packages/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        package_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Packages API: HARD DELETED package ${id}`
    );

    return NextResponse.json({
      success: true,
      message: 'Package deleted',
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/packages/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Packages API: DELETE request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
