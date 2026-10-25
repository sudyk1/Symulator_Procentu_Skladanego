import { useEffect, useState, type InputHTMLAttributes } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Number field that lets the user temporarily type "-" or clear the field
 * without it snapping to 0 mid-typing. Only valid numbers reach the parent.
 */
export function NumberInput({ value, onChange, ...rest }: Props) {
  const [text, setText] = useState(String(value));

  // A value changed from outside (e.g. by a button) replaces what is in the field
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
