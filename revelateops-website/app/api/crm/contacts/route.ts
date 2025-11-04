import { NextRequest, NextResponse } from 'next/server';
import { contactRepo } from '@/lib/db/repositories';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const searchParams = request.nextUrl.searchParams;
    const contacts = await contactRepo.getContacts({
      companyId: searchParams.get('companyId') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
    });

    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authorized) return NextResponse.json(createUnauthorizedResponse(auth.error!), { status: 401 });

  try {
    const body = await request.json();
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const contact = await contactRepo.createContact({ ...body, createdBy: auth.adminUser });
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create contact' }, { status: 500 });
  }
}
