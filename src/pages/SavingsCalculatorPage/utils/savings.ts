import type { SavingsProduct } from '../types';

/**
 * 월 납입액 범위로 필터링
 */
export const filterByMonthlyAmount = (product: SavingsProduct, monthlyAmount: number): boolean => {
  if (monthlyAmount === 0) {
    return true;
  }
  return product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
};

/**
 * 저축 기간으로 필터링
 */
export const filterByTerm = (product: SavingsProduct, term: number): boolean => {
  return product.availableTerms === term;
};

/**
 * 연 이자율 내림차순 정렬
 */
export const sortByAnnualRateDesc = (a: SavingsProduct, b: SavingsProduct): number => {
  return b.annualRate - a.annualRate;
};
