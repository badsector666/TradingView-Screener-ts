# 📦 Installation Guide for tradingview-screener-ts

## 🚀 Quick Installation

```bash
npm install tradingview-screener-ts
```

## 📋 Package Information

- **Package Name**: `tradingview-screener-ts`
- **Version**: 1.0.3
- **TypeScript Support**: ✅ Full TypeScript definitions included
- **Node.js**: Requires Node.js 16.0.0 or higher
- **Python Parity**: 100% compatible with Python `tradingview-screener`
- **Code Quality**: ✅ ESLint + Prettier configured for professional standards

---

## 🔧 Installation Methods

### **Method 1: NPM (Recommended)**

```bash
npm install tradingview-screener-ts
```

### **Method 2: Yarn**

```bash
yarn add tradingview-screener-ts
```

### **Method 3: PNPM**

```bash
pnpm add tradingview-screener-ts
```

### **Method 4: From GitHub (Development)**

```bash
npm install git+https://github.com/Anny26022/TradingView-Screener-ts.git
```

---

## 📖 Basic Usage

### **ES6 Modules (Recommended)**

```typescript
import { Query, Column, col, And, Or } from 'tradingview-screener-ts';

// Basic usage
const result = await new Query().select('name', 'close', 'volume').getScannerData();

console.log(result);
```

### **CommonJS**

```javascript
const { Query, Column, col, And, Or } = require('tradingview-screener-ts');

// Basic usage
const result = await new Query().select('name', 'close', 'volume').getScannerData();

console.log(result);
```

---

## 🎯 Complete Example

```typescript
import { Query, Column, col, And, Or, MARKETS } from 'tradingview-screener-ts';

async function screenStocks() {
  try {
    // Advanced screening example
    const result = await new Query()
      .select('name', 'close', 'volume', 'market_cap_basic', 'price_earnings_ttm')
      .where(
        And(
          col('market_cap_basic').gt(1_000_000_000), // Market cap > 1B
          col('volume').gt(1_000_000), // Volume > 1M
          col('price_earnings_ttm').between(5, 25) // P/E ratio 5-25
        )
      )
      .orderBy('volume', false) // Descending order
      .limit(50)
      .setMarkets('america') // US stocks only
      .getScannerData();

    console.log(`Found ${result.totalCount} stocks matching criteria`);
    console.log('Top 10 results:');
    result.data.slice(0, 10).forEach((stock, index) => {
      console.log(`${index + 1}. ${stock.name}: $${stock.close} (Vol: ${stock.volume})`);
    });
  } catch (error) {
    console.error('Error screening stocks:', error);
  }
}

screenStocks();
```

---

## 🌍 Available Markets

```typescript
import { MARKETS, MARKETS_WITH_NAMES, getMarketName } from 'tradingview-screener-ts';

// View all available markets
console.log('Available Markets:');
MARKETS.forEach(([displayName, marketCode]) => {
  console.log(`${displayName} -> ${marketCode}`);
});

// Get market display name from code
const displayName = getMarketName('america'); // "United States"
console.log(displayName);

// Available markets include:
// - Countries: america, canada, uk, germany, japan, etc.
// - Asset Classes: crypto, forex, futures, bonds, etc.
```

---

## 🔄 Migration from Python

If you're migrating from the Python `tradingview-screener` package:

### **Python Code:**

```python
from tradingview_screener import Query, Column

result = (Query()
  .select('name', 'close', 'volume')
  .where(Column('close') > 100)
  .get_scanner_data())
```

### **TypeScript Equivalent:**

```typescript
import { Query, Column } from 'tradingview-screener-ts';

const result = await new Query()
  .select('name', 'close', 'volume')
  .where(new Column('close').gt(100))
  .getScannerData();
```

**Key Differences:**

- Use `import` instead of `from ... import`
- Add `await` for async operations
- Use `.gt()` instead of `>` operator
- Use `.getScannerData()` instead of `.get_scanner_data()`

---

## 🛠️ Development Setup

### **1. Clone and Install**

```bash
git clone https://github.com/Anny26022/TradingView-Screener-ts.git
cd TradingView-Screener-ts
npm install
```

### **2. Build the Project**

```bash
npm run build
```

### **3. Run Tests**

```bash
npm test
```

### **4. Verify Python Parity**

```bash
npm run verify-parity
```

---

## 📚 Additional Resources

- **Documentation**: [GitHub Repository](https://github.com/Anny26022/TradingView-Screener-ts)
- **Field References**: [FIELD-REFERENCES.md](./FIELD-REFERENCES.md)
- **Examples**: [examples/](./examples/)
- **Python Version**: [shner-elmo/TradingView-Screener](https://github.com/shner-elmo/TradingView-Screener)

---

## ❓ Troubleshooting

### **Common Issues:**

1. **Node.js Version Error**

   ```bash
   # Ensure Node.js 16+ is installed
   node --version  # Should be 16.0.0 or higher
   ```

2. **TypeScript Compilation Errors**

   ```bash
   # Install TypeScript globally if needed
   npm install -g typescript
   ```

3. **Import Errors**
   ```typescript
   // Make sure to use the correct package name
   import { Query } from 'tradingview-screener-ts'; // ✅ Correct
   import { Query } from 'tradingview-screener'; // ❌ Wrong package
   ```

---

## 🎉 You're Ready!

You now have `tradingview-screener-ts` installed and ready to use. Start building powerful stock screeners with full TypeScript support and 100% Python compatibility!

```typescript
import { Query } from 'tradingview-screener-ts';

// Your first screener
const result = await new Query().getScannerData();
console.log('Welcome to tradingview-screener-ts!', result);
```
