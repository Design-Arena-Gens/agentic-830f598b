"use client";

import { useEffect, useState } from "react";

type Health = { status: string; time: string };

type Signal = {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  timeframe: string;
  reason?: string;
  createdAt: string;
};

export default function Page() {
  const [health, setHealth] = useState<Health | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});

    const i = setInterval(() => {
      fetch("/api/signal")
        .then((r) => r.json())
        .then((data) => setSignals(data.signals || []))
        .catch(() => {});
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 28 }}>Agentic FX Bot</h1>
        <div style={{ fontSize: 14, color: '#334155' }}>
          {health ? (
            <span>
              Status: <b>{health.status}</b> ? {new Date(health.time).toLocaleTimeString()}
            </span>
          ) : (
            <span>Loading status?</span>
          )}
        </div>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Recent Signals</h2>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>Time</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>Symbol</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>Timeframe</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>Action</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>Confidence</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e2e8f0' }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {signals.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16, color: '#64748b' }}>No signals yet.</td>
                </tr>
              ) : (
                signals.map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{new Date(s.createdAt).toLocaleString()}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{s.symbol}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{s.timeframe}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', color: s.action === 'BUY' ? '#16a34a' : s.action === 'SELL' ? '#dc2626' : '#475569' }}>
                      {s.action}
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>{Math.round(s.confidence * 100)}%</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', maxWidth: 340, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.reason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
