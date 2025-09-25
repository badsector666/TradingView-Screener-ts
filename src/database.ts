import { KLineDataSet } from './types';
import { createClient, Client, Row } from '@libsql/client';

interface DatabaseRow {
  symbol: string;
  timeframe: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  lastUpdate: number;
}

export class KLineDatabase {
  private db: Client;

  constructor(dbUrl: string, authToken: string) {
    this.db = createClient({
      url: dbUrl,
      authToken: authToken,
    });
  }

  async initialize(): Promise<void> {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS klines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        time INTEGER NOT NULL,
        open REAL NOT NULL,
        high REAL NOT NULL,
        low REAL NOT NULL,
        close REAL NOT NULL,
        volume REAL NOT NULL,
        lastUpdate INTEGER NOT NULL,
        UNIQUE(symbol, timeframe, time)
      )
    `);

    console.log('Database initialized');
  }

  async saveKLineData(data: KLineDataSet): Promise<void> {
    const insertQuery = `
      INSERT OR REPLACE INTO klines
      (symbol, timeframe, time, open, high, low, close, volume, lastUpdate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const period of data.periods) {
      await this.db.execute({
        sql: insertQuery,
        args: [
          data.symbol,
          data.timeframe,
          period.time,
          period.open,
          period.high,
          period.low,
          period.close,
          period.volume,
          data.lastUpdate
        ]
      });
    }

    console.log(`Saved ${data.periods.length} periods for ${data.symbol} ${data.timeframe}`);
  }

  async getKLineData(symbol: string, timeframe: string, limit: number = 100): Promise<KLineDataSet> {
    const query = `
      SELECT * FROM klines
      WHERE symbol = ? AND timeframe = ?
      ORDER BY time DESC
      LIMIT ?
    `;

    const result = await this.db.execute({
      sql: query,
      args: [symbol, timeframe, limit]
    });

    const rows = result.rows as Row[];

    const periods = rows.map(row => ({
      time: row.time as number,
      open: row.open as number,
      high: row.high as number,
      low: row.low as number,
      close: row.close as number,
      volume: row.volume as number
    }));

    return {
      symbol,
      timeframe,
      periods,
      lastUpdate: Date.now()
    };
  }

  async close(): Promise<void> {
    await this.db.close();
    console.log('Database connection closed');
  }
}