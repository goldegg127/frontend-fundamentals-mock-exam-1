import React from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import { formatAmount } from '../utils';
import { useProductSelection, useFetchSavingsProducts, type ProductParams } from '../hooks';
import { ErrorFallback, type ErrorFallbackProps } from '../components';

export interface ProductListProps extends ProductParams {
  fallback?: React.ReactNode;
}

const ProductList = ({ filters, sortBy, limit = 0, fallback }: ProductListProps) => {
  const { products } = useFetchSavingsProducts({
    filters,
    sortBy,
    limit,
  });

  const { selectedProductId, onSelect } = useProductSelection();

  if (!products || products.length === 0) {
    return fallback ? <ListRow contents={fallback} /> : null;
  }

  return (
    <ul>
      {products.map(product => (
        <ListRow
          key={product.id}
          aria-selected={product.id === selectedProductId}
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

ProductList.Loading = ({ text }: { text: string }) => {
  return <ListRow contents={text} />;
};

ProductList.Error = ({ message, onRetry }: ErrorFallbackProps) => {
  return <ListRow contents={<ErrorFallback message={message} onRetry={onRetry} />} />;
};
