import { useMemo } from 'react';
import type { SavingsProduct } from '../types';

const useRecommendedProducts = (products: SavingsProduct[]) => {
  // 연 이자율이 가장 높은 2개의 상품
  const recommendedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [products]);

  return {
    recommendedProducts,
  };
};

export { useRecommendedProducts };
