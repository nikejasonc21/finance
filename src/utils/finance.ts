export function roiPct(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return (revenue - cost) / Math.abs(cost) * 100;
}

export function npv(discountRatePct: number, cashflows: number[]): number {
  const r = discountRatePct / 100;
  return cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t + 1), 0);
}

export function irr(cashflows: number[], guessPct = 10): number {
  // Newton-Raphson simple IRR solver
  let rate = guessPct / 100;
  for (let i = 0; i < 100; i++) {
    let f = 0;
    let df = 0;
    for (let t = 0; t < cashflows.length; t++) {
      const cf = cashflows[t] ?? 0;
      const denom = Math.pow(1 + rate, t + 1);
      f += cf / denom;
      df += - (t + 1) * cf / (denom * (1 + rate));
    }
    const newRate = rate - f / df;
    if (!isFinite(newRate)) break;
    if (Math.abs(newRate - rate) < 1e-7) { rate = newRate; break; }
    rate = newRate;
  }
  return rate * 100;
}

export function paybackPeriodYears(initialOutflow: number, annualInflow: number): number {
  if (annualInflow <= 0) return Infinity;
  return Math.abs(initialOutflow) / annualInflow;
}