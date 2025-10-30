# Decision Architecture - Revelate Enhancement

## Executive Summary

This architecture document defines the technical approach for enhancing the Revelate Operations website from functional prototype to production-ready enterprise application. The enhancement focuses on layering testing infrastructure, security hardening, performance optimization, and observability onto the existing Next.js 16 architecture without disrupting current functionality. All decisions prioritize compatibility with the existing stack while introducing modern best practices for quality, security, and compliance.

## Project Initialization

**Existing Base:** This is a brownfield enhancement project. The core Next.js 16 application is already operational with React 19, TypeScript 5, and Vercel deployment.

**No New Initialization Required:** Implementation begins directly with enhancement stories.

## Decision Summary

| Category | Decision | Version | Verified | Status | Affects Epics | Rationale |
| -------- | -------- | ------- | -------- | ------ | ------------- | --------- |
| **Testing Framework** | Jest + React Testing Library | Jest 30.2.0, RTL 16.3.0 | 2025-10-30 | ✓ Current | Epic 1 | Industry standard for Next.js, native configuration support, excellent TypeScript integration |
| **E2E Testing** | Playwright | 1.56.1 | 2025-10-30 | ✓ Current | Epic 1 | Official Next.js recommendation, cross-browser support, excellent developer experience |
| **Error Monitoring** | Sentry | @sentry/nextjs 10.22.0 | 2025-10-30 | ✓ Current | Epic 1 | Comprehensive error tracking, source map support, Slack integration, Turbopack native Debug IDs |
| **Logging Library** | Pino | 10.1.0 | 2025-10-30 | ✓ Current | Epic 1 | 5x faster than Winston, async processing, optimized for Node.js performance |
| **Rate Limiting** | Upstash Ratelimit | @upstash/ratelimit 2.0.6 | 2025-10-30 | ✓ Current | Epic 2 | Serverless-friendly, Redis-backed, multi-region support, edge-compatible |
| **CSRF Protection** | csrf-csrf + middleware | 4.0.3 | 2025-10-30 | ⚠ Recommended | Epic 2 | Modern stateless CSRF using Double Submit Cookie Pattern, actively maintained (csrf 3.1.0 last updated 6 years ago) |
| **Service Worker/PWA** | Serwist | 9.2.1 | 2025-10-30 | ✓ Current | Epic 2 | next-pwa successor, official Next.js documentation recommendation, Workbox-based |
| **Code Quality** | ESLint + Prettier | Existing (maintained) | N/A | ✓ Current | Both Epics | Already configured, maintain existing setup |
| **Database** | Vercel Postgres | Existing | N/A | ✓ Current | Epic 2 | No change - RLS policies added within existing DB |
| **Deployment** | Vercel | Existing | N/A | ✓ Current | Both Epics | No change - CI/CD enhancements added |

## Version Verification Log

All technology versions were verified via WebSearch on **2025-10-30** to ensure currency and stability.

| Technology | Search Query | Source | Latest Version | Chosen Version | Release Channel | Notes |
|------------|--------------|--------|----------------|----------------|-----------------|-------|
| **Jest** | "jest npm latest version 2025" | npmjs.com | 30.2.0 | 30.2.0 | Latest | Published ~1 month ago. Jest 30 released June 2025 with performance improvements. Requires Node 18+, TypeScript 5.4+ |
| **React Testing Library** | "@testing-library/react npm latest version 2025" | npmjs.com | 16.3.0 | 16.3.0 | Stable | Published 7 months ago (March 2025). Requires @testing-library/dom as peer dependency |
| **Playwright** | "@playwright/test npm latest version 2025" | npmjs.com | 1.56.1 | 1.56.1 | Latest | Published 12 days ago. Actively maintained with regular updates |
| **Sentry** | "@sentry/nextjs npm latest version 2025" | npmjs.com | 10.22.0 | 10.22.0 | Latest | Published Oct 24, 2025. Supports Turbopack production builds, requires Next.js 13.2.0+ |
| **Pino** | "pino npm latest version 2025" | npmjs.com | 10.1.0 | 10.1.0 | Latest | Published Oct 18, 2025. Very low overhead, actively maintained |
| **Upstash Ratelimit** | "@upstash/ratelimit npm latest version 2025" | npmjs.com | 2.0.6 | 2.0.6 | Stable | Published 3 months ago. 108 dependent projects, serverless-optimized |
| **CSRF Protection** | "csrf npm latest version 2025" | npmjs.com | 4.0.3 (csrf-csrf) | 4.0.3 | Stable | **Changed from csrf (3.1.0, 6 years old) to csrf-csrf (4.0.3, 5 months ago).** Uses Double Submit Cookie Pattern, stateless, actively maintained |
| **Serwist** | "@serwist/next npm latest version 2025" | npmjs.com | 9.2.1 | 9.2.1 | Latest | Published 20 days ago. Actively maintained next-pwa successor, last updated July 2025 |

