import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { http } from 'tosslib';

import type { SavingsProduct } from '../types';
import { api } from '../apis';

export interface ProductParams {
  filters?: Array<(product: SavingsProduct) => boolean>;
  sortBy?: (a: SavingsProduct, b: SavingsProduct) => number;
  limit?: number;
}

export const useFetchSavingsProducts = ({ filters = [], sortBy, limit = 0 }: ProductParams = {}) => {
  const { data: products } = useSuspenseQuery({
    queryKey: ['savings-products', 'list'],
    queryFn: async (): Promise<SavingsProduct[]> => await http.get<SavingsProduct[]>(api.savingsProducts),
  });

  const processedProducts = useMemo(() => {
    // 필터링: 모든 필터 함수를 통과한 상품만
    const filteredProducts = products.filter(product => filters.every(filterFn => filterFn(product)));

    // 정렬
    const sortedProducts = sortBy ? [...filteredProducts].sort(sortBy) : filteredProducts;

    // Limit 적용
    return limit > 0 ? sortedProducts.slice(0, limit) : sortedProducts;
  }, [products, filters, sortBy, limit]);

  return {
    products: processedProducts,
  };
};
