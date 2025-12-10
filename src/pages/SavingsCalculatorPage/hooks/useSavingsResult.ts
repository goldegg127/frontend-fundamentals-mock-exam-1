import { useMemo } from 'react';
import { useSavingsProductData } from '../hooks';
import type { CalculatorInput, CalculationResult, SavingsProduct } from '../types';

const useSavingsResult = (inputs: CalculatorInput, selectedProductId: string | null) => {
  // TODO: 캐싱 데이터 사용하도록 처리
  const { products } = useSavingsProductData();

  const savingsResult = useMemo<CalculationResult | null>(() => {
    if (!selectedProductId) {
      return null;
    }

    const selectedProduct = products.find((product: SavingsProduct) => product.id === selectedProductId) || null;

    const { goalAmount, monthlyAmount, term } = inputs;
    const rate = selectedProduct ? selectedProduct.annualRate / 100 : 0;

    // 예상 수익 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
    const expectedTotal = Math.floor(monthlyAmount * term * (1 + rate * 0.5));

    // 목표 금액과의 차이
    const difference = goalAmount - expectedTotal;

    // 추천 월 납입 금액 = 목표 금액 / (저축 기간 * (1 + 연이자율 * 0.5))
    const rawRecommended = goalAmount / (term * (1 + rate * 0.5));
    const recommendedMonthly = Math.round(rawRecommended / 1000) * 1000;

    return {
      expectedTotal,
      difference,
      recommendedMonthly,
      calculatedValidation: {
        expectedTotal: monthlyAmount !== 0,
        difference: monthlyAmount !== 0 && goalAmount !== 0,
        recommendedMonthly: goalAmount !== 0,
      },
    };
  }, [inputs, selectedProductId, products]);

  return { savingsResult };
};

export { useSavingsResult };