### Version Strategy

- **Latest Stable**: Chosen for rapidly evolving tools (Jest, Playwright, Sentry, Pino, Serwist) where new features and bug fixes provide significant value
- **LTS/Stable**: Chosen for foundational infrastructure (RTL 16.3.0, Upstash Ratelimit 2.0.6) that are mature and stable
- **Node.js Compatibility**: All versions compatible with Node.js 20+ LTS

### Breaking Changes & Compatibility

- **Jest 30**: Requires Node.js 18+ (compatible with our Node.js 20+), TypeScript 5.4+ (compatible with our TypeScript 5)
- **RTL 16+**: Requires @testing-library/dom as peer dependency (added to devDependencies)
- **Sentry 10.22.0**: Supports Next.js 13.2.0+ (compatible with our Next.js 16)
- **csrf-csrf 4.0.3**: Drop-in replacement for csrf with modern API and active maintenance

### Next Review Date

**Recommended:** 2026-01-30 (Quarterly review)

During quarterly reviews:
1. Check for new major versions of dependencies
2. Review npm security advisories
3. Evaluate breaking changes and migration paths
4. Update versions in this document

## Project Structure

```
revelateops-website/
├── app/                          # Next.js App Router (existing)
│   ├── api/                      # API Routes
│   │   ├── contact/              # Contact form endpoint
│   │   ├── conversations/        # Chat message endpoints
│   │   ├── calendly/             # Calendly integration (4 endpoints)
│   │   ├── calcom/               # Cal.com integration (3 endpoints)
│   │   ├── slack/                # Slack webhooks
│   │   └── gdpr/                 # NEW: GDPR compliance endpoints
│   │       ├── export/           # Data export
│   │       └── delete/           # Data deletion
│   ├── (pages)/                  # Public pages
│   │   ├── page.tsx              # Homepage
│   │   ├── about/
│   │   ├── services/
│   │   ├── book/
│   │   ├── contact/
│   │   └── faq/
│   └── middleware.ts             # NEW: Rate limiting + CSRF middleware
│
├── components/                   # React components (21 existing)
│   ├── layout/                   # Navigation, Footer, Hero
│   ├── booking/                  # 10 booking components
│   ├── chat/                     # 4 chat components
│   └── ui/                       # FAQAccordion, UserInfoModal
│
├── lib/                          # Business logic
│   ├── db/                       # Database layer
│   │   ├── conversations.ts      # 14 data access functions
│   │   └── schema.sql            # Database schema
│   ├── api-clients/              # External API clients
│   │   ├── calendly-api.ts
│   │   ├── slack-api.ts
│   │   └── calcom-api.ts
│   ├── middleware/               # NEW: Middleware utilities
│   │   ├── ratelimit.ts          # Rate limiting logic
│   │   └── csrf.ts               # CSRF token validation
│   ├── monitoring/               # NEW: Observability
│   │   ├── sentry.ts             # Sentry configuration
│   │   └── logger.ts             # Pino logger setup
│   └── utils/                    # Utility functions
│
├── __tests__/                    # NEW: Test suites
│   ├── unit/                     # Unit tests
│   │   ├── db/                   # Database function tests
│   │   └── lib/                  # Business logic tests
│   ├── integration/              # Integration tests
│   │   └── api/                  # API endpoint tests
│   └── e2e/                      # E2E tests
│       ├── contact.spec.ts       # Contact form → chat flow
│       ├── booking.spec.ts       # Booking flow
│       └── chat.spec.ts          # Message exchange
│
├── public/                       # Static assets
│   ├── manifest.json             # NEW: PWA manifest
│   └── sw.js                     # NEW: Service worker (generated)
│
├── .github/                      # NEW: CI/CD
│   └── workflows/
│       └── test.yml              # Automated testing workflow
│
├── jest.config.js                # NEW: Jest configuration
├── playwright.config.ts          # NEW: Playwright configuration
├── serwist.config.js             # NEW: Service worker config
└── next.config.js                # Existing (enhanced)
```

