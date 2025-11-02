import { NextRequest, NextResponse } from 'next/server';
import { scopingRepo, quoteRepo } from '@/lib/db/repositories';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * POST /api/calculate-scope
 *
 * Calculates price and timeline based on scoping inputs.
 * Public endpoint - no authentication required.
 *
 * Request Body:
 * {
 *   "packageId": "uuid",
 *   "inputs": {
 *     "team_size": 25,
 *     "deal_stages": "5-7",
 *     "integrations": true
 *   },
 *   "saveQuote": true (optional),
 *   "userEmail": "user@example.com" (optional, required if saveQuote=true),
 *   "companyName": "Acme Corp" (optional)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "basePrice": 52500,
 *     "adjustedPrice": 65000,
 *     "baseTimelineWeeks": 8,
 *     "adjustedTimelineWeeks": 12,
 *     "appliedRules": [
 *       {
 *         "ruleName": "Large Team Multiplier",
 *         "adjustmentLabel": "Team size 25-50: +25%",
 *         "priceAdjustment": 1.25,
 *         "timelineAdjustment": 2
 *       }
 *     ],
 *     "quoteId": "uuid" (if saveQuote=true)
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.packageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field',
          message: 'packageId is required',
        },
        { status: 400 }
      );
    }

    if (!body.inputs || typeof body.inputs !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid inputs',
          message: 'inputs must be an object with scoping factor values',
        },
        { status: 400 }
      );
    }

    // Validate saveQuote requirements
    if (body.saveQuote && !body.userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field',
          message: 'userEmail is required when saveQuote=true',
        },
        { status: 400 }
      );
    }

    // Calculate scope
    const calculation = await scopingRepo.calculateScope(body.packageId, body.inputs);

    // Prepare response data
    const responseData: {
      basePrice: number;
      adjustedPrice: number;
      baseTimelineWeeks: number;
      adjustedTimelineWeeks: number;
      appliedRules: typeof calculation.appliedRules;
      quoteId?: string;
    } = {
      basePrice: calculation.basePrice,
      adjustedPrice: calculation.adjustedPrice,
      baseTimelineWeeks: calculation.baseTimelineWeeks,
      adjustedTimelineWeeks: calculation.adjustedTimelineWeeks,
      appliedRules: calculation.appliedRules,
    };

    // Save quote if requested
    if (body.saveQuote) {
      const quote = await quoteRepo.createQuote({
        userEmail: body.userEmail,
        companyName: body.companyName,
        packageId: body.packageId,
        scopingInputs: body.inputs,
        calculatedPrice: calculation.adjustedPrice,
        calculatedTimelineWeeks: calculation.adjustedTimelineWeeks,
        status: 'draft',
      });

      responseData.quoteId = quote.id;

      logger.info(
        createLogContext({
          action: 'quote_saved',
          quote_id: quote.id,
          package_id: body.packageId,
          user_email: body.userEmail,
          calculated_price: calculation.adjustedPrice,
          calculated_timeline: calculation.adjustedTimelineWeeks,
        }),
        'Quote saved during scope calculation'
      );
    }

    logger.info(
      createLogContext({
        action: 'api_request_completed',
        endpoint: '/api/calculate-scope',
        method: 'POST',
        package_id: body.packageId,
        base_price: calculation.basePrice,
        adjusted_price: calculation.adjustedPrice,
        rules_applied: calculation.appliedRules.length,
        quote_saved: !!body.saveQuote,
        duration_ms: performance.now() - startTime,
      }),
      `Scope calculated: ${calculation.appliedRules.length} rules applied`
    );

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'api_request_failed',
        endpoint: '/api/calculate-scope',
        method: 'POST',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Calculate scope API: request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate scope',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
