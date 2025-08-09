import React from 'react';
import { useAppState } from '../state';
import { decisionLogToCsv } from '../utils/csv';

export default function DecisionLog() {
  const { decisions, removeDecision } = useAppState();
  const csv = decisionLogToCsv(decisions);
  const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <div className="card">
      <div className="section-title">Decision Log</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <a className="ghost button" href={url} download={`decision_log.csv`}>
          <button className="secondary">Export CSV</button>
        </a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Asset</th>
            <th>Scenario</th>
            <th>Action</th>
            <th>IRR</th>
            <th>NPV</th>
            <th>ΔCarbon</th>
            <th>Rationale</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {decisions.map(d => (
            <tr key={d.id}>
              <td>{new Date(d.timestampIso).toLocaleString()}</td>
              <td>{d.user}</td>
              <td>{d.assetId}</td>
              <td>{d.scenarioId}</td>
              <td><span className="badge">{d.action}</span></td>
              <td>{d.expectedIrrPct.toFixed(1)}%</td>
              <td>${d.expectedNpv.toLocaleString()}</td>
              <td>{d.expectedCarbonDelta.toFixed(1)} t</td>
              <td style={{ color: '#9ca3af' }}>{d.rationale}</td>
              <td><button className="ghost" onClick={() => removeDecision(d.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}