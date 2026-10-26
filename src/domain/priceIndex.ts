/**
 * Price path of an asset rebuilt from its annual total returns (dividends reinvested).
 * Element 0 is the starting value, element i is the value at the end of year i.
 */
export function growthIndex(rates: number[], start = 100): number[] {
  const index = [start];
  for (const rate of rates) index.push(index[index.length - 1] * (1 + rate / 100));
  return index;
}

export interface Drawdown {
  /** Fall from the peak to the trough, in % (negative, or 0 if the index never fell). */
  percent: number;
  /** Positions in the index (0 = start) of the peak and of the lowest point after it. */
  peak: number;
  trough: number;
}

/** Largest fall from a previous peak. With annual data, falls within a year are not visible. */
export function maxDrawdown(index: number[]): Drawdown {
  let worst: Drawdown = { percent: 0, peak: 0, trough: 0 };
  let peak = 0;
  index.forEach((value, i) => {
    if (value > index[peak]) peak = i;
    const percent = (value / index[peak] - 1) * 100;
    if (percent < worst.percent) worst = { percent, peak, trough: i };
  });
  return worst;
}

export interface YearExtreme {
  /** Position of the year in the rates array. */
  position: number;
  rate: number;
}

/** Best and worst single year. */
export function yearExtremes(rates: number[]): { best: YearExtreme; worst: YearExtreme } {
  let best = 0;
  let worst = 0;
  rates.forEach((rate, i) => {
    if (rate > rates[best]) best = i;
    if (rate < rates[worst]) worst = i;
  });
  return {
    best: { position: best, rate: rates[best] },
    worst: { position: worst, rate: rates[worst] },
  };
}
