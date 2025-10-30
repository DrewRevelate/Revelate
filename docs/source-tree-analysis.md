# Source Tree Analysis - Revelate Website

## Project Structure Overview

```
revelateops-website/
├── app/                     # Next.js App Router (Pages & API Routes)
│   ├── about/              # About page
│   ├── api/                # ⭐ API Routes (10 endpoints)
│   │   ├── calcom/         # Cal.com booking integration
│   │   │   ├── availability/  # Get available time slots
│   │   │   ├── booking/       # Create booking
│   │   │   └── test/          # Test connectivity
│   │   ├── calendly/       # Calendly scheduling integration
│   │   │   ├── availability/  # Get available times
│   │   │   ├── event-types/   # List event types
│   │   │   ├── scheduling-link/ # Generate links
│   │   │   └── user/          # Get user info
│   │   ├── contact/        # Contact form submission
│   │   ├── conversations/  # Chat conversation management
│   │   │   ├── [id]/messages/ # Message CRUD for conversation
│   │   │   └── find-by-email/ # Lookup by email
│   │   └── slack/          # Slack webhook handlers
│   │       └── events/        # Slack Events API
│   ├── book/               # Booking page
│   ├── cal-test/           # Cal.com testing page
│   ├── contact/            # Contact page
│   ├── faq/                # FAQ page
│   ├── services/           # Services page
│   ├── favicon.ico         # Site favicon
│   ├── globals.css         # Global styles (Tailwind)
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Homepage (45 KB - comprehensive)
│
├── components/             # ⭐ React Components (21 files)
│   ├── BetaBanner.tsx      # Beta announcement banner
│   ├── BookingPageClient.tsx  # Booking page logic
│   ├── CalcomBooking.tsx   # Cal.com booking UI
│   ├── CalcomEmbedSimple.tsx  # Simple Cal.com embed
│   ├── CalendlyBadgeWidget.tsx # Floating Calendly badge
│   ├── CalendlyEmbed.tsx   # Inline Calendly embed
│   ├── CalendlyPopupButton.tsx # Popup Calendly trigger
│   ├── CalendlyWidget.tsx  # Full Calendly widget
│   ├── CalendlyWidgetSimple.tsx # Simple Calendly widget
│   ├── ChatWidget.tsx      # Chat interface
│   ├── ContactChat.tsx     # Post-contact chat
│   ├── ContactForm.tsx     # Main contact form
│   ├── CustomBooking.tsx   # Custom booking UI
│   ├── FAQAccordion.tsx    # FAQ accordion component
│   ├── FloatingBookingButton.tsx # 📍 Sticky booking button (44 KB)
│   ├── FloatingChat.tsx    # Floating chat launcher
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Homepage hero section
│   ├── Navigation.tsx      # Main navigation bar
│   ├── StickyNav.tsx       # Sticky nav variant
│   └── UserInfoModal.tsx   # User info modal dialog
│
├── hooks/                  # Custom React hooks
│   └── (hook files)
│
├── lib/                    # ⭐ Shared Library Code
│   ├── calendly-api.ts     # Calendly API client
│   ├── data/               # Static data
│   │   └── stats.ts        # Statistics data
│   └── db/                 # ⭐ Database Layer
│       ├── conversations.ts   # Conversation data access (14 functions)
│       ├── schema.sql         # PostgreSQL schema
│       └── setup-instructions.md # DB setup guide
│
├── public/                 # Static assets
│   ├── logos/              # Brand logos
│   └── (images, assets)
│
├── types/                  # TypeScript type definitions
│   └── (type definition files)
│
├── utils/                  # Utility functions
│   └── (utility modules)
│
├── .env.example            # Environment variable template
├── .env.local              # ⚠️ Environment secrets (gitignored)
├── .env.local.example      # Local env template
├── .gitignore              # Git ignore rules
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies & scripts
├── README.md               # Project overview
├── tsconfig.json           # TypeScript configuration
│
└── Documentation/          # 📚 Project Documentation (23 MD files)
    ├── README.md
    ├── DEPLOYMENT.md
    ├── Content Audit.md
    ├── CALENDLY_*.md       # Calendly integration guides (6 files)
    ├── SLACK_*.md          # Slack integration guides (5 files)
    ├── CHAT_SETUP_COMPLETE.md
    ├── TWO_WAY_CHAT_DESIGN.md
    ├── CONTACT_FORM_README.md
    ├── NEON_SETUP.md
    └── (other documentation)
```

---

## Critical Directories

### `/app` - Next.js App Router
**Purpose:** Pages and API routes
**Entry Point:** `layout.tsx` (root layout), `page.tsx` (homepage)
**Pattern:** File-based routing

**Key Subdirectories:**
- **`/app/api`** - Backend API routes (REST endpoints)
- **`/app/[page-name]`** - Frontend pages

**Special Files:**
- `globals.css` - Tailwind CSS base styles
- `layout.tsx` - Shared layout wrapper
- `page.tsx` - Route page component

---

### `/app/api` - Backend API Layer
**Purpose:** Server-side API endpoints
**Runtime:** Mixed (Edge for Calendly, Node.js for database operations)
**Pattern:** Route handlers (`route.ts`)

