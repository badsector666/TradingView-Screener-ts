import axios, { AxiosRequestConfig, AxiosResponse } from 'redaxios';
import { Column } from './column';
import {
  QueryDict,
  SortByDict,
  ScreenerDict,
  FilterOperationDict,
  OperationDict,
  ExpressionDict,
  LogicalOperator,
  RequestConfig,
  ScreenerDataResult,
} from './types/models';

/**
 * Default range for query results
 */
export const DEFAULT_RANGE: [number, number] = [0, 50];

/**
 * TradingView scanner API URL template
 */
export const URL = 'https://scanner.tradingview.com/{market}/scan';

/**
 * Default HTTP headers for API requests
 */
export const HEADERS: Record<string, string> = {
  authority: 'scanner.tradingview.com',
  'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
  accept: 'text/plain, */*; q=0.01',
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'sec-ch-ua-mobile': '?0',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' +
    'Chrome/98.0.4758.102 Safari/537.36',
  'sec-ch-ua-platform': '"Windows"',
  origin: 'https://www.tradingview.com',
  'sec-fetch-site': 'same-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  referer: 'https://www.tradingview.com/',
  'accept-language': 'en-US,en;q=0.9,it;q=0.8',
};

/**
 * Implementation for AND/OR chaining of expressions
 * @param expressions - Array of filter expressions
 * @param operator - Logical operator ('and' or 'or')
 * @returns Operation dictionary
 */
function implAndOrChaining(
  expressions: Array<FilterOperationDict | OperationDict>,
  operator: LogicalOperator
): OperationDict {
  // We want to wrap all the `FilterOperationDict` expressions with `{'expression': expr}`,
  // to know if it's an instance of `FilterOperationDict` we simply check if it has the `left` key,
  // which no other interface has.
  const operands: Array<OperationDict | ExpressionDict> = [];

  for (const expr of expressions) {
    if ('left' in expr) {
      // if it's a FilterOperationDict
      operands.push({ expression: expr });
    } else {
      operands.push(expr);
    }
  }

  return { operation: { operator, operands } };
}

/**
 * Combines multiple expressions with AND logic
 * @param expressions - Filter expressions to combine
 * @returns Combined operation dictionary
 */
export function And(...expressions: Array<FilterOperationDict | OperationDict>): OperationDict {
  return implAndOrChaining(expressions, 'and');
}

/**
 * Combines multiple expressions with OR logic
 * @param expressions - Filter expressions to combine
 * @returns Combined operation dictionary
 */
export function Or(...expressions: Array<FilterOperationDict | OperationDict>): OperationDict {
  return implAndOrChaining(expressions, 'or');
}

/**
 * This class allows you to perform SQL-like queries on the TradingView stock screener.
 *
 * The `Query` object represents a query that can be made to the official TradingView API, and it
 * stores all the data as JSON internally.
 *
 * @example
 * To perform a simple query all you have to do is:
 * ```typescript
 * import { Query } from 'tradingview-screener-ts';
 *
 * const result = await new Query().getScannerData();
 * console.log(result);
 * // {
 * //   totalCount: 18060,
 * //   data: [
 * //     { ticker: 'AMEX:SPY', name: 'SPY', close: 410.68, volume: 107367671, market_cap_basic: null },
 * //     { ticker: 'NASDAQ:QQQ', name: 'QQQ', close: 345.31, volume: 63475390, market_cap_basic: null },
 * //     // ... more rows
 * //   ]
 * // }
 * ```
 *
 * The `getScannerData()` method will return an object with `totalCount` (like a `COUNT(*)`) and
 * `data` array containing the actual results.
 *
 * By default, the `Query` will select the columns: `name`, `close`, `volume`, `market_cap_basic`,
 * but you can override that:
 *
 * @example
 * ```typescript
 * const result = await new Query()
 *   .select('open', 'high', 'low', 'VWAP', 'MACD.macd', 'RSI', 'Price to Earnings Ratio (TTM)')
 *   .getScannerData();
 * ```
 *
 * You can find 250+ columns available in the TradingView documentation.
 *
 * Now let's do some queries using the `WHERE` statement, select all the stocks that the `close` is
 * bigger or equal than 350:
 *
 * @example
 * ```typescript
 * import { Query, Column } from 'tradingview-screener-ts';
 *
 * const result = await new Query()
 *   .select('close', 'volume', '52 Week High')
 *   .where(new Column('close').gte(350))
 *   .getScannerData();
 * ```
 *
 * You can even use other columns in these kind of operations:
 *
 * @example
 * ```typescript
 * const result = await new Query()
 *   .select('close', 'VWAP')
 *   .where(new Column('close').gte(new Column('VWAP')))
 *   .getScannerData();
 * ```
 */
export class Query {
  private query: QueryDict;
  private url: string;

  /**
   * Creates a new Query instance with default configuration
   */
  constructor() {
    this.query = {
      markets: ['america'],
      symbols: { query: { types: [] }, tickers: [] },
      options: { lang: 'en' },
      columns: ['name', 'close', 'volume', 'market_cap_basic'],
      sort: { sortBy: 'Value.Traded', sortOrder: 'desc' },
      range: [...DEFAULT_RANGE],
    };
    this.url = 'https://scanner.tradingview.com/america/scan';
  }

