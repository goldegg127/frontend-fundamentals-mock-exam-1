import { useState } from 'react';
import { Spacing, Tab } from 'tosslib';

import { useSavingsCalculator } from './hooks/useSavingsCalculator';

import { PageHeader, Divider } from 'components/common';
import { default as SavingForm } from './components/SavingsForm';
import { default as CalculationResult } from './components/CalculationResult';
import { default as RecommendedProducts } from './components/RecommendedProducts';
import { default as ProductList } from './components/ProductList';

export default function SavingsCalculatorPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'results'>('products');
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

      {/* 사용자 선택 탭 */}
      <Tab onChange={value => setActiveTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === 'products' && (
        <ProductList products={products} selectedProductId={selectedProductId} onSelect={handleProductSelect} />
      )}

      {activeTab === 'results' && (
        <>
          {/* 계산 결과 */}
          <CalculationResult result={savingResult} />

          <Divider borderHeight={16} spacingHeight={8} />

          {/* 추천 상품 */}
          <RecommendedProducts
            products={recommendedProducts}
            selectedProductId={selectedProductId}
            onSelect={handleProductSelect}
          />
        </>
      )}

      <Spacing size={40} />
    </>
  );
}
