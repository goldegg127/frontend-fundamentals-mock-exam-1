import { useSavingsFormState } from './useSavingsFormState';
import { useSavingsProductData } from './useSavingsProductData';
import { useProductSelection } from './useProductSelection';
import { useSavingsResult } from './useSavingsResult';

const useSavingsCalculator = () => {
  const { inputs, handleInputChange } = useSavingsFormState();
  const { products } = useSavingsProductData(inputs);
  const { selectedProductId, selectedProduct, handleProductSelect } = useProductSelection(products);
  const { savingResult } = useSavingsResult(inputs, selectedProduct);

  return {
    inputs,
    products,
    selectedProductId,
    selectedProduct,
    savingResult,
    handleInputChange,
    handleProductSelect,
  };
};

export { useSavingsCalculator };