  /**
   * Select specific columns to retrieve
   * @param columns - Column names or Column instances to select
   * @returns This Query instance for method chaining
   */
  public select(...columns: Array<Column | string>): this {
    this.query.columns = columns.map(col => (col instanceof Column ? col.name : col));
    return this;
  }

  /**
   * Filter screener results (expressions are joined with the AND operator)
   * @param expressions - Filter expressions to apply
   * @returns This Query instance for method chaining
   */
  public where(...expressions: FilterOperationDict[]): this {
    this.query.filter = [...expressions];
    return this;
  }

  /**
   * Filter screener using AND/OR operators (nested expressions also allowed)
   *
   * Rules:
   * 1. The argument passed to `where2()` **must** be wrapped in `And()` or `Or()`.
   * 2. `And()` and `Or()` can accept one or more conditions as arguments.
   * 3. Conditions can be simple (e.g., `new Column('field').eq('value')`) or complex, allowing nesting of `And()` and `Or()` to create intricate logical filters.
   * 4. Unlike the `where()` method, which only supports chaining conditions with the `AND` operator, `where2()` allows mixing and nesting of `AND` and `OR` operators.
   *
   * @param operation - Operation dictionary with AND/OR logic
   * @returns This Query instance for method chaining
   *
   * @example
   * Combining conditions with `OR` and nested `AND`:
   * ```typescript
   * import { Query, And, Or, col } from 'tradingview-screener-ts';
   *
   * const result = await new Query()
   *   .select('type', 'typespecs')
   *   .where2(
   *     Or(
   *       And(col('type').eq('stock'), col('typespecs').has(['common', 'preferred'])),
   *       And(col('type').eq('fund'), col('typespecs').hasNoneOf(['etf'])),
   *       col('type').eq('dr')
   *     )
   *   )
   *   .getScannerData();
   * ```
   */
  public where2(operation: OperationDict): this {
    this.query.filter2 = operation.operation;
    return this;
  }

  /**
   * Applies sorting to the query results based on the specified column
   * @param column - Column to sort by
   * @param ascending - Sort order (true for ascending, false for descending)
   * @param nullsFirst - Whether to place null values first
   * @returns This Query instance for method chaining
   *
   * @example
   * ```typescript
   * new Query().orderBy('volume', false)  // sort descending
   * new Query().orderBy('close', true)
   * new Query().orderBy('dividends_yield_current', false, false)
   * ```
   */
  public orderBy(
    column: Column | string,
    ascending: boolean = true,
    nullsFirst: boolean = false
  ): this {
    const sortDict: SortByDict = {
      sortBy: column instanceof Column ? column.name : column,
      sortOrder: ascending ? 'asc' : 'desc',
      nullsFirst,
    };
    this.query.sort = sortDict;
    return this;
  }

  /**
   * Limit the number of results
   * @param limit - Maximum number of results to return
   * @returns This Query instance for method chaining
   */
  public limit(limit: number): this {
    if (!this.query.range) {
      this.query.range = [...DEFAULT_RANGE];
    }
    this.query.range[1] = limit;
    return this;
  }

  /**
   * Skip a number of results (pagination)
   * @param offset - Number of results to skip
   * @returns This Query instance for method chaining
   */
  public offset(offset: number): this {
    if (!this.query.range) {
      this.query.range = [...DEFAULT_RANGE];
    }
    this.query.range[0] = offset;
    return this;
  }

  /**
   * Set the markets to query
   * @param markets - Market names to include
   * @returns This Query instance for method chaining
   *
   * @example
   * ```typescript
   * // Single market
   * new Query().setMarkets('italy')
   *
   * // Multiple markets
   * new Query().setMarkets('america', 'israel', 'hongkong', 'switzerland')
   *
   * // Different asset classes
   * new Query().setMarkets('cfd', 'crypto', 'forex', 'futures')
   * ```
   */
  public setMarkets(...markets: string[]): this {
    if (markets.length === 1) {
      const market = markets[0]!;
      this.url = URL.replace('{market}', market);
      this.query.markets = [market];
    } else {
      this.url = URL.replace('{market}', 'global');
      this.query.markets = [...markets];
    }
    return this;
  }

  /**
   * Set specific tickers to query
   * @param tickers - Ticker symbols to include (format: 'EXCHANGE:SYMBOL')
   * @returns This Query instance for method chaining
   *
   * @example
   * ```typescript
   * new Query().setTickers('NASDAQ:TSLA')
   * new Query().setTickers('NYSE:GME', 'AMEX:SPY', 'MIL:RACE', 'HOSE:VIX')
   * ```
   */
  public setTickers(...tickers: string[]): this {
    if (!this.query.symbols) {
      this.query.symbols = {};
    }
    this.query.symbols.tickers = [...tickers];
    this.setMarkets(); // Reset markets to global
    return this;
  }

