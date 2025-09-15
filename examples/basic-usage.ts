/**
 * Basic usage examples for TradingView Screener TypeScript
 */

import { Query, Column, col, And, Or } from '../src';

async function basicExample(): Promise<void> {
  console.log('=== Basic Example ===');
  
  const result = await new Query()
    .select('name', 'close', 'volume', 'market_cap_basic')
    .getScannerData();

  console.log(`Found ${result.totalCount} total results`);
  console.log('First 5 results:');
  result.data.slice(0, 5).forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (Volume: ${row.volume})`);
  });
}

async function advancedFilteringExample(): Promise<void> {
  console.log('\n=== Advanced Filtering Example ===');
  
  const result = await new Query()
    .select('name', 'close', 'volume', 'relative_volume_10d_calc')
    .where(
      new Column('market_cap_basic').between(1_000_000, 50_000_000),
      new Column('relative_volume_10d_calc').gt(1.2),
      new Column('MACD.macd').gte(new Column('MACD.signal'))
    )
    .orderBy('volume', false)
    .offset(5)
    .limit(25)
    .getScannerData();

  console.log(`Found ${result.totalCount} stocks matching criteria`);
  console.log('Top volume stocks:');
  result.data.slice(0, 10).forEach(row => {
    console.log(`${row.ticker}: ${row.name} - Volume: ${row.volume} (Rel Vol: ${row.relative_volume_10d_calc?.toFixed(2)})`);
  });
}

async function complexLogicExample(): Promise<void> {
  console.log('\n=== Complex Logic Example ===');
  
  const result = await new Query()
    .select('type', 'typespecs', 'name', 'close')
    .where2(
      Or(
        And(col('type').eq('stock'), col('typespecs').has(['common'])),
        And(col('type').eq('fund'), col('typespecs').hasNoneOf(['etf'])),
        col('type').eq('dr')
      )
    )
    .limit(20)
    .getScannerData();

  console.log(`Found ${result.totalCount} instruments matching complex criteria`);
  console.log('Sample results:');
  result.data.slice(0, 10).forEach(row => {
    console.log(`${row.ticker}: ${row.name} (Type: ${row.type}, Specs: ${JSON.stringify(row.typespecs)})`);
  });
}

async function multiMarketExample(): Promise<void> {
  console.log('\n=== Multi-Market Example ===');
  
  const result = await new Query()
    .select('name', 'close', 'market', 'country', 'currency')
    .setMarkets('america', 'israel', 'hongkong')
    .limit(15)
    .getScannerData();

  console.log(`Found ${result.totalCount} instruments across multiple markets`);
  console.log('Sample results:');
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} ${row.currency} (${row.market}/${row.country})`);
  });
}

async function cryptoExample(): Promise<void> {
  console.log('\n=== Crypto Example ===');
  
  const result = await new Query()
    .select('name', 'close', 'volume', 'market')
    .setMarkets('crypto')
    .orderBy('volume', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} crypto instruments`);
  console.log('Top volume crypto:');
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (Volume: ${row.volume})`);
  });
}

async function specificTickersExample(): Promise<void> {
  console.log('\n=== Specific Tickers Example ===');
  
  const result = await new Query()
    .select('name', 'market', 'close', 'volume', 'VWAP', 'MACD.macd')
    .setTickers('NASDAQ:TSLA', 'NYSE:GME', 'AMEX:SPY')
    .getScannerData();

  console.log('Specific tickers data:');
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (VWAP: $${row.VWAP?.toFixed(2)}, MACD: ${row['MACD.macd']?.toFixed(4)})`);
  });
}

async function percentageOperationsExample(): Promise<void> {
  console.log('\n=== Percentage Operations Example ===');
  
  const result = await new Query()
    .select('name', 'close', 'price_52_week_low', 'price_52_week_high')
    .where(
      col('close').abovePct('price_52_week_low', 2.0), // 100% above 52-week low
      col('close').belowPct('price_52_week_high', 0.8)  // 20% below 52-week high
    )
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} stocks in the middle range`);
  console.log('Stocks between 52-week extremes:');
  result.data.forEach(row => {
    const lowPct = ((row.close / row.price_52_week_low - 1) * 100).toFixed(1);
    const highPct = ((row.close / row.price_52_week_high - 1) * 100).toFixed(1);
    console.log(`${row.ticker}: ${row.name} - $${row.close} (+${lowPct}% from low, ${highPct}% from high)`);
  });
}

async function technicalAnalysisExample(): Promise<void> {
  console.log('\n=== Technical Analysis Example ===');
  
  const result = await new Query()
    .select('name', 'close', 'RSI', 'MACD.macd', 'MACD.signal', 'EMA50', 'EMA200')
    .where(
      col('RSI').between(30, 70),  // RSI in normal range
      col('MACD.macd').gt(col('MACD.signal')),  // MACD bullish
      col('close').gt(col('EMA50')),  // Above 50-day EMA
      col('EMA50').gt(col('EMA200'))  // 50-day above 200-day (uptrend)
    )
    .orderBy('volume', false)
    .limit(10)
    .getScannerData();

  console.log(`Found ${result.totalCount} technically strong stocks`);
  console.log('Technically strong stocks:');
  result.data.forEach(row => {
    console.log(`${row.ticker}: ${row.name} - $${row.close} (RSI: ${row.RSI?.toFixed(1)}, MACD: ${row['MACD.macd']?.toFixed(4)})`);
  });
}

// Run all examples
async function runAllExamples(): Promise<void> {
  try {
    await basicExample();
    await advancedFilteringExample();
    await complexLogicExample();
    await multiMarketExample();
    await cryptoExample();
    await specificTickersExample();
    await percentageOperationsExample();
    await technicalAnalysisExample();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
