import { useState } from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { growthIndex, maxDrawdown, yearExtremes } from '../domain/priceIndex';
import type { YearPlan } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { signClass } from '../lib/format';
import { useThemeColors } from '../lib/useThemeColors';

const START_VALUE = 100;

interface Props {
  name: string;
  /** Historical plan: calendar years and returns already in the investor's currency. */
  plan: YearPlan[];
  comparison?: { name: string; plan: YearPlan[] };
}

/** Price path of the selected asset (and the comparison asset), rebased to 100 at the start. */
export function AssetPriceChart({ name, plan, comparison }: Props) {
  const { t, format, currency } = useI18n();
  const colors = useThemeColors();
  const [logScale, setLogScale] = useState(false);

  const rates = plan.map(year => year.rate);
  const index = growthIndex(rates, START_VALUE);
  const compareIndex = comparison && growthIndex(comparison.plan.map(year => year.rate), START_VALUE);

  // Position 0 is the end of the year before the first simulated year
  const yearAt = (position: number) => (plan[0].calendarYear ?? 0) - 1 + position;
  const data = index.map((value, i) => ({ year: yearAt(i), value, compare: compareIndex?.[i] }));

  const drawdown = maxDrawdown(index);
  const { best, worst } = yearExtremes(rates);

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>{t.priceChart.title(name)}</h2>
          <p className="hint">{t.priceChart.subtitle(START_VALUE, currency)}</p>
        </div>
        <label className="checkbox">
          <input type="checkbox" checked={logScale} onChange={e => setLogScale(e.target.checked)} />
          {t.priceChart.logScale}
        </label>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={colors.border} vertical={false} />
            <XAxis dataKey="year" stroke={colors.muted} tick={{ fontSize: 11 }} minTickGap={16} />
            <YAxis
              stroke={colors.muted} tick={{ fontSize: 11 }} width={48}
              scale={logScale ? 'log' : 'linear'} domain={['auto', 'auto']} allowDataOverflow={false}
              tickFormatter={value => format.compact(value)}
            />
            <Tooltip
              formatter={value => format.decimal(Number(value))}
              labelFormatter={label => t.chart.endOfYear(String(label))}
              contentStyle={{ background: colors.card, borderColor: colors.border, color: colors.text }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {drawdown.percent < 0 && (
              <ReferenceArea
                x1={yearAt(drawdown.peak)} x2={yearAt(drawdown.trough)}
                fill={colors.loss} fillOpacity={0.08} stroke="none"
              />
            )}
            <Line name={name} dataKey="value" type="linear" stroke={colors.accent} strokeWidth={2} dot={false} />
            {comparison && (
              <Line
                name={comparison.name} dataKey="compare" type="linear"
                stroke={colors.compare} strokeWidth={2} dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <dl className="price-facts">
        <div>
          <dt>{t.priceChart.growth}</dt>
          <dd>{format.multiple(index[index.length - 1] / START_VALUE)}</dd>
        </div>
        <div>
          <dt>{t.priceChart.bestYear}</dt>
          <dd className="gain">{format.percent(best.rate)} <span>({yearAt(best.position + 1)})</span></dd>
        </div>
        <div>
          <dt>{t.priceChart.worstYear}</dt>
          <dd className={signClass(worst.rate)}>
            {format.percent(worst.rate)} <span>({yearAt(worst.position + 1)})</span>
          </dd>
        </div>
        <div>
          <dt>{t.priceChart.maxDrawdown}</dt>
          <dd className={signClass(drawdown.percent)}>
            {format.percent(drawdown.percent)}
            {drawdown.percent < 0 && <span> ({yearAt(drawdown.peak)}–{yearAt(drawdown.trough)})</span>}
          </dd>
        </div>
      </dl>
      <p className="hint">{t.priceChart.annualNote}</p>
    </section>
  );
}
