import { useSavingsFormState } from './useSavingsFormState';
import { useSavingsProductData } from './useSavingsProductData';

const useSavingsCalculator = () => {
  const { inputs, handleInputChange } = useSavingsFormState();
  const { products } = useSavingsProductData(inputs);

  return {
    inputs,
    products,
    handleInputChange,
  };
};

export { useSavingsCalculator };