**Integration Points:**
- **Calendly API** - Schedule management
- **Cal.com API** - Alternative booking
- **Slack API** - Notifications & chat
- **Vercel Postgres** - Conversation storage

**Key Endpoints:**
1. `/api/contact` - Form submission + conversation creation
2. `/api/conversations/[id]/messages` - Chat message CRUD
3. `/api/slack/events` - Slack webhook receiver
4. `/api/calendly/*` - Calendly proxies
5. `/api/calcom/*` - Cal.com proxies

---

### `/components` - React Component Library
**Purpose:** Reusable UI components
**Count:** 21 components
**Pattern:** Single-file components (`.tsx`)

**Component Categories:**
1. **Layout** - Navigation, Footer, Hero
2. **Booking** - 10 booking-related components
3. **Contact/Chat** - 4 communication components
4. **Interactive** - FAQAccordion, UserInfoModal

**Largest Component:** `FloatingBookingButton.tsx` (44 KB)

---

### `/lib` - Shared Business Logic
**Purpose:** Core application logic, API clients, data access
**Pattern:** Modular TypeScript files

**Key Modules:**
- **`calendly-api.ts`** - Calendly API wrapper
- **`db/conversations.ts`** - Database operations (14 functions)
- **`db/schema.sql`** - PostgreSQL schema
- **`data/stats.ts`** - Application statistics

**Database Layer:**
- ORM: None (direct SQL via `@vercel/postgres`)
- Tables: `conversations`, `messages`
- Operations: CRUD + specialized queries

---

### `/hooks` - Custom React Hooks
**Purpose:** Reusable React logic
**Pattern:** Hook files with `use` prefix

---

### `/types` - TypeScript Definitions
**Purpose:** Shared type definitions
**Pattern:** `.d.ts` files or `.ts` type-only files

---

### `/utils` - Utility Functions
**Purpose:** Helper functions and utilities
**Pattern:** Pure functions, no side effects

---

### `/public` - Static Assets
**Purpose:** Public static files (images, logos, etc.)
**Served From:** Root URL path
**Key Subdirectory:** `/logos` - Brand assets

---

## Build & Generated Directories

### `/.next` - Next.js Build Output
**Purpose:** Compiled application code
**Generated:** On `npm run build` or `npm run dev`
**Gitignored:** Yes

### `/node_modules` - Dependencies
**Purpose:** npm packages
**Size:** ~200+ packages
**Gitignored:** Yes

### `/.vercel` - Vercel Deployment Config
**Purpose:** Deployment configuration
**Generated:** By Vercel CLI
**Gitignored:** Yes

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript compiler configuration |
| `next.config.ts` | Next.js framework configuration |
| `.gitignore` | Git exclusion rules |
| `.env.example` | Environment variable template |
| `.env.local` | Local secrets (gitignored) |

---

## Entry Points

### Application Entry
- **Server:** `app/layout.tsx` → `app/page.tsx`
- **Client:** Hydration from server-rendered HTML

### API Entry
- **REST Endpoints:** `app/api/*/route.ts`
- **Runtime:** Determined by `export const runtime = 'edge' | 'nodejs'`

---

## Data Flow Patterns

### Frontend → Backend
```
Component → fetch('/api/endpoint') → route.ts → lib/db/* → Postgres
```

### External Service Integration
```
Component → fetch('/api/calendly/...') → route.ts → Calendly API
```

### Slack Webhook
```
Slack → POST /api/slack/events → route.ts → lib/db/conversations → Postgres
```

---

## File Naming Conventions

### Pages
- `page.tsx` - Route page component
- `layout.tsx` - Route layout wrapper
- `route.ts` - API route handler

### Components
- `PascalCase.tsx` - React components
- Co-located with usage or in `/components`

### Library Code
- `kebab-case.ts` - Utility files
- `camelCase.ts` - API clients

### Styles
- `globals.css` - Global styles
- Inline: Tailwind utility classes

---

## Import Path Aliases

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

**Usage:**
```typescript
import { createConversation } from '@/lib/db/conversations';
import ContactForm from '@/components/ContactForm';
```

---

## Testing Structure

**Status:** No test files detected in deep scan
**Recommendation:** Add test directories:
- `__tests__/` - Unit tests
- `e2e/` - End-to-end tests

---

## Documentation Organization

23 Markdown files in project root covering:
- Integration guides (Calendly, Slack, Cal.com)
- Setup instructions (NEON database)
- Feature documentation (Chat, Contact)
- Deployment guides

**Recommendation:** Move to `/docs` directory for better organization

---

## Key Architectural Patterns

### 1. Monolithic Full-Stack
- Frontend & backend in single codebase
- Shared types between client & server

### 2. API Route Proxies
- Frontend → Next.js API → External API
- Hides API keys from client
- Enables server-side logic

### 3. Database-Backed Chat
- Conversations persisted in Postgres
- Messages threaded via Slack
- Two-way communication

### 4. Component Composition
- Atomic components in `/components`
- Page-level composition in `/app`
- Reusable UI patterns

---

*Last Updated: 2025-10-30*
*Total Directories: 35*
*Scan Level: Deep*
