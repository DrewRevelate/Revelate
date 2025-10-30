# Project Overview - Revelate Website

## Executive Summary

**Revelate Website** is a modern, full-stack Next.js 16 web application serving as the primary digital presence for Revelate Operations. The site features integrated booking systems (Calendly & Cal.com), a two-way chat system via Slack, and comprehensive contact management—all built with TypeScript and deployed on Vercel.

---

## Project Metadata

| Attribute | Value |
|-----------|-------|
| **Project Name** | Revelate Website (revelateops-website) |
| **Version** | 0.1.0 |
| **Repository Type** | Monolithic full-stack application |
| **Primary Language** | TypeScript |
| **Framework** | Next.js 16.0.0 (App Router) |
| **Deployment Platform** | Vercel |
| **Database** | Vercel Postgres (PostgreSQL) |
| **Status** | Active Development / Prerelease |

---

## Technology Stack Summary

### Core Technologies
- **Frontend:** React 19.2.0, Next.js 16.0.0 App Router
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4, Material-UI 7.3.4, Emotion
- **Animations:** Framer Motion 12.23
- **Database:** PostgreSQL (Vercel Postgres)

### External Integrations
- **Calendly** - Meeting scheduling (OAuth + Personal Access Token)
- **Cal.com** - Alternative booking system (API integration)
- **Slack** - Contact notifications & two-way chat (Bot API)
- **Spotify** - Media integration (remote images)

### Development Tools
- **Linting:** ESLint 9.x with Next.js config
- **Package Manager:** npm
- **Build Tool:** Next.js built-in (Turbopack)

---

## Architecture Classification

**Type:** Monolithic Full-Stack Web Application
**Pattern:** Next.js App Router with API Routes
**Rendering Strategy:** Hybrid (SSR + SSG + CSR)

**Key Architectural Decisions:**
1. **Monolithic Design** - Single codebase for frontend & backend
2. **API Route Proxies** - Next.js API routes proxy external services
3. **Database-Backed Chat** - Conversations persisted for continuity
4. **Dual Booking Systems** - Calendly + Cal.com for flexibility
5. **Slack for Real-Time** - Leverages existing business tool

---

## Project Structure

```
revelateops-website/
├── app/              # Pages & API routes (Next.js App Router)
├── components/       # 21 React components
├── lib/              # Business logic, API clients, database
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
├── utils/            # Utility functions
└── public/           # Static assets
```

**Key Statistics:**
- **API Endpoints:** 10 REST endpoints
- **UI Components:** 21 React components
- **Database Tables:** 2 (conversations, messages)
- **Pages:** 6 public pages (home, about, services, book, contact, faq)
- **Documentation Files:** 23+ markdown files

---

## Core Features

### 1. Multi-Channel Booking System
**Providers:** Calendly + Cal.com
**Features:**
- Availability checking
- Time slot selection
- Event type management
- Custom booking flows
- Floating booking button (mobile-optimized)

**Components:** 10 booking-related components
**API Endpoints:** 7 booking endpoints

---

### 2. Two-Way Chat System
**Architecture:** Website ↔ Slack ↔ Drew
**Features:**
- Contact form initiates conversation
- Real-time messaging via Slack
- Message persistence in PostgreSQL
- One active conversation per user
- Read receipts

**Components:** 4 chat components
**API Endpoints:** 3 chat endpoints
**Database:** 2 tables with 14 data access functions

---

### 3. Contact Management
**Flow:** Contact Form → Slack DM → Database → Chat
**Features:**
- Structured contact form
- Slack notifications with rich formatting
- Automatic conversation creation
- Email-based conversation threading

**Components:** ContactForm, ContactChat
**API Endpoint:** `/api/contact`

---

### 4. Content Pages
**Pages:**
- **Homepage** - Hero, services overview, CTA
- **About** - Company information
- **Services** - Offerings and capabilities
- **FAQ** - Accordion-style Q&A
- **Book** - Integrated booking interface
- **Contact** - Form + chat

**Components:** Navigation, Footer, Hero, FAQAccordion
**Styling:** Brand-compliant (magenta/navy theme)

---

## Data Architecture

### Database Schema
**Provider:** Vercel Postgres
**Tables:**
1. **conversations** - Chat sessions (9 columns)
2. **messages** - Chat messages (7 columns)

**Relationships:**
- `messages.conversation_id` → `conversations.id` (CASCADE)
- `conversations.slack_thread_ts` → Slack thread (UNIQUE)

**Indexes:** 3 indexes for performance
**Triggers:** Auto-update `updated_at` timestamp

---

## API Architecture

### Endpoint Categories
1. **Contact & Chat** (3 endpoints)
   - POST `/api/contact`
   - GET/POST `/api/conversations/[id]/messages`

2. **Calendly Integration** (4 endpoints)
   - GET `/api/calendly/availability`
   - GET `/api/calendly/user`
   - GET `/api/calendly/event-types`
   - GET `/api/calendly/scheduling-link`

3. **Cal.com Integration** (3 endpoints)
   - GET `/api/calcom/availability`
   - POST `/api/calcom/booking`
   - GET `/api/calcom/test`

