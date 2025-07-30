/**
 * Advanced testing utilities and mock data
 *
 * This module provides comprehensive testing utilities, mock data generators,
 * and test helpers to achieve 100% test coverage and quality assurance.
 */

import type { ScreenerDataResult, FilterOperationDict, QueryDict } from './types/models';

/**
 * Mock data generator for testing
 */
export class MockDataGenerator {
  /**
   * Generate mock stock data
   */
  public static generateMockStockData(count: number = 10): ScreenerDataResult {
    const data = Array.from({ length: count }, (_, index) => ({
      name: `Stock ${index + 1}`,
      close: Math.random() * 1000 + 10,
      volume: Math.floor(Math.random() * 10000000) + 100000,
      market_cap_basic: Math.floor(Math.random() * 100000000000) + 1000000000,
      'P/E': Math.random() * 50 + 5,
      'P/B': Math.random() * 10 + 0.5,
      RSI: Math.random() * 100,
      'MACD.macd': Math.random() * 2 - 1,
      'MACD.signal': Math.random() * 2 - 1,
      change: Math.random() * 20 - 10,
      sector: ['Technology', 'Healthcare', 'Finance', 'Energy'][Math.floor(Math.random() * 4)],
      country: ['US', 'India', 'UK', 'Germany'][Math.floor(Math.random() * 4)],
    }));

    return {
      totalCount: count,
      data,
    };
  }

  /**
   * Generate mock crypto data
   */
  public static generateMockCryptoData(count: number = 10): ScreenerDataResult {
    const cryptos = ['Bitcoin', 'Ethereum', 'Cardano', 'Solana', 'Polygon', 'Chainlink'];

    const data = Array.from({ length: count }, (_, index) => ({
      name: cryptos[index % cryptos.length] || `Crypto ${index + 1}`,
      close: Math.random() * 50000 + 100,
      volume: Math.floor(Math.random() * 1000000000) + 10000000,
      market_cap_calc: Math.floor(Math.random() * 1000000000000) + 1000000000,
      change: Math.random() * 40 - 20,
      change_7d: Math.random() * 60 - 30,
      change_30d: Math.random() * 100 - 50,
      volatility: Math.random() * 0.1 + 0.01,
    }));

    return {
      totalCount: count,
      data,
    };
  }

  /**
   * Generate mock India stock data
   */
  public static generateMockIndiaStockData(count: number = 10): ScreenerDataResult {
    const indianStocks = ['Reliance', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank', 'Bharti Airtel'];

    const data = Array.from({ length: count }, (_, index) => ({
      name: indianStocks[index % indianStocks.length] || `Indian Stock ${index + 1}`,
      close: Math.random() * 5000 + 100, // INR prices
      volume: Math.floor(Math.random() * 5000000) + 50000,
      market_cap_basic: Math.floor(Math.random() * 500000000000) + 10000000000, // INR market cap
      'P/E': Math.random() * 40 + 8,
      'P/B': Math.random() * 8 + 0.5,
      debt_to_equity: Math.random() * 2,
      RSI: Math.random() * 100,
      change: Math.random() * 15 - 7.5,
      sector: ['IT', 'Banking', 'Oil & Gas', 'Telecom', 'Pharma'][Math.floor(Math.random() * 5)],
      exchange: ['NSE', 'BSE'][Math.floor(Math.random() * 2)],
    }));

    return {
      totalCount: count,
      data,
    };
  }

  /**
   * Generate mock filter operation
   */
  public static generateMockFilter(): FilterOperationDict {
    const operations = ['greater', 'less', 'equal', 'between', 'in_range'];
    const fields = ['close', 'volume', 'market_cap_basic', 'P/E', 'RSI'];

    return {
      left: fields[Math.floor(Math.random() * fields.length)],
      operation: operations[Math.floor(Math.random() * operations.length)] as any,
      right: Math.random() * 1000,
    };
  }

  /**
   * Generate mock query
   */
  public static generateMockQuery(): QueryDict {
    return {
      markets: ['america', 'india'][Math.floor(Math.random() * 2)] ? ['america'] : ['india'],
      columns: ['name', 'close', 'volume', 'market_cap_basic'],
      sort: {
        sortBy: 'volume',
        sortOrder: 'desc',
      },
      range: [0, 50],
      filter: [this.generateMockFilter()],
    };
  }
}

/**
 * Test utilities for assertions and validations
 */
export class TestUtils {
  /**
   * Assert that data matches expected structure
   */
  public static assertScreenerDataStructure(data: any): asserts data is ScreenerDataResult {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data must be an object');
    }

    if (typeof data.totalCount !== 'number') {
      throw new Error('totalCount must be a number');
    }

    if (!Array.isArray(data.data)) {
      throw new Error('data must be an array');
    }

    // Validate each row
    data.data.forEach((row: any, index: number) => {
      if (typeof row !== 'object' || row === null) {
        throw new Error(`Row ${index} must be an object`);
      }
    });
  }

