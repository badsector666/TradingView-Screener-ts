/**
 * Field Reference Examples for TradingView Screener TypeScript
 * 
 * This file demonstrates how to use the comprehensive field references
 * available for different asset classes.
 * 
 * 📚 Complete Field Documentation:
 * - Stocks: https://shner-elmo.github.io/TradingView-Screener/fields/stocks.html
 * - Crypto: https://shner-elmo.github.io/TradingView-Screener/fields/crypto.html
 * - Forex: https://shner-elmo.github.io/TradingView-Screener/fields/forex.html
 * - Futures: https://shner-elmo.github.io/TradingView-Screener/fields/futures.html
 * - Options: https://shner-elmo.github.io/TradingView-Screener/fields/options.html
 * - Bonds: https://shner-elmo.github.io/TradingView-Screener/fields/bonds.html
 * - Economics: https://shner-elmo.github.io/TradingView-Screener/fields/economics2.html
 *
 * 🌍 Regional Stock Screeners:
 * - India Stocks: https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/india.html
 * - US Stocks: https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/america.html
 * - Global Stocks: https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/global.html
 */

import { Query, Column, col, And, Or } from 'tradingview-screener-ts';

async function stockFieldsExample(): Promise<void> {
  console.log('=== Stock Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/stocks.html');
  
  const result = await new Query()
    .select(
      'name',                    // Company name
      'close',                   // Current price
      'volume',                  // Trading volume
      'market_cap_basic',        // Market capitalization
      'P/E',                     // Price-to-Earnings ratio
      'P/B',                     // Price-to-Book ratio
      'debt_to_equity',          // Debt-to-Equity ratio
      'RSI',                     // Relative Strength Index
      'MACD.macd',              // MACD line
      'MACD.signal',            // MACD signal line
      'EMA20',                  // 20-period Exponential Moving Average
      'relative_volume_10d_calc' // 10-day relative volume
    )
    .where(
      col('market_cap_basic').gt(1_000_000_000),    // Market cap > $1B
      col('P/E').between(5, 30),                    // P/E ratio 5-30
      col('debt_to_equity').lt(2),                  // Low debt
      col('RSI').between(30, 70),                   // RSI not oversold/overbought
      col('relative_volume_10d_calc').gt(1.2)      // Above average volume
    )
    .orderBy('market_cap_basic', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} stocks matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (P/E: ${row['P/E']?.toFixed(2)}, RSI: ${row.RSI?.toFixed(1)})`);
  });
}

async function cryptoFieldsExample(): Promise<void> {
  console.log('\n=== Crypto Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/crypto.html');
  
  const result = await new Query()
    .setMarkets('crypto')
    .select(
      'name',                    // Cryptocurrency name
      'close',                   // Current price
      'volume',                  // Trading volume
      'market_cap_calc',         // Market capitalization
      'change',                  // Price change %
      'volatility',              // Price volatility
      'total_shares_outstanding' // Circulating supply
    )
    .where(
      col('market_cap_calc').gt(100_000_000),       // Market cap > $100M
      col('volume').gt(1_000_000),                  // Volume > $1M
      col('change').between(-10, 10),               // Price change ±10%
      col('volatility').lt(0.1)                     // Low volatility
    )
    .orderBy('market_cap_calc', false)
    .limit(15)
    .getScannerData();

  console.log(`Found ${result.totalCount} cryptocurrencies matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (Change: ${row.change?.toFixed(2)}%, Vol: ${row.volatility?.toFixed(3)})`);
  });
}

async function forexFieldsExample(): Promise<void> {
  console.log('\n=== Forex Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/forex.html');
  
  const result = await new Query()
    .setMarkets('forex')
    .select(
      'name',                    // Currency pair name
      'close',                   // Exchange rate
      'change',                  // Rate change %
      'volatility',              // Exchange rate volatility
      'spread',                  // Bid-ask spread
      'high_1',                  // 1-day high
      'low_1'                    // 1-day low
    )
    .where(
      col('volatility').gt(0.005),                  // Minimum volatility
      col('change').between(-2, 2),                 // Change within ±2%
      col('spread').lt(0.01)                        // Low spread
    )
    .orderBy('volatility', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} forex pairs matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - ${row.close} (Change: ${row.change?.toFixed(3)}%, Vol: ${row.volatility?.toFixed(4)})`);
  });
}