## Epic to Architecture Mapping

| Epic | Architectural Components | Key Technologies |
|------|-------------------------|------------------|
| **Epic 1: Testing & Quality Infrastructure** | `__tests__/`, jest.config.js, playwright.config.ts, lib/monitoring/, .github/workflows/ | Jest 30, RTL 16, Playwright 1.55, Sentry 10.22, Pino |
| **Epic 2: Security & Performance Hardening** | app/middleware.ts, lib/middleware/, app/api/gdpr/, serwist.config.js, public/manifest.json | Upstash Ratelimit 2.0.6, csrf library, Serwist, React.memo |

## Technology Stack Details

### Core Technologies (Existing - No Changes)

- **Framework:** Next.js 16.0.0 (App Router)
- **React:** 19.2.0
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4, Material-UI 7.3.4, Emotion
- **Database:** PostgreSQL (Vercel Postgres)
- **Deployment:** Vercel (Edge + Node.js runtimes)

### New Enhancement Technologies

**Testing Stack:**
- Jest 30.2.0 (unit + integration testing)
- React Testing Library 16.3.0 (component testing)
- Playwright 1.56.1 (E2E testing)
- @testing-library/dom (peer dependency for RTL 16+)

**Security & Compliance:**
- @upstash/ratelimit 2.0.6 (rate limiting)
- csrf-csrf 4.0.3 (CSRF protection - stateless Double Submit Cookie Pattern)
- PostgreSQL RLS policies (row-level security)

**Monitoring & Observability:**
- @sentry/nextjs 10.22.0 (error monitoring)
- Pino 10.1.0 (structured logging)

**Performance & PWA:**
- Serwist 9.2.1 (service worker, next-pwa successor)
- React.memo (component optimization)
- Dynamic imports (code splitting)

### Integration Points

**Existing External Integrations (Maintained):**
- Calendly API (OAuth + Personal Access Token)
- Cal.com API (Bearer authentication)
- Slack Bot API (two-way chat via webhooks)

**New Monitoring Integrations:**
- Sentry (error tracking → Slack alerts)
- Vercel Analytics (performance monitoring)
- Upstash Redis (rate limit state storage)

**CI/CD Integration:**
- GitHub Actions (test automation)
- Vercel deployment hooks (automatic deployment on passing tests)

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Testing Patterns

**Unit Test Organization:**
- Tests co-located with source: `lib/db/__tests__/conversations.test.ts`
- Test file naming: `*.test.ts` or `*.test.tsx`
- Test database: Use in-memory PostgreSQL or test database instance
- Mocking external APIs: Use Jest mocks for Slack, Calendly, Cal.com

**Integration Test Structure:**
```typescript
// __tests__/integration/api/contact.test.ts
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';

describe('POST /api/contact', () => {
  beforeEach(async () => {
    // Setup test database
  });

  it('should create conversation and send Slack notification', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@example.com', ... }),
    });

    const response = await POST(request);
    // Assertions
  });
});
```

**E2E Test Pattern:**
```typescript
// __tests__/e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test('contact form to chat flow', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('[name="name"]', 'Test User');
  // ... fill form and submit
  await expect(page.locator('.chat-widget')).toBeVisible();
});
```

### Security Patterns

**Rate Limiting Middleware:**
```typescript
// app/middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}
```

**CSRF Token Pattern (Double Submit Cookie):**
- Uses csrf-csrf library (stateless Double Submit Cookie Pattern)
- Generate token on form load (server component)
- Validate token in API route before processing
- Tokens stored in HTTP-only cookies
- No server-side session storage required (serverless-friendly)

**GDPR Compliance Pattern:**
```typescript
// app/api/gdpr/export/route.ts
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  // Verify email ownership (send confirmation link)
  // Export all user data as JSON
  return NextResponse.json({ conversations, messages });
}
```

