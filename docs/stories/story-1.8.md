# Story 1.8: Structured Logging Implementation

Status: Drafted

## Story

As a developer,
I want structured logging with conversation_id tracing,
so that I can debug issues and trace user interactions.

## Acceptance Criteria

1. Pino logging library integrated
2. All API endpoints log request/response with conversation_id
3. Database operations log query details
4. Log levels configured (error, warn, info, debug)
5. Logs formatted as JSON for parsing
6. Log retention policy documented

## Tasks / Subtasks

- [ ] Install and configure Pino (AC: 1, 4, 5)
  - [ ] Install pino version 10.1.0
  - [ ] Install pino-pretty for development
  - [ ] Create lib/monitoring/logger.ts
  - [ ] Configure log levels (error, warn, info, debug)
  - [ ] Configure JSON output for production
  - [ ] Configure pretty output for development

- [ ] Instrument API endpoints (AC: 2)
  - [ ] Add request logging middleware
  - [ ] Log request method, path, conversation_id
  - [ ] Log response status and duration
  - [ ] Add error logging in catch blocks
  - [ ] Include conversation_id in all logs

- [ ] Instrument database operations (AC: 3)
  - [ ] Add logging to lib/db/conversations.ts
  - [ ] Log SQL queries (sanitized)
  - [ ] Log query duration
  - [ ] Log database errors
  - [ ] Include conversation_id context

- [ ] Document logging practices (AC: 6)
  - [ ] Document log levels and usage
  - [ ] Document log retention policy
  - [ ] Document how to query logs
  - [ ] Add logging examples to README

## Dev Notes

**Pino Configuration:**
```typescript
// lib/monitoring/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label })
  },
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  })
});
```

**Usage Pattern:**
```typescript
logger.info({ conversation_id, user_email }, 'Conversation created');
logger.error({ conversation_id, error }, 'Database query failed');
```

### References

- [Source: docs/epics.md#Story 1.8] - Acceptance criteria
- [Source: docs/architecture.md#Logging Library] - Pino 10.1.0 selection

### Prerequisites

None (can run in parallel with other stories)

## Dev Agent Record

### Context Reference

- [Story Context 1.8](./story-context-1.8.xml) - Generated 2025-10-30

### File List

- lib/monitoring/logger.ts (NEW)
- app/api/**/route.ts (MODIFIED - add logging)
- lib/db/conversations.ts (MODIFIED - add logging)
- package.json (MODIFIED - add pino dependencies)
- README.md (MODIFIED - add logging documentation)

## Change Log

- 2025-10-30: Story created from epic definition
