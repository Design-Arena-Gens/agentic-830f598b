import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { IncomingCandle, pushSignal, getSignals } from "@/lib/signal";

export async function GET() {
  return NextResponse.json({ signals: getSignals() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { candle: IncomingCandle };
  if (!body?.candle) {
    return NextResponse.json({ error: "Missing candle" }, { status: 400 });
  }

  const { symbol, timeframe, o, h, l, c, indicators } = body.candle;
  const prompt = `You are an FX trading assistant. Given the latest candle and indicators, output a directional decision in BUY/SELL/HOLD with a confidence percentage. Be concise.\n\nSymbol: ${symbol}\nTimeframe: ${timeframe}\nOpen: ${o}\nHigh: ${h}\nLow: ${l}\nClose: ${c}\nIndicators: ${JSON.stringify(indicators || {})}`;

  const decision = await analyzeWithGemini(prompt);
  const record = {
    symbol,
    timeframe,
    action: decision.action,
    confidence: decision.confidence,
    reason: decision.reason,
    createdAt: new Date().toISOString()
  } as const;
  pushSignal(record);

  return NextResponse.json({ ok: true, signal: record });
}
