import { FilterOperationDict } from './types/models';

/**
 * A Column object represents a field in the TradingView stock screener,
 * and it's used in SELECT queries and WHERE queries with the `Query` object.
 *
 * A `Column` supports all the comparison operations:
 * `<`, `<=`, `>`, `>=`, `==`, `!=`, and also other methods like `between()`, `isin()`, etc.
 *
 * @example
 * Some of the operations you can do:
 * ```typescript
 * new Column('close').gt(2.5)
 * new Column('High.All').lte('high')
 * new Column('high').gt('VWAP')
 * new Column('high').gt(new Column('VWAP'))  // same thing as above
 * new Column('is_primary').eq(true)
 * new Column('exchange').ne('OTC')
 *
 * new Column('close').abovePct('VWAP', 1.03)
 * new Column('close').abovePct('price_52_week_low', 2.5)
 * new Column('close').belowPct('VWAP', 1.03)
 * new Column('close').betweenPct('EMA200', 1.2, 1.5)
 * new Column('close').notBetweenPct('EMA200', 1.2, 1.5)
 *
 * new Column('close').between(2.5, 15)
 * new Column('close').between('EMA5', 'EMA20')
 *
 * new Column('type').isin(['stock', 'fund'])
 * new Column('exchange').isin(['AMEX', 'NASDAQ', 'NYSE'])
 * new Column('sector').notIn(['Health Technology', 'Health Services'])
 * new Column('typespecs').has(['common'])
 * new Column('typespecs').hasNoneOf(['reit', 'etn', 'etf'])
 *
 * new Column('description').like('apple')  // the same as `description LIKE '%apple%'`
 * new Column('premarket_change').notEmpty()  // same as `Column('premarket_change') != null`
 * new Column('earnings_release_next_trading_date_fq').inDayRange(0, 0)  // same day
 * ```
 */
export class Column {
  public readonly name: string;

  /**
   * Creates a new Column instance
   * @param name - The name of the column/field
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Extracts the name from a Column object or returns the value as-is
   * @param obj - Column instance or any other value
   * @returns The column name or the original value
   */
  private static extractName(obj: any): any {
    if (obj instanceof Column) {
      return obj.name;
    }
    return obj;
  }

  /**
   * Greater than comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public gt(other: any): FilterOperationDict {
    return { left: this.name, operation: 'greater', right: Column.extractName(other) };
  }

  /**
   * Greater than or equal comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public gte(other: any): FilterOperationDict {
    return { left: this.name, operation: 'egreater', right: Column.extractName(other) };
  }

  /**
   * Less than comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public lt(other: any): FilterOperationDict {
    return { left: this.name, operation: 'less', right: Column.extractName(other) };
  }

  /**
   * Less than or equal comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public lte(other: any): FilterOperationDict {
    return { left: this.name, operation: 'eless', right: Column.extractName(other) };
  }

  /**
   * Equal comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public eq(other: any): FilterOperationDict {
    return { left: this.name, operation: 'equal', right: Column.extractName(other) };
  }

  /**
   * Not equal comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public ne(other: any): FilterOperationDict {
    return { left: this.name, operation: 'nequal', right: Column.extractName(other) };
  }

  /**
   * Crosses comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public crosses(other: any): FilterOperationDict {
    return { left: this.name, operation: 'crosses', right: Column.extractName(other) };
  }

  /**
   * Crosses above comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public crossesAbove(other: any): FilterOperationDict {
    return { left: this.name, operation: 'crosses_above', right: Column.extractName(other) };
  }

  /**
   * Crosses below comparison
   * @param other - Value or Column to compare against
   * @returns Filter operation dictionary
   */
  public crossesBelow(other: any): FilterOperationDict {
    return { left: this.name, operation: 'crosses_below', right: Column.extractName(other) };
  }

