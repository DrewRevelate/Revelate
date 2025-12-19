# CLAUDE.md - AI Assistant Context

## Project Overview

**Revelate Operations Website** - A marketing website for RevOps consulting services, with an integrated personal task management app (TaskFlow).

- **Live Site**: https://www.revelateops.com
- **Preview Branch**: Prerelease (deploys to Vercel preview)
- **Database**: Neon PostgreSQL

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (TaskFlow), Custom (Marketing) |
| Database | Neon PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (beta) with Google OAuth |
| Data Fetching | React Query (TaskFlow) |
| Charts | Recharts |
| Drag & Drop | @hello-pangea/dnd |
| Monitoring | Sentry |
| Analytics | Google Analytics |
| Deployment | Vercel |

## Project Structure

```
app/
├── page.tsx              # Homepage (marketing)
├── layout.tsx            # Root layout with Navigation, Footer
├── globals.css           # Brand design system (CSS variables)
├── about/                # About page
├── services/             # Services page
├── how-i-work/           # Process page
├── faq/                  # FAQ page
├── book/                 # Booking page
├── fit-assessment/       # Lead qualification
├── admin/                # Admin dashboard (protected)
├── taskflow/             # TaskFlow app (separate layout)
│   ├── layout.tsx        # TaskFlow layout with Sidebar
│   ├── page.tsx          # Dashboard
│   ├── board/            # Kanban board
│   ├── my-tasks/         # Task list view
│   ├── projects/         # Projects management
│   ├── activity/         # Activity feed
│   ├── timeline/         # Timeline view
│   ├── settings/         # User settings
│   └── login/            # Auth page
└── api/
    ├── taskflow/         # TaskFlow API routes
    │   ├── tasks/
    │   ├── projects/
    │   ├── activities/
    │   └── notifications/
    └── auth/[...nextauth]/ # NextAuth handler

components/
├── Navigation.tsx        # Main site navigation
├── Footer.tsx            # Site footer
├── ui/                   # shadcn/ui components
└── taskflow/             # TaskFlow-specific components
    ├── layout/           # Sidebar, Header
    ├── dashboard/        # Stats, Charts, ActivityFeed
    └── tasks/            # TaskCard, KanbanColumn, CreateTaskModal

lib/
├── prisma.ts             # Prisma client singleton
├── utils.ts              # cn() utility for shadcn
├── seo/                  # SEO schemas
└── taskflow/
    ├── hooks.ts          # React Query hooks
    ├── auth.ts           # Auth utilities
    └── validation.ts     # Zod schemas

prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Seed script
```

## Key Conventions

### Brand Colors (Use Semantic Names)
```css
/* Primary */
--navy: #1a1f3a        /* bg-navy - Main dark background */
--navy-ink: #131735    /* bg-navy-ink - Deeper contrast */

/* Accent */
--cyan: #00d9ff        /* text-cyan - Highlights, links */
--blue: #0084ff        /* text-blue - Hover states */
--magenta: #d946ef     /* text-magenta - CTAs only */

/* Neutral */
--white: #ffffff       /* text-white */
--surface: #f8fafc     /* bg-surface - Light backgrounds */
--slate: #64748b       /* text-slate - Secondary text */
--charcoal: #334155    /* text-charcoal - Body text */
```

**Never use arbitrary hex values** - Always use the semantic Tailwind classes (bg-navy, text-cyan, etc.)

### Typography
- **Headings**: Space Grotesk (`font-heading`)
- **Body**: Inter (`font-sans`)
- Use fluid typography classes: `text-fluid-5xl`, `text-fluid-4xl`, etc.

### Database Naming
- **TaskFlow models**: Prefixed with `TF` (TFTask, TFProject, TFComment, etc.)
- **CRM models**: No prefix (Company, Contact, Deal, etc.)
- **Legacy models**: Keep for backwards compatibility (Client, Task, Project)

### File Naming
- Components: PascalCase (`TaskCard.tsx`)
- Pages: lowercase (`page.tsx`)
- API routes: lowercase (`route.ts`)
- Utilities: camelCase (`hooks.ts`)

## Authentication

Auth is handled by NextAuth v5 with Google OAuth. Currently **bypassed for development**.

```typescript
// middleware.ts - Auth checks commented out for dev
// To enable: uncomment the taskflow route protection

// Admin email check in auth.ts
const adminEmail = process.env.ADMIN_EMAIL // drew@revelateops.com
```

### Environment Variables Required
```env
# Database
POSTGRES_PRISMA_URL=

# Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=drew@revelateops.com
AUTH_SECRET=

# Analytics
GA_MEASUREMENT_ID=
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database

# Build & Test
npm run build            # Production build
npm run lint             # ESLint
npm run lint:brand       # Check for hardcoded colors
npm test                 # Jest tests
npm run test:e2e         # Playwright tests
```

## TaskFlow App

Personal task management at `/taskflow`. Key features:

- **Kanban Board**: Drag-and-drop task management across columns (BACKLOG → TODO → IN_PROGRESS → IN_REVIEW → DONE)
- **Projects**: Organize tasks by project with color coding
- **Labels**: Tag tasks with custom labels
- **Subtasks**: Hierarchical task structure
- **Dependencies**: Track task dependencies
- **Activity Feed**: Track all changes

### TaskFlow API Endpoints
```
GET/POST   /api/taskflow/tasks
GET/PATCH/DELETE /api/taskflow/tasks/[id]
GET/POST   /api/taskflow/projects
GET/PATCH/DELETE /api/taskflow/projects/[id]
GET        /api/taskflow/activities
GET/PATCH  /api/taskflow/notifications
```

## Important Notes

1. **Don't modify marketing site** when working on TaskFlow - they use separate layouts
2. **Auth is bypassed** - Middleware auth checks are commented out for development
3. **Use `.npmrc`** - Contains `legacy-peer-deps=true` for next-auth compatibility
4. **Prisma migrations** - Run `npm run db:push` after schema changes
5. **Brand consistency** - Always use semantic color classes, never arbitrary values

## Git Workflow

- **main**: Production (auto-deploys to revelateops.com)
- **Prerelease**: Preview/staging (auto-deploys to Vercel preview)

Always commit to Prerelease first, then merge to main after testing.
