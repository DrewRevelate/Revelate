import { NextRequest, NextResponse } from 'next/server';
import { taskRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const searchParams = request.nextUrl.searchParams;
    const showOverdue = searchParams.get('overdue') === 'true';

    if (showOverdue) {
      const tasks = await taskRepo.getOverdueTasks();
      return NextResponse.json({ success: true, data: tasks });
    }

    const tasks = await taskRepo.getTasks({
      status: searchParams.get('status') as any || undefined,
      priority: searchParams.get('priority') as any || undefined,
      projectId: searchParams.get('projectId') || undefined,
      dealId: searchParams.get('dealId') || undefined,
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Task title is required' }, { status: 400 });
    }

    const task = await taskRepo.createTask({ ...body, createdBy: auth.adminUser });
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  }
}
