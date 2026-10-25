import { describe, expect, it } from 'vitest';
import { findAsset } from '../data/assets';
import { CURRENCIES } from '../data/currencies';
import { lastYear } from '../data/series';
import { convertReturn, exchangeFactor, marketDataFor } from './currency';
import { availableRange } from './historical';

describe('exchange rate data', () => {
  it.each(CURRENCIES.map(currency => [currency.code, currency] as const))(
    '%s: rates and inflation run to the same year',
    (_, currency) => {
      expect(lastYear(currency.perUsd)).toBe(2025);
      expect(lastYear(currency.inflation)).toBe(2025);
      expect(currency.perUsd.values.every(rate => rate > 0)).toBe(true);
    },
  );
});

describe('exchangeFactor', () => {
  it('is 1 for the same currency', () => {
    expect(exchangeFactor('PLN', 'PLN', 2010)).toBe(1);
  });

  it('reflects the dollar strengthening against the złoty in 2008', () => {
    // December 2007: 2.4726 PLN per USD, December 2008: 2.9714
    expect(exchangeFactor('USD', 'PLN', 2008)).toBeCloseTo(2.9714 / 2.4726, 10);
  });

  it('is symmetric: there and back gives no change', () => {
    expect(exchangeFactor('EUR', 'GBP', 2016) * exchangeFactor('GBP', 'EUR', 2016)).toBeCloseTo(1, 12);
  });
});

describe('convertReturn', () => {
  it('softens the 2008 S&P 500 loss for a Polish investor', () => {
    const inPln = convertReturn(-37, 'USD', 'PLN', 2008);
    expect(inPln).toBeCloseTo((0.63 * 2.9714 / 2.4726 - 1) * 100, 10);
    expect(inPln).toBeGreaterThan(-37);
  });

  it('round-trips through another currency', () => {
    const inEur = convertReturn(12, 'USD', 'EUR', 2014);
    expect(convertReturn(inEur, 'EUR', 'USD', 2014)).toBeCloseTo(12, 10);
  });
});

describe('marketDataFor', () => {
  it('keeps the original series when the currency matches', () => {
    const sp500 = findAsset('sp500');
    expect(marketDataFor(sp500, 'USD').returns).toBe(sp500.returns);
  });

  it('pairs returns with the inflation of the investor\'s currency', () => {
    expect(marketDataFor(findAsset('sp500'), 'PLN').inflation.id).toBe('pl-cpi');
    expect(marketDataFor(findAsset('wig'), 'GBP').inflation.id).toBe('uk-cpi');
  });

  it('limits the years to where exchange rates and inflation exist', () => {
    expect(availableRange(marketDataFor(findAsset('sp500'), 'USD'))).toEqual([1986, 2025]);
    expect(availableRange(marketDataFor(findAsset('sp500'), 'PLN'))).toEqual([1995, 2025]);
    expect(availableRange(marketDataFor(findAsset('sp500'), 'EUR'))).toEqual([1986, 2025]);
    expect(availableRange(marketDataFor(findAsset('wig'), 'USD'))).toEqual([1995, 2025]);
  });
});
