import React from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatAmount, parseNumber } from 'pages/SavingsCalculatorPage/utils';
import type { CalculatorInput } from '../types';
import { SAVINGS_TERM_OPTIONS } from '../constants';

interface SavingsFormProps {
  value: CalculatorInput;
  onChange: (name: keyof CalculatorInput, value: number) => void;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

const SavingsForm = React.memo(({ value, onChange }: SavingsFormProps) => {
  return (
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={formatAmount(value.goalAmount)}
        suffix="원"
        onChange={(e: InputEvent) => onChange('goalAmount', parseNumber(e.target.value))}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={formatAmount(value.monthlyAmount)}
        suffix="원"
        onChange={(e: InputEvent) => onChange('monthlyAmount', parseNumber(e.target.value))}
      />

      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={value.term}
        onChange={(value: number) => onChange('term', value)}
      >
        {SAVINGS_TERM_OPTIONS.map(opt => (
          <SelectBottomSheet.Option key={opt} value={opt}>
            {`${opt}개월`}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </form>
  );
});

export default SavingsForm;
