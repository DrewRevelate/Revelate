# Story 1.1: Set Up Testing Infrastructure

Status: Done

## Story

As a developer,
I want a configured testing environment with Jest and React Testing Library,
so that I can write and run unit and integration tests for the application.

## Acceptance Criteria

1. Jest configured for Next.js 16 with TypeScript support
2. React Testing Library installed and configured
3. Test scripts added to package.json (test, test:watch, test:coverage)
4. Sample test file created and passing
5. Testing documentation added to README

## Tasks / Subtasks

- [x] Install and configure testing dependencies (AC: 1, 2)
  - [x] Install Jest 30.2.0 and required dependencies (@types/jest, ts-jest)
  - [x] Install React Testing Library 16.3.0 and @testing-library/dom
  - [x] Install @testing-library/jest-dom for DOM matchers
  - [x] Install @testing-library/user-event for user interaction testing

- [x] Create Jest configuration for Next.js 16 (AC: 1)
  - [x] Create jest.config.js with Next.js preset
  - [x] Configure TypeScript support with ts-jest
  - [x] Set up path aliases to match tsconfig.json (@/)
  - [x] Configure test environment (jsdom for React components)
  - [x] Add setupFilesAfterEnv for global test setup

- [x] Create global test setup file (AC: 2)
  - [x] Create __tests__/setup.ts file
  - [x] Import @testing-library/jest-dom matchers
  - [x] Configure any global mocks or test utilities

- [x] Add test scripts to package.json (AC: 3)
  - [x] Add "test" script: `jest`
  - [x] Add "test:watch" script: `jest --watch`
  - [x] Add "test:coverage" script: `jest --coverage`
  - [x] Configure coverage thresholds in jest.config.js

- [x] Create sample test file (AC: 4)
  - [x] Create __tests__/sample.test.ts with basic assertions
  - [x] Verify test can import from project using path aliases
  - [x] Run test and ensure it passes
  - [x] Create sample component test if time permits

- [x] Update README with testing documentation (AC: 5)
  - [x] Add "Testing" section to README
  - [x] Document how to run tests (npm test, npm run test:watch, npm run test:coverage)
  - [x] Document test file location conventions
  - [x] Document how to write new tests (basic example)

- [x] Verify installation and configuration (All ACs)
  - [x] Run `npm test` and verify all tests pass
  - [x] Run `npm run test:coverage` and verify coverage report generates
  - [x] Verify no TypeScript errors in test files

## Dev Notes

### Architecture Patterns

**Testing Stack (from architecture.md):**
- Jest 30.2.0 (unit + integration testing)
- React Testing Library 16.3.0 (component testing)
- @testing-library/dom (peer dependency for RTL 16+)
- Industry standard for Next.js with native configuration support

**Test Organization Pattern:**
- Tests co-located with source: `lib/db/__tests__/conversations.test.ts`
- Test file naming: `*.test.ts` or `*.test.tsx`
- Test suites organized in `__tests__/` directory:
  - `__tests__/unit/` for unit tests
  - `__tests__/integration/` for integration tests
  - `__tests__/e2e/` for E2E tests (Playwright, added in Story 1.4)

**Coverage Standards:**
- Minimum 80% coverage threshold (defined in Story 1.5)
- Focus on business logic and data access functions first

### Project Structure Notes

**Alignment with unified project structure:**
- Create `__tests__/` directory at project root
- Follow Next.js 16 App Router conventions
- Test files use TypeScript 5 strict mode
- Path aliases configured to match tsconfig.json (@/ for root imports)

**Test File Locations:**
```
revelateops-website/
├── __tests__/                    # NEW: Test suites
│   ├── setup.ts                  # Global test setup
│   ├── unit/                     # Unit tests (Story 1.2)
│   ├── integration/              # Integration tests (Story 1.3)
│   └── e2e/                      # E2E tests (Story 1.4)
└── jest.config.js                # NEW: Jest configuration
```

