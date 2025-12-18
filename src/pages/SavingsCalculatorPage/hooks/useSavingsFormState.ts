import { useState, useCallback } from 'react';

import type { CalculatorInput } from '../types';

const useSavingsFormState = () => {
  const [inputs, setInputs] = useState<CalculatorInput>({
    goalAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

  const setSavingsStates = useCallback((updates: Partial<CalculatorInput>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    savingsStates: inputs,
    setSavingsStates,
  };
};

export { useSavingsFormState };
