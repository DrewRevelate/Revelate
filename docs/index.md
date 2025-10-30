# Revelate Website - Documentation Index

**Master Documentation Index for AI-Assisted Development**

---

## Project Quick Reference

| Attribute | Value |
|-----------|-------|
| **Project** | Revelate Website |
| **Type** | Monolithic Full-Stack Web Application |
| **Tech Stack** | Next.js 16 + React 19 + TypeScript 5 |
| **Architecture** | Next.js App Router with API Routes |
| **Database** | PostgreSQL (Vercel Postgres) |
| **Deployment** | Vercel |
| **Status** | Active Development / Prerelease |

**Repository Type:** Monolith
**Primary Language:** TypeScript
**Entry Point:** `app/layout.tsx` → `app/page.tsx`
**API Routes:** `app/api/*/route.ts`

---

## Generated Documentation (BMM Phase 0)

### Core Documentation
1. **[Project Overview](./project-overview.md)** ⭐
   - Executive summary
   - Architecture overview
   - Core features
   - Tech stack details
   - Roadmap & next steps

2. **[Technology Stack](./technology-stack.md)**
   - Complete technology inventory
   - Dependencies & versions
   - Development tools
   - External integrations
   - Technical decisions

3. **[Source Tree Analysis](./source-tree-analysis.md)**
   - Directory structure (annotated)
   - Critical folders explained
   - Entry points documented
   - Import path aliases
   - File naming conventions

### API & Backend Documentation
4. **[API Contracts](./api-contracts.md)** ⭐
   - 10 REST endpoints documented
   - Request/response schemas
   - Authentication requirements
   - Error handling patterns
   - Integration architecture

5. **[Data Models](./data-models.md)** ⭐
   - Database schema (PostgreSQL)
   - 2 tables: conversations, messages
   - 14 data access functions
   - Relationships & indexes
   - Migration strategy

### Frontend Documentation
6. **[Component Inventory](./component-inventory.md)** ⭐
   - 21 React components cataloged
   - Component categories
   - Size analysis
   - Dependencies map
   - Performance notes

---

## Existing Project Documentation

### Integration Guides

**Calendly Integration:**
- [CALENDLY_INTEGRATION.md](../revelateops-website/CALENDLY_INTEGRATION.md)
- [CALENDLY_SETUP.md](../revelateops-website/CALENDLY_SETUP.md)
- [CALENDLY_README.md](../revelateops-website/CALENDLY_README.md)
- [CALENDLY_API_SETUP.md](../revelateops-website/CALENDLY_API_SETUP.md)
- [CALENDLY_API_EXAMPLES.md](../revelateops-website/CALENDLY_API_EXAMPLES.md)
- [CALENDLY_QUICK_REFERENCE.md](../revelateops-website/CALENDLY_QUICK_REFERENCE.md)

**Slack Integration:**
- [SLACK_SETUP.md](../revelateops-website/SLACK_SETUP.md)
- [SLACK_EVENTS_SETUP.md](../revelateops-website/SLACK_EVENTS_SETUP.md)
- [SLACK_WEBHOOK_ALTERNATIVE.md](../revelateops-website/SLACK_WEBHOOK_ALTERNATIVE.md)
- [GET_SLACK_USER_ID.md](../revelateops-website/GET_SLACK_USER_ID.md)
- [FIX_SLACK_SCOPE.md](../revelateops-website/FIX_SLACK_SCOPE.md)

**Chat System:**
- [CHAT_SETUP_COMPLETE.md](../revelateops-website/CHAT_SETUP_COMPLETE.md)
- [TWO_WAY_CHAT_DESIGN.md](../revelateops-website/TWO_WAY_CHAT_DESIGN.md)

**Other Features:**
- [CONTACT_FORM_README.md](../revelateops-website/CONTACT_FORM_README.md)
- [NEON_SETUP.md](../revelateops-website/NEON_SETUP.md) - Database setup

### Enhancement Tracking
- [ENHANCEMENTS_SUMMARY.md](../revelateops-website/ENHANCEMENTS_SUMMARY.md)
- [BOOKING_PAGE_IMPROVEMENTS.md](../revelateops-website/BOOKING_PAGE_IMPROVEMENTS.md)
- [LOGO_SHOWCASE.md](../revelateops-website/LOGO_SHOWCASE.md)
- [QUICK_START_EXAMPLES.md](../revelateops-website/QUICK_START_EXAMPLES.md)

