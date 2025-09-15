import { Query , col} from '../src';
import fs from 'fs';

/**
 * Example: Get unique symbols
 *
 * This example demonstrates how to get a list of unique symbols from the collected ticker data.
 */
function getUniqueSymbols(tickers: string[]): string[] {
  const uniqueSymbols: Set<string> = new Set();

  tickers.forEach(ticker => {
    const [, symbol] = ticker.split(':');
    uniqueSymbols.add(symbol);
  });

  // Save to JSON file
  fs.writeFileSync('configs/unique_symbols.json', JSON.stringify(Array.from(uniqueSymbols), null, 2));

  return Array.from(uniqueSymbols);
}

/**
 * Example: Get all crypto tickers using pagination
 *
 * This example shows how to retrieve all available cryptocurrency tickers
 * by using pagination with the limit() and offset() methods.
 */
async function getAllCryptoTickers() {
  const allTickers = [];
  let offset = 0;
  const batchSize = 100000;

  while (true) {
    console.log(`Fetching batch starting at offset ${offset}...`);

    const result = await new Query()
      .setMarkets('crypto')
      // .select('name') // Minimal columns for faster requests
      .select('name', 'close', 'volume', 'market_cap_basic')  
      .where(
        col('name').like('USDT.P')
      )  
      .orderBy('market_cap_basic', false) // false = descending 
      .limit(batchSize)
      .offset(offset)
      .getScannerData();

    // Break if no more results
    if (result.data.length === 0) {
      console.log('No more results found');
      break;
    }

    // Extract tickers from this batch
    const tickers = result.data.map(row => row.ticker);
    allTickers.push(...tickers);

    console.log(`Collected ${tickers.length} tickers (total: ${allTickers.length})`);

    // Move to next batch
    offset += batchSize;

    // Optional: Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Save to JSON file
  fs.writeFileSync('configs/all_crypto_tickers.json', JSON.stringify(allTickers, null, 2));

  console.log(`Total tickers collected: ${allTickers.length}`);
  return allTickers;
}

/**
 * Example: Create exchange-symbol mapping
 *
 * This example demonstrates how to create a mapping of exchanges to their
 * respective symbols from the collected ticker data.
 */
function createExchangeMapping(tickers: string[]) {
  const exchangeMap: Record<string, string[]> = {};

  tickers.forEach(ticker => {
    const [exchange, symbol] = ticker.split(':');
    if (!exchangeMap[exchange]) {
      exchangeMap[exchange] = [];
    }
    exchangeMap[exchange].push(symbol);
  });

  // Save to JSON file
  fs.writeFileSync('configs/exchange_mapping.json', JSON.stringify(exchangeMap, null, 2));

  return exchangeMap;
}

// Example usage
(async () => {
  // Get all crypto tickers
  const allTickers = await getAllCryptoTickers();
  // console.log('All Crypto Tickers:', allTickers);

  // Create exchange-symbol mapping
  const exchangeMap = createExchangeMapping(allTickers);
  // console.log('Exchange-Symbol Mapping:', exchangeMap);
  const uniqueSymbols = getUniqueSymbols(allTickers);
  console.log('Unique Symbols:', uniqueSymbols);
})();