4. **Slack Webhooks** (1 endpoint)
   - POST `/api/slack/events`

**Runtime Strategy:**
- **Edge Runtime:** Calendly endpoints (stateless, fast)
- **Node.js Runtime:** Database operations (Postgres), Cal.com

---

## Environment Configuration

### Required Environment Variables

**Calendly:**
- `NEXT_PUBLIC_CALENDLY_CLIENT_ID`
- `CALENDLY_CLIENT_SECRET`
- `CALENDLY_SIGNING_KEY`
- `CALENDLY_API_TOKEN`
- `CALENDLY_USERNAME`
- `CALENDLY_EVENT_SLUG`

**Slack:**
- `SLACK_BOT_TOKEN` (xoxb-*)
- `SLACK_USER_ID`

**Cal.com:**
- `CALCOM_API_KEY`

**Database:**
- Automatically configured by Vercel Postgres

---

## Development Workflow

### Scripts
```json
{
  "dev": "next dev",           // Local development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "eslint"             // Code linting
}
```

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Configure `.env.local` with required secrets
4. Run dev server: `npm run dev`
5. Access at `http://localhost:3000`

### Build & Deploy
1. Build: `npm run build`
2. Test: `npm run start`
3. Deploy: Push to Vercel (automatic deployment)

---

## Security & Compliance

### Security Measures
- ✅ Environment variables for all secrets
- ✅ API routes hide external API keys
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (parameterized queries)
- ✅ TypeScript strict mode (type safety)

### Recommendations
- ⚠️ Implement rate limiting
- ⚠️ Add CSRF protection
- ⚠️ Implement data retention policy
- ⚠️ Add GDPR compliance features
- ⚠️ Set up error monitoring (Sentry)

---

## Performance Characteristics

### Optimizations
- ✅ Next.js automatic code splitting
- ✅ Image optimization (Next.js Image)
- ✅ Edge runtime for stateless endpoints
- ✅ Database indexes on critical queries

### Performance Metrics (Estimated)
- **Time to First Byte (TTFB):** < 200ms (Vercel Edge)
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1

### Recommendations
- ⚠️ Lazy load booking components
- ⚠️ Implement React.memo for static components
- ⚠️ Optimize FloatingBookingButton (44 KB)
- ⚠️ Add service worker for offline support

---

## Testing & Quality Assurance

### Current State
- ❌ No automated tests detected
- ✅ ESLint for code quality
- ✅ TypeScript for type safety

### Recommendations
- ⚠️ Add unit tests (Jest + React Testing Library)
- ⚠️ Add E2E tests (Playwright)
- ⚠️ Set up CI/CD pipeline
- ⚠️ Implement test coverage reporting

---

## Documentation

### Existing Documentation
**Count:** 23+ markdown files
**Categories:**
- Integration guides (Calendly, Slack, Cal.com)
- Setup instructions (Database, deployment)
- Feature documentation (Chat, Contact)
- Content audit

**Location:** Project root (recommend moving to `/docs`)

### New Documentation (Generated)
- **Technology Stack** - Complete tech inventory
- **API Contracts** - All 10 endpoints documented
- **Component Inventory** - 21 components cataloged
- **Data Models** - Database schema + operations
- **Source Tree Analysis** - Directory structure
- **Project Overview** - This document

---

## Brand Compliance

### Brand Colors
- **Primary:** Magenta (#d946ef)
- **Background:** Navy (#1a1f3a)
- **Accent:** (Defined in brand guidelines)

### Current Status
**Score:** 50/56 (Excellent - Brand Compliant)

**Recent Improvements:**
- ✅ Multi-color gradients removed
- ✅ Typography optimized
- ✅ Corner radius compliance (12px max)
- ✅ Calendly integration brand colors applied

---

## Deployment

### Platform
**Provider:** Vercel
**Region:** Auto (edge network)
**Domain:** (Configure in Vercel dashboard)

### Deployment Process
1. **Automatic:** Push to Git → Vercel deploys
2. **Manual:** `vercel deploy` via CLI
3. **Preview:** Every PR gets preview URL

### Environment
- **Production:** Main branch
- **Preview:** Feature branches
- **Development:** Local machine

---

## Next Steps & Roadmap

### Immediate Priorities (Prerelease)
1. ✅ Complete documentation audit ← **This Document**
2. ⚠️ Implement automated testing
3. ⚠️ Security audit & hardening
4. ⚠️ Performance optimization
5. ⚠️ Accessibility (A11y) audit

### Short Term (Post-Launch)
1. Add analytics (Google Analytics / Plausible)
2. Implement SEO optimizations
3. Add blog/content management
4. Expand chat features (file uploads, etc.)

### Long Term
1. Mobile app (React Native)
2. CRM integration
3. Advanced analytics dashboard
4. Multi-language support

---

## Contact & Support

**Project Maintainer:** Drew Lambert
**Company:** Revelate Operations
**Documentation Date:** 2025-10-30
**Documentation Scan Level:** Deep

---

*This overview was generated through systematic codebase analysis and represents the state of the project as of the scan date.*