### Performance Patterns

**Lazy Loading:**
```typescript
// app/book/page.tsx
import dynamic from 'next/dynamic';

const CalendlyWidget = dynamic(() => import('@/components/CalendlyWidget'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

**Component Optimization:**
```typescript
// components/layout/Navigation.tsx
import { memo } from 'react';

export const Navigation = memo(function Navigation({ items }) {
  return <nav>{/* navigation content */}</nav>;
});
```

**Service Worker Caching:**
```javascript
// serwist.config.js
module.exports = {
  cacheOnNavigation: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.calendly\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'calendly-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
      },
    },
  ],
};
```

### Logging Patterns

**Structured Logging:**
```typescript
// lib/monitoring/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label) => ({ level: label }),
  },
});

// Usage in API routes
logger.info({
  conversation_id: conversationId,
  action: 'message_sent',
  user_email: email,
}, 'User message sent');
```

**Error Monitoring:**
```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
```

## Consistency Rules

### Naming Conventions

**API Routes:**
- RESTful naming: `/api/resource` (plural for collections)
- Nested resources: `/api/conversations/[id]/messages`
- GDPR endpoints: `/api/gdpr/export`, `/api/gdpr/delete`

**Database Tables:**
- Lowercase, plural: `conversations`, `messages`
- Foreign keys: `conversation_id` (snake_case)

**React Components:**
- PascalCase: `CalendlyWidget`, `ContactForm`
- File naming matches component: `CalendlyWidget.tsx`

**Test Files:**
- Same name as source + `.test`: `conversations.test.ts`
- E2E tests: Descriptive `.spec`: `contact-flow.spec.ts`

### Code Organization

**Tests:**
- Unit tests co-located with source OR in `__tests__/unit/`
- Integration tests in `__tests__/integration/`
- E2E tests in `__tests__/e2e/`
- Test utilities in `__tests__/utils/`

**Middleware:**
- All middleware in `lib/middleware/`
- Applied via `app/middleware.ts` (Next.js convention)

**Monitoring:**
- All observability code in `lib/monitoring/`
- Logger exports from `lib/monitoring/logger.ts`
- Sentry config in `lib/monitoring/sentry.ts`

### Error Handling

**API Route Pattern:**
```typescript
try {
  // Operation
  return NextResponse.json({ success: true, data });
} catch (error) {
  logger.error({ error, endpoint: '/api/contact' }, 'API error');
  Sentry.captureException(error);

  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Internal server error' },
    { status: 500 }
  );
}
```

**Database Error Handling:**
```typescript
try {
  const result = await query();
  return result;
} catch (error) {
  logger.error({ error, query: 'getConversation' }, 'Database error');
  throw new Error('Failed to fetch conversation');
}
```

### Logging Strategy

**Log Levels:**
- `error`: Failures requiring immediate attention
- `warn`: Recoverable issues (rate limit near threshold, fallback triggered)
- `info`: Significant events (conversation created, message sent)
- `debug`: Detailed tracing (development only)

**Required Fields:**
- `conversation_id`: For all conversation-related logs
- `user_email`: For user actions (hashed in production)
- `action`: Describes what happened
- `timestamp`: Automatic via Pino

**Example:**
```typescript
logger.info({
  conversation_id: 123,
  action: 'slack_notification_sent',
  slack_thread_ts: 'ts_value',
}, 'Slack DM sent to Drew');
```

## Data Architecture

**Existing Schema (No Changes):**

**conversations table:**
- id (SERIAL PRIMARY KEY)
- user_name, user_email, user_phone, user_company
- slack_thread_ts (UNIQUE - thread identifier)
- status (active/closed)
- created_at, updated_at (automatic timestamps)

**messages table:**
- id (SERIAL PRIMARY KEY)
- conversation_id (FK → conversations.id, CASCADE)
- sender ('user' | 'drew')
- message_text (TEXT)
- sent_at (automatic timestamp)
- read_by_user (BOOLEAN)
- slack_ts (thread message timestamp)

**Enhancement: Row-Level Security (RLS)**
```sql
-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users access only their own conversations
CREATE POLICY user_conversations ON conversations
  FOR SELECT
  USING (user_email = current_setting('app.user_email', true));

