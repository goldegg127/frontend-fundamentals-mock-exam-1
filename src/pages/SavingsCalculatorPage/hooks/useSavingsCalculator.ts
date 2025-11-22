import { useState, useCallback } from 'react';
import { CalculatorInput } from '../types';

const useSavingsCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInput>({
    goalAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

  const handleInputChange = useCallback((name: keyof CalculatorInput, value: number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    inputs,
    handleInputChange,
  };
};

export { useSavingsCalculator };
