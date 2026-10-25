import type { SimulationSettings, Summary, YearPlan, YearResult } from './types';

/** Monthly rate that compounds to the given annual rate (in %) over 12 months. */
export function monthlyRate(annualPercent: number): number {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

/**
 * Simulates the portfolio month by month.
 *
 * The contribution is added at the start of the month (or year), then the portfolio grows
 * by the monthly rate. A cumulative price level is tracked alongside to report real values.
 */
export function simulate(plan: YearPlan[], settings: SimulationSettings): YearResult[] {
  const monthly = settings.frequency === 'month';
  let value = settings.initialAmount;
  let totalPaid = settings.initialAmount;
  let realPaid = settings.initialAmount;
  let priceLevel = 1;

  return plan.map(({ contribution, rate, inflation }) => {
    const growth = monthlyRate(rate);
    const priceGrowth = monthlyRate(inflation);
    const valueAtStart = value;
    let paidInYear = 0;

    const pay = () => {
      value += contribution;
      paidInYear += contribution;
      realPaid += contribution / priceLevel;
    };

    if (!monthly) pay();
    for (let month = 0; month < 12; month++) {
      if (monthly) pay();
      value *= 1 + growth;
      priceLevel *= 1 + priceGrowth;
    }

    totalPaid += paidInYear;
    return {
      paidInYear,
      gainInYear: value - valueAtStart - paidInYear,
      totalPaid,
      value,
      realValue: value / priceLevel,
      realPaid,
    };
  });
}

/** Geometric mean of annual rates of return, in %. */
export function averageReturn(rates: number[]): number {
  if (rates.length === 0) return 0;
  const growth = rates.reduce((acc, rate) => acc * (1 + rate / 100), 1);
  return (Math.pow(growth, 1 / rates.length) - 1) * 100;
}

export function summarize(plan: YearPlan[], results: YearResult[], initialAmount: number): Summary {
  const last = results.at(-1) ?? {
    value: initialAmount, totalPaid: initialAmount, realValue: initialAmount, realPaid: initialAmount,
  };
  return {
    finalValue: last.value,
    totalPaid: last.totalPaid,
    profit: last.value - last.totalPaid,
    averageReturn: averageReturn(plan.map(year => year.rate)),
    realValue: last.realValue,
    realProfit: last.realValue - last.realPaid,
  };
}
