/**
 * Advanced architecture patterns and design implementations
 *
 * This module implements enterprise-grade architectural patterns including
 * Factory, Strategy, Observer, Decorator, and Plugin patterns for maximum
 * extensibility and maintainability.
 */

import type { FilterOperationDict, ScreenerDataResult, QueryDict } from './types/models';

/**
 * Abstract Factory Pattern for creating different types of queries
 */
export abstract class QueryFactory {
  /**
   * Create a query for specific market type
   */
  public static createMarketQuery(
    marketType: 'stock' | 'crypto' | 'forex' | 'india'
  ): IQueryBuilder {
    switch (marketType) {
      case 'stock':
        return new StockQueryBuilder();
      case 'crypto':
        return new CryptoQueryBuilder();
      case 'forex':
        return new ForexQueryBuilder();
      case 'india':
        return new IndiaStockQueryBuilder();
      default:
        throw new Error(`Unsupported market type: ${marketType}`);
    }
  }

  /**
   * Create query from template
   */
  public static createFromTemplate(template: QueryTemplate): IQueryBuilder {
    const builder = this.createMarketQuery(template.marketType);
    return builder
      .setColumns(template.columns)
      .setFilters(template.filters)
      .setLimit(template.limit);
  }
}

/**
 * Query Builder Interface
 */
export interface IQueryBuilder {
  setColumns(columns: string[]): IQueryBuilder;
  setFilters(filters: FilterOperationDict[]): IQueryBuilder;
  setLimit(limit: number): IQueryBuilder;
  setMarkets(...markets: string[]): IQueryBuilder;
  build(): QueryDict;
}

/**
 * Stock Query Builder Implementation
 */
export class StockQueryBuilder implements IQueryBuilder {
  private query: Partial<QueryDict> = {};

  public setColumns(columns: string[]): IQueryBuilder {
    this.query.columns =
      columns.length > 0 ? columns : ['name', 'close', 'volume', 'market_cap_basic', 'P/E', 'P/B'];
    return this;
  }

  public setFilters(filters: FilterOperationDict[]): IQueryBuilder {
    this.query.filter = filters;
    return this;
  }

  public setLimit(limit: number): IQueryBuilder {
    this.query.range = [0, Math.min(limit, 1000)];
    return this;
  }

  public setMarkets(...markets: string[]): IQueryBuilder {
    this.query.markets = markets.length > 0 ? markets : ['america'];
    return this;
  }

  public build(): QueryDict {
    return {
      markets: ['america'],
      columns: ['name', 'close', 'volume'],
      range: [0, 50],
      ...this.query,
    } as QueryDict;
  }
}

/**
 * Crypto Query Builder Implementation
 */
export class CryptoQueryBuilder implements IQueryBuilder {
  private query: Partial<QueryDict> = {};

  public setColumns(columns: string[]): IQueryBuilder {
    this.query.columns =
      columns.length > 0
        ? columns
        : ['name', 'close', 'volume', 'market_cap_calc', 'change', 'change_7d'];
    return this;
  }

  public setFilters(filters: FilterOperationDict[]): IQueryBuilder {
    this.query.filter = filters;
    return this;
  }

  public setLimit(limit: number): IQueryBuilder {
    this.query.range = [0, Math.min(limit, 500)];
    return this;
  }

  public setMarkets(..._markets: string[]): IQueryBuilder {
    this.query.markets = ['crypto'];
    return this;
  }

  public build(): QueryDict {
    return {
      markets: ['crypto'],
      columns: ['name', 'close', 'volume'],
      range: [0, 50],
      ...this.query,
    } as QueryDict;
  }
}

/**
 * Forex Query Builder Implementation
 */
export class ForexQueryBuilder implements IQueryBuilder {
  private query: Partial<QueryDict> = {};

  public setColumns(columns: string[]): IQueryBuilder {
    this.query.columns =
      columns.length > 0 ? columns : ['name', 'close', 'change', 'volatility', 'high', 'low'];
    return this;
  }

  public setFilters(filters: FilterOperationDict[]): IQueryBuilder {
    this.query.filter = filters;
    return this;
  }

