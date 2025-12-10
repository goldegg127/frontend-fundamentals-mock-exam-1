import { useState, useEffect } from 'react';
import { http, isHttpError } from 'tosslib';

import type { SavingsProduct, CalculatorInput } from '../types';
import { api } from '../apis';

export interface ProductParams {
  filters?: CalculatorInput | null;
  order?: 'annualRateAsce';
  limit?: number;
}

const useSavingsProductData = ({ filters, order, limit }: ProductParams = {}) => {
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

  const filterProducts = () => {
    if (!filters) {
      return products;
    }

    if (filters?.monthlyAmount === 0) {
      return products.filter(product => product.availableTerms === filters?.term);
    }

    return products.filter(product => {
      const isAmountValid =
        filters?.monthlyAmount >= product.minMonthlyAmount && filters?.monthlyAmount <= product.maxMonthlyAmount;

      const isTermValid = product.availableTerms === filters?.term;

      return isAmountValid && isTermValid;
    });
  };

  const resultProducts = order
    ? filterProducts()
        .sort((a, b) => b.annualRate - a.annualRate)
        .slice(0, limit)
    : filterProducts();

  return {
    products: resultProducts,
  };
};

export { useSavingsProductData };
