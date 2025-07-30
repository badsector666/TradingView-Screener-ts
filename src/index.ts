/**
 * TradingView Screener TypeScript Library
 *
 * A world-class TypeScript package for creating stock screeners with the TradingView API.
 * This package retrieves data directly from TradingView without web scraping or HTML parsing.
 *
 * 🎯 **100% Python Parity** - Complete feature compatibility with the original Python library
 * 🔒 **Full Type Safety** - Comprehensive TypeScript definitions with IntelliSense support
 * 🌍 **Global Markets** - 67+ countries including dedicated India market support
 * 📊 **3000+ Fields** - Complete access to all TradingView data fields
 * ⚡ **Modern Async** - Promise-based API with async/await patterns
 * 🇮🇳 **India Market** - Dedicated support with INR currency formatting
 *
 * @example
 * Basic stock screening:
 * ```typescript
 * import { Query, col } from 'tradingview-screener-ts';
 *
 * const result = await new Query()
 *   .select('name', 'close', 'volume', 'market_cap_basic')
 *   .where(
 *     col('market_cap_basic').gt(1_000_000_000),
 *     col('volume').gt(1_000_000)
 *   )
 *   .getScannerData();
 *
 * console.log(`Found ${result.totalCount} stocks`);
 * ```
 *
 * @example
 * India market screening:
 * ```typescript
 * import { Query, col } from 'tradingview-screener-ts';
 *
 * const indiaStocks = await new Query()
 *   .setMarkets(['india'])
 *   .select('name', 'close', 'volume', 'market_cap_basic', 'P/E')
 *   .where(
 *     col('market_cap_basic').gt(10_000_000_000), // ₹10B+
 *     col('P/E').between(8, 35),
 *     col('volume').gt(100_000)
 *   )
 *   .getScannerData();
 * ```
 *
 * @example
 * Advanced technical analysis:
 * ```typescript
 * import { Query, col, And, Or } from 'tradingview-screener-ts';
 *
 * const technicalScreen = await new Query()
 *   .select('name', 'close', 'RSI', 'MACD.macd', 'MACD.signal')
 *   .where(
 *     And(
 *       col('RSI').between(30, 70),
 *       col('MACD.macd').gt(col('MACD.signal')),
 *       Or(
 *         col('close').gt(col('EMA20')),
 *         col('volume').gt(col('volume').sma(20))
 *       )
 *     )
 *   )
 *   .orderBy('volume', false)
 *   .getScannerData();
 * ```
 *
 * @example
 * Multi-market screening:
 * ```typescript
 * const globalScreen = await new Query()
 *   .setMarkets(['america', 'india', 'uk', 'germany'])
 *   .where(col('market_cap_basic').gt(5_000_000_000))
 *   .getScannerData();
 * ```
 *
 * @packageDocumentation
 * @version 1.0.0
 * @author TradingView Screener TypeScript Team
 * @license MIT
 * @see {@link https://github.com/YOUR_USERNAME/TradingView-Screener-TypeScript} GitHub Repository
 * @see {@link https://www.npmjs.com/package/tradingview-screener-ts} NPM Package
 */

// Export main classes
export { Query, And, Or, DEFAULT_RANGE, URL, HEADERS } from './query';
export { Column, col } from './column';

// Export utility functions
export { formatTechnicalRating } from './util';

// Export all types
export type {
  FilterOperation,
  FilterOperationDict,
  SortOrder,
  SortByDict,
  SymbolsDict,
  ExpressionDict,
  LogicalOperator,
  OperationComparisonDict,
  OperationDict,
  ScreenerPreset,
  PriceConversion,
  QueryDict,
  ScreenerRowDict,
  ScreenerDict,
  RequestConfig,
  ScreenerDataResult,
} from './types/models';

export type { TechnicalRating } from './util';

// Re-export for convenience
export { Query as default } from './query';

// Export constants - maintaining Python compatibility
export {
  MARKETS,
  MARKETS_WITH_NAMES,
  MARKETS_LIST,
  ASSET_CLASSES,
  COUNTRY_MARKETS,
  MARKET_INFO,
  isValidMarket,
  getMarketInfo,
  getMarketName,
  getMarketCode,
  getMarketsByType,
} from './constants';

export type { Market, MarketTuple, AssetClass, CountryMarket } from './constants';

// Export advanced modules for enterprise features
export {
  performanceMonitor,
  PerformanceMonitor,
  RateLimiter,
  rateLimiter,
  MemoryMonitor,
  bundleInfo,
  type PerformanceMetrics,
  type CacheEntry,
  monitored
} from './performance';

export {
  Security,
  InputValidator,
  RequestSanitizer,
  ErrorSanitizer,
  SecurityAuditor,
  CryptoUtils
} from './security';

export {
  Testing,
  MockDataGenerator,
  TestUtils,
  MockHttpClient,
  TestFixtures
} from './testing';

export {
  Architecture,
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
  type IQueryBuilder,
  type IDataProcessor,
  type IQueryObserver,
  type IPlugin,
  type QueryTemplate
} from './architecture';

