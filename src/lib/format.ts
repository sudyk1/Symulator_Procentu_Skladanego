const pln = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });

export const formatPLN = (amount: number) => pln.format(amount);

export const formatPercent = (percent: number) => (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';

/** Klasa CSS koloru dla wartości dodatniej lub ujemnej. */
export const signClass = (amount: number) => (amount >= 0 ? 'gain' : 'loss');
