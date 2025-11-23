import React from 'react';
import { ListRow } from 'tosslib';
import { SavingsProduct } from '../types';
import { default as ProductList } from './ProductList';

type ProductListProps = {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
};

const FilteredProducts = React.memo(({ products, selectedProductId, onSelect }: ProductListProps) => {
  return (
    <ProductList
      products={products}
      selectedProductId={selectedProductId}
      onSelect={onSelect}
      fallback={<ListRow contents={'조건에 맞는 상품이 없습니다.'} />}
    />
  );
});

export default FilteredProducts;
