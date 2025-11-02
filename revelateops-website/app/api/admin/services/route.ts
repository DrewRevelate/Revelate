import { NextRequest, NextResponse } from 'next/server';
import { serviceRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/admin/services
 *
 * Returns all services (including inactive).
 * Requires admin authentication.
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  // Authenticate admin
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const services = await serviceRepo.getAllServices();

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/services',
        method: 'GET',
        admin_user: auth.adminUser,
        service_count: services.length,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Services API: returned ${services.length} services`
    );

    return NextResponse.json({
      success: true,
      data: services,
      meta: {
        count: services.length,
      },
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/services',
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
        error: 'Failed to fetch services',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/services
 *
 * Creates a new service.
 * Requires admin authentication.
 *
 * Request Body:
 * {
 *   "name": "Service Name",
 *   "slug": "service-slug",
 *   "shortDescription": "Brief description",
 *   "fullDescription": "Full description",
 *   "basePrice": 15000,
 *   "category": "architecture",
 *   "icon": "🏗️",
 *   "isFeatured": false,
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
    if (!body.name || !body.slug || !body.basePrice || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'name, slug, basePrice, and category are required',
        },
        { status: 400 }
      );
    }

    // Create service
    const service = await serviceRepo.createService({
      name: body.name,
      slug: body.slug,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      basePrice: body.basePrice,
      category: body.category,
      icon: body.icon,
      isFeatured: body.isFeatured,
      displayOrder: body.displayOrder,
      createdBy: auth.adminUser,
    });

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/services',
        method: 'POST',
        admin_user: auth.adminUser,
        service_id: service.id,
        service_name: service.name,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Services API: created service ${service.name}`
    );

    return NextResponse.json(
      {
        success: true,
        data: service,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/services',
        method: 'POST',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Services API: POST request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
