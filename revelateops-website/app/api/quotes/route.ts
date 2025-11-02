import { NextRequest, NextResponse } from 'next/server';
import { quoteRepo } from '@/lib/db/repositories';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * POST /api/quotes
 *
 * Create a new quote from user submission.
 * Public endpoint - no authentication required.
 *
 * Request Body:
 * {
 *   firstName?: string;
 *   lastName?: string;
 *   userEmail?: string;
 *   phone?: string;
 *   companyName?: string;
 *   title?: string;
 *   comments?: string;
 *   packageId?: string;
 *   scopingInputs?: object; // Quiz answers or other inputs
 *   selectedServices?: string[]; // Array of service IDs
 *   calculatedPrice?: number;
 *   calculatedTimelineWeeks?: number;
 *   pdfUrl?: string;
 *   status?: 'draft' | 'sent' | 'accepted';
 * }
 *
 * Example:
 * POST /api/quotes
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "userEmail": "john@example.com",
 *   "phone": "555-0123",
 *   "companyName": "Acme Corp",
 *   "title": "VP of Sales",
 *   "selectedServices": ["service-id-1", "service-id-2"],
 *   "status": "draft"
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await request.json();

    // Validate required fields (at least email or company name)
    if (!body.userEmail && !body.companyName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Either userEmail or companyName is required',
        },
        { status: 400 }
      );
    }

    // Create the quote
    const quote = await quoteRepo.createQuote({
      firstName: body.firstName,
      lastName: body.lastName,
      userEmail: body.userEmail,
      phone: body.phone,
      companyName: body.companyName,
      title: body.title,
      comments: body.comments,
      packageId: body.packageId,
      scopingInputs: body.scopingInputs,
      selectedServices: body.selectedServices,
      calculatedPrice: body.calculatedPrice,
      calculatedTimelineWeeks: body.calculatedTimelineWeeks,
      pdfUrl: body.pdfUrl,
      status: body.status ?? 'draft',
    });

    logger.info(
      createLogContext({
        action: 'api_request_completed',
        endpoint: '/api/quotes',
        method: 'POST',
        quote_id: quote.id,
        user_email: body.userEmail,
        company_name: body.companyName,
        package_id: body.packageId,
        service_count: body.selectedServices?.length ?? 0,
        status: quote.status,
        duration_ms: performance.now() - startTime,
      }),
      `Quote created: ${quote.id}`
    );

    return NextResponse.json(
      {
        success: true,
        data: quote,
        message: 'Quote created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'api_request_failed',
        endpoint: '/api/quotes',
        method: 'POST',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create quote'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/quotes
 *
 * Get quotes, optionally filtered by email or status.
 * Public endpoint - but consider adding authentication in production.
 *
 * Query Parameters:
 * - email: (optional) Filter quotes by user email
 * - status: (optional) Filter quotes by status (draft | sent | accepted)
 *
 * Example:
 * - GET /api/quotes?email=john@example.com
 * - GET /api/quotes?status=sent
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const status = searchParams.get('status') as 'draft' | 'sent' | 'accepted' | null;

    let quotes;

    if (email) {
      // Get quotes by email
      quotes = await quoteRepo.getQuotesByEmail(email);
    } else if (status) {
      // Get quotes by status
      quotes = await quoteRepo.getQuotesByStatus(status);
    } else {
      // Get recent quotes (limited to prevent abuse)
      quotes = await quoteRepo.getRecentQuotes(50);
    }

    logger.info(
      createLogContext({
        action: 'api_request_completed',
        endpoint: '/api/quotes',
        method: 'GET',
        email,
        status,
        quote_count: quotes.length,
        duration_ms: performance.now() - startTime,
      }),
      `Quotes API: returned ${quotes.length} quotes`
    );

    return NextResponse.json(
      {
        success: true,
        data: quotes,
        meta: {
          count: quotes.length,
          email: email ?? null,
          status: status ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'api_request_failed',
        endpoint: '/api/quotes',
        method: 'GET',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Quotes API: request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quotes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