### General Documentation
- [README.md](../revelateops-website/README.md) - Project overview
- [DEPLOYMENT.md](../revelateops-website/DEPLOYMENT.md) - Deployment guide
- [Content Audit.md](../revelateops-website/Content Audit.md) - Content review

---

## Getting Started for Developers

### Prerequisites
- Node.js 20+
- npm
- Git
- Access to:
  - Calendly account (API credentials)
  - Slack workspace (Bot token)
  - Cal.com account (API key)
  - Vercel account (Postgres database)

### Quick Start
```bash
# Clone repository
git clone <repo-url>
cd revelateops-website

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Access at http://localhost:3000
```

### Environment Setup
Required variables in `.env.local`:
```bash
# Calendly
NEXT_PUBLIC_CALENDLY_CLIENT_ID=...
CALENDLY_CLIENT_SECRET=...
CALENDLY_SIGNING_KEY=...
CALENDLY_API_TOKEN=...
CALENDLY_USERNAME=...
CALENDLY_EVENT_SLUG=...

# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_USER_ID=U...

# Cal.com (optional)
CALCOM_API_KEY=...
```

### Database Setup
See: [lib/db/setup-instructions.md](../revelateops-website/lib/db/setup-instructions.md)
Schema: [lib/db/schema.sql](../revelateops-website/lib/db/schema.sql)

---

## Common Development Tasks

### Adding a New Page
1. Create `app/new-page/page.tsx`
2. Add navigation link in `components/Navigation.tsx`
3. Update `components/Footer.tsx` if needed

### Adding a New API Endpoint
1. Create `app/api/endpoint-name/route.ts`
2. Export GET/POST/etc. async functions
3. Use `NextResponse.json()` for responses
4. Add to API documentation

### Adding a New Component
1. Create `components/ComponentName.tsx`
2. Import and use in page or other component
3. Update component inventory if significant

### Database Changes
1. Update `lib/db/schema.sql`
2. Run migration in Vercel Postgres
3. Update `lib/db/conversations.ts` functions
4. Update TypeScript interfaces

---

## Architecture Reference

### Request Flow

**Frontend Request:**
```
Browser → Next.js SSR/CSR → Component → fetch('/api/...') → Route Handler → Response
```

**API Proxy Pattern:**
```
Client → Next.js API Route → External API (Calendly/Cal.com/Slack) → Response
```

**Chat Message Flow:**
```
User → Website → POST /api/conversations/[id]/messages
                → Postgres (save)
                → Slack API (notify)
                → Response

Drew → Slack (reply) → POST /api/slack/events (webhook)
                     → Postgres (save)
                     → Client (polling/websocket)
```

### Key Directories

| Directory | Purpose | Entry Point |
|-----------|---------|-------------|
| `/app` | Pages & API routes | `layout.tsx`, `page.tsx` |
| `/components` | React components | Imported by pages |
| `/lib` | Business logic | `db/conversations.ts`, `calendly-api.ts` |
| `/hooks` | Custom hooks | Imported by components |
| `/types` | Type definitions | Imported throughout |
| `/utils` | Utilities | Imported as needed |

### Import Path Aliases
```typescript
import { fn } from '@/lib/module';     // Maps to project root
import Component from '@/components/C'; // TypeScript path alias
```

---

## Testing & Quality

### Current State
- ❌ **No automated tests** - Needs implementation
- ✅ **ESLint** - Code quality checks
- ✅ **TypeScript** - Type safety (strict mode)

### Recommended Testing Strategy
1. **Unit Tests** - Jest + React Testing Library
   - Test components in isolation
   - Test utility functions
   - Test API route handlers

2. **Integration Tests** - Test API flows
   - Contact form → Database → Slack
   - Chat message flow
   - Booking workflows

3. **E2E Tests** - Playwright
   - User journeys (contact, book, chat)
   - Form submissions
   - Navigation flows

---

## Deployment

### Vercel Configuration
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Root Directory:** `revelateops-website`

### Environment Variables
Configure in Vercel dashboard:
- All Calendly variables
- All Slack variables
- Cal.com API key
- Database (auto-configured)

### Deployment Triggers
- **Production:** Push to `main` branch
- **Preview:** Pull requests
- **Manual:** `vercel deploy` via CLI

