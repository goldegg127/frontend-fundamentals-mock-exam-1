export interface SavingsProductAPIResponse {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export type SavingsProduct = SavingsProductAPIResponse;

export interface CalculatorInput {
  goalAmount: number;
  monthlyAmount: number;
  term: number;
}

export interface CalculationResult {
  expectedTotal: number;
  difference: number;
  recommendedMonthly: number;
}
