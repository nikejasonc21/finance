import Solver from 'javascript-lp-solver';
import { OptimizationConfig, OptimizationResultItem, Scenario } from '../types';
import { npv, irr } from './finance';

interface ScenarioKpis { npv: number; irr: number; carbon: number; risk: number; capex: number }

function scenarioKpis(s: Scenario, discountRatePct: number, planningYears: number): ScenarioKpis {
  const annualDeltaCash = s.deltaRevenue - s.deltaOpex;
  const cashflows = Array(planningYears).fill(annualDeltaCash);
  const scenarioNpv = -s.capex + npv(discountRatePct, cashflows);
  const scenarioIrr = irr([-s.capex, ...cashflows]);
  const carbon = s.deltaCarbonTons;
  const risk = s.deltaSlaRiskPct;
  return { npv: scenarioNpv, irr: scenarioIrr, carbon, risk, capex: Math.max(0, s.capex) };
}

export function optimizeScenarios(scenarios: Scenario[], config: OptimizationConfig): OptimizationResultItem[] {
  const kpis = scenarios.map(s => scenarioKpis(s, config.discountRatePct, config.planningYears));

  const values = {
    npv: kpis.map(k => k?.npv ?? 0),
    irr: kpis.map(k => k?.irr ?? 0),
    carbon: kpis.map(k => -(k?.carbon ?? 0)),
    risk: kpis.map(k => -(k?.risk ?? 0))
  } as const;

  const mins = Object.fromEntries(Object.entries(values).map(([k, arr]) => [k, Math.min(...(arr as number[]))])) as Record<keyof typeof values, number>;
  const maxs = Object.fromEntries(Object.entries(values).map(([k, arr]) => [k, Math.max(...(arr as number[]))])) as Record<keyof typeof values, number>;
  const norm = (v: number, key: keyof typeof values) => {
    const min = mins[key];
    const max = maxs[key];
    return max === min ? 0.5 : (v - min) / (max - min);
  };

  const weights = config.objectiveWeights;
  const scores = kpis.map(k => (
    weights.npv * norm(k.npv, 'npv') +
    weights.irr * norm(k.irr, 'irr') +
    weights.carbon * norm(-(k.carbon), 'carbon') +
    weights.risk * norm(-(k.risk), 'risk')
  ));

  const model: any = { optimize: 'score', opType: 'max', constraints: {}, variables: {}, ints: {} };

  model.constraints['capex'] = { max: config.budgetCapex };
  if (config.carbonBudgetTons !== undefined) {
    model.constraints['carbon'] = { max: config.carbonBudgetTons };
  }
  model.constraints['risk'] = { max: config.slaRiskMaxPct };

  const assetIds = Array.from(new Set(scenarios.map(s => s.assetId)));
  for (const assetId of assetIds) {
    model.constraints[`asset_${assetId}`] = { max: 1 };
  }

  scenarios.forEach((s, i) => {
    const vid = s.id;
    const k = kpis[i]!;
    const score = scores[i] ?? 0;
    model.variables[vid] = {
      score,
      capex: k.capex,
      carbon: Math.max(0, s.deltaCarbonTons),
      risk: Math.max(0, s.deltaSlaRiskPct),
      [`asset_${s.assetId}`]: 1
    };
    model.ints[vid] = 1;
  });

  const result = Solver.Solve(model) as any;
  const selectedVariables = Object.keys(result).filter(k => k !== 'feasible' && k !== 'result' && k !== 'bounded');
  const chosen = new Set(selectedVariables.filter(k => result[k] === 1));

  return scenarios.map((s, i) => ({
    scenarioId: s.id,
    assetId: s.assetId,
    selected: chosen.has(s.id),
    score: scores[i] ?? 0
  }));
}