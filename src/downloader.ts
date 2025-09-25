import { KLineData, KLineDataSet, TimeFrame, TradingViewClientOptions, ChartSession, TradingViewClient } from './types';
const TradingView = require('@mathieuc/tradingview') as { Client: new (options: TradingViewClientOptions) => TradingViewClient };
const fs = require('fs').promises;

class KLineDataCollector {
  private client: TradingViewClient;
  private chart: ChartSession | null;
  private isRunning: boolean;
  private currentSymbol: string | null;
  private currentTimeframe: TimeFrame | null;
  private data: Map<string, KLineDataSet>;
  private timeframes: TimeFrame[];
  private initialRange: number;
  private requestDelay: number;
  private maxRetries: number;
  private realtimeInterval: number;
  private mode: 'initial' | 'realtime';

  constructor(options: TradingViewClientOptions = {}) {
    this.client = new TradingView.Client(options);
    this.chart = null;
    this.isRunning = false;
    this.currentSymbol = null;
    this.currentTimeframe = null;
    this.data = new Map();
    this.timeframes = ['1', '3', '5', '15', '30', '60', '240'];
    this.initialRange = 1200;
    this.requestDelay = 2000;
    this.maxRetries = 3;
    this.realtimeInterval = 60000;
    this.mode = 'initial';
  }

  async initialize(): Promise<void> {
    this.chart = new this.client.Session.Chart();
    this.setupEventHandlers();
    console.log('KLine Data Collector initialized');
  }

  private setupEventHandlers(): void {
    if (!this.chart) return;

    this.chart.onSymbolLoaded(() => {
      console.log(`Symbol loaded: ${this.chart?.infos.full_name}`);
    });

    this.chart.onUpdate((changes: string[]) => {
      if (changes.includes('$prices')) {
        this.handlePriceUpdate();
      }
    });

    this.chart.onError((...messages: any[]) => {
      console.error('Chart error:', messages);
      this.handleError(messages);
    });

    this.client.onError((...messages: any[]) => {
      console.error('Client error:', messages);
      this.handleError(messages);
    });
  }

  private handlePriceUpdate(): void {
    if (!this.chart) return;

    const periods = this.chart.periods;
    if (periods && periods.length > 0 && this.currentSymbol && this.currentTimeframe) {
      const key = `${this.currentSymbol}_${this.currentTimeframe}`;

      this.data.set(key, {
        symbol: this.currentSymbol,
        timeframe: this.currentTimeframe,
        periods: periods.map(p => ({
          time: p.time,
          open: p.open,
          high: p.high,
          low: p.low,
          close: p.close,
          volume: p.volume
        })),
        lastUpdate: Date.now()
      });

      console.log(`Updated ${key}: ${periods.length} periods`);
    }
  }

  private handleError(messages: any[]): 'skip' | 'retry' {
    const errorStr = messages.join(' ');

    if (errorStr.includes('rate') || errorStr.includes('limit')) {
      console.warn('Rate limiting detected, increasing delay');
      this.requestDelay = Math.min(this.requestDelay * 1.5, 10000);
    }

    if (errorStr.includes('Symbol error') || errorStr.includes('invalid symbol')) {
      console.warn(`Invalid symbol: ${this.currentSymbol}`);
      return 'skip';
    }

    if (errorStr.includes('study_not_auth') || errorStr.includes('premium')) {
      console.warn('Premium feature required, skipping');
      return 'skip';
    }

    return 'retry';
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadTickersFromFile(filePath: string): Promise<string[]> {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading tickers file:', error);
      throw error;
    }
  }

  async collectInitialData(tickers: string[]): Promise<void> {
    console.log(`Starting initial data collection for ${tickers.length} tickers`);
    this.mode = 'initial';

    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      console.log(`Processing ticker ${i + 1}/${tickers.length}: ${ticker}`);

      for (const timeframe of this.timeframes) {
        let retries = 0;
        let success = false;

        while (retries < this.maxRetries && !success) {
          try {
            await this.collectDataForSymbolTimeframe(ticker, timeframe, this.initialRange);
            success = true;
          } catch (error) {
            retries++;
            console.warn(`Retry ${retries}/${this.maxRetries} for ${ticker} ${timeframe}:`, (error as Error).message);

            if (retries < this.maxRetries) {
              await this.delay(this.requestDelay * retries);
            }
          }
        }

        if (!success) {
          console.error(`Failed to collect data for ${ticker} ${timeframe} after ${this.maxRetries} retries`);
        }

        await this.delay(this.requestDelay);
      }
    }

