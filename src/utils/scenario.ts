import { Asset, Scenario, ScenarioAction } from '../types';

function scenarioId(assetId: string, action: ScenarioAction): string {
  return `${assetId}:${action}`;
}

export function generateScenariosForAsset(asset: Asset): Scenario[] {
  const baseRevenue = asset.annualRevenue;
  const baseOpex = asset.annualOpex;

  return [
    {
      id: scenarioId(asset.id, 'Reinvest'),
      assetId: asset.id,
      action: 'Reinvest',
      capex: 0.2 * (baseRevenue + baseOpex),
      deltaRevenue: 0.15 * baseRevenue,
      deltaOpex: -0.05 * baseOpex,
      deltaEnergyKwh: -0.08 * asset.annualEnergyKwh,
      deltaCarbonTons: -0.1 * asset.annualCarbonTons,
      deltaSlaRiskPct: -10,
      description: 'Upgrade capacity and efficiency to drive growth'
    },
    {
      id: scenarioId(asset.id, 'Retrofit'),
      assetId: asset.id,
      action: 'Retrofit',
      capex: 0.1 * (baseRevenue + baseOpex),
      deltaRevenue: 0.05 * baseRevenue,
      deltaOpex: -0.12 * baseOpex,
      deltaEnergyKwh: -0.2 * asset.annualEnergyKwh,
      deltaCarbonTons: -0.25 * asset.annualCarbonTons,
      deltaSlaRiskPct: -15,
      description: 'Energy and maintenance retrofits to cut costs and carbon'
    },
    {
      id: scenarioId(asset.id, 'Repurpose'),
      assetId: asset.id,
      action: 'Repurpose',
      capex: 0.05 * (baseRevenue + baseOpex),
      deltaRevenue: 0.08 * baseRevenue,
      deltaOpex: 0.02 * baseOpex,
      deltaEnergyKwh: 0,
      deltaCarbonTons: 0,
      deltaSlaRiskPct: -5,
      description: 'Shift to new demand (e.g., edge compute)'
    },
    {
      id: scenarioId(asset.id, 'Divest'),
      assetId: asset.id,
      action: 'Divest',
      capex: -0.5 * baseRevenue, // proceeds
      deltaRevenue: -baseRevenue,
      deltaOpex: -baseOpex,
      deltaEnergyKwh: -asset.annualEnergyKwh,
      deltaCarbonTons: -asset.annualCarbonTons,
      deltaSlaRiskPct: 5,
      description: 'Sell asset to recycle capital'
    },
    {
      id: scenarioId(asset.id, 'Decommission'),
      assetId: asset.id,
      action: 'Decommission',
      capex: 0.02 * (baseRevenue + baseOpex), // dismantle cost
      deltaRevenue: -baseRevenue,
      deltaOpex: -baseOpex,
      deltaEnergyKwh: -asset.annualEnergyKwh,
      deltaCarbonTons: -asset.annualCarbonTons,
      deltaSlaRiskPct: -20,
      description: 'Retire asset at end of life'
    }
  ];
}

export function generateScenarios(assets: Asset[]): Scenario[] {
  return assets.flatMap(generateScenariosForAsset);
}