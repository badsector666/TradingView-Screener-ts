# 🚀 TradingView Screener API

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/tradingview-screener-ts.svg?color=%2334D058)](https://www.npmjs.com/package/tradingview-screener-ts)
[![Node Version](https://img.shields.io/node/v/tradingview-screener-ts.svg?color=%2334D058)](https://www.npmjs.com/package/tradingview-screener-ts)
[![Downloads](https://img.shields.io/npm/dt/tradingview-screener-ts.svg)](https://www.npmjs.com/package/tradingview-screener-ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A complete TypeScript port of the popular Python TradingView Screener library**

_100% feature parity • Enhanced type safety • Modern JavaScript features_

[📚 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🌍 Markets](#-markets) • [💡 Examples](#-examples) • [🔗 API Reference](#-api-reference)

</div>

---

## 🙏 Credits

This TypeScript library is a complete port of the original **[TradingView-Screener](https://github.com/shner-elmo/TradingView-Screener)** Python library created by **[shner-elmo](https://github.com/shner-elmo)**.

All credit for the original concept, API design, and implementation goes to the original author. This TypeScript version maintains 100% feature parity while adding type safety and modern JavaScript features.

**Original Python Library:** https://github.com/shner-elmo/TradingView-Screener

---

## ✨ Features

🎯 **100% Python Parity** - Every feature from the original Python library  
🔒 **Full Type Safety** - Complete TypeScript definitions with IntelliSense  
🌍 **Global Markets** - 67+ countries including dedicated India market support  
📊 **3000+ Fields** - Complete access to all TradingView data fields  
⚡ **Modern Async** - Promise-based API with async/await patterns  
🇮🇳 **India Market** - Dedicated support with INR currency formatting  
📈 **Technical Analysis** - 100+ technical indicators and screening tools  
🔧 **Developer Experience** - Enhanced debugging and error handling

---

## 🚀 Quick Start

### Installation

```bash
npm install tradingview-screener-ts
```

### Basic Usage

```typescript
import { Query, col } from 'tradingview-screener-ts';

// Screen large-cap stocks with high volume
const result = await new Query()
  .select('name', 'close', 'volume', 'market_cap_basic')
  .where(
    col('market_cap_basic').gt(1_000_000_000), // Market cap > $1B
    col('volume').gt(1_000_000) // Volume > 1M
  )
  .orderBy('volume', false)
  .limit(50)
  .getScannerData();

console.log(`Found ${result.totalCount} stocks`);
result.data.forEach(stock => {
  console.log(`${stock.name}: $${stock.close} (Vol: ${stock.volume})`);
});
```

### India Market Example

```typescript
// Screen Indian large-cap stocks
const indiaStocks = await new Query()
  .setMarkets('india')
  .select('name', 'close', 'volume', 'market_cap_basic', 'P/E')
  .where(
    col('market_cap_basic').gt(10_000_000_000), // Market cap > ₹10B
    col('P/E').between(8, 35), // P/E ratio 8-35
    col('volume').gt(100_000) // Volume > 100K
  )
  .orderBy('market_cap_basic', false)
  .getScannerData();

console.log(`Found ${indiaStocks.totalCount} Indian stocks`);
```

---

## 🌍 Markets

### Supported Markets (67+ total)

#### **Major Stock Markets**

- 🇺🇸 **United States** (`america`) - NYSE, NASDAQ, AMEX
- 🇮🇳 **India** (`india`) - NSE, BSE with INR currency support
- 🇬🇧 **United Kingdom** (`uk`) - LSE
- 🇩🇪 **Germany** (`germany`) - XETRA, Frankfurt
- 🇯🇵 **Japan** (`japan`) - TSE, Nikkei

#### **Asset Classes**

- 💰 **Cryptocurrency** (`crypto`) - Bitcoin, Ethereum, Altcoins
- 💱 **Forex** (`forex`) - Currency pairs
- 📈 **Futures** (`futures`) - Commodity and financial futures
- 📊 **Options** (`options`) - Options contracts
- 🏦 **Bonds** (`bonds`) - Government and corporate bonds

### Regional Screeners

- [🇮🇳 **India Stocks Screener**](https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/india.html) - Complete India market screening
- [🇺🇸 **US Stocks Screener**](https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/america.html) - US market screening
- [🌐 **Global Stocks Screener**](https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/global.html) - Multi-market screening

---

## 📊 Field Documentation

### Complete Field References (3000+ fields)

- [**📈 Stocks Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/stocks.html) - OHLC, volume, fundamentals, technical indicators
- [**₿ Crypto Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/crypto.html) - Cryptocurrency-specific metrics
- [**💱 Forex Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/forex.html) - Currency pair data
- [**📈 Futures Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/futures.html) - Futures contract data
- [**📊 Options Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/options.html) - Options Greeks and metrics
- [**🏦 Bonds Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/bonds.html) - Bond yield and duration data
- [**🌍 Economics Fields**](https://shner-elmo.github.io/TradingView-Screener/fields/economics2.html) - Economic indicators

### Common Fields

```typescript
// Price & Volume
('close', 'open', 'high', 'low', 'volume');

// Market Data
('market_cap_basic', 'shares_outstanding', 'float_shares_outstanding');

// Valuation Ratios
('P/E', 'P/B', 'P/S', 'EV/EBITDA', 'price_earnings_ttm');

// Technical Indicators
('RSI', 'MACD.macd', 'MACD.signal', 'EMA20', 'SMA50', 'SMA200');

// Financial Metrics
('debt_to_equity', 'return_on_equity', 'return_on_assets', 'gross_margin');
```

---

## 💡 Examples

### Advanced Technical Analysis

```typescript
import { Query, col, And, Or } from 'tradingview-screener-ts';

const technicalScreen = await new Query()
  .select('name', 'close', 'RSI', 'MACD.macd', 'MACD.signal', 'volume')
  .where(
    And(
      col('RSI').between(30, 70), // Not oversold/overbought
      col('MACD.macd').gt(col('MACD.signal')), // MACD bullish crossover
      col('close').gt(col('EMA20')), // Above 20-day EMA
      Or(
        col('volume').gt(col('volume').sma(20)), // Above average volume
        col('relative_volume_10d_calc').gt(1.5) // High relative volume
      )
    )
  )
  .orderBy('volume', false)
  .getScannerData();
```

### Multi-Market Screening

```typescript
// Screen across multiple markets
const globalScreen = await new Query()
  .setMarkets('america', 'india', 'uk', 'germany', 'japan')
  .select('name', 'close', 'market_cap_basic', 'country', 'sector')
  .where(
    col('market_cap_basic').gt(5_000_000_000), // $5B+ market cap
    col('P/E').between(5, 25), // Reasonable P/E
    col('debt_to_equity').lt(1) // Low debt
  )
  .orderBy('market_cap_basic', false)
  .getScannerData();
```

### Cryptocurrency Screening

```typescript
// Screen cryptocurrencies
const cryptoScreen = await new Query()
  .setMarkets(['crypto'])
  .select('name', 'close', 'volume', 'market_cap_calc', 'change')
  .where(
    col('market_cap_calc').gt(1_000_000_000), // $1B+ market cap
    col('volume').gt(10_000_000), // $10M+ daily volume
    col('change').between(-20, 20) // ±20% daily change
  )
  .orderBy('volume', false)
  .getScannerData();
```

---

## 🔗 API Reference

### Core Classes

- **`Query`** - Main screener query builder
- **`Column`** - Column operations and filtering
- **`col()`** - Shorthand for creating Column instances

### Query Methods

- `select()` - Choose columns to retrieve
- `where()` - Add filters (AND logic)
- `where2()` - Advanced filtering (AND/OR logic)
- `orderBy()` - Sort results
- `limit()` - Limit number of results
- `setMarkets()` - Choose markets/exchanges
- `getScannerData()` - Execute query and get results

### Column Operations

- **Comparison**: `gt()`, `gte()`, `lt()`, `lte()`, `eq()`, `ne()`
- **Range**: `between()`, `notBetween()`, `isin()`, `notIn()`
- **Technical**: `crosses()`, `crossesAbove()`, `crossesBelow()`
- **Percentage**: `abovePct()`, `belowPct()`, `betweenPct()`
- **String**: `like()`, `notLike()`, `empty()`, `notEmpty()`

---

## 📚 Documentation

- [**Installation Guide**](INSTALLATION-GUIDE.md) - Complete installation instructions
- [**API Reference**](API-REFERENCE.md) - Detailed API documentation
- [**Field References**](FIELD-REFERENCES.md) - Complete field documentation
- [**Migration Guide**](MIGRATION.md) - Python to TypeScript migration
- [**Examples**](examples/) - Practical usage examples

---

## 🔄 Migration from Python

### Python vs TypeScript

| Python                               | TypeScript                                             | Notes                  |
| ------------------------------------ | ------------------------------------------------------ | ---------------------- |
| `Column('field') > 100`              | `col('field').gt(100)`                                 | Method-based operators |
| `query.get_scanner_data()`           | `query.getScannerData()`                               | camelCase naming       |
| `from tradingview_screener import *` | `import { Query, col } from 'tradingview-screener-ts'` | ES6 imports            |

### Example Migration

**Python:**

```python
from tradingview_screener import Query, Column

result = (Query()
  .select('name', 'close', 'volume')
  .where(Column('close') > 100)
  .get_scanner_data())
```

**TypeScript:**

```typescript
import { Query, col } from 'tradingview-screener-ts';

const result = await new Query()
  .select('name', 'close', 'volume')
  .where(col('close').gt(100))
  .getScannerData();
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Python library by [shner-elmo](https://github.com/shner-elmo/TradingView-Screener)
- TradingView for providing the excellent screening API
- TypeScript community for the amazing tooling

---

<div align="center">

**Made with ❤️ for the TypeScript community**

[⭐ Star on GitHub](https://github.com/Anny26022/TradingView-Screener-ts) • [📦 NPM Package](https://www.npmjs.com/package/tradingview-screener-ts) • [🐛 Report Issues](https://github.com/Anny26022/TradingView-Screener-ts/issues)

</div>
