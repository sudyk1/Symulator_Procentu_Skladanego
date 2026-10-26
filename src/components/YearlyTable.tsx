import type { ReturnsMode, YearPlan, YearResult } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { signClass } from '../lib/format';
import { NumberInput } from './NumberInput';

interface Props {
  plan: YearPlan[];
  results: YearResult[];
  mode: ReturnsMode;
  contributionLabel: string;
  /** Return of a single year changed (year index from 0). */
  onRateChange: (yearIndex: number, rate: number) => void;
}

export function YearlyTable({ plan, results, mode, contributionLabel, onRateChange }: Props) {
  const { t, format } = useI18n();
  const editable = mode === 'own';
  return (
    <section className="card">
      <h2>{t.yearly.title}</h2>
      {editable && <p className="hint">{t.yearly.hint}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.yearly.year}</th>
              <th>{t.yearly.period}</th>
              <th>{contributionLabel}</th>
              <th>{t.yearly.rate}</th>
              <th>{t.yearly.inflation}</th>
              <th>{t.yearly.paidInYear}</th>
              <th>{t.yearly.gainInYear}</th>
              <th>{t.yearly.totalPaid}</th>
              <th>{t.yearly.value}</th>
              <th>{t.yearly.realValue}</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((year, i) => {
              const result = results[i];
              const periodStart = i > 0 && year.periodIndex !== plan[i - 1].periodIndex;
              return (
                <tr key={i} className={periodStart ? 'period-start' : undefined}>
                  <td>
                    {i + 1}
                    {year.calendarYear !== undefined && <span className="calendar-year"> {year.calendarYear}</span>}
                  </td>
                  <td>{year.periodIndex + 1}</td>
                  <td>{format.currency(year.contribution)}</td>
                  <td>
                    {editable ? (
                      <NumberInput
                        aria-label={t.yearly.rateOf(i + 1)}
                        step={0.1} value={year.rate} className={year.overridden ? 'override' : undefined}
                        onChange={rate => onRateChange(i, rate)}
                      />
                    ) : (
                      <span className={signClass(year.rate)}>{format.decimal(year.rate)}</span>
                    )}
                  </td>
                  <td>{format.decimal(year.inflation)}</td>
                  <td>{format.currency(result.paidInYear)}</td>
                  <td className={signClass(result.gainInYear)}>{format.currency(result.gainInYear)}</td>
                  <td>{format.currency(result.totalPaid)}</td>
                  <td><strong>{format.currency(result.value)}</strong></td>
                  <td>{format.currency(result.realValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
