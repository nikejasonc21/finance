import { create } from 'zustand';
import { Asset, DecisionLogEntry, Forecast, OptimizationConfig, Scenario } from './types';
import { batchForecast } from './utils/aiForecast';
import { generateScenarios } from './utils/scenario';
import { load, save } from './utils/storage';

interface AppState {
  assets: Asset[];
  forecasts: Forecast[];
  scenarios: Scenario[];
  decisions: DecisionLogEntry[];
  config: OptimizationConfig;
  setAssets: (assets: Asset[]) => void;
  addDecision: (d: DecisionLogEntry) => void;
  removeDecision: (id: string) => void;
  reset: () => void;
}

const defaultConfig: OptimizationConfig = {
  objectiveWeights: { npv: 0.4, irr: 0.3, carbon: 0.2, risk: 0.1 },
  discountRatePct: 10,
  budgetCapex: 5_000_000,
  slaRiskMaxPct: 100,
  carbonBudgetTons: undefined,
  planningYears: 5
};

export const useAppState = create<AppState>((set, get) => ({
  assets: load<Asset[]>('assets', []),
  forecasts: load<Forecast[]>('forecasts', []),
  scenarios: load<Scenario[]>('scenarios', []),
  decisions: load<DecisionLogEntry[]>('decisions', []),
  config: load<OptimizationConfig>('config', defaultConfig),

  setAssets: (assets) => {
    const forecasts = batchForecast(assets);
    const scenarios = generateScenarios(assets);
    save('assets', assets);
    save('forecasts', forecasts);
    save('scenarios', scenarios);
    set({ assets, forecasts, scenarios });
  },

  addDecision: (d) => {
    const decisions = [...get().decisions, d];
    save('decisions', decisions);
    set({ decisions });
  },

  removeDecision: (id) => {
    const decisions = get().decisions.filter(d => d.id !== id);
    save('decisions', decisions);
    set({ decisions });
  },

  reset: () => {
    save('assets', []);
    save('forecasts', []);
    save('scenarios', []);
    save('decisions', []);
    save('config', defaultConfig);
    set({ assets: [], forecasts: [], scenarios: [], decisions: [], config: defaultConfig });
  }
}));