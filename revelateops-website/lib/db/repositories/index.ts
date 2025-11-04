/**
 * Repository Index
 *
 * Central export point for all database repositories.
 * Import repositories using: import { serviceRepo, packageRepo } from '@/lib/db/repositories'
 */

// Services Repository
export * as serviceRepo from './services';
export type {
  Service,
  ServiceWithPackages,
  CreateServiceInput,
  UpdateServiceInput,
} from './services';

// Packages Repository
export * as packageRepo from './packages';
export type {
  Package,
  PackageWithServices,
  PackageWithAll,
  CreatePackageInput,
  UpdatePackageInput,
  PackageServiceInput,
} from './packages';

// Scoping Repository
export * as scopingRepo from './scoping';
export type {
  ScopingFactor,
  ScopingRule,
  CreateScopingFactorInput,
  UpdateScopingFactorInput,
  CreateScopingRuleInput,
  UpdateScopingRuleInput,
  ScopingInputs,
  ScopingCalculationResult,
} from './scoping';

// Quotes Repository
export * as quoteRepo from './quotes';
export type {
  Quote,
  QuoteWithPackage,
  CreateQuoteInput,
  UpdateQuoteInput,
} from './quotes';

// Audit Repository
export * as auditRepo from './audit';
export type { AdminAuditLog, LogAdminChangeInput } from './audit';

// =====================================================
// CRM Repositories
// =====================================================

// Companies Repository
export * as companyRepo from './companies';
export type {
  Company,
  CompanyWithRelations,
  CreateCompanyInput,
  UpdateCompanyInput,
} from './companies';

// Contacts Repository
export * as contactRepo from './contacts';
export type {
  Contact,
  ContactWithRelations,
  CreateContactInput,
  UpdateContactInput,
} from './contacts';

// Deals Repository
export * as dealRepo from './deals';
export type {
  Deal,
  DealWithRelations,
  DealStage,
  CreateDealInput,
  UpdateDealInput,
} from './deals';

// Projects Repository
export * as projectRepo from './projects';
export type {
  Project,
  ProjectWithRelations,
  ProjectStatus,
  CreateProjectInput,
  UpdateProjectInput,
} from './projects';

// Tasks Repository
export * as taskRepo from './tasks';
export type {
  Task,
  TaskWithRelations,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
} from './tasks';

// Activities Repository
export * as activityRepo from './activities';
export type {
  Activity,
  ActivityWithRelations,
  ActivityType,
  CreateActivityInput,
  GetActivitiesFilters,
} from './activities';