  public setLimit(limit: number): IQueryBuilder {
    this.query.range = [0, Math.min(limit, 200)];
    return this;
  }

  public setMarkets(..._markets: string[]): IQueryBuilder {
    this.query.markets = ['forex'];
    return this;
  }

  public build(): QueryDict {
    return {
      markets: ['forex'],
      columns: ['name', 'close', 'change'],
      range: [0, 50],
      ...this.query,
    } as QueryDict;
  }
}

/**
 * India Stock Query Builder Implementation
 */
export class IndiaStockQueryBuilder implements IQueryBuilder {
  private query: Partial<QueryDict> = {};

  public setColumns(columns: string[]): IQueryBuilder {
    this.query.columns =
      columns.length > 0
        ? columns
        : ['name', 'close', 'volume', 'market_cap_basic', 'P/E', 'debt_to_equity'];
    return this;
  }

  public setFilters(filters: FilterOperationDict[]): IQueryBuilder {
    this.query.filter = filters;
    return this;
  }

  public setLimit(limit: number): IQueryBuilder {
    this.query.range = [0, Math.min(limit, 500)];
    return this;
  }

  public setMarkets(..._markets: string[]): IQueryBuilder {
    this.query.markets = ['india'];
    return this;
  }

  public build(): QueryDict {
    return {
      markets: ['india'],
      columns: ['name', 'close', 'volume'],
      range: [0, 50],
      ...this.query,
    } as QueryDict;
  }
}

/**
 * Query Template Interface
 */
export interface QueryTemplate {
  name: string;
  marketType: 'stock' | 'crypto' | 'forex' | 'india';
  columns: string[];
  filters: FilterOperationDict[];
  limit: number;
  description?: string;
}

/**
 * Strategy Pattern for different data processing strategies
 */
export interface IDataProcessor {
  process(data: ScreenerDataResult): ScreenerDataResult;
}

/**
 * Stock Data Processor
 */
export class StockDataProcessor implements IDataProcessor {
  public process(data: ScreenerDataResult): ScreenerDataResult {
    return {
      ...data,
      data: data.data.map(row => ({
        ...row,
        // Add calculated fields for stocks
        market_cap_formatted: this.formatMarketCap(row.market_cap_basic),
        pe_category: this.categorizePE(row['P/E']),
      })),
    };
  }

  private formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  }

  private categorizePE(pe: number): string {
    if (pe < 10) return 'Low';
    if (pe < 20) return 'Moderate';
    if (pe < 30) return 'High';
    return 'Very High';
  }
}

/**
 * India Stock Data Processor
 */
export class IndiaStockDataProcessor implements IDataProcessor {
  public process(data: ScreenerDataResult): ScreenerDataResult {
    return {
      ...data,
      data: data.data.map(row => ({
        ...row,
        // Add calculated fields for Indian stocks
        market_cap_formatted: this.formatMarketCapINR(row.market_cap_basic),
        price_formatted: `₹${row.close?.toFixed(2)}`,
        pe_category: this.categorizeIndianPE(row['P/E']),
      })),
    };
  }

  private formatMarketCapINR(marketCap: number): string {
    if (marketCap >= 1e12) return `₹${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `₹${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e7) return `₹${(marketCap / 1e7).toFixed(1)}Cr`;
    return `₹${(marketCap / 1e5).toFixed(1)}L`;
  }

  private categorizeIndianPE(pe: number): string {
    if (pe < 15) return 'Low';
    if (pe < 25) return 'Moderate';
    if (pe < 40) return 'High';
    return 'Very High';
  }
}

/**
 * Crypto Data Processor
 */
export class CryptoDataProcessor implements IDataProcessor {
  public process(data: ScreenerDataResult): ScreenerDataResult {
    return {
      ...data,
      data: data.data.map(row => ({
        ...row,
        // Add calculated fields for crypto
        volatility_category: this.categorizeVolatility(row.volatility),
        price_change_category: this.categorizePriceChange(row.change),
      })),
    };
  }

