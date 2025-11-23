import React from 'react';
import { ListRow } from 'tosslib';
import { SavingsProduct } from '../types';
import { default as ProductRow } from './ProductRow';

type ProductListProps = {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
};

const ProductList = React.memo(({ products, selectedProductId, onSelect }: ProductListProps) => {
  if (!products || products.length === 0) {
    return <ListRow contents={'조건에 맞는 상품이 없습니다.'} />;
  }

  return (
    <>
      {products.map(product => (
        <ProductRow key={product.id} product={product} selectedProductId={selectedProductId} onSelect={onSelect} />
      ))}
    </>
  );
});

export default ProductList;
