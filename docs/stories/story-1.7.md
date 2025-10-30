# Story 1.7: Error Monitoring Integration

Status: Drafted

## Story

As an operations engineer,
I want integrated error monitoring with Sentry,
so that production errors are captured and alerted in real-time.

## Acceptance Criteria

1. Sentry SDK installed and configured for Next.js
2. Error tracking active for both client and server code
3. Source maps uploaded for readable stack traces
4. Slack alerts configured for critical errors
5. Error dashboard accessible to team
6. Sample error tested and verified in Sentry

## Tasks / Subtasks

- [ ] Install and configure Sentry (AC: 1)
  - [ ] Install @sentry/nextjs version 10.22.0
  - [ ] Run npx @sentry/wizard@latest -i nextjs
  - [ ] Configure Sentry DSN in environment variables
  - [ ] Create sentry.client.config.ts
  - [ ] Create sentry.server.config.ts
  - [ ] Create sentry.edge.config.ts

- [ ] Configure error tracking (AC: 2)
  - [ ] Set up client-side error boundary
  - [ ] Configure server-side error handling
  - [ ] Set up API route error tracking
  - [ ] Configure sample rate and filters
  - [ ] Test error capture in development

- [ ] Set up source maps (AC: 3)
  - [ ] Configure Sentry source map upload
  - [ ] Set up auth token for uploads
  - [ ] Verify source maps in Sentry dashboard
  - [ ] Test stack trace readability

- [ ] Configure Slack alerts (AC: 4)
  - [ ] Connect Sentry to Slack workspace
  - [ ] Set up alert rules for critical errors
  - [ ] Configure alert conditions and thresholds
  - [ ] Test Slack notification delivery

- [ ] Verify integration (AC: 5, 6)
  - [ ] Create test error in application
  - [ ] Verify error appears in Sentry dashboard
  - [ ] Verify stack trace is readable
  - [ ] Verify Slack alert is sent
  - [ ] Document Sentry dashboard access

## Dev Notes

**Sentry Configuration:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### References

- [Source: docs/epics.md#Story 1.7] - Acceptance criteria
- [Source: docs/architecture.md#Error Monitoring] - Sentry 10.22.0 configuration

### Prerequisites

Story 1.1 (Testing Infrastructure) - helps verify error tracking works

## Dev Agent Record

### Context Reference

- [Story Context 1.7](./story-context-1.7.xml) - Generated 2025-10-30

### File List

- sentry.client.config.ts (NEW)
- sentry.server.config.ts (NEW)
- sentry.edge.config.ts (NEW)
- next.config.js (MODIFIED - add Sentry plugin)
- package.json (MODIFIED - add @sentry/nextjs)

## Change Log

- 2025-10-30: Story created from epic definition
