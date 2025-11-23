import { useMemo } from 'react';
import type { CalculatorInput, SavingsProduct, CalculationResult } from '../types';

const useSavingsResult = (inputs: CalculatorInput, selectedProduct: SavingsProduct | null) => {
  const savingResult = useMemo<CalculationResult | null>(() => {
    if (!selectedProduct) {
      return null;
    }

    const { goalAmount, monthlyAmount, term } = inputs;
    const rate = selectedProduct.annualRate / 100;

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
      calcaulatedValidation: {
        expectedTotal: monthlyAmount !== 0,
        difference: monthlyAmount !== 0 && goalAmount !== 0,
        recommendedMonthly: goalAmount !== 0,
      },
    };
  }, [inputs, selectedProduct]);

  return { savingResult };
};

export { useSavingsResult };