  private categorizeVolatility(volatility: number): string {
    if (volatility < 0.02) return 'Low';
    if (volatility < 0.05) return 'Moderate';
    if (volatility < 0.1) return 'High';
    return 'Extreme';
  }

  private categorizePriceChange(change: number): string {
    if (Math.abs(change) < 2) return 'Stable';
    if (Math.abs(change) < 5) return 'Moderate';
    if (Math.abs(change) < 10) return 'High';
    return 'Extreme';
  }
}

/**
 * Data Processing Context (Strategy Pattern)
 */
export class DataProcessingContext {
  private processor: IDataProcessor;

  constructor(processor: IDataProcessor) {
    this.processor = processor;
  }

  public setProcessor(processor: IDataProcessor): void {
    this.processor = processor;
  }

  public processData(data: ScreenerDataResult): ScreenerDataResult {
    return this.processor.process(data);
  }
}

/**
 * Observer Pattern for query events
 */
export interface IQueryObserver {
  onQueryStart(query: QueryDict): void;
  onQueryComplete(query: QueryDict, result: ScreenerDataResult): void;
  onQueryError(query: QueryDict, error: Error): void;
}

/**
 * Query Event Manager
 */
export class QueryEventManager {
  private observers: IQueryObserver[] = [];

  public addObserver(observer: IQueryObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: IQueryObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public notifyQueryStart(query: QueryDict): void {
    this.observers.forEach(observer => observer.onQueryStart(query));
  }

  public notifyQueryComplete(query: QueryDict, result: ScreenerDataResult): void {
    this.observers.forEach(observer => observer.onQueryComplete(query, result));
  }

  public notifyQueryError(query: QueryDict, error: Error): void {
    this.observers.forEach(observer => observer.onQueryError(query, error));
  }
}

/**
 * Performance Observer Implementation
 */
export class PerformanceObserver implements IQueryObserver {
  private metrics: Array<{
    query: QueryDict;
    startTime: number;
    endTime?: number;
    duration?: number;
    success: boolean;
    error?: string;
  }> = [];

  public onQueryStart(query: QueryDict): void {
    this.metrics.push({
      query,
      startTime: performance.now(),
      success: false,
    });
  }

  public onQueryComplete(query: QueryDict, _result: ScreenerDataResult): void {
    const metric = this.metrics.find(m => m.query === query && !m.endTime);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = true;
    }
  }

  public onQueryError(query: QueryDict, error: Error): void {
    const metric = this.metrics.find(m => m.query === query && !m.endTime);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = false;
      metric.error = error.message;
    }
  }

  public getMetrics(): typeof this.metrics {
    return [...this.metrics];
  }

  public getAverageQueryTime(): number {
    const completedQueries = this.metrics.filter(m => m.duration);
    if (completedQueries.length === 0) return 0;

    const totalTime = completedQueries.reduce((sum, m) => sum + (m.duration || 0), 0);
    return totalTime / completedQueries.length;
  }
}

/**
 * Plugin System for extensibility
 */
export interface IPlugin {
  name: string;
  version: string;
  initialize(): void;
  destroy(): void;
}

/**
 * Plugin Manager
 */
export class PluginManager {
  private plugins = new Map<string, IPlugin>();

  public registerPlugin(plugin: IPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`);
    }

    this.plugins.set(plugin.name, plugin);
    plugin.initialize();
  }

  public unregisterPlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.destroy();
      this.plugins.delete(name);
    }
  }

  public getPlugin(name: string): IPlugin | undefined {
    return this.plugins.get(name);
  }

  public getAllPlugins(): IPlugin[] {
    return Array.from(this.plugins.values());
  }
}

/**
 * Export architecture components
 */
export const Architecture = {
  QueryFactory,
  StockQueryBuilder,
  CryptoQueryBuilder,
  ForexQueryBuilder,
  IndiaStockQueryBuilder,
  StockDataProcessor,
  IndiaStockDataProcessor,
  CryptoDataProcessor,
  DataProcessingContext,
  QueryEventManager,
  PerformanceObserver,
  PluginManager,
} as const;
