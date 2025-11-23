import React from 'react';
import { colors, ListRow } from 'tosslib';

import { formatAmount } from 'utils';
import type { CalculationResult as CalculationResultData } from '../types';

import { VALIDATION_MESSAGE as validationMessage } from '../constants';

interface CalculationResultProps {
  result: CalculationResultData | null;
}

const CalculationResult = React.memo(({ result }: CalculationResultProps) => {
  const VALIDATION_MESSAGE = validationMessage.CALCULATION_RESULT;

  if (!result) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={VALIDATION_MESSAGE.selectedProduct} />} />;
  }

  const { expectedTotal, difference, recommendedMonthly, calculatedValidation } = result;

  const datas = [
    {
      name: 'expectedTotal',
      label: '예상 수익 금액',
      value: formatAmount(expectedTotal),
      validationMessage: VALIDATION_MESSAGE.expectedTotal,
    },
    {
      name: 'difference',
      label: '목표 금액과의 차이',
      value: formatAmount(difference) ?? '0',
      validationMessage: VALIDATION_MESSAGE.difference,
    },
    {
      name: 'recommendedMonthly',
      label: '추천 월 납입 금액',
      value: formatAmount(recommendedMonthly),
      validationMessage: VALIDATION_MESSAGE.recommendedMonthly,
    },
  ] as const;

  return (
    <>
      {datas.map(({ name, label, value, validationMessage }, index) => (
        <ListRow
          key={`${index}-${name}`}
          contents={
            <ListRow.Texts
              type="2RowTypeA"
              top={label}
              topProps={{ color: colors.grey600 }}
              {...(calculatedValidation[name]
                ? { bottom: value, bottomProps: { fontWeight: 'bold', color: colors.blue600 } }
                : { bottom: validationMessage, bottomProps: { fontWeight: 'bold', color: colors.red400 } })}
            />
          }
        />
      ))}
    </>
  );
});

export default CalculationResult;
