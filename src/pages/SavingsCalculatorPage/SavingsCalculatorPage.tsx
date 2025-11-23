import { Spacing } from 'tosslib';

import {
  useSavingsFormState,
  useSavingsProductData,
  useProductSelection,
  useSavingsResult,
  useRecommendedProducts,
} from './hooks';

import { PageHeader, Divider, Tabs } from 'components/common';
import { SavingForm, FilteredProducts, CalculationResult, RecommendedProducts } from './components';

export default function SavingsCalculatorPage() {
  const { inputs, handleInputChange } = useSavingsFormState();
  const { products } = useSavingsProductData(inputs);
  const { selectedProductId, selectedProduct, handleProductSelect } = useProductSelection(products);
  const { savingResult } = useSavingsResult(inputs, selectedProduct);
  const { recommendedProducts } = useRecommendedProducts(products);

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

      {/* 입력 결과 */}
      <section>
        <Tabs defaultValue="products">
          <Tabs.Panel label="적금 상품" value="products">
            <FilteredProducts
              products={products}
              selectedProductId={selectedProductId}
              onSelect={handleProductSelect}
            />
          </Tabs.Panel>

          <Tabs.Panel label="계산 결과" value="results">
            <CalculationResult result={savingResult} />

            <Divider borderHeight={16} spacingHeight={8} />

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
