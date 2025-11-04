import { NextRequest, NextResponse } from 'next/server';
import { companyRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const withRelations = request.nextUrl.searchParams.get('relations') === 'true';

    const company = withRelations
      ? await companyRepo.getCompanyWithRelations(params.id)
      : await companyRepo.getCompanyById(params.id);

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    logger.error(createLogContext({ action: 'company_fetch_failed', error }));
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    const body = await request.json();
    const company = await companyRepo.updateCompany(params.id, {
      ...body,
      updatedBy: auth.adminUser,
    });

    logger.info(createLogContext({
      action: 'company_updated',
      company_id: company.id,
      admin_user: auth.adminUser,
    }));

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    logger.error(createLogContext({ action: 'company_update_failed', error }));
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });
  }

  try {
    await companyRepo.archiveCompany(params.id, auth.adminUser);
    return NextResponse.json({ success: true, message: 'Company archived' });
  } catch (error) {
    logger.error(createLogContext({ action: 'company_archive_failed', error }));
    return NextResponse.json(
      { success: false, error: 'Failed to archive company' },
      { status: 500 }
    );
  }
}
