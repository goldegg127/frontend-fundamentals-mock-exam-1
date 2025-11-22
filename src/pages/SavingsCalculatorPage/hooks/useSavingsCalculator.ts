import { useSavingsFormState } from './useSavingsFormState';
import { useSavingsProductData } from './useSavingsProductData';
import { useProductSelection } from './useProductSelection';

const useSavingsCalculator = () => {
  const { inputs, handleInputChange } = useSavingsFormState();
  const { products } = useSavingsProductData(inputs);
  const { selectedProductId, selectedProduct, handleProductSelect } = useProductSelection(products);

  return {
    inputs,
    products,
    selectedProductId,
    selectedProduct,
    handleInputChange,
    handleProductSelect,
  };
};

export { useSavingsCalculator };
