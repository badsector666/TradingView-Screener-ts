/**
 * Constants for TradingView Screener TypeScript
 *
 * This module exports all constants used throughout the library,
 * including markets, asset classes, and other configuration values.
 *
 * Ported directly from Python version to maintain 100% compatibility.
 */

// Export all market-related constants
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
  type Market,
  type MarketTuple,
  type AssetClass,
  type CountryMarket,
} from './markets';

// Re-export default markets list
export { default as MARKETS_DEFAULT } from './markets';
