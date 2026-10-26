import { describe, expect, it } from 'vitest';
import { growthIndex, maxDrawdown, yearExtremes } from './priceIndex';

describe('growthIndex', () => {
  it('starts at the base value and compounds the annual returns', () => {
    const index = growthIndex([10, -50, 100]);
    [100, 110, 55, 110].forEach((expected, i) => expect(index[i]).toBeCloseTo(expected, 10));
    expect(index).toHaveLength(4);
  });

  it('uses a custom start value', () => {
    expect(growthIndex([5], 1000)).toEqual([1000, 1050]);
  });
});

describe('maxDrawdown', () => {
  it('finds the largest fall from a previous peak', () => {
    // 100 → 120 (peak) → 60 → 90 → 150 → 120
    const result = maxDrawdown([100, 120, 60, 90, 150, 120]);
    expect(result).toEqual({ percent: -50, peak: 1, trough: 2 });
  });

  it('is 0 for an index that only rises', () => {
    expect(maxDrawdown(growthIndex([5, 10, 3])).percent).toBe(0);
  });

  it('measures the 2000–2002 S&P 500 bear market from annual data', () => {
    const { percent } = maxDrawdown(growthIndex([-9.10, -11.89, -22.10]));
    expect(percent).toBeCloseTo(((1 - 0.091) * (1 - 0.1189) * (1 - 0.221) - 1) * 100, 10);
  });
});

describe('yearExtremes', () => {
  it('returns the best and worst year with their positions', () => {
    expect(yearExtremes([3, -37, 26, 15])).toEqual({
      best: { position: 2, rate: 26 },
      worst: { position: 1, rate: -37 },
    });
  });
});
