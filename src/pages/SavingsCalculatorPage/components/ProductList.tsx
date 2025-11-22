import React from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import { formatAmount } from '../../../utils';
import type { SavingsProduct } from '../types';

type ProductListProps = {
  products: SavingsProduct[];
};

const ProductList = React.memo(({ products }: ProductListProps) => {
  if (!products || products.length === 0) {
    return <ListRow contents={'조건에 맞는 상품이 없습니다.'} />;
  }

  return (
    <>
      {products.map(product => (
        <ListRow
          key={product.id}
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
          right={<Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {}}
        />
      ))}
    </>
  );
});

export default ProductList;
