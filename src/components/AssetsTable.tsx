import React from 'react';
import { useAppState } from '../state';

export default function AssetsTable() {
  const { assets, forecasts } = useAppState();
  return (
    <div className="card">
      <div className="section-title">Assets</div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Age</th>
            <th>Utilization</th>
            <th>Revenue</th>
            <th>Opex</th>
            <th>Energy</th>
            <th>Carbon</th>
            <th>SLA Risk</th>
            <th>Forecast ROI</th>
            <th>Opex Trend</th>
            <th>EOL</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td><span className="badge">{a.type}</span></td>
              <td>{a.ageYears}y</td>
              <td>{a.utilizationPct.toFixed(0)}%</td>
              <td>${a.annualRevenue.toLocaleString()}</td>
              <td>${a.annualOpex.toLocaleString()}</td>
              <td>{a.annualEnergyKwh.toLocaleString()} kWh</td>
              <td>{a.annualCarbonTons.toFixed(1)} t</td>
              <td>{a.slaRiskPct.toFixed(1)}%</td>
              <td>{forecasts[i]?.roiNext12mPct.toFixed(1)}%</td>
              <td>{forecasts[i]?.opexTrendPctYoY.toFixed(1)}%</td>
              <td>{forecasts[i]?.endOfLifeInYears}y</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}