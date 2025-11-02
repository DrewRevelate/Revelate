import { NextRequest, NextResponse } from 'next/server';
import { packageRepo, scopingRepo } from '@/lib/db/repositories';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/packages/[id]
 *
 * Returns a single package with all related data.
 * Public endpoint - no authentication required.
 *
 * Query Parameters:
 * - include_services: (optional) Include associated services (default: true)
 * - include_scoping: (optional) Include scoping factors and rules (default: true)
 *
 * Example:
 * - GET /api/packages/abc-123
 * - GET /api/packages/abc-123?include_services=true&include_scoping=true
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const searchParams = request.nextUrl.searchParams;
    const includeServices = searchParams.get('include_services') !== 'false';
    const includeScoping = searchParams.get('include_scoping') !== 'false';

    // Get package with all related data
    const pkg = await packageRepo.getPackageWithAll(id);

    if (!pkg) {
      logger.warn(
        createLogContext({
          action: 'api_request_completed',
          endpoint: `/api/packages/${id}`,
          method: 'GET',
          found: false,
          duration_ms: performance.now() - startTime,
        }),
        'Package not found'
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
          message: `No package found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Build response data based on query parameters
    const responseData: {
      id: string;
      name: string;
      slug: string;
      type: string;
      stage?: string | null;
      targetArrMin?: bigint | null;
      targetArrMax?: bigint | null;
      tagline?: string | null;
      shortDescription?: string | null;
      fullDescription?: string | null;
      basePrice: number;
      discountPercentage?: number;
      timelineWeeksMin?: number | null;
      timelineWeeksMax?: number | null;
      icon?: string | null;
      badge?: string | null;
      inputsDescription?: string | null;
      deliveryRhythmDescription?: string | null;
      outputsDescription?: string | null;
      successCriteriaDescription?: string | null;
      guaranteeDescription?: string | null;
      isFeatured: boolean;
      displayOrder: number;
      createdAt: Date;
      updatedAt: Date;
      services?: typeof pkg.packageServices;
      scopingFactors?: typeof pkg.scopingFactors;
      scopingRules?: typeof pkg.scopingRules;
    } = {
      id: pkg.id,
      name: pkg.name,
      slug: pkg.slug,
      type: pkg.type,
      stage: pkg.stage,
      targetArrMin: pkg.targetArrMin,
      targetArrMax: pkg.targetArrMax,
      tagline: pkg.tagline,
      shortDescription: pkg.shortDescription,
      fullDescription: pkg.fullDescription,
      basePrice: Number(pkg.basePrice),
      discountPercentage: Number(pkg.discountPercentage),
      timelineWeeksMin: pkg.timelineWeeksMin ? Number(pkg.timelineWeeksMin) : null,
      timelineWeeksMax: pkg.timelineWeeksMax ? Number(pkg.timelineWeeksMax) : null,
      icon: pkg.icon,
      badge: pkg.badge,
      inputsDescription: pkg.inputsDescription,
      deliveryRhythmDescription: pkg.deliveryRhythmDescription,
      outputsDescription: pkg.outputsDescription,
      successCriteriaDescription: pkg.successCriteriaDescription,
      guaranteeDescription: pkg.guaranteeDescription,
      isFeatured: pkg.isFeatured,
      displayOrder: pkg.displayOrder,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };

    if (includeServices) {
      responseData.services = pkg.packageServices;
    }

    if (includeScoping) {
      responseData.scopingFactors = pkg.scopingFactors;
      responseData.scopingRules = pkg.scopingRules;
    }

    logger.info(
      createLogContext({
        action: 'api_request_completed',
        endpoint: `/api/packages/${id}`,
        method: 'GET',
        package_name: pkg.name,
        include_services: includeServices,
        include_scoping: includeScoping,
        service_count: pkg.packageServices.length,
        scoping_factor_count: pkg.scopingFactors.length,
        scoping_rule_count: pkg.scopingRules.length,
        duration_ms: performance.now() - startTime,
      }),
      `Package API: returned package ${pkg.name}`
    );

    return NextResponse.json(
      {
        success: true,
        data: responseData,
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
        endpoint: `/api/packages/${id}`,
        method: 'GET',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Package API: request failed'
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
