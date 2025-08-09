import Papa from 'papaparse';
import { Asset, DecisionLogEntry } from '../types';

export function parseAssetsCsv(csvText: string): Asset[] {
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) {
    throw new Error(parsed.errors.map(e => e.message).join('; '));
  }
  const rows = parsed.data as Record<string, string>[];
  return rows.map((r, idx) => ({
    id: r.id || String(idx + 1),
    name: r.name || `Asset ${idx + 1}`,
    type: (r.type as Asset['type']) || 'Tower',
    ageYears: Number(r.ageYears || 0),
    utilizationPct: Number(r.utilizationPct || 0),
    annualRevenue: Number(r.annualRevenue || 0),
    annualOpex: Number(r.annualOpex || 0),
    annualEnergyKwh: Number(r.annualEnergyKwh || 0),
    annualCarbonTons: Number(r.annualCarbonTons || 0),
    slaRiskPct: Number(r.slaRiskPct || 0)
  }));
}

export function decisionLogToCsv(entries: DecisionLogEntry[]): string {
  return Papa.unparse(entries);
}