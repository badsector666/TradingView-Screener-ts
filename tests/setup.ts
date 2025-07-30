/**
 * Jest test setup file
 */

// Set longer timeout for API calls
jest.setTimeout(30000);

// Mock console.warn to reduce noise in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});

// Global test configuration
global.testConfig = {
  timeout: 30000,
  skipLiveTests: process.env.SKIP_LIVE_TESTS === 'true',
};