  /**
   * Scan only equities that are in the given index (or indexes)
   * @param indexes - Index symbols to filter by
   * @returns This Query instance for method chaining
   *
   * @example
   * ```typescript
   * new Query().setIndex('SYML:SP;SPX')
   * new Query().setIndex('SYML:NSE;NIFTY', 'SYML:TVC;UKX')
   * ```
   */
  public setIndex(...indexes: string[]): this {
    this.query.preset = 'index_components_market_pages';
    if (!this.query.symbols) {
      this.query.symbols = {};
    }
    this.query.symbols.symbolset = [...indexes];
    this.setMarkets(); // Reset markets to global
    return this;
  }

  /**
   * Set a custom property on the query
   * @param key - Property key
   * @param value - Property value
   * @returns This Query instance for method chaining
   */
  public setProperty(key: string, value: any): this {
    (this.query as any)[key] = value;
    return this;
  }

  /**
   * Perform a POST web-request and return the raw data from the API
   * @param config - Additional request configuration
   * @returns Raw API response
   *
   * @example
   * ```typescript
   * const rawData = await new Query()
   *   .select('close', 'volume')
   *   .limit(5)
   *   .getScannerDataRaw();
   *
   * console.log(rawData);
   * // {
   * //   totalCount: 17559,
   * //   data: [
   * //     { s: 'NASDAQ:NVDA', d: [116.14, 312636630] },
   * //     { s: 'AMEX:SPY', d: [542.04, 52331224] },
   * //     // ...
   * //   ]
   * // }
   * ```
   */
  public async getScannerDataRaw(config: RequestConfig = {}): Promise<ScreenerDict> {
    if (!this.query.range) {
      this.query.range = [...DEFAULT_RANGE];
    }

    const requestConfig: AxiosRequestConfig = {
      headers: { ...HEADERS, ...config.headers },
      timeout: config.timeout || 20000,
      ...config,
    };

    // Handle cookies
    if (config.cookies) {
      if (typeof config.cookies === 'string') {
        requestConfig.headers!['Cookie'] = config.cookies;
      } else {
        const cookieString = Object.entries(config.cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
        requestConfig.headers!['Cookie'] = cookieString;
      }
    }

    try {
      const response: AxiosResponse<ScreenerDict> = await axios.post(
        this.url,
        this.query,
        requestConfig
      );
      return response.data;
    } catch (error: unknown) { // Explicitly type error as unknown
      // Check if it's an error with a response property (likely an HTTP error)
      if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object') {
        const httpError = error as any; // Cast to any to access response properties safely
        const errorMessage = `HTTP ${httpError.response.status}: ${httpError.response.statusText}\nBody: ${JSON.stringify(httpError.response.data)}`;
        throw new Error(errorMessage);
      }
      // If it's not an Error instance at all, re-throw as is
      throw error;
    }
  }

  /**
   * Perform a POST web-request and return the data from the API as a structured result
   * @param config - Additional request configuration
   * @returns Structured result with totalCount and data array
   *
   * @example
   * ```typescript
   * const result = await new Query()
   *   .select('name', 'close', 'volume')
   *   .where(new Column('close').gte(100))
   *   .getScannerData();
   *
   * console.log(`Found ${result.totalCount} results`);
   * result.data.forEach(row => {
   *   console.log(`${row.name}: $${row.close}`);
   * });
   * ```
   */
  public async getScannerData(config: RequestConfig = {}): Promise<ScreenerDataResult> {
    const jsonObj = await this.getScannerDataRaw(config);
    const rowsCount = jsonObj.totalCount;
    const data = jsonObj.data;

    // Add null check here
    if (!data) {
      return {
        totalCount: rowsCount,
        data: []
      };
    }

    const columns = this.query.columns || [];
    const structuredData = data.map(row => {
      const result: Record<string, any> = { ticker: row.s };
      columns.forEach((column, index) => {
        result[column] = row.d[index];
      });
      return result;
    });

    return {
      totalCount: rowsCount,
      data: structuredData,
    };
  }

  /**
   * Create a copy of this Query
   * @returns New Query instance with copied configuration
   */
  public copy(): Query {
    const newQuery = new Query();
    newQuery.query = JSON.parse(JSON.stringify(this.query));
    newQuery.url = this.url;
    return newQuery;
  }

  /**
   * Get the current query configuration
   * @returns Current query dictionary
   */
  public getQuery(): QueryDict {
    return JSON.parse(JSON.stringify(this.query));
  }

  /**
   * Get the current URL
   * @returns Current API URL
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * String representation of the Query
   * @returns Formatted string representation
   */
  public toString(): string {
    return `Query(\n  ${JSON.stringify(this.query, null, 2)}\n  url=${this.url}\n)`;
  }

  /**
   * Check equality with another Query
   * @param other - Other Query to compare with
   * @returns True if queries are equal
   */
  public equals(other: Query): boolean {
    return JSON.stringify(this.query) === JSON.stringify(other.query) && this.url === other.url;
  }
}
