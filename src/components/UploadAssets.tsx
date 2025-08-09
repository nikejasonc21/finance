import React, { useRef } from 'react';
import { parseAssetsCsv } from '../utils/csv';
import { useAppState } from '../state';

export default function UploadAssets() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setAssets = useAppState(s => s.setAssets);

  const onFile = async (file: File) => {
    const text = await file.text();
    const assets = parseAssetsCsv(text);
    setAssets(assets);
  };

  return (
    <div className="card">
      <div className="section-title">Ingest Asset Registry</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => inputRef.current?.click()}>Upload CSV</button>
        <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }} />
        <a className="link" href={`data:text/csv;charset=utf-8,` + encodeURIComponent("id,name,type,ageYears,utilizationPct,annualRevenue,annualOpex,annualEnergyKwh,annualCarbonTons,slaRiskPct\nA1,Tower Alpha,Tower,7,70,1200000,500000,350000,120,8\nF2,Fiber Route 2,FiberRoute,12,55,800000,300000,200000,80,12\nD3,DC East,DataCenter,9,65,5000000,3200000,9000000,2500,15")} download="assets_template.csv">Download CSV Template</a>
      </div>
    </div>
  );
}