import { useState } from 'react';

const useProductSelection = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  return {
    selectedProductId,
    onSelect: setSelectedProductId,
  };
};

export { useProductSelection };
