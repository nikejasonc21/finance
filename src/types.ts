export type AssetType = 'Tower' | 'FiberRoute' | 'DataCenter';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  ageYears: number;
  utilizationPct: number; // 0..100
  annualRevenue: number; // USD
  annualOpex: number; // USD
  annualEnergyKwh: number;
  annualCarbonTons: number; // tCO2e
  slaRiskPct: number; // 0..100 probability-weighted risk
}

export interface Forecast {
  assetId: string;
  roiNext12mPct: number;
  opexTrendPctYoY: number;
  endOfLifeInYears: number;
}

export type ScenarioAction = 'Reinvest' | 'Retrofit' | 'Repurpose' | 'Divest' | 'Decommission';

export interface Scenario {
  id: string;
  assetId: string;
  action: ScenarioAction;
  capex: number;
  deltaRevenue: number;
  deltaOpex: number;
  deltaEnergyKwh: number;
  deltaCarbonTons: number;
  deltaSlaRiskPct: number;
  description?: string;
}

export interface OptimizationConfig {
  objectiveWeights: { npv: number; irr: number; carbon: number; risk: number };
  discountRatePct: number;
  budgetCapex: number;
  slaRiskMaxPct: number;
  carbonBudgetTons?: number;
  planningYears: number;
}

export interface OptimizationResultItem {
  scenarioId: string;
  assetId: string;
  selected: boolean;
  score: number;
}

export interface DecisionLogEntry {
  id: string;
  timestampIso: string;
  user: string;
  assetId: string;
  scenarioId: string;
  action: ScenarioAction;
  rationale: string;
  expectedIrrPct: number;
  expectedNpv: number;
  expectedCarbonDelta: number;
}