**Integration Pattern Example (Reference for future stories):**
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
      body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
    });

    const response = await POST(request);
    // Assertions
  });
});
```

### References

- [Source: docs/architecture.md#Testing Patterns] - Testing stack decisions and patterns
- [Source: docs/architecture.md#Project Structure] - Test directory organization
- [Source: docs/architecture.md#Version Verification Log] - Specific versions to install
- [Source: docs/epics.md#Story 1.1] - Acceptance criteria and story definition

### Prerequisites

None - This is the foundational story for Epic 1.

## Dev Agent Record

### Context Reference

- [Story Context 1.1](./story-context-1.1.xml) - Generated 2025-10-30

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log

**Implementation Plan (2025-10-30):**

1. Install testing dependencies (Jest 30.2.0, RTL 16.3.0, supporting packages)
   - Exact versions per Story Context constraints
   - All devDependencies as specified

2. Create jest.config.js
   - Use next/jest preset (Next.js 16 compatibility)
   - Configure jsdom environment for React components
   - Map @/* path alias to match tsconfig.json
   - Set up setupFilesAfterEnv pointing to __tests__/setup.ts
   - Add coverage configuration (ready for Story 1.5)

3. Create __tests__/setup.ts
   - Import @testing-library/jest-dom for DOM matchers
   - Global test configuration

4. Add npm scripts to package.json
   - test, test:watch, test:coverage

5. Create __tests__/sample.test.ts
   - Basic Jest assertions
   - TypeScript compilation verification
   - Path alias resolution verification

6. Update README.md
   - Add Testing section with script documentation
   - Test file location conventions
   - Basic test writing example

7. Run all verification tests
   - npm test (must pass)
   - npm run test:watch (verify watch mode)
   - npm run test:coverage (verify coverage generation)

**Edge cases to handle:**
- Next.js 16 App Router compatibility
- React 19 compatibility with RTL
- TypeScript strict mode compliance

### Completion Notes

**Story 1.1 Implementation Complete (2025-10-30)**

Successfully set up comprehensive testing infrastructure for the Revelate project:

**Deliverables:**
- Jest 30.2.0 configured with Next.js 16 compatibility and TypeScript support
- React Testing Library 16.3.0 installed with all peer dependencies
- Complete jest.config.js with proper path alias mapping and coverage thresholds
- Global test setup file (__tests__/setup.ts) with jest-dom matchers and common mocks
- Three test scripts added to package.json (test, test:watch, test:coverage)
- Sample test suite with 10 passing tests demonstrating TypeScript, async/await, and jest-dom integration
- Comprehensive testing documentation in README with examples

**Verification Results:**
- ✓ All 10 sample tests passing
- ✓ TypeScript compilation working in test environment
- ✓ Path aliases (@/) resolving correctly
- ✓ Coverage reporting functional
- ✓ No TypeScript errors in test files

**Notes:**
- Coverage thresholds set to 80% as specified in architecture (will be enforced in Story 1.5)
- Test directory structure created and documented for future stories
- Global mocks added for matchMedia and IntersectionObserver (common React component dependencies)
- Next.js 16 App Router and React 19 compatibility verified

### File List

**New Files:**
- revelateops-website/jest.config.js - Jest configuration for Next.js 16 with TypeScript support
- revelateops-website/__tests__/setup.ts - Global test setup with jest-dom and common mocks
- revelateops-website/__tests__/sample.test.ts - Sample test suite (10 tests)

**Modified Files:**
- revelateops-website/package.json - Added test scripts and testing devDependencies
- revelateops-website/README.md - Added comprehensive Testing section with examples

## Change Log

- 2025-10-30: Story created from epic definition
- 2025-10-30: Implementation completed - Testing infrastructure set up with Jest 30.2.0, RTL 16.3.0, all test scripts, and documentation
- 2025-10-30: Story marked Done - All acceptance criteria met, tests passing (10/10), DoD complete
