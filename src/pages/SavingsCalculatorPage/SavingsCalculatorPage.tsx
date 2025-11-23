import { Spacing } from 'tosslib';

import { useSavingsCalculator } from './hooks/useSavingsCalculator';

import { PageHeader, Divider, Tabs } from 'components/common';
import { default as SavingForm } from './components/SavingsForm';
import { default as CalculationResult } from './components/CalculationResult';
import { default as RecommendedProducts } from './components/RecommendedProducts';
import { default as ProductList } from './components/ProductList';

export default function SavingsCalculatorPage() {
  const {
    inputs,
    products,
    handleInputChange,
    selectedProductId,
    handleProductSelect,
    savingResult,
    recommendedProducts,
  } = useSavingsCalculator();

  return (
    <>
      <PageHeader title="적금 계산기" />

      {/* 계산 입력 */}
      <section>
        <Spacing size={16} />
        <SavingForm value={inputs} onChange={handleInputChange} />
        <Spacing size={16} />
      </section>

      <Divider borderHeight={16} spacingHeight={8} />

      <section>
        <Tabs defaultValue="products">
          <Tabs.Panel label="적금 상품" value="products">
            {/* 상품 목록 */}
            <ProductList products={products} selectedProductId={selectedProductId} onSelect={handleProductSelect} />
          </Tabs.Panel>

          <Tabs.Panel label="계산 결과" value="results">
            {/* 계산 결과 */}
            <CalculationResult result={savingResult} />

            <Divider borderHeight={16} spacingHeight={8} />

            {/* 추천 상품 */}
            <RecommendedProducts
              products={recommendedProducts}
              selectedProductId={selectedProductId}
              onSelect={handleProductSelect}
            />
          </Tabs.Panel>
        </Tabs>
      </section>

      <Spacing size={40} />
    </>
  );
}
