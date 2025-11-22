import { useState, useCallback, useEffect, useMemo } from 'react';
import { http, isHttpError } from 'tosslib';

import type { CalculatorInput, SavingsProduct } from '../types';
import { api } from '../../../apis';

const useSavingsCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInput>({
    goalAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

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

  const filteredProducts = useMemo(() => {
    if (inputs.monthlyAmount === 0) {
      return products.filter(product => product.availableTerms === inputs.term);
    }

    return products.filter(product => {
      const isAmountValid =
        inputs.monthlyAmount >= product.minMonthlyAmount && inputs.monthlyAmount <= product.maxMonthlyAmount;

      const isTermValid = product.availableTerms === inputs.term;

      return isAmountValid && isTermValid;
    });
  }, [products, inputs.monthlyAmount, inputs.term]);

  const handleInputChange = useCallback((name: keyof CalculatorInput, value: number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    inputs,
    products: filteredProducts,
    handleInputChange,
  };
};

export { useSavingsCalculator };
