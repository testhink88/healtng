import React from "react";

/**
 * Props:
 * - nps: [{ x: ISO, y: number(-100..100) }]
 * - csat: [{ x: ISO, y: number(1..5) }]
 * - reasons: [{ reason: string, count: number }]
 * - compact?: boolean
 */
export default function SatisfactionTrendsChart({ nps = [], csat = [], reasons = [], compact = false }) {
  const w = compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";
  const barMax = Math.max(1, ...reasons.map(r => r.count || 0));

  return (
    <div className={`grid ${w} gap-4`}>
      <MiniLine title="NPS" data={nps} min={-100} max={100} />
      <MiniLine title="CSAT" data={csat} min={1} max={5} />
      <div className="md:col-span-2">
        <div className="text-sm font-medium mb-2">Motivos (último período)</div>
        <div className="space-y-2">
          {reasons.map((r) => {
            const pct = (r.count / barMax) * 100;
            return (
              <div key={r.reason}>
                <div className="text-xs mb-1">{r.reason} <span className="text-muted-foreground">({r.count})</span></div>
                <div className="h-2 bg-muted rounded">
                  <div className="h-2 bg-primary/60 rounded" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniLine({ title, data = [], min, max }) {
  if (!data.length) return null;
  const ys = data.map(p => p.y);
  const lo = min ?? Math.min(...ys);
  const hi = max ?? Math.max(...ys);
  const span = Math.max(1e-6, hi - lo);

  return (
    <div className="border border-border rounded p-3">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="w-full flex items-end gap-[6px] h-24">
        {data.map((p, i) => {
          const v = (p.y - lo) / span;
          return (
            <div
              key={i}
              className="w-2 bg-foreground/30 rounded-sm"
              title={`${p.x.slice(0,10)}: ${p.y}`}
              style={{ height: `${Math.max(6, v * 90)}%` }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{data[0].x.slice(0,10)}</span>
        <span>{data[data.length-1].x.slice(0,10)}</span>
      </div>
    </div>
  );
}
