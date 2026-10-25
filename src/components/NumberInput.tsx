import { useEffect, useState, type InputHTMLAttributes } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Pole liczbowe, które pozwala chwilowo wpisać „-” albo zostawić puste pole
 * bez zamiany na 0 w trakcie pisania. Do rodzica trafiają tylko poprawne liczby.
 */
export function NumberInput({ value, onChange, ...rest }: Props) {
  const [text, setText] = useState(String(value));

  // Wartość zmieniona z zewnątrz (np. przyciskiem) nadpisuje to, co jest w polu
  useEffect(() => {
    setText(current => (Number(current) === value && current !== '' ? current : String(value)));
  }, [value]);

  return (
    <input
      {...rest}
      type="number"
      value={text}
      onChange={e => {
        setText(e.target.value);
        if (e.target.value !== '' && Number.isFinite(e.target.valueAsNumber)) onChange(e.target.valueAsNumber);
      }}
    />
  );
}
