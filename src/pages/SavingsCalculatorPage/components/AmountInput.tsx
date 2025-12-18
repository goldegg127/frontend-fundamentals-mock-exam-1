import { ComponentProps } from 'react';
import { TextField } from 'tosslib';
import { formatAmount, parseNumber } from '../utils';

export interface AmountInputProps extends Omit<ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  value?: number | null;
  onChange: (value: number) => void;
}

const AmountInput = ({ value, onChange, ...props }: AmountInputProps) => {
  return (
    <TextField
      value={formatAmount(value)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(parseNumber(e.target.value))}
      suffix="원"
      {...props}
    />
  );
};

export default AmountInput;
