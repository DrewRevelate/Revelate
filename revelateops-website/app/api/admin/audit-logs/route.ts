import { NextRequest, NextResponse } from 'next/server';
import { auditRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * GET /api/admin/audit-logs
 *
 * Returns audit logs with optional filters.
 * Requires admin authentication.
 *
 * Query Parameters:
 * - tableName: (optional) Filter by table name (services, packages, etc.)
 * - recordId: (optional) Filter by specific record ID
 * - action: (optional) Filter by action (create, update, delete, activate, deactivate)
 * - changedBy: (optional) Filter by admin user who made the change
 * - startDate: (optional) Filter logs from this date (ISO 8601)
 * - endDate: (optional) Filter logs until this date (ISO 8601)
 * - limit: (optional) Number of logs to return (default: 100, max: 500)
 *
 * Examples:
 * - GET /api/admin/audit-logs
 * - GET /api/admin/audit-logs?tableName=services
 * - GET /api/admin/audit-logs?recordId=abc-123
 * - GET /api/admin/audit-logs?action=update&limit=50
 * - GET /api/admin/audit-logs?changedBy=admin@example.com
 * - GET /api/admin/audit-logs?startDate=2025-01-01&endDate=2025-01-31
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  // Authenticate admin
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const tableName = searchParams.get('tableName') ?? undefined;
    const recordId = searchParams.get('recordId') ?? undefined;
    const action = searchParams.get('action') ?? undefined;
    const changedBy = searchParams.get('changedBy') ?? undefined;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const limitStr = searchParams.get('limit');

    // Parse dates
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    // Parse and validate limit
    let limit = limitStr ? parseInt(limitStr, 10) : 100;
    if (isNaN(limit) || limit < 1) {
      limit = 100;
    }
    if (limit > 500) {
      limit = 500; // Max limit
    }

    // Get logs based on filters
    let logs;

    if (tableName || recordId || action || changedBy || startDate || endDate) {
      // Use filtered query
      logs = await auditRepo.getAuditLogsFiltered({
        tableName,
        recordId,
        action,
        changedBy,
        startDate,
        endDate,
        limit,
      });
    } else {
      // Get recent logs
      logs = await auditRepo.getRecentAuditLogs(limit);
    }

    logger.info(
      createLogContext({
        action: 'admin_api_request_completed',
        endpoint: '/api/admin/audit-logs',
        method: 'GET',
        admin_user: auth.adminUser,
        log_count: logs.length,
        filters: {
          tableName,
          recordId,
          action,
          changedBy,
          startDate: startDateStr,
          endDate: endDateStr,
          limit,
        },
        duration_ms: performance.now() - startTime,
      }),
      `Admin Audit Logs API: returned ${logs.length} logs`
    );

    return NextResponse.json({
      success: true,
      data: logs,
      meta: {
        count: logs.length,
        limit,
        filters: {
          tableName: tableName ?? null,
          recordId: recordId ?? null,
          action: action ?? null,
          changedBy: changedBy ?? null,
          startDate: startDateStr ?? null,
          endDate: endDateStr ?? null,
        },
      },
    });
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_api_request_failed',
        endpoint: '/api/admin/audit-logs',
        method: 'GET',
        admin_user: auth.adminUser,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin Audit Logs API: GET request failed'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audit logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
