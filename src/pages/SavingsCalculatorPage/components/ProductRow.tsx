import React from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import { formatAmount } from 'utils';
import type { SavingsProduct } from '../types';

export interface ProductRowProps {
  product: SavingsProduct;
  selectedProductId: string | null;
  onSelect: (id: string) => void;
}

const ProductRow = React.memo(({ product, selectedProductId, onSelect }: ProductRowProps) => {
  if (!product) {
    return <></>;
  }

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={product.name}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: ${product.annualRate}%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`${formatAmount(product.minMonthlyAmount)}원 ~ ${formatAmount(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
        onClick={() => onSelect(product.id)}
      />
    </>
  );
});

export default ProductRow;
