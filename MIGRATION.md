# Migration Guide: Python to TypeScript

This guide helps you migrate from the Python version of TradingView Screener to the TypeScript version.

## Overview

The TypeScript version maintains the same core functionality as the Python version while adapting to JavaScript/TypeScript conventions and providing full type safety.

## Key Differences

### 1. Installation

**Python:**

```bash
pip install tradingview-screener
```

**TypeScript:**

```bash
npm install tradingview-screener
```

### 2. Imports

**Python:**

```python
from tradingview_screener import Query, Column, col, And, Or
```

**TypeScript:**

```typescript
import { Query, Column, col, And, Or } from 'tradingview-screener';
```

### 3. Async/Await

**Python (Synchronous):**

```python
result = Query().get_scanner_data()
```

**TypeScript (Asynchronous):**

```typescript
const result = await new Query().getScannerData();
```

### 4. Method Names

Python uses `snake_case`, TypeScript uses `camelCase`:

| Python                   | TypeScript            |
| ------------------------ | --------------------- |
| `get_scanner_data()`     | `getScannerData()`    |
| `get_scanner_data_raw()` | `getScannerDataRaw()` |
| `order_by()`             | `orderBy()`           |
| `set_markets()`          | `setMarkets()`        |
| `set_tickers()`          | `setTickers()`        |
| `set_index()`            | `setIndex()`          |
| `set_property()`         | `setProperty()`       |

### 5. Comparison Operators

Python supports operator overloading, TypeScript uses methods:

| Python                   | TypeScript                     |
| ------------------------ | ------------------------------ |
| `Column('close') > 100`  | `new Column('close').gt(100)`  |
| `Column('close') >= 100` | `new Column('close').gte(100)` |
| `Column('close') < 100`  | `new Column('close').lt(100)`  |
| `Column('close') <= 100` | `new Column('close').lte(100)` |
| `Column('close') == 100` | `new Column('close').eq(100)`  |
| `Column('close') != 100` | `new Column('close').ne(100)`  |

### 6. Method Names for Column Operations

| Python              | TypeScript        |
| ------------------- | ----------------- |
| `above_pct()`       | `abovePct()`      |
| `below_pct()`       | `belowPct()`      |
| `between_pct()`     | `betweenPct()`    |
| `not_between_pct()` | `notBetweenPct()` |
| `not_between()`     | `notBetween()`    |
| `not_in()`          | `notIn()`         |
| `has_none_of()`     | `hasNoneOf()`     |
| `not_like()`        | `notLike()`       |
| `not_empty()`       | `notEmpty()`      |
| `crosses_above()`   | `crossesAbove()`  |
| `crosses_below()`   | `crossesBelow()`  |
| `in_day_range()`    | `inDayRange()`    |
| `in_week_range()`   | `inWeekRange()`   |
| `in_month_range()`  | `inMonthRange()`  |

## Migration Examples

### Basic Query

**Python:**

```python
from tradingview_screener import Query

result = Query().select('name', 'close', 'volume').get_scanner_data()
print(f"Found {result[0]} results")
for row in result[1].itertuples():
    print(f"{row.ticker}: {row.name} - ${row.close}")
```

**TypeScript:**

```typescript
import { Query } from 'tradingview-screener-ts';

const result = await new Query().select('name', 'close', 'volume').getScannerData();

console.log(`Found ${result.totalCount} results`);
result.data.forEach(row => {
  console.log(`${row.ticker}: ${row.name} - $${row.close}`);
});
```

### Advanced Filtering

**Python:**

```python
from tradingview_screener import Query, Column

result = (Query()
  .select('name', 'close', 'volume')
  .where(
    Column('market_cap_basic').between(1_000_000, 50_000_000),
    Column('close') > Column('VWAP'),
    Column('volume') > 1_000_000
  )
  .order_by('volume', ascending=False)
  .limit(25)
  .get_scanner_data())
```

**TypeScript:**

```typescript
import { Query, Column } from 'tradingview-screener-ts';

const result = await new Query()
  .select('name', 'close', 'volume')
  .where(
    new Column('market_cap_basic').between(1_000_000, 50_000_000),
    new Column('close').gt(new Column('VWAP')),
    new Column('volume').gt(1_000_000)
  )
  .orderBy('volume', false)
  .limit(25)
  .getScannerData();
```

