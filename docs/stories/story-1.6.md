# Story 1.6: CI/CD Testing Integration

Status: Drafted

## Story

As a DevOps engineer,
I want automated tests running in CI/CD pipeline,
so that code quality is verified before deployment.

## Acceptance Criteria

1. GitHub Actions (or Vercel CI) configured for automated testing
2. Tests run on every pull request
3. Tests run on every push to main branch
4. Deployment blocked if tests fail
5. Test results visible in PR checks

## Tasks / Subtasks

- [ ] Create GitHub Actions workflow (AC: 1)
  - [ ] Create .github/workflows/test.yml
  - [ ] Configure Node.js version (20+)
  - [ ] Install dependencies
  - [ ] Run all test suites (unit, integration, e2e)

- [ ] Configure test triggers (AC: 2, 3)
  - [ ] Run on pull_request events
  - [ ] Run on push to main branch
  - [ ] Configure test parallelization if needed

- [ ] Set up deployment gates (AC: 4)
  - [ ] Configure Vercel to require passing checks
  - [ ] Ensure tests must pass before merge
  - [ ] Set up branch protection rules

- [ ] Configure test reporting (AC: 5)
  - [ ] Display test results in PR
  - [ ] Show coverage changes
  - [ ] Add status badges

## Dev Notes

**GitHub Actions Workflow:**
```yaml
name: Tests
on: [pull_request, push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

### References

- [Source: docs/epics.md#Story 1.6] - Acceptance criteria
- [Source: docs/architecture.md#CI/CD Integration] - Workflow configuration

### Prerequisites

Stories 1.1-1.5 complete (full test suite implemented)

## Dev Agent Record

### Context Reference

- [Story Context 1.6](./story-context-1.6.xml) - Generated 2025-10-30

### File List

- .github/workflows/test.yml (NEW)
- .github/workflows/playwright.yml (NEW - optional separate workflow)

## Change Log

- 2025-10-30: Story created from epic definition
