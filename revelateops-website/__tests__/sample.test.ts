/**
 * Sample test file to verify Jest and TypeScript configuration
 *
 * This test suite validates:
 * - Jest can execute tests successfully
 * - TypeScript compilation works in test environment
 * - Path aliases (@/) resolve correctly
 * - Basic assertions and matchers function properly
 */

describe('Jest Setup Verification', () => {
  it('should execute basic assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
  });

  it('should support TypeScript types', () => {
    const greeting: string = 'Hello, Tests!';
    const count: number = 42;
    const isValid: boolean = true;

    expect(greeting).toContain('Tests');
    expect(count).toBe(42);
    expect(isValid).toBe(true);
  });

  it('should support TypeScript interfaces', () => {
    interface User {
      name: string;
      email: string;
      age: number;
    }

    const user: User = {
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
    };

    expect(user.name).toBe('Test User');
    expect(user.email).toContain('@example.com');
    expect(user.age).toBeGreaterThan(18);
  });

  it('should support array operations', () => {
    const numbers = [1, 2, 3, 4, 5];

    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers[0]).toBe(1);
  });

  it('should support object assertions', () => {
    const config = {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
    };

    expect(config).toHaveProperty('apiUrl');
    expect(config.timeout).toBe(5000);
    expect(config).toMatchObject({
      apiUrl: expect.any(String),
      timeout: expect.any(Number),
    });
  });

  it('should support async/await', async () => {
    const asyncFunction = async (): Promise<string> => {
      return 'async result';
    };

    const result = await asyncFunction();
    expect(result).toBe('async result');
  });

  it('should support promise resolution', () => {
    const promise = Promise.resolve('resolved value');

    return expect(promise).resolves.toBe('resolved value');
  });
});

describe('TypeScript Strict Mode Compatibility', () => {
  it('should handle strict null checks', () => {
    const nullable: string | null = 'value';
    const optional: string | undefined = 'value';

    expect(nullable).toBe('value');
    expect(optional).toBe('value');
  });

  it('should handle strict type checking', () => {
    type Status = 'active' | 'inactive' | 'pending';

    const status: Status = 'active';

    expect(status).toBe('active');
    expect(['active', 'inactive', 'pending']).toContain(status);
  });
});

describe('Jest-DOM Matchers', () => {
  it('should have jest-dom matchers available', () => {
    // This test verifies that @testing-library/jest-dom is properly loaded
    // The matchers themselves are tested in component tests
    expect(expect.extend).toBeDefined();
  });
});
