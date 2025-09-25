import KLineDataCollector from './downloader';
import { KLineDatabase } from './database';

async function main() {
  // Initialize the data collector
  const collector = new KLineDataCollector({
    // Add your TradingView credentials if needed
    // token: 'your_session_token',
    // signature: 'your_signature'
  });

  // Initialize the database
  const db = new KLineDatabase(
    'YOUR_TURSO_DATABASE_URL',
    'YOUR_TURSO_AUTH_TOKEN'
  );

  try {
    await collector.initialize();
    await db.initialize();

    // Load tickers from JSON file
    const tickers = await collector.loadTickersFromFile('tickers.json');

    // Mode 1: Initial data collection (1200 K-Lines)
    console.log('=== INITIAL DATA COLLECTION ===');
    await collector.collectInitialData(tickers);

    // Save initial data to database
    const collectedData = collector.getCollectedData();
    for (const [key, data] of collectedData.entries()) {
      await db.saveKLineData(data);
    }

    // Mode 2: Real-time updates (optional)
    const startRealtime = process.argv.includes('--realtime');
    if (startRealtime) {
      console.log('=== REAL-TIME UPDATES ===');

      // Set up graceful shutdown
      process.on('SIGINT', async () => {
        console.log('Received SIGINT, shutting down gracefully...');
        collector.stopRealtimeUpdates();
        await db.close();
        await collector.cleanup();
        process.exit(0);
      });

      // Start real-time updates and save to database
      await collector.startRealtimeUpdates(tickers);
    } else {
      await db.close();
      await collector.cleanup();
    }

  } catch (error) {
    console.error('Main execution error:', error);
    await db.close();
    await collector.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}