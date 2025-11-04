import { NextRequest, NextResponse } from 'next/server';
import { projectRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const searchParams = request.nextUrl.searchParams;
    const projects = await projectRepo.getProjects({
      status: searchParams.get('status') as any || undefined,
      companyId: searchParams.get('companyId') || undefined,
      dealId: searchParams.get('dealId') || undefined,
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const body = await request.json();
    if (!body.companyId || !body.name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const project = await projectRepo.createProject({ ...body, createdBy: auth.adminUser });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
