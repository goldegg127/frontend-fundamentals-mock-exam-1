import { useState, useCallback, useMemo } from 'react';
import type { SavingsProduct } from '../types';

const useProductSelection = (products: SavingsProduct[]) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleProductSelect = useCallback((id: string) => {
    setSelectedProductId(id);
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((product: SavingsProduct) => product.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  return {
    selectedProductId,
    selectedProduct,
    handleProductSelect,
  };
};

export { useProductSelection };
