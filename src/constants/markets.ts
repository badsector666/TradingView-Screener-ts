/**
 * Available markets and asset classes for TradingView Screener
 *
 * This file provides a list of supported TradingView market codes and human-friendly names.
 * These can be used for country/region selection and with the setMarkets() method.
 *
 * Ported directly from Python version: markets_list.py
 */

/**
 * List of supported TradingView market codes and human-friendly names.
 * Exact port from Python MARKETS list - maintains same structure and order.
 *
 * Format: [display_name, market_code]
 */
export const MARKETS = [
  ['United States', 'america'],
  ['Canada', 'canada'],
  ['Brazil', 'brazil'],
  ['Mexico', 'mexico'],
  ['United Kingdom', 'uk'],
  ['Germany', 'germany'],
  ['France', 'france'],
  ['Italy', 'italy'],
  ['Spain', 'spain'],
  ['Netherlands', 'netherlands'],
  ['Switzerland', 'switzerland'],
  ['Sweden', 'sweden'],
  ['Norway', 'norway'],
  ['Finland', 'finland'],
  ['Denmark', 'denmark'],
  ['Belgium', 'belgium'],
  ['Austria', 'austria'],
  ['Poland', 'poland'],
  ['Portugal', 'portugal'],
  ['Greece', 'greece'],
  ['Hungary', 'hungary'],
  ['Czech Republic', 'czech'],
  ['Russia', 'russia'],
  ['Turkey', 'turkey'],
  ['Israel', 'israel'],
  ['Japan', 'japan'],
  ['China', 'china'],
  ['Hong Kong', 'hongkong'],
  ['India', 'india'],
  ['Singapore', 'singapore'],
  ['South Korea', 'korea'],
  ['Taiwan', 'taiwan'],
  ['Australia', 'australia'],
  ['New Zealand', 'newzealand'],
  ['South Africa', 'southafrica'],
  ['Egypt', 'egypt'],
  ['Nigeria', 'nigeria'],
  // Asset classes (not countries)
  ['Crypto', 'crypto'],
  ['Forex', 'forex'],
  ['Coin', 'coin'],
  ['CFD', 'cfd'],
  ['Futures', 'futures'],
  ['Bonds', 'bonds'],
  ['Economy', 'economy'],
  ['Options', 'options'],
] as const;

/**
 * Type for the MARKETS tuple structure
 */
export type MarketTuple = readonly [string, string];

/**
 * Type for market codes (extracted from MARKETS)
 */
export type Market = (typeof MARKETS)[number][1];

/**
 * Markets with names - object mapping market codes to display names
 * Derived from the MARKETS array for easy lookup
 */
export const MARKETS_WITH_NAMES: Record<string, string> = Object.fromEntries(MARKETS);

/**
 * List of just the market codes (for backward compatibility)
 */
export const MARKETS_LIST: readonly string[] = MARKETS.map(([, code]) => code);

/**
 * Asset classes extracted from MARKETS (items marked as asset classes in Python)
 */
export const ASSET_CLASSES: readonly string[] = [
  'crypto',
  'forex',
  'coin',
  'cfd',
  'futures',
  'bonds',
  'economy',
  'options',
] as const;

/**
 * Country markets extracted from MARKETS (excluding asset classes)
 */
export const COUNTRY_MARKETS: readonly string[] = [
  'america',
  'canada',
  'brazil',
  'mexico',
  'uk',
  'germany',
  'france',
  'italy',
  'spain',
  'netherlands',
  'switzerland',
  'sweden',
  'norway',
  'finland',
  'denmark',
  'belgium',
  'austria',
  'poland',
  'portugal',
  'greece',
  'hungary',
  'czech',
  'russia',
  'turkey',
  'israel',
  'japan',
  'china',
  'hongkong',
  'india',
  'singapore',
  'korea',
  'taiwan',
  'australia',
  'newzealand',
  'southafrica',
  'egypt',
  'nigeria',
] as const;

/**
 * Type definitions for market categories
 */
export type AssetClass = (typeof ASSET_CLASSES)[number];
export type CountryMarket = (typeof COUNTRY_MARKETS)[number];

/**
 * Market information with descriptions - generated from MARKETS array
 */
export const MARKET_INFO: Record<
  string,
  { name: string; description: string; type: 'asset_class' | 'country' }
