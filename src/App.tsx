import React from 'react';
import UploadAssets from './components/UploadAssets';
import Dashboard from './components/Dashboard';
import AssetsTable from './components/AssetsTable';
import OptimizationPanel from './components/OptimizationPanel';
import DecisionLog from './components/DecisionLog';

export default function App() {
  return (
    <div>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Network Asset Optimizer</div>
          <span className="badge">Finance + NOC</span>
        </div>
        <div style={{ color: '#9ca3af' }}>Proactive capital recycling • ESG aligned</div>
      </div>

      <div className="layout">
        <div className="sidebar">
          <UploadAssets />
          <div className="hr" />
          <div className="card">
            <div className="section-title">How it works</div>
            <ol style={{ margin: 0, paddingLeft: 16, color: '#9ca3af' }}>
              <li>Upload asset CSV</li>
              <li>AI forecasts ROI and OPEX trends</li>
              <li>Run optimization under budget and SLA constraints</li>
              <li>Review ranked recommendations and log decisions</li>
            </ol>
          </div>
        </div>

        <div className="grid">
          <Dashboard />
          <AssetsTable />
          <OptimizationPanel />
          <DecisionLog />
        </div>
      </div>

      <footer>© {new Date().getFullYear()} Network Asset Optimizer · Built with React + TypeScript</footer>
    </div>
  );
}