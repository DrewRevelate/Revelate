import { NextRequest, NextResponse } from 'next/server';
import { packageRepo } from '@/lib/db/repositories';
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
 * GET /api/packages
 *
 * Returns all active packages, optionally filtered by type.
 * Public endpoint - no authentication required.
 *
 * Query Parameters:
 * - type: (optional) Filter packages by type (stage | targeted | custom)
 * - featured: (optional) Return only featured packages (true/false)
 * - include_services: (optional) Include associated services (true/false)
 *
 * Example:
 * - GET /api/packages
 * - GET /api/packages?type=stage
 * - GET /api/packages?featured=true
 * - GET /api/packages?include_services=true
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'stage' | 'targeted' | 'custom' | null;
    const featured = searchParams.get('featured') === 'true';
    const includeServices = searchParams.get('include_services') === 'true';

    let packages;

    if (type) {
      // Get packages by type
      packages = await packageRepo.getPackagesByType(type, true);
    } else {
      // Get all active packages
      packages = await packageRepo.getActivePackages();
    }

    // Filter by featured if requested
    if (featured) {
      packages = packages.filter((p) => p.isFeatured);
    }

    // If includeServices is true, fetch full package data with services
    if (includeServices) {
      const packagesWithServices = await Promise.all(
        packages.map((pkg) => packageRepo.getPackageWithServices(pkg.id))
      );
      packages = packagesWithServices.filter((p) => p !== null);
    }

    // Serialize packages to handle BigInt fields
    const serializedPackages = packages.map(serializePackage);

    logger.info(
      createLogContext({
        action: 'api_request_completed',
        endpoint: '/api/packages',
        method: 'GET',
        type,
        featured,
        include_services: includeServices,
        package_count: packages.length,
        duration_ms: performance.now() - startTime,
      }),
      `Packages API: returned ${packages.length} packages`
    );

    return NextResponse.json(
      {
        success: true,
        data: serializedPackages,
        meta: {
          count: packages.length,
          type: type ?? null,
          featured,
          includeServices,
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
        endpoint: '/api/packages',
        method: 'GET',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Packages API: request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