> = {
  // Asset Classes
  bonds: { name: 'Bonds', description: 'Government and corporate bonds', type: 'asset_class' },
  cfd: { name: 'CFD', description: 'Contracts for Difference', type: 'asset_class' },
  coin: { name: 'Coin', description: 'Cryptocurrency coins', type: 'asset_class' },
  crypto: { name: 'Crypto', description: 'Cryptocurrency markets', type: 'asset_class' },
  forex: { name: 'Forex', description: 'Foreign exchange currency pairs', type: 'asset_class' },
  futures: { name: 'Futures', description: 'Futures contracts', type: 'asset_class' },
  economy: { name: 'Economy', description: 'Economic indicators', type: 'asset_class' },
  options: { name: 'Options', description: 'Options contracts', type: 'asset_class' },

  // Countries - using exact names from Python MARKETS
  america: {
    name: 'United States',
    description: 'US stock markets (NYSE, NASDAQ, AMEX)',
    type: 'country',
  },
  canada: { name: 'Canada', description: 'Canadian stock markets', type: 'country' },
  brazil: { name: 'Brazil', description: 'Brazilian stock markets', type: 'country' },
  mexico: { name: 'Mexico', description: 'Mexican stock markets', type: 'country' },
  uk: { name: 'United Kingdom', description: 'UK stock markets', type: 'country' },
  germany: { name: 'Germany', description: 'German stock markets', type: 'country' },
  france: { name: 'France', description: 'French stock markets', type: 'country' },
  italy: { name: 'Italy', description: 'Italian stock markets', type: 'country' },
  spain: { name: 'Spain', description: 'Spanish stock markets', type: 'country' },
  netherlands: { name: 'Netherlands', description: 'Dutch stock markets', type: 'country' },
  switzerland: { name: 'Switzerland', description: 'Swiss stock markets', type: 'country' },
  sweden: { name: 'Sweden', description: 'Swedish stock markets', type: 'country' },
  norway: { name: 'Norway', description: 'Norwegian stock markets', type: 'country' },
  finland: { name: 'Finland', description: 'Finnish stock markets', type: 'country' },
  denmark: { name: 'Denmark', description: 'Danish stock markets', type: 'country' },
  belgium: { name: 'Belgium', description: 'Belgian stock markets', type: 'country' },
  austria: { name: 'Austria', description: 'Austrian stock markets', type: 'country' },
  poland: { name: 'Poland', description: 'Polish stock markets', type: 'country' },
  portugal: { name: 'Portugal', description: 'Portuguese stock markets', type: 'country' },
  greece: { name: 'Greece', description: 'Greek stock markets', type: 'country' },
  hungary: { name: 'Hungary', description: 'Hungarian stock markets', type: 'country' },
  czech: { name: 'Czech Republic', description: 'Czech stock markets', type: 'country' },
  russia: { name: 'Russia', description: 'Russian stock markets', type: 'country' },
  turkey: { name: 'Turkey', description: 'Turkish stock markets', type: 'country' },
  israel: { name: 'Israel', description: 'Israeli stock markets', type: 'country' },
  japan: { name: 'Japan', description: 'Japanese stock markets', type: 'country' },
  china: { name: 'China', description: 'Chinese stock markets', type: 'country' },
  hongkong: { name: 'Hong Kong', description: 'Hong Kong stock markets', type: 'country' },
  india: { name: 'India', description: 'Indian stock markets', type: 'country' },
  singapore: { name: 'Singapore', description: 'Singapore stock markets', type: 'country' },
  korea: { name: 'South Korea', description: 'South Korean stock markets', type: 'country' },
  taiwan: { name: 'Taiwan', description: 'Taiwan stock markets', type: 'country' },
  australia: { name: 'Australia', description: 'Australian stock markets', type: 'country' },
  newzealand: { name: 'New Zealand', description: 'New Zealand stock markets', type: 'country' },
  southafrica: {
    name: 'South Africa',
    description: 'South African stock markets',
    type: 'country',
  },
  egypt: { name: 'Egypt', description: 'Egyptian stock markets', type: 'country' },
  nigeria: { name: 'Nigeria', description: 'Nigerian stock markets', type: 'country' },
};

/**
 * Helper function to validate if a market is supported
 * @param market - Market code to validate
 * @returns True if market is supported
 */
export function isValidMarket(market: string): market is Market {
  return MARKETS_LIST.includes(market);
}

/**
 * Helper function to get market information
 * @param market - Market code
 * @returns Market information or undefined if not found
 */
export function getMarketInfo(market: string) {
  return MARKET_INFO[market];
}

/**
 * Helper function to get market display name from code
 * @param marketCode - Market code
 * @returns Display name or undefined if not found
 */
export function getMarketName(marketCode: string): string | undefined {
  return MARKETS_WITH_NAMES[marketCode];
}

/**
 * Helper function to get market code from display name
 * @param displayName - Display name
 * @returns Market code or undefined if not found
 */
export function getMarketCode(displayName: string): string | undefined {
  const entry = MARKETS.find(([name]) => name === displayName);
  return entry?.[1];
}

/**
 * Helper function to get markets by type
 * @param type - Type of markets to get
 * @returns Array of market codes of the specified type
 */
export function getMarketsByType(type: 'asset_class' | 'country'): string[] {
  return Object.entries(MARKET_INFO)
    .filter(([, info]) => info.type === type)
    .map(([market]) => market);
}

/**
 * Default export for convenience - the main MARKETS array
 */
export default MARKETS;
