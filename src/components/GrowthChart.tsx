import {
  Area, CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { YearPlan, YearResult } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { useThemeColors } from '../lib/useThemeColors';

interface Props {
  plan: YearPlan[];
  results: YearResult[];
  initialAmount: number;
  /** Second series to compare – same years and contributions, different returns. */
  comparison?: { name: string; results: YearResult[] };
}

export function GrowthChart({ plan, results, initialAmount, comparison }: Props) {
  const colors = useThemeColors();
  const { t, format } = useI18n();

  // Point 0 is the starting state, every following point is the end of a year
  const startLabel = plan[0]?.calendarYear !== undefined ? plan[0].calendarYear - 1 : 0;
  const data = [
    { label: startLabel, value: initialAmount, paid: initialAmount, real: initialAmount, compare: initialAmount },
    ...results.map((result, i) => ({
      label: plan[i].calendarYear ?? i + 1,
      value: result.value,
      paid: result.totalPaid,
      real: result.realValue,
      compare: comparison?.results[i].value,
    })),
  ];
  // Period boundaries: years after which the contribution period changes
  const boundaries = plan.flatMap((year, i) =>
    i > 0 && year.periodIndex !== plan[i - 1].periodIndex ? [data[i].label] : []);

  return (
    <section className="card">
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={colors.border} vertical={false} />
            <XAxis dataKey="label" stroke={colors.muted} tick={{ fontSize: 11 }} minTickGap={16} />
            <YAxis
              stroke={colors.muted} tick={{ fontSize: 11 }} width={56}
              tickFormatter={value => format.compact(value)}
            />
            <Tooltip
              formatter={value => format.currency(Number(value))}
              labelFormatter={label => t.chart.endOfYear(String(label))}
              contentStyle={{ background: colors.card, borderColor: colors.border, color: colors.text }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {boundaries.map(label => (
              <ReferenceLine key={label} x={label} stroke={colors.muted} strokeDasharray="3 3" />
            ))}
            <Area
              name={t.chart.value} dataKey="value" type="monotone"
              stroke={colors.accent} fill={colors.accent} fillOpacity={0.15} strokeWidth={2}
            />
            <Area
              name={t.chart.paid} dataKey="paid" type="monotone"
              stroke={colors.muted} fill={colors.muted} fillOpacity={0.2} strokeWidth={2}
            />
            <Line
              name={t.chart.real} dataKey="real" type="monotone"
              stroke={colors.real} strokeWidth={2} strokeDasharray="6 4" dot={false}
            />
            {comparison && (
              <Line
                name={comparison.name} dataKey="compare" type="monotone"
                stroke={colors.compare} strokeWidth={2} dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
