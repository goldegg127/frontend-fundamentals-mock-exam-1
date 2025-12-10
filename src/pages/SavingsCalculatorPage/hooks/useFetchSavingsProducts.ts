import { useState, useEffect } from 'react';
import { http, isHttpError } from 'tosslib';

import type { SavingsProduct } from '../types';
import { api } from '../apis';
import { sortByAnnualRateDesc } from '../utils';

export interface ProductParams {
  filters?: Array<(product: SavingsProduct) => boolean>;
  order?: 'annualRateDesc';
  limit?: number;
}

const useFetchSavingsProducts = ({ filters = [], order, limit = 0 }: ProductParams = {}) => {
  const [products, setProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await http.get<SavingsProduct[]>(api.savingsProducts);
        setProducts(data);
      } catch (error) {
        if (isHttpError(error)) {
          console.log(error.message);
        }
      }
    };

    fetchProducts();
  }, []);

  // 필터링: 모든 필터 함수를 통과한 상품만
  const filteredProducts = products.filter(product => filters.every(filterFn => filterFn(product)));

  // 정렬
  const sortedProducts =
    order === 'annualRateDesc' ? [...filteredProducts].sort(sortByAnnualRateDesc) : filteredProducts;

  // Limit 적용
  const resultProducts = limit > 0 ? sortedProducts.slice(0, limit) : sortedProducts;

  return {
    products: resultProducts,
  };
};

export { useFetchSavingsProducts };
