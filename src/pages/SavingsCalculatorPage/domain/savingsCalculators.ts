import type { SavingsProduct, CalculatorInput } from '../types';

// 예상 수익 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
export const calculateExpectedTotal = (product: SavingsProduct | null, inputs: CalculatorInput) => {
  if (!product || inputs.monthlyAmount === 0) {
    return null;
  }

  const rate = product.annualRate / 100;
  return Math.floor(inputs.monthlyAmount * inputs.term * (1 + rate * 0.5));
};

// 목표 금액과의 차이
export const calculateDifference = (product: SavingsProduct | null, inputs: CalculatorInput) => {
  const expectedTotal = calculateExpectedTotal(product, inputs);

  if (expectedTotal === null || inputs.goalAmount === 0) {
    return null;
  }

  return inputs.goalAmount - expectedTotal;
};

// 추천 월 납입 금액 = 목표 금액 / (저축 기간 * (1 + 연이자율 * 0.5))
export const calculateRecommended = (product: SavingsProduct | null, inputs: CalculatorInput) => {
  if (!product || inputs.goalAmount === 0) {
    return null;
  }

  const rate = product.annualRate / 100;
  const rawRecommended = inputs.goalAmount / (inputs.term * (1 + rate * 0.5));

  return Math.round(rawRecommended / 1000) * 1000;
};
