import { ComponentProps } from 'react';
import { SelectBottomSheet } from 'tosslib';

export interface TermSelectProps
  extends Omit<ComponentProps<typeof SelectBottomSheet>, 'title' | 'value' | 'onChange' | 'children'> {
  value: number;
  onChange: (value: number) => void;
}

const TermSelect = ({ value, onChange, ...props }: TermSelectProps) => {
  return (
    <SelectBottomSheet title="저축 기간을 선택해주세요" value={value} onChange={onChange} {...props}>
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
};

export default TermSelect;
