import { NextRequest, NextResponse } from 'next/server';
import { activityRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const searchParams = request.nextUrl.searchParams;
    const activities = await activityRepo.getActivities({
      companyId: searchParams.get('companyId') || undefined,
      contactId: searchParams.get('contactId') || undefined,
      dealId: searchParams.get('dealId') || undefined,
      projectId: searchParams.get('projectId') || undefined,
      type: searchParams.get('type') as any || undefined,
    });

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const body = await request.json();
    if (!body.type || !body.subject) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const activity = await activityRepo.createActivity({ ...body, createdBy: auth.adminUser });
    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create activity' }, { status: 500 });
  }
}
