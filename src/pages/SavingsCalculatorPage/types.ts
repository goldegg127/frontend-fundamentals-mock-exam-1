import { SavingsProductAPIResponse } from 'types';

export type SavingsProduct = SavingsProductAPIResponse;

export interface CalculatorInput {
  goalAmount: number;
  monthlyAmount: number;
  term: number;
}

interface CalcaulatedValidation {
  expectedTotal: boolean;
  difference: boolean;
  recommendedMonthly: boolean;
}

export interface CalculationResult {
  expectedTotal: number; // 예상 수익 금액
  difference: number; // 목표 금액과의 차이
  recommendedMonthly: number; // 추천 월 납입 금액
  calcaulatedValidation: CalcaulatedValidation; // 유효성 검사 여부
}
