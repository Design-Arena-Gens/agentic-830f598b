import { GoogleGenerativeAI } from "@google/generative-ai";

export type SignalDecision = {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number; // 0..1
  reason?: string;
};

export async function analyzeWithGemini(prompt: string): Promise<SignalDecision> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { action: "HOLD", confidence: 0.0, reason: "GEMINI_API_KEY missing" };
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const res = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }]}] });
  const text = res.response.text();

  // very defensive parse
  const lowered = text.toLowerCase();
  let action: SignalDecision["action"] = "HOLD";
  if (lowered.includes("buy")) action = "BUY";
  if (lowered.includes("sell")) action = action === "HOLD" ? "SELL" : action; // prefer first strong cue

  const confMatch = text.match(/(confidence|probability)[^0-9]*([0-9]{1,3})%/i);
  const confidence = confMatch ? Math.max(0, Math.min(100, parseInt(confMatch[2], 10))) / 100 : 0.5;

  return { action, confidence, reason: text.slice(0, 500) };
}
