import { NextRequest, NextResponse } from 'next/server';
import { serviceRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/admin/services/[id]
 *
 * Returns a single service by ID.
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
    const service = await serviceRepo.getServiceById(id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
          message: `No service found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    logger.debug(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/services/${id}`,
        method: 'GET',
        admin_user: auth.adminUser,
        service_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Services API: returned service ${service.name}`
    );

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/services/${id}`,
        method: 'GET',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Services API: GET request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/services/[id]
 *
 * Updates a service.
 * Requires admin authentication.
 *
 * Request Body (all fields optional):
 * {
 *   "name": "Updated Name",
 *   "basePrice": 20000,
 *   "isActive": false,
 *   ...
 * }
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

    // Update service
    const service = await serviceRepo.updateService(id, {
      ...body,
      updatedBy: auth.adminUser,
    });

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/services/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        service_id: id,
        service_name: service.name,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Services API: updated service ${service.name}`
    );

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/services/${id}`,
        method: 'PATCH',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Services API: PATCH request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/services/[id]
 *
 * Deletes a service (hard delete).
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
    await serviceRepo.deleteService(id, auth.adminUser!);

    logger.warn(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: `/api/admin/services/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        service_id: id,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Services API: HARD DELETED service ${id}`
    );

    return NextResponse.json({
      success: true,
      message: 'Service deleted',
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: `/api/admin/services/${id}`,
        method: 'DELETE',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Services API: DELETE request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
