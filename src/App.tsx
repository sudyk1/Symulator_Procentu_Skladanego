import { useMemo, useState } from 'react';
import { AssetPriceChart } from './components/AssetPriceChart';
import { ComparisonCard } from './components/ComparisonCard';
import { GrowthChart } from './components/GrowthChart';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PeriodsCard } from './components/PeriodsCard';
import { ReturnsCard, type AssetOption, type HistoricalChoice } from './components/ReturnsCard';
import { SettingsCard } from './components/SettingsCard';
import { StatsBar } from './components/StatsBar';
import { YearlyTable } from './components/YearlyTable';
import { MARKET_ASSETS } from './data/assets';
import { marketDataFor, type MarketData } from './domain/currency';
import { availableStartYears, coversWindow, fitWindow } from './domain/historical';
import {
  buildHistoricalPlan, buildOwnPlan, pruneOverrides, randomOverrides, totalYears,
} from './domain/plan';
import { simulate, summarize } from './domain/simulate';
import type { ContributionFrequency, Period, RateOverrides, ReturnsMode } from './domain/types';
import { useI18n } from './i18n/I18nProvider';
import { currencySymbol } from './lib/format';

const RANDOM_SPREAD = 15;
const DEFAULT_HISTORICAL_YEARS = 20;
const DEFAULT_ASSET_ID = 'sp500';

let nextPeriodId = 1;
const newPeriod = (fields: Omit<Period, 'id'>): Period => ({ id: nextPeriodId++, ...fields });

const historicalPlan = (periods: Period[], data: MarketData, window: { years: number; firstYear: number }) =>
  buildHistoricalPlan(periods, { ...data, ...window });

export function App() {
  const { t, currency } = useI18n();
  const [initialAmount, setInitialAmount] = useState(10000);
  const [frequency, setFrequency] = useState<ContributionFrequency>('month');
  const [mode, setMode] = useState<ReturnsMode>('own');
  const [ownInflation, setOwnInflation] = useState(3.5);
  const [historicalChoice, setHistoricalChoice] = useState<HistoricalChoice | null>(null);
  const [periods, setPeriods] = useState(() => [newPeriod({ years: 20, contribution: 500, rate: 7 })]);
  const [overrides, setOverrides] = useState<RateOverrides>({});
  const [compareId, setCompareId] = useState<string | null>(null);

  // Every asset with its returns converted into the selected currency
  const options: AssetOption[] = useMemo(
    () => MARKET_ASSETS.map(asset => ({ asset, data: marketDataFor(asset, currency) })),
    [currency],
  );

  // The stored choice may not fit the data after a currency change (e.g. 40 years in USD, 31 in PLN)
  const historical = useMemo((): HistoricalChoice => {
    const assetId = historicalChoice?.assetId ?? DEFAULT_ASSET_ID;
    const { data } = options.find(option => option.asset.returns.id === assetId)!;
    const firstYear = historicalChoice?.firstYear ?? availableStartYears(data, DEFAULT_HISTORICAL_YEARS)[0];
    return { assetId, ...fitWindow(data, historicalChoice?.years ?? DEFAULT_HISTORICAL_YEARS, firstYear) };
  }, [historicalChoice, options]);
  const selected = options.find(option => option.asset.returns.id === historical.assetId)!;

  const plan = useMemo(() => mode === 'own'
    ? buildOwnPlan(periods, overrides, ownInflation)
    : historicalPlan(periods, selected.data, historical),
  [mode, periods, overrides, ownInflation, selected, historical]);

  const results = useMemo(() => simulate(plan, { initialAmount, frequency }), [plan, initialAmount, frequency]);
  const summary = summarize(plan, results, initialAmount);

  // Comparison: only assets with data for the whole selected range of years
  const compareCandidates = options.filter(option =>
    option !== selected && coversWindow(option.data, historical.firstYear, historical.years));
  const compareOption = mode === 'historical'
    ? compareCandidates.find(option => option.asset.returns.id === compareId)
    : undefined;
  const comparison = useMemo(() => {
    if (!compareOption) return undefined;
    const comparePlan = historicalPlan(periods, compareOption.data, historical);
    const compareResults = simulate(comparePlan, { initialAmount, frequency });
    return {
      id: compareOption.asset.returns.id,
      plan: comparePlan,
      results: compareResults,
      summary: summarize(comparePlan, compareResults, initialAmount),
    };
  }, [compareOption, periods, historical, initialAmount, frequency]);

  const contributionLabel = t.contribution[frequency](currencySymbol(currency));

  // Changing periods may shorten the simulation – overrides of years out of range are dropped
  const updatePeriods = (next: Period[]) => {
    setPeriods(next);
    setOverrides(current => pruneOverrides(current, totalYears(next)));
  };

  const changeYearRate = (yearIndex: number, rate: number) => {
    const periodRate = periods[plan[yearIndex].periodIndex].rate;
    setOverrides(current => {
      const { [yearIndex]: _, ...rest } = current;
      return rate === periodRate ? rest : { ...rest, [yearIndex]: rate };
    });
  };

  return (
    <main>
      <header className="page-header">
        <div>
          <h1>{t.appTitle}</h1>
          <p className="subtitle">{t.appSubtitle}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <SettingsCard
        initialAmount={initialAmount}
        frequency={frequency}
        onInitialAmountChange={setInitialAmount}
        onFrequencyChange={setFrequency}
      />

      <ReturnsCard
        mode={mode}
        ownInflation={ownInflation}
        historical={historical}
        options={options}
        selected={selected}
        compareCandidates={compareCandidates}
        compareId={compareOption ? compareId : null}
        periodYears={totalYears(periods)}
        onModeChange={setMode}
        onOwnInflationChange={setOwnInflation}
        onHistoricalChange={setHistoricalChoice}
        onCompareChange={setCompareId}
      />

      <PeriodsCard
        periods={periods}
        mode={mode}
        contributionLabel={contributionLabel}
        randomSpread={RANDOM_SPREAD}
        onChange={(id, changes) => updatePeriods(periods.map(p => (p.id === id ? { ...p, ...changes } : p)))}
        onAdd={() => {
          const last = periods[periods.length - 1];
          updatePeriods([...periods, newPeriod({ years: 5, contribution: last.contribution, rate: last.rate })]);
        }}
        onRemove={id => updatePeriods(periods.filter(p => p.id !== id))}
        onRandomize={() => setOverrides(randomOverrides(buildOwnPlan(periods, {}, ownInflation), RANDOM_SPREAD))}
        onClearOverrides={() => setOverrides({})}
      />

      <StatsBar summary={summary} years={plan.length} />

      {comparison && (
        <ComparisonCard
          mainName={t.series[selected.asset.returns.id]}
          compareName={t.series[comparison.id]}
          main={summary}
          compare={comparison.summary}
        />
      )}

      {mode === 'historical' && (
        <AssetPriceChart
          name={t.series[selected.asset.returns.id]}
          plan={plan}
          comparison={comparison && { name: t.series[comparison.id], plan: comparison.plan }}
        />
      )}

      <GrowthChart
        plan={plan}
        results={results}
        initialAmount={initialAmount}
        comparison={comparison && { name: t.series[comparison.id], results: comparison.results }}
      />

      <YearlyTable
        plan={plan}
        results={results}
        mode={mode}
        contributionLabel={contributionLabel}
        onRateChange={changeYearRate}
      />
    </main>
  );
}
