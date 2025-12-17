import { useSearchParams } from 'react-router-dom';

const SELECTED_PRODUCT_ID = 'selectedProductId';

export const useProductSelection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProductId = searchParams.get(SELECTED_PRODUCT_ID);

  const onSelect = (productId: string | null) => {
    setSearchParams(prev => {
      if (productId) {
        prev.set(SELECTED_PRODUCT_ID, productId); // 업데이트
      } else {
        prev.delete(SELECTED_PRODUCT_ID); // 기존 선택 제거
      }
      return prev;
    });
  };

  return {
    selectedProductId,
    onSelect,
  };
};
