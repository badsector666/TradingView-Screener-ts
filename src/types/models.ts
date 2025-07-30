/**
 * Type definitions for TradingView Screener API
 * Ported from Python TypedDict definitions to TypeScript interfaces
 */

/**
 * Available filter operations for screening
 */
export type FilterOperation =
  | 'greater'
  | 'egreater'
  | 'less'
  | 'eless'
  | 'equal'
  | 'nequal'
  | 'in_range' // equivalent to SQL `BETWEEN` or `IN (...)`
  | 'not_in_range'
  | 'empty'
  | 'nempty'
  | 'crosses'
  | 'crosses_above'
  | 'crosses_below'
  | 'match' // the same as: `LOWER(col) LIKE '%pattern%'`
  | 'nmatch' // not match
  | 'smatch' // simple match, does the same thing as `match`
  | 'has' // set must contain one of the values
  | 'has_none_of' // set must NOT contain ANY of the values
  | 'above%'
  | 'below%'
  | 'in_range%'
  | 'not_in_range%'
  | 'in_day_range'
  | 'in_week_range'
  | 'in_month_range';

/**
 * Filter operation dictionary structure
 */
export interface FilterOperationDict {
  left: string;
  operation: FilterOperation;
  right?: any; // optional when the operation is `empty` or `nempty`
}

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortByDict {
  sortBy: string;
  sortOrder: SortOrder;
  nullsFirst?: boolean;
}

/**
 * Symbol query configuration
 */
export interface SymbolsDict {
  query?: {
    types: string[];
  };
  tickers?: string[];
  symbolset?: string[];
  watchlist?: {
    id: number;
  };
  groups?: Array<{
    type: string;
    values: string;
  }>;
}

/**
 * Expression wrapper for filter operations
 */
export interface ExpressionDict {
  expression: FilterOperationDict;
}

/**
 * Logical operator for combining operations
 */
export type LogicalOperator = 'and' | 'or';

/**
 * Operation comparison structure for AND/OR logic
 */
export interface OperationComparisonDict {
  operator: LogicalOperator;
  operands: Array<OperationDict | ExpressionDict>;
}

/**
 * Operation wrapper
 */
export interface OperationDict {
  operation: OperationComparisonDict;
}

/**
 * Available presets for screening
 */
export type ScreenerPreset = 'index_components_market_pages' | 'pre-market-gainers';

/**
 * Price conversion configuration
 */
export type PriceConversion =
  | { to_symbol: boolean }
  | { to_currency: string }; // currency should be in lower-case

/**
 * Complete query structure for the TradingView API
 */
export interface QueryDict {
  markets?: string[];
  symbols?: SymbolsDict;
  options?: Record<string, any>; // example: `{"options": {"lang": "en"}}`
  columns?: string[];
  filter?: FilterOperationDict[];
  filter2?: OperationComparisonDict;
  sort?: SortByDict;
  range?: [number, number]; // tuple with two integers, i.e. `[0, 100]`
  ignore_unknown_fields?: boolean; // default false
  preset?: ScreenerPreset; // there are many other presets
  price_conversion?: PriceConversion;
}

/**
 * Individual row in screener response
 */
export interface ScreenerRowDict {
  s: string; // symbol (NASDAQ:AAPL)
  d: any[]; // data, list of values
}

/**
 * Complete screener API response
 */
export interface ScreenerDict {
  totalCount: number;
  data: ScreenerRowDict[];
}

/**
 * HTTP request configuration
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  cookies?: Record<string, string> | string;
  [key: string]: any;
}

/**
 * Screener data result tuple equivalent
 */
export interface ScreenerDataResult {
  totalCount: number;
  data: Array<Record<string, any>>;
}