-- Policy: Drew (admin) accesses all
CREATE POLICY admin_conversations ON conversations
  FOR ALL
  USING (current_setting('app.user_role', true) = 'admin');

-- Similar policies for messages table
```

**Data Retention:**
- Scheduled job runs daily via Vercel Cron
- Deletes conversations >90 days old
- Cascade deletion removes associated messages
- Configurable retention period via environment variable

## API Contracts

**Existing Endpoints (Maintained):**

All 10 existing API endpoints remain unchanged in functionality:
- POST /api/contact
- GET/POST /api/conversations/[id]/messages
- GET /api/calendly/* (4 endpoints)
- GET/POST /api/calcom/* (3 endpoints)
- POST /api/slack/events

**New Endpoints:**

**GDPR Data Export:**
```
GET /api/gdpr/export?email=user@example.com

Response 200:
{
  "conversations": [...],
  "messages": [...],
  "export_date": "2025-10-30T12:00:00Z"
}
```

**GDPR Data Deletion:**
```
DELETE /api/gdpr/delete?email=user@example.com&token=confirm_token

Response 200:
{
  "success": true,
  "deleted_conversations": 3,
  "deleted_messages": 47
}
```

**Rate Limit Headers (All Endpoints):**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1698765432
```

## Security Architecture

**Defense in Depth Layers:**

1. **Network Layer:** Vercel Edge network, DDoS protection
2. **Application Layer:**
   - Rate limiting (10 req/10s per IP for contact form)
   - CSRF tokens on all POST/PUT/DELETE
   - Input validation on all endpoints
3. **Data Layer:**
   - Row-level security in PostgreSQL
   - Parameterized queries (SQL injection prevention)
   - Data encryption at rest (Vercel Postgres)
4. **Transport Layer:** HTTPS only, secure cookies

**Authentication:**
- No user authentication (public contact form)
- Drew authenticates via Slack (existing)
- GDPR endpoints require email verification token

**Authorization:**
- RLS policies enforce data access control
- API routes validate conversation ownership
- Admin role for Drew (support access)

**Compliance:**
- GDPR: Data export, deletion, retention policy
- WCAG 2.1 AA: Accessibility standards
- OWASP Top 10: Security audit checklist

## Performance Considerations

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization Strategies:**

1. **Code Splitting:**
   - Lazy load booking components (CalendlyWidget, CalcomBooking)
   - Separate bundles for chat widget
   - Route-based code splitting (automatic via Next.js)

2. **Caching:**
   - Service worker caches static assets
   - Stale-while-revalidate for API responses
   - CDN caching via Vercel Edge

3. **Component Optimization:**
   - React.memo for Navigation, Footer
   - useCallback for event handlers
   - useMemo for expensive computations

4. **Bundle Size:**
   - Target: Reduce initial bundle by 30%
   - Before: ~500 KB (with 44 KB FloatingBookingButton)
   - After: ~350 KB (optimized components, code splitting)

5. **Image Optimization:**
   - Next.js Image component (automatic)
   - WebP format with fallbacks
   - Lazy loading below fold

**Performance Monitoring:**
- Vercel Analytics (Real User Monitoring)
- Lighthouse CI (automated audits)
- Sentry Performance (transaction tracing)

## Deployment Architecture

**Platform:** Vercel (No Change)

**Environments:**
- **Production:** Main branch (main)
- **Preview:** Feature branches (automatic)
- **Development:** Local (localhost:3000)

**CI/CD Pipeline:**
1. PR created → GitHub Actions triggers
2. Run all tests (unit, integration, E2E)
3. Run ESLint + TypeScript checks
4. Generate test coverage report
5. If tests pass → Deploy to Vercel preview
6. Manual approval → Merge to main
7. Automatic production deployment

**Deployment Process:**
```yaml
# .github/workflows/test.yml
name: Test & Deploy
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run build
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

**Vercel Configuration:**
```javascript
// next.config.js enhancements
const withSerwist = require('@serwist/next').default({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
});

module.exports = withSerwist({
  // Existing Next.js config
  reactStrictMode: true,

  // Sentry source maps
  sentry: {
    hideSourceMaps: true,
  },
});
```

**Environment Variables (New):**
```
# Testing
DATABASE_URL_TEST=postgresql://...

