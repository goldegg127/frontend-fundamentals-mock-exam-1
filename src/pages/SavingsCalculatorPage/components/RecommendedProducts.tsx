import React from 'react';
import { ListHeader, Spacing } from 'tosslib';
import { SavingsProduct } from '../types';
import { default as ProductList } from './ProductList';

type RecommendedProductsProps = {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
};

const RecommendedProducts = React.memo(
  ({ products: recommendedProducts, selectedProductId, onSelect }: RecommendedProductsProps) => {
    return (
      <>
        <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />

        <Spacing size={12} />

        <ProductList
          products={recommendedProducts}
          selectedProductId={selectedProductId}
          onSelect={onSelect}
          fallback={null}
        />
      </>
    );
  }
);

export default RecommendedProducts;
