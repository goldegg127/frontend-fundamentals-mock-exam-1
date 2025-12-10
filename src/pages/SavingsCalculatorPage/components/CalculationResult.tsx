import React from 'react';
import { colors, ListRow } from 'tosslib';
import { formatAmount } from '../utils';
import type { CalculatorInput } from '../types';
import { useSavingsResult } from '../hooks';

interface CalculationResultProps {
  savingsStates: CalculatorInput;
  selectedProductId: string | null;
}

const CalculationResult = React.memo(({ savingsStates, selectedProductId }: CalculationResultProps) => {
  const { savingsResult } = useSavingsResult(savingsStates, selectedProductId);

  if (!savingsResult) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const { expectedTotal, difference, recommendedMonthly, calculatedValidation } = savingsResult;

  return (
    <ul>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={calculatedValidation.expectedTotal ? formatAmount(expectedTotal) : '월 납입액을 입력해주세요.'}
            bottomProps={{
              fontWeight: 'bold',
              color: calculatedValidation.expectedTotal ? colors.blue600 : colors.red400,
            }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={
              calculatedValidation.difference ? formatAmount(difference) : '목표 금액과 월 납입액을 입력해주세요.'
            }
            bottomProps={{
              fontWeight: 'bold',
              color: calculatedValidation.difference ? colors.blue600 : colors.red400,
            }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={
              calculatedValidation.recommendedMonthly ? formatAmount(recommendedMonthly) : '목표 금액을 입력해주세요.'
            }
            bottomProps={{
              fontWeight: 'bold',
              color: calculatedValidation.recommendedMonthly ? colors.blue600 : colors.red400,
            }}
          />
        }
      />
    </ul>
  );
});

export default CalculationResult;