# Monitoring
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=... (for source maps)

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Existing vars maintained
SLACK_BOT_TOKEN=xoxb-...
CALENDLY_API_TOKEN=...
# etc.
```

## Development Environment

### Prerequisites

**Required Software:**
- Node.js 20+ (LTS)
- npm 10+
- Git 2.40+
- PostgreSQL 15+ (for local testing)

**Existing Stack (No Changes):**
- Next.js 16.0.0
- React 19.2.0
- TypeScript 5

**New Development Dependencies:**
```json
{
  "devDependencies": {
    "jest": "^30.2.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/dom": "^10.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@playwright/test": "^1.56.1",
    "@types/jest": "^29.5.0"
  },
  "dependencies": {
    "@sentry/nextjs": "^10.22.0",
    "pino": "^10.1.0",
    "@upstash/ratelimit": "^2.0.6",
    "@upstash/redis": "^1.31.0",
    "csrf-csrf": "^4.0.3",
    "@serwist/next": "^9.2.1"
  }
}
```

### Setup Commands

```bash
# 1. Clone repository (existing)
git clone <repo-url>
cd revelateops-website

# 2. Install dependencies (includes new test dependencies)
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with actual values

# 4. Setup test database
createdb revelate_test
npm run db:migrate:test

# 5. Run tests
npm test                    # Unit + integration tests
npm run test:e2e           # E2E tests
npm run test:coverage      # Coverage report

# 6. Start development server
npm run dev

# 7. Run linting
npm run lint

