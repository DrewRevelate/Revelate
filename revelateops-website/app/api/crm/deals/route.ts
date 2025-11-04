import { NextRequest, NextResponse } from 'next/server';
import { dealRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const searchParams = request.nextUrl.searchParams;
    const groupByStage = searchParams.get('groupByStage') === 'true';

    if (groupByStage) {
      const dealsByStage = await dealRepo.getDealsByStage();
      return NextResponse.json({ success: true, data: dealsByStage });
    }

    const deals = await dealRepo.getDeals({
      stage: searchParams.get('stage') as any || undefined,
      companyId: searchParams.get('companyId') || undefined,
      contactId: searchParams.get('contactId') || undefined,
    });

    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch deals' }, { status: 500 });
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

    const deal = await dealRepo.createDeal({ ...body, createdBy: auth.adminUser });
    return NextResponse.json({ success: true, data: deal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create deal' }, { status: 500 });
  }
}