---

## Security Considerations

### Implemented
- ✅ Environment variables for secrets
- ✅ API routes hide external keys
- ✅ SQL injection protection (parameterized queries)
- ✅ Input validation
- ✅ TypeScript type safety

### Recommendations
- ⚠️ Add rate limiting (API routes)
- ⚠️ Implement CSRF protection
- ⚠️ Add request authentication/authorization
- ⚠️ Set up error monitoring (Sentry/LogRocket)
- ⚠️ Implement data retention policy
- ⚠️ Add GDPR compliance features

---

## Performance Optimization

### Current Optimizations
- ✅ Next.js automatic code splitting
- ✅ Edge runtime for stateless endpoints
- ✅ Database indexes
- ✅ Image optimization (Next.js Image)

### Recommendations
- ⚠️ Lazy load booking components
- ⚠️ Implement React.memo for static components
- ⚠️ Split FloatingBookingButton (44 KB → smaller chunks)
- ⚠️ Add service worker for offline support
- ⚠️ Implement caching strategy (API responses)

---

## Troubleshooting

### Common Issues

**API Routes Not Working:**
1. Check runtime (`export const runtime = 'nodejs' | 'edge'`)
2. Verify environment variables loaded
3. Check logs in Vercel dashboard

**Database Connection Issues:**
1. Verify Vercel Postgres configured
2. Check environment variables
3. Ensure functions use correct SQL syntax

**Slack Integration Not Working:**
1. Verify bot token starts with `xoxb-`
2. Check bot permissions (chat:write, etc.)
3. Verify webhook URL configured in Slack

**Calendly Integration Issues:**
1. Check API token validity
2. Verify event type URIs
3. Test with Calendly API directly first

---

## Project Statistics

### Codebase Metrics
- **Total API Endpoints:** 10
- **Total Components:** 21
- **Database Tables:** 2
- **Database Functions:** 14
- **Public Pages:** 6
- **Documentation Files:** 23+ (existing) + 6 (generated)

### Size Analysis
- **Largest Component:** FloatingBookingButton.tsx (44 KB)
- **Largest Page:** page.tsx (45 KB)
- **Total Dependencies:** ~200+ npm packages

---

## Next Steps for Prerelease

### Phase 0: Documentation ✅ Complete
- ✅ Document existing codebase
- ✅ Architecture analysis
- ✅ API contracts documented
- ✅ Component inventory
- ✅ Data models documented

### Phase 1: Analysis (Optional)
See workflow status for recommended next steps

### Recommended Immediate Actions
1. **Security Audit** - Review all endpoints
2. **Performance Testing** - Load testing, metrics
3. **Accessibility Audit** - WCAG compliance check
4. **Testing Implementation** - Unit + E2E tests
5. **Code Quality Review** - Technical debt assessment

---

## How to Use This Documentation

### For New Developers
1. Start with [Project Overview](./project-overview.md)
2. Review [Technology Stack](./technology-stack.md)
3. Read [Source Tree Analysis](./source-tree-analysis.md)
4. Reference [API Contracts](./api-contracts.md) & [Data Models](./data-models.md) as needed

### For AI-Assisted Development
**Primary Reference:** This index.md file
**Context Files:**
- API development → [API Contracts](./api-contracts.md)
- Database work → [Data Models](./data-models.md)
- Frontend work → [Component Inventory](./component-inventory.md)
- Architecture decisions → [Project Overview](./project-overview.md)

### For PRD Creation (Brownfield)
Point PRD workflow to this index.md for complete project context

---

## Documentation Maintenance

**Last Updated:** 2025-10-30
**Scan Level:** Deep
**Scan Mode:** initial_scan
**Documentation Version:** 1.0
**Generated By:** BMM document-project workflow

### Keeping Documentation Current
- Re-run documentation scan after major changes
- Update manually for small changes
- Version documentation alongside code
- Review quarterly for accuracy

---

## Contact & Support

**Project:** Revelate Website
**Owner:** Drew Lambert
**Company:** Revelate Operations

**For Documentation Issues:**
- Report gaps or inaccuracies
- Request additional analysis
- Suggest improvements

---

*This documentation index serves as the primary entry point for understanding the Revelate website codebase. All generated documentation follows the BMM (BMad Method) Phase 0 - Documentation workflow.*
