import { useSavingsFormState } from './useSavingsFormState';
import { useSavingsProductData } from './useSavingsProductData';
import { useProductSelection } from './useProductSelection';
import { useSavingsResult } from './useSavingsResult';
import { useRecommendedProducts } from './useRecommendedProducts';

const useSavingsCalculator = () => {
  const { inputs, handleInputChange } = useSavingsFormState();
  const { products } = useSavingsProductData(inputs);
  const { selectedProductId, selectedProduct, handleProductSelect } = useProductSelection(products);
  const { savingResult } = useSavingsResult(inputs, selectedProduct);
  const { recommendedProducts } = useRecommendedProducts(products);

  return {
    inputs,
    products,
    selectedProductId,
    selectedProduct,
    savingResult,
    recommendedProducts,
    handleInputChange,
    handleProductSelect,
  };
};

export { useSavingsCalculator };
