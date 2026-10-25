/** How often a contribution is made. */
export type ContributionFrequency = 'month' | 'year';

/** Where the annual rates of return come from. */
export type ReturnsMode = 'own' | 'historical';

/** A period: consecutive years with the same contribution and (in own mode) the same return. */
export interface Period {
  id: number;
  years: number;
  /** Contribution in PLN – monthly or yearly depending on the frequency. */
  contribution: number;
  /** Annual rate of return in %. Used only in own mode. */
  rate: number;
}

/** Overridden returns of single years: year index (from 0) → rate in %. */
export type RateOverrides = Record<number, number>;

/** Settings of one simulated year, ready to be computed. */
export interface YearPlan {
  /** Index of the period the contribution comes from. */
  periodIndex: number;
  contribution: number;
  /** Annual rate of return in %. */
  rate: number;
  /** Annual inflation in %. */
  inflation: number;
  /** Calendar year – historical mode only. */
  calendarYear?: number;
  overridden: boolean;
}

/** Result of one simulated year. Nominal amounts in PLN. */
export interface YearResult {
  paidInYear: number;
  gainInYear: number;
  totalPaid: number;
  value: number;
  /** Portfolio value in prices from the start of the investment. */
  realValue: number;
  /** Total contributions converted to prices from the start of the investment. */
  realPaid: number;
}

export interface SimulationSettings {
  initialAmount: number;
  frequency: ContributionFrequency;
}

export interface Summary {
  finalValue: number;
  totalPaid: number;
  profit: number;
  /** Geometric mean of annual rates of return, in %. */
  averageReturn: number;
  realValue: number;
  realProfit: number;
}
