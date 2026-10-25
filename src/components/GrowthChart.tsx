import {
  Area, CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { YearPlan, YearResult } from '../domain/types';
import { formatPLN } from '../lib/format';
import { useThemeColors } from '../lib/useThemeColors';

interface Props {
  plan: YearPlan[];
  results: YearResult[];
  initialAmount: number;
}

const compactPLN = new Intl.NumberFormat('pl-PL', { notation: 'compact', maximumFractionDigits: 1 });

export function GrowthChart({ plan, results, initialAmount }: Props) {
  const colors = useThemeColors();

  // Punkt 0 to stan początkowy, kolejne punkty to koniec każdego roku
  const startLabel = plan[0]?.calendarYear !== undefined ? plan[0].calendarYear - 1 : 0;
  const data = [
    { label: startLabel, value: initialAmount, paid: initialAmount, real: initialAmount },
    ...results.map((result, i) => ({
      label: plan[i].calendarYear ?? i + 1,
      value: result.value,
      paid: result.totalPaid,
      real: result.realValue,
    })),
  ];
  // Granice okresów: lata, po których zmienia się okres wpłat
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
              tickFormatter={v => compactPLN.format(v)}
            />
            <Tooltip
              formatter={value => formatPLN(Number(value))}
              labelFormatter={label => `Koniec roku ${label}`}
              contentStyle={{ background: colors.card, borderColor: colors.border, color: colors.text }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {boundaries.map(label => (
              <ReferenceLine key={label} x={label} stroke={colors.muted} strokeDasharray="3 3" />
            ))}
            <Area
              name="Wartość portfela" dataKey="value" type="monotone"
              stroke={colors.accent} fill={colors.accent} fillOpacity={0.15} strokeWidth={2}
            />
            <Area
              name="Wpłacony kapitał" dataKey="paid" type="monotone"
              stroke={colors.muted} fill={colors.muted} fillOpacity={0.2} strokeWidth={2}
            />
            <Line
              name="Wartość po inflacji" dataKey="real" type="monotone"
              stroke={colors.real} strokeWidth={2} strokeDasharray="6 4" dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
