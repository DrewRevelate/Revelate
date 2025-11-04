import { NextRequest, NextResponse } from 'next/server';
import { companyRepo, dealRepo, projectRepo, taskRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';

/**
 * GET /api/crm/dashboard
 *
 * Returns aggregated metrics for the CRM dashboard.
 */
export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    // Fetch all stats in parallel
    const [
      companies,
      pipelineMetrics,
      projectStats,
      taskStats,
      overdueTasks,
    ] = await Promise.all([
      companyRepo.getActiveCompanies(),
      dealRepo.getPipelineMetrics(),
      projectRepo.getProjectStats(),
      taskRepo.getTaskStats(),
      taskRepo.getOverdueTasks(),
    ]);

    const dashboard = {
      companies: {
        total: companies.length,
      },
      pipeline: {
        totalValue: Number(pipelineMetrics.totalValue),
        dealCount: Object.values(pipelineMetrics.dealCountByStage).reduce((a, b) => a + b, 0),
        averageDealSize: Number(pipelineMetrics.averageDealSize),
        byStage: pipelineMetrics.dealCountByStage,
      },
      projects: {
        total: projectStats.totalProjects,
        byStatus: projectStats.projectsByStatus,
        averageProgress: Math.round(projectStats.averageProgress),
      },
      tasks: {
        total: taskStats.totalTasks,
        overdue: overdueTasks.length,
        completionRate: Math.round(taskStats.completionRate),
        byStatus: taskStats.tasksByStatus,
        byPriority: taskStats.tasksByPriority,
      },
    };

    return NextResponse.json({ success: true, data: dashboard });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