async function futuresFieldsExample(): Promise<void> {
  console.log('\n=== Futures Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/futures.html');
  
  const result = await new Query()
    .setMarkets('futures')
    .select(
      'name',                    // Contract name
      'close',                   // Current price
      'volume',                  // Trading volume
      'open_interest',           // Open interest
      'expiration',              // Contract expiration
      'settlement_price',        // Settlement price
      'change'                   // Price change %
    )
    .where(
      col('volume').gt(1000),                       // Minimum volume
      col('open_interest').gt(500),                 // Minimum open interest
      col('change').between(-5, 5)                  // Price change ±5%
    )
    .orderBy('volume', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} futures contracts matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (Vol: ${row.volume}, OI: ${row.open_interest})`);
  });
}

async function optionsFieldsExample(): Promise<void> {
  console.log('\n=== Options Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/options.html');
  
  const result = await new Query()
    .setMarkets('options')
    .select(
      'name',                    // Option name
      'close',                   // Option price
      'strike',                  // Strike price
      'expiration',              // Expiration date
      'delta',                   // Delta Greek
      'gamma',                   // Gamma Greek
      'theta',                   // Theta Greek
      'vega',                    // Vega Greek
      'implied_volatility',      // Implied volatility
      'volume'                   // Trading volume
    )
    .where(
      col('volume').gt(100),                        // Minimum volume
      col('implied_volatility').between(0.1, 1.0), // IV between 10%-100%
      col('delta').between(0.3, 0.7),              // Delta 0.3-0.7
      col('expiration').inDayRange(7, 60)          // 1-8 weeks to expiration
    )
    .orderBy('volume', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} options contracts matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.ticker}: Strike $${row.strike} - $${row.close} (Delta: ${row.delta?.toFixed(3)}, IV: ${(row.implied_volatility * 100)?.toFixed(1)}%)`);
  });
}

async function bondsFieldsExample(): Promise<void> {
  console.log('\n=== Bonds Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/bonds.html');
  
  const result = await new Query()
    .setMarkets('bonds')
    .select(
      'name',                    // Bond name
      'close',                   // Bond price
      'yield',                   // Current yield
      'duration',                // Duration
      'maturity',                // Maturity date
      'credit_rating',           // Credit rating
      'coupon_rate'              // Coupon rate
    )
    .where(
      col('yield').between(2, 8),                   // Yield 2%-8%
      col('duration').between(1, 10),              // Duration 1-10 years
      col('credit_rating').isin(['AAA', 'AA', 'A']) // High credit rating
    )
    .orderBy('yield', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} bonds matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (Yield: ${row.yield?.toFixed(2)}%, Rating: ${row.credit_rating})`);
  });
}

async function economicsFieldsExample(): Promise<void> {
  console.log('\n=== Economics Fields Example ===');
  console.log('Using fields from: https://shner-elmo.github.io/TradingView-Screener/fields/economics2.html');
  
  const result = await new Query()
    .setMarkets('economics2')
    .select(
      'name',                    // Indicator name
      'close',                   // Current value
      'change',                  // Change from previous
      'country',                 // Country
      'importance',              // Economic importance
      'frequency'                // Update frequency
    )
    .where(
      col('importance').isin(['High', 'Medium']),   // Important indicators
      col('change').notEmpty()                      // Has recent data
    )
    .orderBy('importance', false)
    .limit(15)
    .getScannerData();

  console.log(`Found ${result.totalCount} economic indicators matching criteria`);
  result.data.forEach(row => {
    console.log(`${row.country}: ${row.name} - ${row.close} (Change: ${row.change}, Importance: ${row.importance})`);
  });
}

async function indiaStockFieldsExample(): Promise<void> {
  console.log('\n=== India Stock Fields Example ===');
  console.log('Using India screener: https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/india.html');

  const result = await new Query()
    .setMarkets(['india'])  // Focus on Indian stock market (NSE/BSE)
    .select(
      'name',                    // Company name
      'close',                   // Current price in INR
      'volume',                  // Trading volume
      'market_cap_basic',        // Market cap in INR
      'P/E',                     // Price-to-Earnings ratio
      'P/B',                     // Price-to-Book ratio
      'debt_to_equity',          // Debt-to-Equity ratio
      'RSI',                     // Relative Strength Index
      'change',                  // Price change %
      'relative_volume_10d_calc' // 10-day relative volume
    )
    .where(
      col('market_cap_basic').gt(10_000_000_000),   // Market cap > ₹10B
      col('P/E').between(8, 35),                    // P/E ratio 8-35
      col('debt_to_equity').lt(1.5),                // Reasonable debt levels
      col('RSI').between(30, 70),                   // RSI not oversold/overbought
      col('volume').gt(100_000),                    // Volume > 100K shares
      col('change').gt(-10)                         // Not falling more than 10%
    )
    .orderBy('market_cap_basic', false)
    .limit(15)
    .getScannerData();

  console.log(`Found ${result.totalCount} Indian stocks matching criteria`);
  console.log('Top 15 Indian stocks:');
  result.data.forEach((stock, index) => {
    console.log(`${index + 1}. ${stock.name}: ₹${stock.close} (P/E: ${stock['P/E']}, Change: ${stock.change}%)`);
  });
}

// Run all field reference examples
async function runAllFieldExamples(): Promise<void> {
  console.log('🚀 TradingView Screener - Field Reference Examples\n');
  console.log('📚 Complete field documentation: https://shner-elmo.github.io/TradingView-Screener/\n');

  try {
    await stockFieldsExample();
    await indiaStockFieldsExample();
    await cryptoFieldsExample();
    await forexFieldsExample();
    await futuresFieldsExample();
    await optionsFieldsExample();
    await bondsFieldsExample();
    await economicsFieldsExample();
  } catch (error) {
    console.error('Error running field examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllFieldExamples();
}
