import type { Summary } from '../domain/types';
import { formatPercent, formatPLN, signClass } from '../lib/format';

export function StatsBar({ summary }: { summary: Summary }) {
  return (
    <>
      <section className="stats">
        <Stat label="Wartość końcowa" value={formatPLN(summary.finalValue)} />
        <Stat label="Suma wpłat (ze startem)" value={formatPLN(summary.totalPaid)} />
        <Stat label="Zysk" value={formatPLN(summary.profit)} className={signClass(summary.profit)} />
        <Stat label="Średni zwrot roczny (CAGR stóp)" value={formatPercent(summary.averageReturn)} />
        <Stat label="Wartość po inflacji" value={formatPLN(summary.realValue)} real />
        <Stat label="Zysk realny" value={formatPLN(summary.realProfit)} className={signClass(summary.realProfit)} real />
      </section>
      <p className="hint spaced">
        Kwoty „po inflacji” są w cenach z początku inwestycji. Zysk realny to wartość po inflacji minus wpłaty
        przeliczone na ceny z początku.
      </p>
    </>
  );
}

interface StatProps {
  label: string;
  value: string;
  className?: string;
  real?: boolean;
}

function Stat({ label, value, className = '', real = false }: StatProps) {
  return (
    <div className={`stat${real ? ' real' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${className}`}>{value}</div>
    </div>
  );
}
