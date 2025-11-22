import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

import { useSavingsCalculator } from './hooks/useSavingsCalculator';

import { default as SavingForm } from './components/SavingsForm';
import { default as CalculationResult } from './components/CalculationResult';
import { default as RecommendedProducts } from './components/RecommendedProducts';
import { default as ProductList } from './components/ProductList';

export default function SavingsCalculatorPage() {
  const { inputs, handleInputChange } = useSavingsCalculator();

  return (
    <>
      <NavigationBar title="적금 계산기" />

      {/* 계산 입력 */}
      <section>
        <Spacing size={16} />
        <SavingForm value={inputs} onChange={handleInputChange} />
        <Spacing size={16} />
      </section>

      <div>
        <Spacing size={8} />
        <Border height={16} />
        <Spacing size={8} />
      </div>

      {/* 사용자 선택 탭 */}
      <Tab onChange={() => {}}>
        <Tab.Item value="products" selected={true}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={false}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 입력 기준 필터링 상품 */}
      <ProductList />

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      <Spacing size={8} />

      {/* 계산 결과 */}
      <CalculationResult />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 추천 상품 */}
      <RecommendedProducts />

      <Spacing size={40} />
    </>
  );
}