# 8. Build for production
npm run build
```

## Architecture Decision Records (ADRs)

### ADR-001: Jest over Vitest for Testing

**Decision:** Use Jest 30.2.0 + React Testing Library 16.3.0 for unit and integration testing

**Rationale:**
- Native Next.js configuration support
- Jest 30 performance improvements (faster, less memory) - released June 2025
- Mature ecosystem with extensive Next.js documentation
- Team familiarity and industry standard
- RTL 16+ requires @testing-library/dom as peer dependency
- Compatible with Node.js 20+ and TypeScript 5.4+

**Alternatives Considered:** Vitest (faster but less Next.js integration)

**Affected Epics:** Epic 1 (Story 1.1-1.3)

**Verified:** 2025-10-30 via npmjs.com

---

### ADR-002: Playwright for E2E Testing

**Decision:** Use Playwright 1.56.1 for end-to-end testing

**Rationale:**
- Official Next.js documentation recommendation
- Cross-browser testing (Chromium, Firefox, WebKit)
- Excellent developer experience and debugging tools
- Built-in screenshot/video recording
- Fast execution with parallelization
- Actively maintained with regular updates (published 12 days ago)

**Alternatives Considered:** Cypress (heavier, slower)

**Affected Epics:** Epic 1 (Story 1.4)

**Verified:** 2025-10-30 via npmjs.com

---

### ADR-003: Sentry for Error Monitoring

**Decision:** Use @sentry/nextjs 10.22.0 for error monitoring and observability

**Rationale:**
- Comprehensive Next.js integration (client + server)
- Native Debug IDs for Turbopack (improved source maps)
- Slack integration for critical alerts
- Performance transaction tracing
- Source map upload automation
- Supports Next.js 13.2.0+ (compatible with our Next.js 16)
- Published Oct 24, 2025 - current stable release

**Alternatives Considered:** LogRocket (more expensive), Rollbar (less Next.js integration)

**Affected Epics:** Epic 1 (Story 1.7)

**Verified:** 2025-10-30 via npmjs.com

---

### ADR-004: Pino for Structured Logging

**Decision:** Use Pino 10.1.0 for structured logging with JSON output

**Rationale:**
- 5x faster than Winston (async processing)
- Optimized for Node.js performance
- JSON structured logs for parsing/analysis
- Low overhead in production
- Excellent TypeScript support
- Very low overhead JavaScript logger
- Published Oct 18, 2025 - actively maintained

**Alternatives Considered:** Winston (slower but more features)

**Affected Epics:** Epic 1 (Story 1.8)

**Verified:** 2025-10-30 via npmjs.com

---

### ADR-005: Upstash Ratelimit for API Protection

**Decision:** Use @upstash/ratelimit 2.0.6 with Redis for rate limiting

**Rationale:**
- Serverless-friendly (HTTP-based, no persistent connections)
- Multi-region Redis for low latency
- Edge runtime compatible
- Sliding window algorithm for accurate limiting
- Ephemeral caching reduces Redis calls
- 108 dependent projects in npm registry - well-tested
- Published 3 months ago - stable release

**Alternatives Considered:** Native Next.js middleware (no state persistence)

**Affected Epics:** Epic 2 (Story 2.1)

**Verified:** 2025-10-30 via npmjs.com

---

### ADR-006: csrf-csrf for Modern CSRF Protection

**Decision:** Use csrf-csrf 4.0.3 instead of csrf 3.1.0 for CSRF protection

**Rationale:**
- csrf library (3.1.0) last updated 6 years ago - unmaintained
- csrf-csrf (4.0.3) published 5 months ago - actively maintained
- Implements stateless Double Submit Cookie Pattern
- No server-side session storage required (serverless-friendly)
- Modern API compatible with Next.js middleware
- Drop-in replacement with improved security model
- Better suited for distributed serverless architecture

**Alternatives Considered:** csrf (outdated), @edge-csrf/nextjs (less adoption)

**Affected Epics:** Epic 2 (Story 2.2)

**Verified:** 2025-10-30 via npmjs.com

**Migration Notes:**
- Replace `import csrf from 'csrf'` with `import { doubleCsrf } from 'csrf-csrf'`
- Update token generation and validation to use Double Submit Cookie Pattern
- No breaking changes to API routes - tokens still validated before processing

---

### ADR-007: Serwist over next-pwa for Service Workers

**Decision:** Use Serwist 9.2.1 as the PWA/service worker solution

**Rationale:**
- next-pwa is unmaintained (last update 2+ years ago)
- Serwist is the official successor, recommended by Next.js docs
- Based on Google's Workbox (battle-tested)
- Easier Next.js 16 configuration
- Active maintenance and support
- Published 20 days ago - actively maintained with regular updates
- Last updated July 2025

**Alternatives Considered:** next-pwa (abandoned), native implementation (complex)

**Affected Epics:** Epic 2 (Story 2.8)

**Verified:** 2025-10-30 via npmjs.com

---

### ADR-008: Row-Level Security in PostgreSQL

**Decision:** Implement RLS policies in Vercel Postgres

**Rationale:**
- Database-level access control (defense in depth)
- Prevents data leaks even if application logic fails
- Standard PostgreSQL feature (well-documented)
- Minimal performance impact with proper indexing
- Supports multi-tenant security model

**Alternatives Considered:** Application-layer only (less secure)

**Affected Epics:** Epic 2 (Story 2.5)

---

### ADR-009: 90-Day Data Retention Policy

**Decision:** Automatically delete conversations and messages after 90 days

**Rationale:**
- GDPR best practice (data minimization)
- Reduces storage costs
- Lower compliance risk
- Configurable via environment variable
- Audit trail maintained for deletions

**Alternatives Considered:** Indefinite storage (higher risk/cost)

**Affected Epics:** Epic 2 (Story 2.3)

---

### ADR-010: Code Splitting via Dynamic Imports

**Decision:** Use Next.js dynamic imports for lazy loading heavy components

**Rationale:**
- Reduces initial bundle size by ~30%
- Booking components only loaded when needed
- Native Next.js feature (no additional dependencies)
- Improves Core Web Vitals (LCP)
- SSR can be disabled per component

**Alternatives Considered:** Eager loading (larger initial bundle)

**Affected Epics:** Epic 2 (Story 2.6)

---

### ADR-011: React.memo for Static Components

**Decision:** Apply React.memo to Navigation, Footer, and static UI components

**Rationale:**
- Prevents unnecessary re-renders
- Minimal code changes
- Measurable performance improvement (50% fewer renders)
- Native React feature (no dependencies)
- Can be verified with React DevTools Profiler

**Alternatives Considered:** useMemo/useCallback only (less effective for components)

**Affected Epics:** Epic 2 (Story 2.7)

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-10-30_
_For: Drew Lambert_
_Project: Revelate Operations Website Enhancement_
