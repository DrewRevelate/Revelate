# Revelate Operations - Brand Compliant Website

![Coverage](https://img.shields.io/badge/coverage-19%25-red) [![Testing](https://img.shields.io/badge/tests-passing-brightgreen)](#testing)

Website score: 50/56 (Excellent - Brand Compliant)

All brand compliance fixes deployed:
- Multi-color gradients removed
- Typography optimized
- Calendly integration fixed
- Text sizes increased for readability

## Testing

This project uses Jest 30.2.0 and React Testing Library 16.3.0 for comprehensive testing.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test File Locations

Tests are organized in the `__tests__/` directory:

```
__tests__/
├── setup.ts              # Global test setup and configuration
├── sample.test.ts        # Example test file
├── unit/                 # Unit tests for individual functions/components
├── integration/          # Integration tests for API endpoints and workflows
└── e2e/                  # End-to-end tests (Playwright)
```

### Writing Tests

Test files use the `.test.ts` or `.test.tsx` extension and follow this pattern:

```typescript
// __tests__/unit/example.test.ts
import { describe, it, expect } from '@jest/globals';

describe('Feature Name', () => {
  it('should perform expected behavior', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

#### Component Testing Example

```typescript
// __tests__/unit/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Path Aliases

Tests support the same path aliases as the main application:

```typescript
import { SomeComponent } from '@/components/SomeComponent';
import { someUtil } from '@/lib/utils';
```

### Coverage Thresholds

Minimum coverage requirements:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

**CI/CD Enforcement:** GitHub Actions automatically runs test coverage on every pull request and push to main/Prerelease branches. Builds will fail if coverage drops below the 80% threshold.

### Viewing Coverage Reports

After running `npm run test:coverage`, you can view detailed coverage reports in multiple formats:

#### HTML Report (Recommended)

Open the interactive HTML report in your browser:

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report (macOS)
open coverage/index.html

# Open HTML report (Linux)
xdg-open coverage/index.html

# Or manually navigate to:
# revelateops-website/coverage/index.html
```

The HTML report provides:
- **File-by-file coverage breakdown** - Click any file to see line-by-line coverage
- **Color-coded coverage** - Green (covered), red (uncovered), yellow (partially covered)
- **Interactive navigation** - Browse through your codebase with coverage overlays
- **Detailed metrics** - Statements, branches, functions, and lines percentages

#### Understanding Coverage Metrics

The coverage report shows four key metrics:

- **Lines**: Percentage of code lines executed during tests
- **Branches**: Percentage of conditional branches taken (if/else, switch, ternary, etc.)
- **Functions**: Percentage of functions/methods called during tests
- **Statements**: Percentage of JavaScript statements executed

**Example:** A function with an if/else has 2 branches. If only the if block runs in tests, branch coverage is 50%.

#### Coverage Report Files

Coverage reports are generated in the `coverage/` directory:

```
coverage/
├── index.html              # Main HTML report (open in browser)
├── lcov-report/            # Detailed HTML reports per file
├── lcov.info               # LCOV format for CI/CD tools and badge generation
└── coverage-final.json     # JSON format for programmatic access
```

**Note:** The `coverage/` directory is excluded from git (see `.gitignore`) to prevent committing large report files.

### Test Environment

- **Framework:** Jest 30.2.0
- **React Testing:** React Testing Library 16.3.0
- **Environment:** jsdom (browser-like DOM API)
- **TypeScript:** Full support with strict mode enabled
- **Next.js:** Compatible with Next.js 16 App Router

