import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Contact Repository
 *
 * Handles all database operations for CRM contacts.
 */

export type Contact = Prisma.ContactGetPayload<{}>;
export type ContactWithRelations = Prisma.ContactGetPayload<{
  include: {
    company: true;
    conversation: true;
    deals: true;
    activities: { take: 10; orderBy: { activityDate: 'desc' } };
  };
}>;

export interface CreateContactInput {
  companyId?: string;
  conversationId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  linkedinUrl?: string;
  isPrimary?: boolean;
  notes?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateContactInput {
  companyId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  linkedinUrl?: string;
  isPrimary?: boolean;
  status?: string;
  notes?: string;
  tags?: string[];
  updatedBy?: string;
}

/**
 * Get all active contacts
 */
export async function getActiveContacts(): Promise<Contact[]> {
  const startTime = performance.now();

  try {
    const contacts = await prisma.contact.findMany({
      where: { status: 'active' },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActiveContacts',
        count: contacts.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${contacts.length} active contacts`
    );

    return contacts;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActiveContacts',
        error,
      }),
      'Failed to get active contacts'
    );
    throw error;
  }
}

/**
 * Get contacts with filters
 */
export async function getContacts(filters?: {
  companyId?: string;
  status?: string;
  search?: string;
}): Promise<Contact[]> {
  const startTime = performance.now();

  try {
    const where: Prisma.ContactWhereInput = {};

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getContacts',
        filters,
        count: contacts.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${contacts.length} contacts with filters`
    );

    return contacts;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getContacts',
        error,
      }),
      'Failed to get contacts'
    );
    throw error;
  }
}

/**
 * Get contact by ID
 */
export async function getContactById(id: string): Promise<Contact | null> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getContactById',
        contact_id: id,
        found: !!contact,
        duration_ms: performance.now() - startTime,
      }),
      contact ? 'Contact found' : 'Contact not found'
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getContactById',
        contact_id: id,
        error,
      }),
      'Failed to get contact by ID'
    );
    throw error;
  }
}

/**
 * Get contact with all relations
 */
export async function getContactWithRelations(id: string): Promise<ContactWithRelations | null> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        conversation: {
          include: {
            messages: {
              orderBy: { sent_at: 'desc' },
              take: 10,
            },
          },
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          take: 10,
          orderBy: { activityDate: 'desc' },
        },
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getContactWithRelations',
        contact_id: id,
        found: !!contact,
        duration_ms: performance.now() - startTime,
      }),
      contact ? 'Contact with relations found' : 'Contact not found'
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getContactWithRelations',
        contact_id: id,
        error,
      }),
      'Failed to get contact with relations'
    );
    throw error;
  }
}

/**
 * Get contact by email
 */
export async function getContactByEmail(email: string): Promise<Contact | null> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getContactByEmail',
        found: !!contact,
        duration_ms: performance.now() - startTime,
      }),
      contact ? 'Contact found by email' : 'Contact not found by email'
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getContactByEmail',
        error,
      }),
      'Failed to get contact by email'
    );
    throw error;
  }
}

/**
 * Get contact by conversation ID
 */
export async function getContactByConversationId(conversationId: number): Promise<Contact | null> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.findUnique({
      where: { conversationId },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getContactByConversationId',
        conversation_id: conversationId,
        found: !!contact,
        duration_ms: performance.now() - startTime,
      }),
      contact ? 'Contact found by conversation' : 'Contact not found by conversation'
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getContactByConversationId',
        error,
      }),
      'Failed to get contact by conversation ID'
    );
    throw error;
  }
}

/**
 * Create a new contact
 */
export async function createContact(data: CreateContactInput): Promise<Contact> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.create({
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'contact_created',
        contact_id: contact.id,
        contact_name: `${contact.firstName} ${contact.lastName}`,
        duration_ms: performance.now() - startTime,
      }),
      `Contact created: ${contact.firstName} ${contact.lastName}`
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'contact_creation_failed',
        error,
      }),
      'Failed to create contact'
    );
    throw error;
  }
}

/**
 * Update a contact
 */
export async function updateContact(id: string, data: UpdateContactInput): Promise<Contact> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
      },
    });

    logger.info(
      createLogContext({
        action: 'contact_updated',
        contact_id: contact.id,
        contact_name: `${contact.firstName} ${contact.lastName}`,
        duration_ms: performance.now() - startTime,
      }),
      `Contact updated: ${contact.firstName} ${contact.lastName}`
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'contact_update_failed',
        contact_id: id,
        error,
      }),
      'Failed to update contact'
    );
    throw error;
  }
}

/**
 * Set primary contact for a company
 */
export async function setPrimaryContact(id: string, companyId: string): Promise<Contact> {
  const startTime = performance.now();

  try {
    // Remove primary status from all contacts in the company
    await prisma.contact.updateMany({
      where: { companyId },
      data: { isPrimary: false },
    });

    // Set this contact as primary
    const contact = await prisma.contact.update({
      where: { id },
      data: { isPrimary: true },
    });

    logger.info(
      createLogContext({
        action: 'primary_contact_set',
        contact_id: contact.id,
        company_id: companyId,
        duration_ms: performance.now() - startTime,
      }),
      `Primary contact set for company`
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'set_primary_contact_failed',
        contact_id: id,
        error,
      }),
      'Failed to set primary contact'
    );
    throw error;
  }
}

/**
 * Delete a contact (soft delete by setting status to 'inactive')
 */
export async function deactivateContact(id: string, deactivatedBy?: string): Promise<Contact> {
  const startTime = performance.now();

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status: 'inactive',
        updatedBy: deactivatedBy,
      },
    });

    logger.info(
      createLogContext({
        action: 'contact_deactivated',
        contact_id: contact.id,
        duration_ms: performance.now() - startTime,
      }),
      'Contact deactivated'
    );

    return contact;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'contact_deactivation_failed',
        contact_id: id,
        error,
      }),
      'Failed to deactivate contact'
    );
    throw error;
  }
}

/**
 * Hard delete a contact (use with caution)
 */
export async function deleteContact(id: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.contact.delete({
      where: { id },
    });

    logger.warn(
      createLogContext({
        action: 'contact_deleted',
        contact_id: id,
        duration_ms: performance.now() - startTime,
      }),
      'Contact permanently deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'contact_deletion_failed',
        contact_id: id,
        error,
      }),
      'Failed to delete contact'
    );
    throw error;
  }
}