    console.log('Initial data collection completed');
  }

  private async collectDataForSymbolTimeframe(symbol: string, timeframe: TimeFrame, range: number = 100): Promise<void> {
    if (!this.chart) return;

    return new Promise((resolve, reject) => {
      this.currentSymbol = symbol;
      this.currentTimeframe = timeframe;

      let symbolLoaded = false;
      let dataReceived = false;

      const timeout = setTimeout(() => {
        if (!dataReceived) {
          reject(new Error(`Timeout waiting for data: ${symbol} ${timeframe}`));
        }
      }, 30000);

      const symbolLoadedHandler = () => {
        symbolLoaded = true;
      };

      const updateHandler = (changes: string[]) => {
        if (changes.includes('$prices') && symbolLoaded) {
          dataReceived = true;
          clearTimeout(timeout);

          if (this.chart) {
            this.chart.onSymbolLoaded(() => {});
            this.chart.onUpdate(() => {});
          }

          resolve();
        }
      };

      const errorHandler = (...messages: any[]) => {
        const action = this.handleError(messages);
        if (action === 'skip') {
          clearTimeout(timeout);
          resolve();
        } else {
          clearTimeout(timeout);
          reject(new Error(messages.join(' ')));
        }
      };

      if (this.chart) {
        this.chart.onSymbolLoaded(symbolLoadedHandler);
        this.chart.onUpdate(updateHandler);
        this.chart.onError(errorHandler);
      }

      this.chart?.setMarket(symbol, {
        timeframe: timeframe,
        range: range
      });
    });
  }

  async startRealtimeUpdates(tickers: string[]): Promise<void> {
    console.log('Starting real-time updates mode');
    this.mode = 'realtime';
    this.isRunning = true;

    while (this.isRunning) {
      for (const ticker of tickers) {
        if (!this.isRunning) break;

        for (const timeframe of this.timeframes) {
          if (!this.isRunning) break;

          try {
            await this.collectDataForSymbolTimeframe(ticker, timeframe, 2);
            console.log(`Updated real-time data for ${ticker} ${timeframe}`);
          } catch (error) {
            console.warn(`Real-time update failed for ${ticker} ${timeframe}:`, (error as Error).message);
          }

          await this.delay(1000);
        }

        await this.delay(2000);
      }

      console.log('Completed real-time update cycle, waiting...');
      await this.delay(this.realtimeInterval);
    }
  }

  stopRealtimeUpdates(): void {
    console.log('Stopping real-time updates');
    this.isRunning = false;
  }

  async saveDataToFile(filePath: string): Promise<void> {
    const dataObject: Record<string, KLineDataSet> = {};
    for (const [key, value] of this.data.entries()) {
      dataObject[key] = value;
    }

    await fs.writeFile(filePath, JSON.stringify(dataObject, null, 2));
    console.log(`Data saved to ${filePath}`);
  }

  getCollectedData(): Map<string, KLineDataSet> {
    return this.data;
  }

  async cleanup(): Promise<void> {
    this.stopRealtimeUpdates();
    if (this.chart) {
      this.chart.delete();
    }
    await this.client.end();
    console.log('Cleanup completed');
  }
}

// Usage example
async function main() {
  const collector = new KLineDataCollector({
    // Add your TradingView credentials if needed
    // token: 'your_session_token',
    // signature: 'your_signature'
  });

  try {
    await collector.initialize();

    // Load tickers from JSON file
    const tickers = await collector.loadTickersFromFile('tickers.json');

    // Mode 1: Initial data collection (1200 K-Lines)
    console.log('=== INITIAL DATA COLLECTION ===');
    await collector.collectInitialData(tickers);

    // Save initial data
    await collector.saveDataToFile('initial_klines_data.json');

    // Mode 2: Real-time updates (optional)
    const startRealtime = process.argv.includes('--realtime');
    if (startRealtime) {
      console.log('=== REAL-TIME UPDATES ===');

      // Set up graceful shutdown
      process.on('SIGINT', async () => {
        console.log('Received SIGINT, shutting down gracefully...');
        collector.stopRealtimeUpdates();
        await collector.saveDataToFile('final_klines_data.json');
        await collector.cleanup();
        process.exit(0);
      });

      await collector.startRealtimeUpdates(tickers);
    } else {
      await collector.cleanup();
    }

  } catch (error) {
    console.error('Main execution error:', error);
    await collector.cleanup();
  }
}

// Export for use as module
export default KLineDataCollector;

// Run if called directly
if (require.main === module) {
  main();
}