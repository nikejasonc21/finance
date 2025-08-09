import React, { useMemo } from 'react';
import { useAppState } from '../state';
import { Forecast } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function kpiBox(label: string, value: string) {
  return (
    <div className="card kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}

function riskColor(pct: number) {
  if (pct < 10) return '#22c55e';
  if (pct < 20) return '#eab308';
  return '#ef4444';
}

export default function Dashboard() {
  const { assets, forecasts } = useAppState();

  const kpis = useMemo(() => {
    const portfolioIrr = forecasts.length ? (forecasts.reduce((a, f) => a + f.roiNext12mPct, 0) / forecasts.length) : 0;
    const carbonSavings = assets.reduce((a, as) => a + Math.max(0, 0.15 * as.annualCarbonTons), 0);
    const slaRisk = assets.length ? (assets.reduce((a, as) => a + as.slaRiskPct, 0) / assets.length) : 0;
    return { portfolioIrr, carbonSavings, slaRisk };
  }, [assets, forecasts]);

  const chartData: Array<{ name: string; roi: number; opex: number }> = forecasts.map((f: Forecast, i) => ({
    name: assets[i]?.name || f.assetId,
    roi: f.roiNext12mPct,
    opex: f.opexTrendPctYoY
  }));

  return (
    <div className="grid cols-3">
      {kpiBox('Portfolio ROI (next 12m)', `${kpis.portfolioIrr.toFixed(1)}%`)}
      {kpiBox('Potential Carbon Savings', `${kpis.carbonSavings.toFixed(1)} tCO2e/yr`)}
      {kpiBox('Avg SLA Risk', `${kpis.slaRisk.toFixed(1)}%`)}

      <div className="card" style={{ gridColumn: '1 / span 2' }}>
        <div className="section-title">Asset Heatmap</div>
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>ROI 12m</th>
              <th>OPEX Trend</th>
              <th>SLA Risk</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f, idx) => (
              <tr key={f.assetId}>
                <td>{assets[idx]?.name || f.assetId}</td>
                <td><span className="badge">{assets[idx]?.type}</span></td>
                <td style={{ color: f.roiNext12mPct >= 0 ? '#22c55e' : '#ef4444' }}>{f.roiNext12mPct.toFixed(1)}%</td>
                <td>{f.opexTrendPctYoY.toFixed(1)}%</td>
                <td style={{ color: riskColor(assets[idx]?.slaRiskPct || 0) }}>{assets[idx]?.slaRiskPct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="section-title">Forecast Overview</div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gRoi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gOpex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af"/>
              <YAxis stroke="#9ca3af"/>
              <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid #223049', color: '#e5e7eb' }} />
              <Area type="monotone" dataKey="roi" stroke="#22c55e" fillOpacity={1} fill="url(#gRoi)" />
              <Area type="monotone" dataKey="opex" stroke="#38bdf8" fillOpacity={1} fill="url(#gOpex)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}