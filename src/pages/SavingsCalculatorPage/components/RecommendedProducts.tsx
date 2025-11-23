import React from 'react';
import { ListHeader, Spacing } from 'tosslib';
import { SavingsProduct } from '../types';
import { default as ProductRow } from './ProductRow';

type RecommendedProductsProps = {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
};

const RecommendedProducts = React.memo(
  ({ products: recommendedProducts, selectedProductId, onSelect }: RecommendedProductsProps) => {
    if (!recommendedProducts || recommendedProducts.length === 0) {
      return null;
    }

    return (
      <>
        <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />

        <Spacing size={12} />
        {recommendedProducts.map(product => (
          <ProductRow
            key={`recommended-${product.id}`}
            product={product}
            selectedProductId={selectedProductId}
            onSelect={onSelect}
          />
        ))}
      </>
    );
  }
);

export default RecommendedProducts;