  /**
   * Assert that filter operation is valid
   */
  public static assertValidFilter(filter: any): asserts filter is FilterOperationDict {
    if (typeof filter !== 'object' || filter === null) {
      throw new Error('Filter must be an object');
    }

    if (typeof filter.left !== 'string') {
      throw new Error('Filter left must be a string');
    }

    if (typeof filter.operation !== 'string') {
      throw new Error('Filter operation must be a string');
    }

    const validOperations = [
      'greater',
      'egreater',
      'less',
      'eless',
      'equal',
      'nequal',
      'in_range',
      'not_in_range',
      'match',
      'nmatch',
      'crosses',
    ];

    if (!validOperations.includes(filter.operation)) {
      throw new Error(`Invalid operation: ${filter.operation}`);
    }
  }

  /**
   * Measure execution time
   */
  public static async measureExecutionTime<T>(
    fn: () => Promise<T>
  ): Promise<{ result: T; executionTime: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    return {
      result,
      executionTime: end - start,
    };
  }

  /**
   * Create performance benchmark
   */
  public static async benchmark<T>(
    name: string,
    fn: () => Promise<T>,
    iterations: number = 10
  ): Promise<{
    name: string;
    iterations: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
  }> {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const { executionTime } = await this.measureExecutionTime(fn);
      times.push(executionTime);
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    return {
      name,
      iterations,
      averageTime,
      minTime,
      maxTime,
      totalTime,
    };
  }

  /**
   * Validate API response structure
   */
  public static validateApiResponse(response: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      this.assertScreenerDataStructure(response);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    // Check for reasonable data
    if (response?.totalCount > 10000) {
      warnings.push('Large totalCount may indicate overly broad query');
    }

    if (response?.data?.length === 0) {
      warnings.push('No data returned - query may be too restrictive');
    }

    // Check for data consistency
    if (response?.data?.length > 0) {
      const firstRow = response.data[0];
      const keys = Object.keys(firstRow);

      response.data.forEach((row: any, index: number) => {
        const rowKeys = Object.keys(row);
        if (rowKeys.length !== keys.length) {
          warnings.push(`Row ${index} has different number of fields`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate test report
   */
  public static generateTestReport(results: any[]): {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    coverage: number;
    duration: number;
    summary: string;
  } {
    const totalTests = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const duration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

    // Mock coverage calculation (in real scenario, this would come from coverage tools)
    const coverage = (passed / totalTests) * 100;

    const summary = `${passed}/${totalTests} tests passed (${((passed / totalTests) * 100).toFixed(1)}%)`;

    return {
      totalTests,
      passed,
      failed,
      skipped,
      coverage,
      duration,
      summary,
    };
  }
}

/**
 * Mock HTTP client for testing
 */
export class MockHttpClient {
  private responses = new Map<string, any>();
  private requestLog: Array<{ url: string; config: any; timestamp: number }> = [];

  /**
   * Set mock response for URL
   */
  public setMockResponse(url: string, response: any): void {
    this.responses.set(url, response);
  }

  /**
   * Mock HTTP request
   */
  public async request(url: string, config: any = {}): Promise<any> {
    this.requestLog.push({
      url,
      config,
      timestamp: Date.now(),
    });

    const response = this.responses.get(url);
    if (!response) {
      throw new Error(`No mock response configured for ${url}`);
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

    return response;
  }

  /**
   * Get request log
   */
  public getRequestLog(): Array<{ url: string; config: any; timestamp: number }> {
    return [...this.requestLog];
  }

  /**
   * Clear request log
   */
  public clearLog(): void {
    this.requestLog.length = 0;
  }

  /**
   * Reset all mocks
   */
  public reset(): void {
    this.responses.clear();
    this.clearLog();
  }
}

/**
 * Test data fixtures
 */
export const TestFixtures = {
  /**
   * Sample stock data
   */
  stockData: MockDataGenerator.generateMockStockData(50),

  /**
   * Sample crypto data
   */
  cryptoData: MockDataGenerator.generateMockCryptoData(20),

  /**
   * Sample India stock data
   */
  indiaStockData: MockDataGenerator.generateMockIndiaStockData(30),

  /**
   * Sample error responses
   */
  errorResponses: {
    networkError: new Error('Network connection failed'),
    timeoutError: new Error('Request timeout'),
    authError: new Error('Authentication required'),
    rateLimitError: new Error('Rate limit exceeded'),
    serverError: new Error('Server error'),
  },

  /**
   * Sample queries
   */
  sampleQueries: {
    basicStock: {
      markets: ['america'],
      columns: ['name', 'close', 'volume'],
      range: [0, 50],
    },
    indiaStock: {
      markets: ['india'],
      columns: ['name', 'close', 'volume', 'market_cap_basic'],
      range: [0, 30],
    },
    crypto: {
      markets: ['crypto'],
      columns: ['name', 'close', 'volume', 'market_cap_calc'],
      range: [0, 20],
    },
  },
} as const;

/**
 * Export testing utilities
 */
export const Testing = {
  MockDataGenerator,
  TestUtils,
  MockHttpClient,
  TestFixtures,
} as const;