  /**
   * Between range comparison
   * @param left - Lower bound
   * @param right - Upper bound
   * @returns Filter operation dictionary
   */
  public between(left: any, right: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_range',
      right: [Column.extractName(left), Column.extractName(right)],
    };
  }

  /**
   * Not between range comparison
   * @param left - Lower bound
   * @param right - Upper bound
   * @returns Filter operation dictionary
   */
  public notBetween(left: any, right: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'not_in_range',
      right: [Column.extractName(left), Column.extractName(right)],
    };
  }

  /**
   * Is in values comparison
   * @param values - Array of values to check against
   * @returns Filter operation dictionary
   */
  public isin(values: any[]): FilterOperationDict {
    return { left: this.name, operation: 'in_range', right: [...values] };
  }

  /**
   * Not in values comparison
   * @param values - Array of values to check against
   * @returns Filter operation dictionary
   */
  public notIn(values: any[]): FilterOperationDict {
    return { left: this.name, operation: 'not_in_range', right: [...values] };
  }

  /**
   * Field contains any of the values
   * (it's the same as `isin()`, except that it works on fields of type `set`)
   * @param values - Value or array of values
   * @returns Filter operation dictionary
   */
  public has(values: string | string[]): FilterOperationDict {
    return { left: this.name, operation: 'has', right: values };
  }

  /**
   * Field doesn't contain any of the values
   * (it's the same as `notIn()`, except that it works on fields of type `set`)
   * @param values - Value or array of values
   * @returns Filter operation dictionary
   */
  public hasNoneOf(values: string | string[]): FilterOperationDict {
    return { left: this.name, operation: 'has_none_of', right: values };
  }

  /**
   * In day range comparison
   * @param a - Start day
   * @param b - End day
   * @returns Filter operation dictionary
   */
  public inDayRange(a: number, b: number): FilterOperationDict {
    return { left: this.name, operation: 'in_day_range', right: [a, b] };
  }

  /**
   * In week range comparison
   * @param a - Start week
   * @param b - End week
   * @returns Filter operation dictionary
   */
  public inWeekRange(a: number, b: number): FilterOperationDict {
    return { left: this.name, operation: 'in_week_range', right: [a, b] };
  }

  /**
   * In month range comparison
   * @param a - Start month
   * @param b - End month
   * @returns Filter operation dictionary
   */
  public inMonthRange(a: number, b: number): FilterOperationDict {
    return { left: this.name, operation: 'in_month_range', right: [a, b] };
  }

  /**
   * Above percentage comparison
   * @param column - Column or field name to compare against
   * @param pct - Percentage threshold
   * @returns Filter operation dictionary
   * @example
   * The closing price is higher than the VWAP by more than 3%
   * ```typescript
   * new Column('close').abovePct('VWAP', 1.03)
   * ```
   *
   * Closing price is above the 52-week-low by more than 150%
   * ```typescript
   * new Column('close').abovePct('price_52_week_low', 2.5)
   * ```
   */
  public abovePct(column: Column | string, pct: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'above%',
      right: [Column.extractName(column), pct],
    };
  }

  /**
   * Below percentage comparison
   * @param column - Column or field name to compare against
   * @param pct - Percentage threshold
   * @returns Filter operation dictionary
   * @example
   * The closing price is lower than the VWAP by 3% or more
   * ```typescript
   * new Column('close').belowPct('VWAP', 1.03)
   * ```
   */
  public belowPct(column: Column | string, pct: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'below%',
      right: [Column.extractName(column), pct],
    };
  }

  /**
   * Between percentage comparison
   * @param column - Column or field name to compare against
   * @param pct1 - First percentage threshold
   * @param pct2 - Second percentage threshold (optional)
   * @returns Filter operation dictionary
   * @example
   * The percentage change between the Close and the EMA is between 20% and 50%
   * ```typescript
   * new Column('close').betweenPct('EMA200', 1.2, 1.5)
   * ```
   */
  public betweenPct(column: Column | string, pct1: number, pct2?: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_range%',
      right: [Column.extractName(column), pct1, pct2],
    };
  }

  /**
   * Not between percentage comparison
   * @param column - Column or field name to compare against
   * @param pct1 - First percentage threshold
   * @param pct2 - Second percentage threshold (optional)
   * @returns Filter operation dictionary
   * @example
   * The percentage change between the Close and the EMA is NOT between 20% and 50%
   * ```typescript
   * new Column('close').notBetweenPct('EMA200', 1.2, 1.5)
   * ```
   */
  public notBetweenPct(column: Column | string, pct1: number, pct2?: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'not_in_range%',
      right: [Column.extractName(column), pct1, pct2],
    };
  }

  /**
   * Like pattern matching
   * @param other - Pattern to match
   * @returns Filter operation dictionary
   */
  public like(other: any): FilterOperationDict {
    return { left: this.name, operation: 'match', right: Column.extractName(other) };
  }

  /**
   * Not like pattern matching
   * @param other - Pattern to not match
   * @returns Filter operation dictionary
   */
  public notLike(other: any): FilterOperationDict {
    return { left: this.name, operation: 'nmatch', right: Column.extractName(other) };
  }

  /**
   * Empty check
   * @returns Filter operation dictionary
   */
  public empty(): FilterOperationDict {
    return { left: this.name, operation: 'empty', right: null };
  }

  /**
   * Not empty check
   * This method can be used to check if a field is not null/undefined.
   * @returns Filter operation dictionary
   */
  public notEmpty(): FilterOperationDict {
    return { left: this.name, operation: 'nempty', right: null };
  }

  /**
   * String representation of the Column
   * @returns String representation
   */
  public toString(): string {
    return `Column(${this.name})`;
  }
}

/**
 * Short alias for Column constructor for convenience
 * @param name - The name of the column/field
 * @returns New Column instance
 */
export const col = (name: string): Column => new Column(name);
