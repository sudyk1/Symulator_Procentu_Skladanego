import type { Summary } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { signClass } from '../lib/format';

interface Props {
  mainName: string;
  compareName: string;
  main: Summary;
  compare: Summary;
}

/** Side-by-side result of two indices/ETFs with the same contributions and years. */
export function ComparisonCard({ mainName, compareName, main, compare }: Props) {
  const { t, format } = useI18n();
  const rows = [
    { label: t.comparison.finalValue, a: main.finalValue, b: compare.finalValue },
    { label: t.comparison.realValue, a: main.realValue, b: compare.realValue },
    { label: t.comparison.profit, a: main.profit, b: compare.profit },
  ];
  const returnGap = main.averageReturn - compare.averageReturn;

  return (
    <section className="card comparison">
      <h2>{t.comparison.title}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th />
              <th>{mainName}</th>
              <th>{compareName}</th>
              <th>{t.comparison.difference}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, a, b }) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{format.currency(a)}</td>
                <td>{format.currency(b)}</td>
                <td className={signClass(a - b)}>{format.currency(a - b)}</td>
              </tr>
            ))}
            <tr>
              <td>{t.comparison.averageReturn}</td>
              <td>{format.percent(main.averageReturn)}</td>
              <td>{format.percent(compare.averageReturn)}</td>
              <td className={signClass(returnGap)}>{format.points(returnGap)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
