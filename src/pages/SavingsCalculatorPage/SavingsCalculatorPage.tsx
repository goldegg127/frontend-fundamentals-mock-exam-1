import React from 'react';
import { Spacing, ListRow, ListHeader, NavigationBar } from 'tosslib';

import { filterByMonthlyAmount, filterByTerm } from './utils';
import { useSavingsFormState, useProductSelection } from './hooks';

import { Divider, Tabs } from './components/ui';
import { AmountInput, TermSelect, ProductList, CalculationResult } from './components';

export default function SavingsCalculatorPage() {
  const { savingsStates, setSavingsStates } = useSavingsFormState();
  const { selectedProductId, onSelect } = useProductSelection();

  return (
    <main>
      <header>
        <h1 className="sr-only">적금 계산기</h1>
        <NavigationBar title="적금 계산기" aria-hidden="true" />
      </header>

      <section>
        <h2 className="sr-only">적금 계산을 위해 목표 금액, 월 납입액, 저축 기간 입력하기</h2>
        <Spacing size={16} />

        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
          <AmountInput
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            value={savingsStates.goalAmount}
            onChange={(value: number) => setSavingsStates({ goalAmount: value })}
          />
          <Spacing size={16} />
          <AmountInput
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            value={savingsStates.monthlyAmount}
            onChange={(value: number) => setSavingsStates({ monthlyAmount: value })}
          />
          <Spacing size={16} />
          <TermSelect
            label="저축 기간"
            value={savingsStates.term}
            onChange={(value: number) => setSavingsStates({ term: value })}
          />
        </form>

        <Spacing size={16} />
      </section>

      <Divider borderHeight={16} spacingHeight={8} />

      <Tabs defaultValue="products">
        <Tabs.Panel label="적금 상품" value="products">
          <section>
            <h2 className="sr-only">적금 상품 목록</h2>

            <ProductList
              filters={[
                product => filterByMonthlyAmount(product, savingsStates.monthlyAmount),
                product => filterByTerm(product, savingsStates.term),
              ]}
              selectedProductId={selectedProductId}
              onSelect={onSelect}
              fallback={<ListRow contents={'조건에 맞는 상품이 없습니다.'} />}
            />
          </section>
        </Tabs.Panel>

        <Tabs.Panel label="계산 결과" value="results">
          <section>
            <h2 className="sr-only">선택한 적금 상품의 계산 결과</h2>

            <CalculationResult savingsStates={savingsStates} selectedProductId={selectedProductId} />
          </section>

          <Divider borderHeight={16} spacingHeight={8} />

          <section>
            <h2 className="sr-only">이자율 높은 순의 추천 상품 목록</h2>

            <ListHeader
              title={
                <ListHeader.TitleParagraph fontWeight="bold" aria-hidden="true">
                  추천 상품 목록
                </ListHeader.TitleParagraph>
              }
            />
            <Spacing size={12} />
            <ProductList
              filters={[
                product => filterByMonthlyAmount(product, savingsStates.monthlyAmount),
                product => filterByTerm(product, savingsStates.term),
              ]}
              order={'annualRateDesc'}
              limit={2}
              selectedProductId={selectedProductId}
              onSelect={onSelect}
              fallback={<ListRow contents={'추천 상품이 없습니다.'} />}
            />
          </section>
        </Tabs.Panel>
      </Tabs>

      <Spacing size={40} />
    </main>
  );
}
