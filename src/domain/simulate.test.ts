import { describe, expect, it } from 'vitest';
import { averageReturn, monthlyRate, simulate, summarize } from './simulate';
import type { YearPlan } from './types';

const years = (n: number, year: Partial<YearPlan>): YearPlan[] =>
  Array.from({ length: n }, () => ({
    periodIndex: 0, contribution: 0, rate: 0, inflation: 0, overridden: false, ...year,
  }));

describe('monthlyRate', () => {
  it('po 12 miesiącach daje stopę roczną', () => {
    expect(Math.pow(1 + monthlyRate(7), 12)).toBeCloseTo(1.07, 12);
  });
});

describe('simulate', () => {
  it('bez wpłat i inflacji to zwykły procent składany', () => {
    const results = simulate(years(10, { rate: 7 }), { initialAmount: 1000, frequency: 'month' });
    expect(results.at(-1)!.value).toBeCloseTo(1000 * 1.07 ** 10, 6);
  });

  it('zgadza się z pierwszą wersją: 10 000 zł, 500 zł/mies., 7%, 20 lat', () => {
    const results = simulate(years(20, { rate: 7, contribution: 500 }), { initialAmount: 10000, frequency: 'month' });
    expect(Math.round(results.at(-1)!.value / 100) * 100).toBe(293900);
    expect(results.at(-1)!.totalPaid).toBe(130000);
  });

  it('wpłata roczna na początku roku pracuje cały rok', () => {
    const results = simulate(years(5, { rate: 10, contribution: 1000 }), { initialAmount: 0, frequency: 'year' });
    const expected = [1, 2, 3, 4, 5].reduce((sum, k) => sum + 1000 * 1.1 ** k, 0);
    expect(results.at(-1)!.value).toBeCloseTo(expected, 6);
  });

  it('bez inflacji wartość realna równa się nominalnej', () => {
    const [result] = simulate(years(1, { rate: 5, contribution: 100 }), { initialAmount: 1000, frequency: 'month' });
    expect(result.realValue).toBeCloseTo(result.value, 9);
    expect(result.realPaid).toBeCloseTo(result.totalPaid, 9);
  });

  it('gdy zwrot równa się inflacji, wartość realna stoi w miejscu', () => {
    const results = simulate(years(15, { rate: 4, inflation: 4 }), { initialAmount: 5000, frequency: 'month' });
    expect(results.at(-1)!.realValue).toBeCloseTo(5000, 6);
  });

  it('późniejsze wpłaty są realnie mniej warte', () => {
    const results = simulate(years(10, { contribution: 1000, inflation: 5 }), { initialAmount: 0, frequency: 'year' });
    const expected = Array.from({ length: 10 }, (_, k) => 1000 / 1.05 ** k).reduce((a, b) => a + b);
    expect(results.at(-1)!.realPaid).toBeCloseTo(expected, 6);
  });

  it('zysk w roku to przyrost wartości minus wpłaty', () => {
    const results = simulate(years(3, { rate: 8, contribution: 200 }), { initialAmount: 1000, frequency: 'month' });
    const [first, second] = results;
    expect(second.gainInYear).toBeCloseTo(second.value - first.value - second.paidInYear, 9);
  });
});

describe('summarize', () => {
  it('liczy zysk nominalny i realny', () => {
    const plan = years(10, { rate: 6, contribution: 300, inflation: 3 });
    const results = simulate(plan, { initialAmount: 2000, frequency: 'month' });
    const summary = summarize(plan, results, 2000);
    expect(summary.profit).toBeCloseTo(summary.finalValue - summary.totalPaid, 9);
    expect(summary.realProfit).toBeCloseTo(results.at(-1)!.realValue - results.at(-1)!.realPaid, 9);
    expect(summary.averageReturn).toBeCloseTo(6, 9);
  });
});

describe('averageReturn', () => {
  it('to średnia geometryczna, nie arytmetyczna', () => {
    expect(averageReturn([50, -50])).toBeCloseTo((Math.sqrt(0.75) - 1) * 100, 9);
  });
});
