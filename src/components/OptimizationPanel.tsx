import React, { useMemo, useState } from 'react';
import { useAppState } from '../state';
import { optimizeScenarios } from '../utils/optimization';
import { Scenario } from '../types';
import { paybackPeriodYears } from '../utils/finance';

export default function OptimizationPanel() {
  const { scenarios, config } = useAppState();
  const [results, setResults] = useState<ReturnType<typeof optimizeScenarios> | null>(null);

  const ranked = useMemo(() => {
    if (!results) return [];
    const map = new Map(results.map(r => [r.scenarioId, r]));
    return [...scenarios]
      .map(s => ({ s, r: map.get(s.id)! }))
      .filter(x => x.r)
      .sort((a, b) => b.r.score - a.r.score)
      .slice(0, 20);
  }, [results, scenarios]);

  const run = () => {
    const res = optimizeScenarios(scenarios, config);
    setResults(res);
  };

  return (
    <div className="card">
      <div className="section-title">AI Optimization & Recommendations</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={run}>Run Optimization</button>
        <span style={{ color: '#9ca3af' }}>Budget Capex: ${config.budgetCapex.toLocaleString()} • Discount: {config.discountRatePct}% • Horizon: {config.planningYears}y</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Action</th>
            <th>Score</th>
            <th>Capex</th>
            <th>ΔRev</th>
            <th>ΔOpex</th>
            <th>Payback</th>
            <th>ΔCarbon</th>
            <th>Rationale</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map(({ s, r }) => (
            <Row key={s.id} s={s} score={r.score} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ s, score }: { s: Scenario; score: number }) {
  const payback = paybackPeriodYears(s.capex, s.deltaRevenue - s.deltaOpex);
  const rationale = [
    s.deltaRevenue > 0 ? 'grows revenue' : s.deltaRevenue < 0 ? 'reduces revenue' : undefined,
    s.deltaOpex < 0 ? 'cuts opex' : s.deltaOpex > 0 ? 'raises opex' : undefined,
    s.deltaCarbonTons < 0 ? 'cuts carbon' : s.deltaCarbonTons > 0 ? 'adds carbon' : undefined,
    s.deltaSlaRiskPct < 0 ? 'lowers SLA risk' : s.deltaSlaRiskPct > 0 ? 'raises SLA risk' : undefined
  ].filter(Boolean).join(', ');
  return (
    <tr>
      <td>{s.assetId}</td>
      <td><span className="badge">{s.action}</span></td>
      <td>{score.toFixed(3)}</td>
      <td>${Math.max(0, s.capex).toLocaleString()}</td>
      <td>${s.deltaRevenue.toLocaleString()}</td>
      <td>${s.deltaOpex.toLocaleString()}</td>
      <td>{Number.isFinite(payback) ? `${payback.toFixed(1)}y` : 'n/a'}</td>
      <td>{s.deltaCarbonTons.toFixed(2)} t</td>
      <td style={{ color: '#9ca3af' }}>{rationale}</td>
    </tr>
  );
}