import { NextRequest, NextResponse } from 'next/server';
import { serviceRepo } from '@/lib/db/repositories';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/services
 *
 * Returns all active services, optionally filtered by category.
 * Public endpoint - no authentication required.
 *
 * Query Parameters:
 * - category: (optional) Filter services by category
 * - featured: (optional) Return only featured services (true/false)
 *
 * Example:
 * - GET /api/services
 * - GET /api/services?category=architecture
 * - GET /api/services?featured=true
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    let services;

    if (category) {
      // Get services by category
      services = await serviceRepo.getServicesByCategory(category, true);
    } else {
      // Get all active services
      services = await serviceRepo.getActiveServices();
    }

    // Filter by featured if requested
    if (featured) {
      services = services.filter((s) => s.isFeatured);
    }

    logger.info(
      createLogContext({
        action: 'api_request_completed',
        endpoint: '/api/services',
        method: 'GET',
        category,
        featured,
        service_count: services.length,
        duration_ms: performance.now() - startTime,
      }),
      `Services API: returned ${services.length} services`
    );

    return NextResponse.json(
      {
        success: true,
        data: services,
        meta: {
          count: services.length,
          category: category ?? null,
          featured,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'api_request_failed',
        endpoint: '/api/services',
        method: 'GET',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Services API: request failed'
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
