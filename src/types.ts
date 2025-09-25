export interface KLineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface KLineDataSet {
  symbol: string;
  timeframe: string;
  periods: KLineData[];
  lastUpdate: number;
}

export type TimeFrame = '1' | '3' | '5' | '15' | '30' | '60' | '240';

export interface TradingViewClientOptions {
  token?: string;
  signature?: string;
}

export interface ChartSession {
  onSymbolLoaded: (callback: () => void) => void;
  onUpdate: (callback: (changes: string[]) => void) => void;
  onError: (callback: (...messages: any[]) => void) => void;
  setMarket: (symbol: string, options: { timeframe: TimeFrame; range: number }) => void;
  delete: () => void;
  infos: { full_name: string };
  periods: KLineData[];
}

export interface TradingViewClient {
  Session: {
    Chart: new () => ChartSession;
  };
  onError: (callback: (...messages: any[]) => void) => void;
  end: () => Promise<void>;
}