import { Asset, Forecast } from '../types';

export function forecastForAsset(asset: Asset): Forecast {
  const utilizationFactor = asset.utilizationPct / 100;
  const margin = asset.annualRevenue - asset.annualOpex;
  const roi = (margin / Math.max(asset.annualOpex, 1)) * 100;

  // Heuristic: older assets have rising opex trend; low-utilization assets may have negative ROI trend
  const agePenalty = Math.max(0, asset.ageYears - 5) * 0.8;
  const opexTrend = Math.min(20, 3 + agePenalty - utilizationFactor * 2);

  const eolBase = asset.type === 'Tower' ? 25 : asset.type === 'FiberRoute' ? 40 : 20;
  const eolYearsRemaining = Math.max(1, eolBase - asset.ageYears - (asset.slaRiskPct / 20));

  return {
    assetId: asset.id,
    roiNext12mPct: Math.max(-50, Math.min(200, roi - (1 - utilizationFactor) * 30)),
    opexTrendPctYoY: opexTrend,
    endOfLifeInYears: Math.round(eolYearsRemaining)
  };
}

export function batchForecast(assets: Asset[]): Forecast[] {
  return assets.map(forecastForAsset);
}