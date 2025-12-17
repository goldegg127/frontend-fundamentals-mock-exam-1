import React, { createContext, useContext, useMemo } from 'react';
import { colors, ListRow } from 'tosslib';
import { useFetchSavingsProducts, useProductSelection } from '../hooks';
import { formatAmount } from '../utils';
import type { CalculatorInput, SavingsProduct } from '../types';
import { ErrorFallback, type ErrorFallbackProps } from '../components';

// Context 정의 (데이터 공유용)
interface CalculationContextType {
  product: SavingsProduct | null;
  savingsStates: CalculatorInput;
}

const CalculationContext = createContext<CalculationContextType | null>(null);

interface CalculationResultProps {
  savingsStates: CalculatorInput;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

// 부모가 데이터 fetching 담당

const CalculationResult = ({ savingsStates, children, fallback }: CalculationResultProps) => {
  const { products } = useFetchSavingsProducts();
  const { selectedProductId } = useProductSelection();

  const selectedProduct = useMemo(() => {
    return products.find(product => product.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  if (!selectedProductId) {
    return fallback ? <ListRow contents={fallback} /> : null;
  }

  return (
    <CalculationContext.Provider value={{ product: selectedProduct, savingsStates }}>
      <ul>{children}</ul>
    </CalculationContext.Provider>
  );
};

// 자식이 렌더링 담당

interface ItemProps {
  label: string;
  calculate: (product: SavingsProduct | null, state: CalculatorInput) => number | null;
  fallback: string;
}

CalculationResult.Item = function Item({ label, calculate, fallback }: ItemProps) {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('CalculationResult.Item must be used within CalculationResult');
  }

  const { product, savingsStates } = context;
  const resultValue = calculate(product, savingsStates);

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={resultValue ? `${formatAmount(resultValue)}원` : fallback}
          bottomProps={{ fontWeight: 'bold', color: resultValue ? colors.blue600 : colors.red400 }}
        />
      }
    />
  );
};

export default CalculationResult;

CalculationResult.Loading = ({ text }: { text: string }) => {
  return <ListRow contents={text} />;
};

CalculationResult.Error = ({ message, onRetry }: ErrorFallbackProps) => {
  return <ListRow contents={<ErrorFallback message={message} onRetry={onRetry} />} />;
};
