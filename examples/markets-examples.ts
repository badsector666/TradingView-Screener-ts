/**
 * Markets and Asset Classes Examples for TradingView Screener TypeScript
 * 
 * This file demonstrates how to use the markets constants and helper functions
 * to work with different markets and asset classes.
 */

import {
  Query,
  col,
  MARKETS,
  MARKETS_WITH_NAMES,
  MARKETS_LIST,
  ASSET_CLASSES,
  COUNTRY_MARKETS,
  MARKET_INFO,
  isValidMarket,
  getMarketInfo,
  getMarketName,
  getMarketCode,
  getMarketsByType
} from 'tradingview-screener-ts';

async function exploreAvailableMarkets(): Promise<void> {
  console.log('=== Available Markets (Python-Compatible Structure) ===');

  console.log('\n📊 All Markets (Display Name -> Market Code):');
  MARKETS.slice(0, 10).forEach(([displayName, marketCode]) => {
    console.log(`  "${displayName}" -> "${marketCode}"`);
  });
  console.log(`  ... and ${MARKETS.length - 10} more markets`);

  console.log('\n📈 Asset Classes:');
  ASSET_CLASSES.forEach(assetClass => {
    const info = getMarketInfo(assetClass);
    console.log(`  ${assetClass}: ${info?.description || 'No description'}`);
  });

  console.log('\n🌍 Country Markets (sample):');
  COUNTRY_MARKETS.slice(0, 10).forEach(country => {
    const displayName = getMarketName(country);
    console.log(`  ${country}: ${displayName || country}`);
  });

  console.log(`\n📊 Total Markets Available: ${MARKETS.length}`);
  console.log(`📊 Market Codes Only: ${MARKETS_LIST.length}`);
}

async function validateMarkets(): Promise<void> {
  console.log('\n=== Market Validation ===');
  
  const testMarkets = ['america', 'crypto', 'forex', 'invalid_market', 'italy'];
  
  testMarkets.forEach(market => {
    const isValid = isValidMarket(market);
    const info = getMarketInfo(market);
    console.log(`${market}: ${isValid ? '✅ Valid' : '❌ Invalid'} ${info ? `- ${info.description}` : ''}`);
  });
}

async function stockMarketExamples(): Promise<void> {
  console.log('\n=== Stock Market Examples ===');
  
  // US Market
  console.log('🇺🇸 US Market:');
  const usResult = await new Query()
    .setMarkets('america')
    .select('name', 'close', 'volume', 'market_cap_basic')
    .where(col('market_cap_basic').gt(1_000_000_000))
    .limit(5)
    .getScannerData();
  
  usResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - $${row.close}`);
  });
  
  // Italian Market
  console.log('\n🇮🇹 Italian Market:');
  const italyResult = await new Query()
    .setMarkets('italy')
    .select('name', 'close', 'volume')
    .limit(5)
    .getScannerData();
  
  italyResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - $${row.close}`);
  });
}

async function assetClassExamples(): Promise<void> {
  console.log('\n=== Asset Class Examples ===');
  
  // Cryptocurrency
  console.log('₿ Cryptocurrency:');
  const cryptoResult = await new Query()
    .setMarkets('crypto')
    .select('name', 'close', 'volume', 'change')
    .orderBy('volume', false)
    .limit(5)
    .getScannerData();
  
  cryptoResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - $${row.close} (${row.change > 0 ? '+' : ''}${row.change?.toFixed(2)}%)`);
  });
  
  // Forex
  console.log('\n💱 Forex:');
  const forexResult = await new Query()
    .setMarkets('forex')
    .select('name', 'close', 'change', 'volatility')
    .limit(5)
    .getScannerData();
  
  forexResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - ${row.close} (Vol: ${row.volatility?.toFixed(4)})`);
  });
  
  // Futures
  console.log('\n📈 Futures:');
  const futuresResult = await new Query()
    .setMarkets('futures')
    .select('name', 'close', 'volume', 'open_interest')
    .limit(5)
    .getScannerData();
  
  futuresResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - $${row.close} (OI: ${row.open_interest})`);
  });
}

async function multiMarketExamples(): Promise<void> {
  console.log('\n=== Multi-Market Examples ===');
  
  // Multiple countries
  console.log('🌍 Multiple Countries:');
  const multiCountryResult = await new Query()
    .setMarkets('america', 'italy', 'israel', 'hongkong')
    .select('name', 'close', 'market', 'country')
    .limit(10)
    .getScannerData();
  
  multiCountryResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - $${row.close} (${row.country})`);
  });
  
  // Multiple asset classes
  console.log('\n📊 Multiple Asset Classes:');
  const multiAssetResult = await new Query()
    .setMarkets('crypto', 'forex')
    .select('name', 'close', 'market')
    .limit(8)
    .getScannerData();
  
  multiAssetResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - ${row.close} (${row.market})`);
  });
}

async function marketsByTypeExample(): Promise<void> {
  console.log('\n=== Markets by Type ===');
  
  const assetClassMarkets = getMarketsByType('asset_class');
  const countryMarkets = getMarketsByType('country');
  const regionMarkets = getMarketsByType('region');
  
  console.log(`Asset Classes (${assetClassMarkets.length}):`, assetClassMarkets.join(', '));
  console.log(`Countries (${countryMarkets.length}):`, countryMarkets.slice(0, 10).join(', '), '...');
  console.log(`Regions (${regionMarkets.length}):`, regionMarkets.join(', '));
}

async function advancedMarketFiltering(): Promise<void> {
  console.log('\n=== Advanced Market Filtering ===');
  
  // Find stocks in European markets with high volume
  console.log('🇪🇺 European High Volume Stocks:');
  const europeanResult = await new Query()
    .setMarkets('germany', 'france', 'italy', 'spain', 'netherlands')
    .select('name', 'close', 'volume', 'country', 'market_cap_basic')
    .where(
      col('volume').gt(1_000_000),
      col('market_cap_basic').gt(500_000_000)
    )
    .orderBy('volume', false)
    .limit(8)
    .getScannerData();
  
  europeanResult.data.forEach(row => {
    console.log(`  ${row.ticker}: ${row.name} - $${row.close} (${row.country}, Vol: ${row.volume})`);
  });
  
  // Find crypto with high market cap
  console.log('\n₿ High Market Cap Crypto:');
  const cryptoHighCapResult = await new Query()
    .setMarkets('crypto')
    .select('name', 'close', 'market_cap_calc', 'change')
    .where(col('market_cap_calc').gt(1_000_000_000))
    .orderBy('market_cap_calc', false)
    .limit(5)
    .getScannerData();
  
  cryptoHighCapResult.data.forEach(row => {
    const marketCap = row.market_cap_calc / 1_000_000_000;
    console.log(`  ${row.ticker}: ${row.name} - $${row.close} (${marketCap.toFixed(1)}B market cap)`);
  });
}

// Run all market examples
async function runAllMarketExamples(): Promise<void> {
  console.log('🚀 TradingView Screener - Markets & Asset Classes Examples\n');
  
  try {
    await exploreAvailableMarkets();
    await validateMarkets();
    await stockMarketExamples();
    await assetClassExamples();
    await multiMarketExamples();
    await marketsByTypeExample();
    await advancedMarketFiltering();
    
    console.log('\n✅ All market examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running market examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllMarketExamples();
}
