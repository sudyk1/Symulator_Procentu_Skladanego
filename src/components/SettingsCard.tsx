import type { ContributionFrequency } from '../domain/types';
import { NumberInput } from './NumberInput';

interface Props {
  initialAmount: number;
  frequency: ContributionFrequency;
  onInitialAmountChange: (amount: number) => void;
  onFrequencyChange: (frequency: ContributionFrequency) => void;
}

export function SettingsCard({ initialAmount, frequency, onInitialAmountChange, onFrequencyChange }: Props) {
  return (
    <section className="card">
      <div className="grid">
        <label>
          Kwota startowa (zł)
          <NumberInput min={0} step={100} value={initialAmount} onChange={onInitialAmountChange} />
        </label>
        <label>
          Częstotliwość wpłat
          <select value={frequency} onChange={e => onFrequencyChange(e.target.value as ContributionFrequency)}>
            <option value="month">Co miesiąc</option>
            <option value="year">Co rok</option>
          </select>
        </label>
      </div>
    </section>
  );
}
