export interface SavingsProductAPIResponse {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export type SavingsProductsAPIResponse = SavingsProductAPIResponse[];
