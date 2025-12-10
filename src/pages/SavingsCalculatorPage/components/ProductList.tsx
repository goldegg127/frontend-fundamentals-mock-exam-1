import React from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import { formatAmount } from '../utils';
import { useSavingsProductData, type ProductParams } from '../hooks';

export interface ProductListProps extends ProductParams {
  selectedProductId: string | null;
  onSelect: (id: string) => void;
  fallback?: React.ReactNode;
}

const ProductList = ({ filters, order, limit = 0, selectedProductId, onSelect, fallback }: ProductListProps) => {
  const { products } = useSavingsProductData({
    filters,
    order,
    limit,
  });

  if (!products || products.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <ul style={{ margin: 0, padding: 0 }}>
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
          right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          onClick={() => onSelect(product.id)}
        />
      ))}
    </ul>
  );
};

export default ProductList;
