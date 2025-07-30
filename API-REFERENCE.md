# 📖 API Reference - TradingView Screener API

## 🚀 Quick Start

```bash
npm install tradingview-screener-ts
```

```typescript
import { Query, Column, col, And, Or } from 'tradingview-screener-ts';

const result = await new Query().select('name', 'close', 'volume').getScannerData();
```

---

## 📋 Table of Contents

- [Core Classes](#core-classes)
- [Query Methods](#query-methods)
- [Column Operations](#column-operations)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Constants](#constants)
- [Examples](#examples)

---

## 🏗️ Core Classes

### **Query Class**

The main class for building and executing screener queries.

```typescript
class Query {
  constructor();

  // Selection methods
  select(...columns: string[]): Query;

  // Filtering methods
  where(...filters: FilterOperationDict[]): Query;
  where2(operation: OperationDict): Query;

  // Sorting and pagination
  orderBy(column: string, ascending?: boolean): Query;
  limit(count: number): Query;
  offset(count: number): Query;

  // Market and symbol selection
  setMarkets(...markets: string[]): Query;
  setTickers(tickers: string[]): Query;
  setIndex(index: string): Query;

  // Execution methods
  getScannerData(): Promise<ScreenerDataResult>;
  getScannerDataRaw(): Promise<any>;

  // Utility methods
  copy(): Query;
  toString(): string;
  equals(other: Query): boolean;
}
```

### **Column Class**

Represents a data column with filtering operations.

```typescript
class Column {
  constructor(name: string);

  // Comparison operations
  gt(value: any): FilterOperationDict; // Greater than
  gte(value: any): FilterOperationDict; // Greater than or equal
  lt(value: any): FilterOperationDict; // Less than
  lte(value: any): FilterOperationDict; // Less than or equal
  eq(value: any): FilterOperationDict; // Equal to
  ne(value: any): FilterOperationDict; // Not equal to

  // Range operations
  between(min: any, max: any): FilterOperationDict;
  notBetween(min: any, max: any): FilterOperationDict;

  // Set operations
  isin(values: any[]): FilterOperationDict;
  notIn(values: any[]): FilterOperationDict;
  has(values: any[]): FilterOperationDict;
  hasNoneOf(values: any[]): FilterOperationDict;

  // Time-based operations
  inDayRange(days: number): FilterOperationDict;
  inWeekRange(weeks: number): FilterOperationDict;
  inMonthRange(months: number): FilterOperationDict;

  // Percentage operations
  abovePct(percentage: number): FilterOperationDict;
  belowPct(percentage: number): FilterOperationDict;
  betweenPct(min: number, max: number): FilterOperationDict;
  notBetweenPct(min: number, max: number): FilterOperationDict;

  // String operations
  like(pattern: string): FilterOperationDict;
  notLike(pattern: string): FilterOperationDict;

  // Null operations
  empty(): FilterOperationDict;
  notEmpty(): FilterOperationDict;

  // Technical analysis
  crosses(other: Column | number): FilterOperationDict;
  crossesAbove(other: Column | number): FilterOperationDict;
  crossesBelow(other: Column | number): FilterOperationDict;
}
```

---

## 🔍 Query Methods

### **Selection Methods**

#### `select(...columns: string[]): Query`

Specify which columns to include in the results.

```typescript
const query = new Query().select('name', 'close', 'volume', 'market_cap_basic');
```

### **Filtering Methods**

#### `where(...filters: FilterOperationDict[]): Query`

Add filtering conditions (AND logic).

```typescript
const query = new Query().where(
  col('market_cap_basic').gt(1_000_000_000),
  col('volume').gt(1_000_000)
);
```

#### `where2(operation: OperationDict): Query`

Add complex filtering with AND/OR logic.

```typescript
const query = new Query().where2(
  And(col('market_cap_basic').gt(1_000_000_000), Or(col('P/E').lt(15), col('P/B').lt(2)))
);
```

### **Sorting and Pagination**

#### `orderBy(column: string, ascending?: boolean): Query`

Sort results by a column.

```typescript
// Descending order (default)
const query = new Query().orderBy('volume');

// Ascending order
const query = new Query().orderBy('volume', true);
```

#### `limit(count: number): Query`

Limit the number of results.

```typescript
const query = new Query().limit(50);
```

#### `offset(count: number): Query`

Skip a number of results (pagination).

```typescript
const query = new Query().offset(100).limit(50); // Results 101-150
```

### **Market Selection**

#### `setMarkets(...markets: string[]): Query`

Filter by specific markets.

```typescript
// Single market
const query = new Query().setMarkets('america');

// Multiple markets
const query = new Query().setMarkets('america', 'india', 'uk');

// Asset classes
const query = new Query().setMarkets('crypto', 'forex');
```

#### `setTickers(tickers: string[]): Query`

Filter by specific ticker symbols.

```typescript
const query = new Query().setTickers(['AAPL', 'GOOGL', 'MSFT']);
```

### **Execution Methods**

#### `getScannerData(): Promise<ScreenerDataResult>`

Execute the query and return structured results.

```typescript
const result = await query.getScannerData();
console.log(`Found ${result.totalCount} results`);
result.data.forEach(row => console.log(row));
```

#### `getScannerDataRaw(): Promise<any>`

Execute the query and return raw API response.

```typescript
const rawResult = await query.getScannerDataRaw();
```

---

## 🔧 Column Operations

### **Comparison Operations**

```typescript
// Numeric comparisons
col('close').gt(100); // Price > $100
col('volume').gte(1_000_000); // Volume >= 1M
col('P/E').lt(20); // P/E < 20
col('RSI').lte(70); // RSI <= 70
col('change').eq(0); // No change
col('beta').ne(1); // Beta ≠ 1
```

### **Range Operations**

```typescript
// Value ranges
col('P/E').between(10, 25); // P/E between 10-25
col('RSI').notBetween(20, 80); // RSI outside 20-80
col('market_cap_basic').between(1e9, 10e9); // Market cap 1B-10B
```

### **Set Operations**

```typescript
// Value sets
col('sector').isin(['Technology', 'Healthcare']);
col('exchange').notIn(['OTC', 'PINK']);
col('typespecs').has(['common']);
col('typespecs').hasNoneOf(['preferred']);
```

### **Technical Analysis**

```typescript
// Moving average crossovers
col('close').crossesAbove(col('SMA20')); // Price crosses above 20-day SMA
col('MACD.macd').crosses(col('MACD.signal')); // MACD crossover
col('RSI').crossesBelow(70); // RSI crosses below 70
```

---

## 🛠️ Utility Functions

### **Logical Operations**

#### `And(...conditions: FilterOperationDict[]): OperationDict`

Combine conditions with AND logic.

```typescript
And(
  col('market_cap_basic').gt(1_000_000_000),
  col('P/E').between(10, 25),
  col('volume').gt(1_000_000)
);
```

#### `Or(...conditions: FilterOperationDict[]): OperationDict`

Combine conditions with OR logic.

```typescript
Or(col('P/E').lt(15), col('P/B').lt(2), col('debt_to_equity').lt(0.5));
```

### **Helper Functions**

#### `col(name: string): Column`

Shorthand for creating Column instances.

```typescript
// These are equivalent:
new Column('close').gt(100);
col('close').gt(100);
```

#### `formatTechnicalRating(rating: number): string`

Format technical rating values.

```typescript
formatTechnicalRating(0.8); // "Strong Buy"
formatTechnicalRating(0.3); // "Buy"
formatTechnicalRating(-0.3); // "Sell"
```

---

## 📊 Type Definitions

### **Core Interfaces**

```typescript
interface ScreenerDataResult {
  totalCount: number;
  data: Record<string, any>[];
}

interface FilterOperationDict {
  left: string;
  operation: FilterOperation;
  right?: any;
}

interface OperationDict {
  operation: LogicalOperation;
  operands: (FilterOperationDict | OperationDict)[];
}

interface QueryDict {
  markets?: string[];
  symbols?: SymbolsDict;
  columns?: string[];
  sort?: SortByDict;
  range?: [number, number];
  filter?: FilterOperationDict[];
  filter2?: OperationDict;
  options?: Record<string, any>;
}
```

### **Enum Types**

```typescript
type FilterOperation =
  | 'greater'
  | 'egreater'
  | 'less'
  | 'eless'
  | 'equal'
  | 'nequal'
  | 'in_range'
  | 'not_in_range'
  | 'match'
  | 'nmatch'
  | 'in_day_range'
  | 'in_week_range'
  | 'in_month_range'
  | 'crosses'
  | 'crosses_above'
  | 'crosses_below'
  | 'above_pct'
  | 'below_pct'
  | 'between_pct'
  | 'not_between_pct'
  | 'empty'
  | 'nempty';

type LogicalOperation = 'and' | 'or';

type Market =
  | 'america'
  | 'india'
  | 'uk'
  | 'germany'
  | 'japan'
  | 'crypto'
  | 'forex'
  | 'futures'
  | 'bonds'
  | 'options';
// ... and 60+ more markets
```

---

## 🌍 Constants

### **Available Markets**

```typescript
import { MARKETS, MARKETS_LIST, ASSET_CLASSES } from 'tradingview-screener-ts';

// All markets with display names
MARKETS.forEach(([displayName, marketCode]) => {
  console.log(`${displayName} -> ${marketCode}`);
});

// Just market codes
console.log(MARKETS_LIST); // ['america', 'india', 'uk', ...]

// Asset classes only
console.log(ASSET_CLASSES); // ['crypto', 'forex', 'futures', ...]
```

---

## 💡 Examples

### **Basic Stock Screening**

```typescript
import { Query, col } from 'tradingview-screener-ts';

const basicScreen = await new Query()
  .select('name', 'close', 'volume', 'market_cap_basic')
  .where(col('market_cap_basic').gt(1_000_000_000), col('volume').gt(1_000_000))
  .orderBy('volume', false)
  .limit(50)
  .getScannerData();
```

### **India Market Screening**

```typescript
const indiaScreen = await new Query()
  .setMarkets('india')
  .select('name', 'close', 'volume', 'market_cap_basic', 'P/E')
  .where(
    col('market_cap_basic').gt(10_000_000_000), // ₹10B+
    col('P/E').between(8, 35),
    col('volume').gt(100_000)
  )
  .getScannerData();
```

### **Technical Analysis Screening**

```typescript
import { And, Or } from 'tradingview-screener-ts';

const technicalScreen = await new Query()
  .select('name', 'close', 'RSI', 'MACD.macd', 'MACD.signal')
  .where2(
    And(
      col('RSI').between(30, 70),
      col('MACD.macd').gt(col('MACD.signal')),
      Or(col('close').gt(col('EMA20')), col('volume').gt(col('volume').sma(20)))
    )
  )
  .getScannerData();
```

---

## 🔗 Additional Resources

- **[Field References](FIELD-REFERENCES.md)** - Complete field documentation
- **[Migration Guide](MIGRATION.md)** - Python to TypeScript migration
- **[Examples](examples/)** - Practical usage examples
- **[GitHub Repository](https://github.com/YOUR_USERNAME/TradingView-Screener-TypeScript)**

---

> **💡 Pro Tip**: Use TypeScript's IntelliSense to explore available methods and get real-time documentation while coding!
