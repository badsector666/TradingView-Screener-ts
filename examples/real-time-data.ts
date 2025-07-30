/**
 * Real-time data access examples
 * 
 * This example shows how to access real-time data using session cookies.
 * You need to be logged in to TradingView and provide your session cookies.
 */

import { Query, col } from 'tradingview-screener-ts';

// Example session cookies (replace with your actual cookies)
const EXAMPLE_COOKIES = {
  sessionid: 'your-session-id-here',
  // You can add other cookies if needed
  // csrftoken: 'your-csrf-token',
  // device_t: 'your-device-token',
};

async function checkUpdateModes(): Promise<void> {
  console.log('=== Checking Update Modes ===');
  
  try {
    const result = await new Query()
      .select('exchange', 'update_mode')
      .limit(10000)
      .getScannerData({ cookies: EXAMPLE_COOKIES });

    // Group by exchange and update_mode
    const grouped: Record<string, Record<string, number>> = {};
    
    result.data.forEach(row => {
      const exchange = row.exchange;
      const updateMode = row.update_mode;
      
      if (!grouped[exchange]) {
        grouped[exchange] = {};
      }
      
      if (!grouped[exchange][updateMode]) {
        grouped[exchange][updateMode] = 0;
      }
      
      grouped[exchange][updateMode]++;
    });

    console.log('Update modes by exchange:');
    Object.entries(grouped).forEach(([exchange, modes]) => {
      console.log(`\n${exchange}:`);
      Object.entries(modes).forEach(([mode, count]) => {
        console.log(`  ${mode}: ${count}`);
      });
    });

  } catch (error) {
    console.error('Error checking update modes:', error);
    console.log('\nNote: Make sure to replace EXAMPLE_COOKIES with your actual session cookies');
    console.log('To get your cookies:');
    console.log('1. Go to https://www.tradingview.com and log in');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Application > Cookies > https://www.tradingview.com');
    console.log('4. Copy the sessionid value');
  }
}

async function realTimeDataExample(): Promise<void> {
  console.log('\n=== Real-Time Data Example ===');
  
  try {
    const result = await new Query()
      .select('name', 'close', 'volume', 'update_mode', 'exchange')
      .where(
        col('exchange').isin(['NASDAQ', 'NYSE', 'AMEX'])
      )
      .orderBy('volume', false)
      .limit(20)
      .getScannerData({ cookies: EXAMPLE_COOKIES });

    console.log('Real-time data for top volume US stocks:');
    result.data.forEach(row => {
      const updateStatus = row.update_mode === 'streaming' ? '🟢 LIVE' : '🟡 DELAYED';
      console.log(`${updateStatus} ${row.ticker}: ${row.name} - $${row.close} (Vol: ${row.volume})`);
    });

  } catch (error) {
    console.error('Error fetching real-time data:', error);
  }
}

async function compareDelayedVsRealTime(): Promise<void> {
  console.log('\n=== Comparing Delayed vs Real-Time ===');
  
  try {
    // Get data without cookies (delayed)
    const delayedResult = await new Query()
      .select('name', 'close', 'volume', 'update_mode')
      .setTickers('NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL')
      .getScannerData();

    console.log('Delayed data:');
    delayedResult.data.forEach(row => {
      console.log(`${row.ticker}: $${row.close} (${row.update_mode})`);
    });

    // Get data with cookies (real-time)
    const realTimeResult = await new Query()
      .select('name', 'close', 'volume', 'update_mode')
      .setTickers('NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL')
      .getScannerData({ cookies: EXAMPLE_COOKIES });

    console.log('\nReal-time data:');
    realTimeResult.data.forEach(row => {
      console.log(`${row.ticker}: $${row.close} (${row.update_mode})`);
    });

  } catch (error) {
    console.error('Error comparing data:', error);
  }
}

async function premiumDataExample(): Promise<void> {
  console.log('\n=== Premium Data Example ===');
  
  try {
    // This example shows accessing data that might require premium subscription
    const result = await new Query()
      .select('name', 'close', 'premarket_change', 'aftermarket_change', 'update_mode')
      .where(
        col('premarket_change').notEmpty()
      )
      .limit(10)
      .getScannerData({ cookies: EXAMPLE_COOKIES });

    console.log('Stocks with pre-market data:');
    result.data.forEach(row => {
      const preMarket = row.premarket_change ? `Pre: ${row.premarket_change > 0 ? '+' : ''}${row.premarket_change.toFixed(2)}%` : 'No pre-market';
      const afterMarket = row.aftermarket_change ? `After: ${row.aftermarket_change > 0 ? '+' : ''}${row.aftermarket_change.toFixed(2)}%` : 'No after-market';
      console.log(`${row.ticker}: ${row.name} - $${row.close} | ${preMarket} | ${afterMarket}`);
    });

  } catch (error) {
    console.error('Error fetching premium data:', error);
  }
}

async function customHeadersExample(): Promise<void> {
  console.log('\n=== Custom Headers Example ===');
  
  try {
    // Example of using custom headers and request configuration
    const result = await new Query()
      .select('name', 'close', 'volume')
      .limit(5)
      .getScannerData({
        cookies: EXAMPLE_COOKIES,
        headers: {
          'User-Agent': 'Custom User Agent',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 30000, // 30 seconds timeout
      });

    console.log('Data fetched with custom configuration:');
    result.data.forEach(row => {
      console.log(`${row.ticker}: ${row.name} - $${row.close}`);
    });

  } catch (error) {
    console.error('Error with custom headers:', error);
  }
}

// Cookie string format example
async function cookieStringExample(): Promise<void> {
  console.log('\n=== Cookie String Format Example ===');
  
  try {
    // You can also pass cookies as a string
    const cookieString = 'sessionid=your-session-id; csrftoken=your-csrf-token';
    
    const result = await new Query()
      .select('name', 'close')
      .limit(3)
      .getScannerData({ cookies: cookieString });

    console.log('Data fetched with cookie string:');
    result.data.forEach(row => {
      console.log(`${row.ticker}: ${row.name} - $${row.close}`);
    });

  } catch (error) {
    console.error('Error with cookie string:', error);
  }
}

// Run all real-time examples
async function runRealTimeExamples(): Promise<void> {
  console.log('🚀 TradingView Screener - Real-Time Data Examples\n');
  console.log('⚠️  Note: These examples require valid TradingView session cookies');
  console.log('📝 Please update EXAMPLE_COOKIES with your actual session data\n');

  await checkUpdateModes();
  await realTimeDataExample();
  await compareDelayedVsRealTime();
  await premiumDataExample();
  await customHeadersExample();
  await cookieStringExample();
}

// Instructions for getting cookies
function printCookieInstructions(): void {
  console.log('\n📋 How to get your TradingView session cookies:');
  console.log('1. Go to https://www.tradingview.com and log in');
  console.log('2. Open Developer Tools (F12 or Ctrl+Shift+I)');
  console.log('3. Go to Application tab > Storage > Cookies > https://www.tradingview.com');
  console.log('4. Find and copy the "sessionid" value');
  console.log('5. Replace the EXAMPLE_COOKIES in this file with your actual cookies');
  console.log('\nAlternatively, you can copy all cookies as a string from the Network tab');
}

// Run examples if this file is executed directly
if (require.main === module) {
  printCookieInstructions();
  runRealTimeExamples();
}
