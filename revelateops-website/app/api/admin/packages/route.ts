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
 * GET /api/admin/packages
 *
 * Returns all packages (including inactive).
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
    const packages = await packageRepo.getAllPackages();

    // Serialize packages to handle BigInt fields
    const serializedPackages = packages.map(serializePackage);

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/packages',
        method: 'GET',
        admin_user: auth.adminUser,
        package_count: packages.length,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Packages API: returned ${packages.length} packages`
    );

    return NextResponse.json({
      success: true,
      data: serializedPackages,
      meta: {
        count: packages.length,
      },
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/packages',
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
        error: 'Failed to fetch packages',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/packages
 *
 * Creates a new package.
 * Requires admin authentication.
 *
 * Request Body:
 * {
 *   "name": "Package Name",
 *   "slug": "package-slug",
 *   "type": "stage",
 *   "stage": "series-b",
 *   "basePrice": 52500,
 *   "timelineWeeksMin": 8,
 *   "timelineWeeksMax": 16,
 *   "inputsDescription": "...",
 *   "deliveryRhythmDescription": "...",
 *   "outputsDescription": "...",
 *   ...
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
    if (!body.name || !body.slug || !body.type || body.basePrice === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'name, slug, type, and basePrice are required',
        },
        { status: 400 }
      );
    }

    // Validate type
    if (!['stage', 'targeted', 'custom'].includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type',
          message: 'type must be one of: stage, targeted, custom',
        },
        { status: 400 }
      );
    }

    // Convert ARR values to BigInt if provided
    const targetArrMin = body.targetArrMin ? BigInt(body.targetArrMin) : undefined;
    const targetArrMax = body.targetArrMax ? BigInt(body.targetArrMax) : undefined;

    // Create package
    const pkg = await packageRepo.createPackage({
      name: body.name,
      slug: body.slug,
      type: body.type,
      stage: body.stage,
      targetArrMin,
      targetArrMax,
      tagline: body.tagline,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      basePrice: body.basePrice,
      discountPercentage: body.discountPercentage,
      timelineWeeksMin: body.timelineWeeksMin,
      timelineWeeksMax: body.timelineWeeksMax,
      icon: body.icon,
      badge: body.badge,
      inputsDescription: body.inputsDescription,
      deliveryRhythmDescription: body.deliveryRhythmDescription,
      outputsDescription: body.outputsDescription,
      successCriteriaDescription: body.successCriteriaDescription,
      guaranteeDescription: body.guaranteeDescription,
      isFeatured: body.isFeatured,
      displayOrder: body.displayOrder,
      createdBy: auth.adminUser,
    });

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/packages',
        method: 'POST',
        admin_user: auth.adminUser,
        package_id: pkg.id,
        package_name: pkg.name,
        duration_ms: performance.now() - startTime,
      }),
      `Admin Packages API: created package ${pkg.name}`
    );

    return NextResponse.json(
      {
        success: true,
        data: serializePackage(pkg),
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/packages',
        method: 'POST',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Packages API: POST request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