### Complex Logic with AND/OR

**Python:**

```python
from tradingview_screener import Query, And, Or, col

result = (Query()
  .where2(
    And(
      Or(
        col('type') == 'stock',
        col('type') == 'fund'
      ),
      col('close') > 10
    )
  )
  .get_scanner_data())
```

**TypeScript:**

```typescript
import { Query, And, Or, col } from 'tradingview-screener-ts';

const result = await new Query()
  .where2(And(Or(col('type').eq('stock'), col('type').eq('fund')), col('close').gt(10)))
  .getScannerData();
```

### Real-time Data with Cookies

**Python:**

```python
import rookiepy
from tradingview_screener import Query

cookies = rookiepy.to_cookiejar(rookiepy.chrome(['.tradingview.com']))
result = Query().get_scanner_data(cookies=cookies)
```

**TypeScript:**

```typescript
import { Query } from 'tradingview-screener-ts';

const cookies = { sessionid: 'your-session-id' };
const result = await new Query().getScannerData({ cookies });
```

### Error Handling

**Python:**

```python
try:
    result = Query().limit(-5).get_scanner_data()
except Exception as e:
    print(f"Error: {e}")
```

**TypeScript:**

```typescript
try {
  const result = await new Query().limit(-5).getScannerData();
} catch (error) {
  console.error('Error:', error.message);
}
```

## Return Value Differences

### Python

Returns a tuple: `(total_count: int, dataframe: pandas.DataFrame)`

```python
count, df = Query().get_scanner_data()
print(f"Total: {count}")
print(df.head())
```

### TypeScript

Returns an object: `{ totalCount: number, data: Array<Record<string, any>> }`

```typescript
const result = await new Query().getScannerData();
console.log(`Total: ${result.totalCount}`);
console.log(result.data.slice(0, 5));
```

## Type Safety

The TypeScript version provides full type definitions:

```typescript
import {
  Query,
  Column,
  ScreenerDataResult,
  FilterOperationDict,
  QueryDict,
} from 'tradingview-screener';

// All methods and properties are fully typed
const query: Query = new Query();
const result: ScreenerDataResult = await query.getScannerData();
const filter: FilterOperationDict = new Column('close').gt(100);
```

## Testing

**Python:**

```python
import pytest

def test_query():
    result = Query().limit(5).get_scanner_data()
    assert result[0] > 0
    assert len(result[1]) <= 5
```

**TypeScript:**

```typescript
import { Query } from 'tradingview-screener';

test('should return results', async () => {
  const result = await new Query().limit(5).getScannerData();
  expect(result.totalCount).toBeGreaterThan(0);
  expect(result.data.length).toBeLessThanOrEqual(5);
});
```

## Common Pitfalls

1. **Forgetting `await`**: All data fetching methods are async in TypeScript
2. **Constructor syntax**: Use `new Column()` instead of `Column()`
3. **Method names**: Remember camelCase instead of snake_case
4. **Return values**: Object with `totalCount` and `data` instead of tuple
5. **Comparison operators**: Use methods like `.gt()` instead of `>`

## Benefits of TypeScript Version

1. **Type Safety**: Catch errors at compile time
2. **Better IDE Support**: Autocomplete and IntelliSense
3. **Modern JavaScript**: Async/await, ES modules
4. **NPM Ecosystem**: Easy integration with Node.js and browser projects
5. **Documentation**: JSDoc comments for better developer experience

## Performance Considerations

- The TypeScript version uses `axios` instead of `requests`
- JSON parsing is handled natively by JavaScript
- No pandas dependency means faster startup times
- Memory usage may differ due to JavaScript's object handling

## Next Steps

1. Install the TypeScript version: `npm install tradingview-screener-ts`
2. Update your imports and method calls
3. Add proper error handling with try/catch
4. Take advantage of TypeScript's type system
5. Run your tests to ensure everything works correctly

For more examples and detailed API documentation, see the [README](README-TS.md) and [examples](examples/) directory.
