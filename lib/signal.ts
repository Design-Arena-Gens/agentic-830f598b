export type IncomingCandle = {
  symbol: string;
  timeframe: string; // e.g., M1, M5, H1
  o: number; h: number; l: number; c: number; v?: number; // last close candle
  indicators?: Record<string, number>;
};

export type Signal = {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  timeframe: string;
  reason?: string;
  createdAt: string;
};

const memory: Signal[] = [];

export function pushSignal(s: Signal) {
  memory.unshift(s);
  if (memory.length > 200) memory.length = 200;
}

export function getSignals(): Signal[] {
  return memory;
}
