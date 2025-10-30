# Technology Stack - Revelate Website

## Overview
Full-stack Next.js web application with integrated booking, contact, and chat functionality.

## Core Framework & Language

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.0.0 | Full-stack React framework with App Router |
| **Runtime** | Node.js | 20+ | Server-side runtime |
| **Language** | TypeScript | 5.x | Type-safe development |
| **React** | React | 19.2.0 | UI library |
| **React DOM** | React DOM | 19.2.0 | React rendering |

## Frontend Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **CSS-in-JS** | Emotion | 11.14.0 | Styled components |
| **UI Components** | Material-UI (MUI) | 7.3.4 | Component library |
| **Icons** | MUI Icons | 7.3.4 | Icon set |
| **Icons** | Lucide React | 0.548.0 | Additional icon library |
| **Animations** | Framer Motion | 12.23.24 | Animation library |

## External Integrations

| Service | Purpose | Authentication |
|---------|---------|----------------|
| **Calendly** | Meeting scheduling | OAuth 2.0 + Personal Access Token |
| **Cal.com** | Alternative booking system | API integration |
| **Slack** | Contact form notifications & chat | Bot Token (xoxb-*) |
| **Spotify** | Media integration (images) | Remote image patterns |

## Utility Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **date-fns** | 4.1.0 | Date manipulation |
| **jsPDF** | 3.0.3 | PDF generation |
| **dotenv** | 17.2.3 | Environment variable management |

## Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.x | Code linting |
| **ESLint Config Next** | 16.0.0 | Next.js specific linting rules |

## TypeScript Configuration

- **Target:** ES2017
- **Module Resolution:** Bundler
- **Strict Mode:** Enabled
- **Path Aliases:** `@/*` → project root
- **JSX:** react-jsx

## Build & Deployment

| Tool | Purpose |
|------|---------|
| **@tailwindcss/postcss** | CSS processing |
| **Next.js Build** | Production optimization |
| **Vercel** | Deployment platform (inferred from config) |

## API Routes Structure

The application includes the following API endpoints:

- `/api/calcom` - Cal.com booking integration
- `/api/calendly` - Calendly scheduling integration
- `/api/contact` - Contact form submission handler
- `/api/conversations` - Chat/messaging system
- `/api/slack` - Slack webhook handlers

## Environment Variables Required

### Calendly Integration
- `NEXT_PUBLIC_CALENDLY_CLIENT_ID`
- `CALENDLY_CLIENT_SECRET`
- `CALENDLY_SIGNING_KEY`
- `CALENDLY_API_TOKEN`
- `CALENDLY_USERNAME`
- `CALENDLY_EVENT_SLUG`

### Slack Integration
- `SLACK_BOT_TOKEN`
- `SLACK_USER_ID`

## Architecture Pattern

**Type:** Monolithic Full-Stack Web Application
**Pattern:** Next.js App Router with API Routes
**Rendering:** Server-Side Rendering (SSR) + Static Site Generation (SSG) + Client-Side Rendering (CSR)

## Key Technical Decisions

1. **Next.js 16 with App Router** - Modern React Server Components architecture
2. **TypeScript Strict Mode** - Maximum type safety
3. **Dual UI Libraries** - Material-UI for complex components, Tailwind for custom styling
4. **Multiple Booking Systems** - Calendly + Cal.com for flexibility
5. **Slack for Notifications** - Real-time contact form handling via Slack Bot API
6. **Framer Motion** - Rich animations for enhanced UX

---

*Last Updated: 2025-10-30*
*Scan Level: Deep*
