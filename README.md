# 토스 적금 계산기

> Frontend Fundamentals 모의고사 1회 과제

## 📋 구현 기능

### 요구사항 구현 현황

- ✅ **요구사항 1**: 적금 상품 목록 API 연동 및 표시
  - TanStack Query v5 기반 데이터 페칭
  - 자동 캐싱으로 중복 API 호출 제거
  - Suspense 기반 로딩 상태 관리
  - 천단위 콤마 포맷팅

- ✅ **요구사항 2**: 저축 목표 입력 및 상품 필터링
  - 목표 금액 입력
  - 월 납입액 입력
  - 저축 기간 선택
  - 조건에 맞는 상품 실시간 필터링

- ✅ **요구사항 3**: 적금 상품 선택 기능
  - 단일 선택 지원
  - 선택 아이콘 표시
  - 계산 결과 탭에 상품 정보 전달

- ✅ **요구사항 4**: 계산 결과 탭
  - 예상 수익 금액 계산
  - 목표 금액과의 차이 계산
  - 추천 월 납입 금액 계산 (1,000원 단위 반올림)
  - 상품 미선택 시 안내 메시지
  - Compound Component 패턴으로 UI 텍스트 명시적 노출

- ✅ **요구사항 5**: 추천 상품 목록
  - 계산 결과 탭에 위치
  - 이자율 높은 추천 상품 2개 표시
  - 사용자가 선택한 적금 상품일 경우, 선택 아이콘 표시

## 🏗️ 기술 스택

- **React 18**: UI 라이브러리 (Suspense, Concurrent 기능 활용)
- **TypeScript**: 타입 안정성
- **TanStack Query v5**: 서버 상태 관리 및 캐싱
- **Vite**: 빌드 도구
- **tosslib**: 토스 UI 컴포넌트 라이브러리
- **React Router v7**: 라우팅 및 URL 상태 관리
- **react-error-boundary v3.14**: 에러 처리 및 복구

## 📁 프로젝트 구조

### 최신 아키텍처 (리팩토링 완료)

```
src/
├── App.tsx                                  # QueryClientProvider 설정
├── styles/
│   └── globals.css                          # 전역 스타일 (ul 리셋, sr-only)
├── utils/
│   └── format.ts                            # 전역 유틸리티 (숫자 포맷팅)
└── pages/
    ├── Routes.tsx                           # 라우팅 설정
    └── SavingsCalculatorPage/              # 적금 계산기 도메인
        ├── index.tsx                        # export
        ├── SavingsCalculatorPage.tsx        # 메인 페이지 (Hook 조립 + Suspense + ErrorBoundary)
        ├── types.ts                         # 도메인 타입
        ├── apis.ts                          # API 엔드포인트 상수
        ├── domain/                          # 도메인 레이어 (순수 함수)
        │   ├── savingsProducts.ts           # 필터링/정렬 로직
        │   ├── savingsCalculators.ts        # 계산 로직
        │   └── index.ts
        ├── hooks/                           # Hook Composition Pattern
        │   ├── useSavingsFormState.ts       # 입력 상태 관리
        │   ├── useFetchSavingsProducts.ts   # TanStack Query 기반 데이터 페칭
        │   ├── useProductSelection.ts       # URL 쿼리 파라미터 기반 상품 선택
        │   └── index.ts
        └── components/                      # UI Components
            ├── AmountInput.tsx              # 금액 입력
            ├── TermSelect.tsx               # 기간 선택
            ├── ProductList.tsx              # 상품 목록 (IoC + Suspense)
            ├── CalculationResult.tsx        # 계산 결과 (Compound Component)
            ├── ErrorFallback.tsx            # 에러 폴백 UI
            └── ui/
                ├── Tabs.tsx                 # 탭 (Compound Component)
                ├── Divider.tsx              # 구분선
                └── index.ts
```

## 🎯 주요 리팩토링 및 아키텍처 개선

> 본 프로젝트는 **"단순한 기능 구현"**에서 시작하여, **"장기적인 확장성과 유지보수성"**을 확보하기 위한 점진적 리팩토링을 거쳤습니다.

### 0. 최신 업데이트 (2025-12-19)

#### ErrorBoundary를 활용한 에러 처리
**추가된 기능:**
- react-error-boundary v3.14 라이브러리 도입
- TanStack Query의 `useQueryErrorResetBoundary`와 통합
- 각 데이터 페칭 영역에 독립적인 ErrorBoundary 설정

**구현 코드:**
```typescript
// SavingsCalculatorPage.tsx
const { reset } = useQueryErrorResetBoundary();

<ErrorBoundary
  onReset={reset}
  fallbackRender={({ resetErrorBoundary }) => (
    <ProductList.Error
      message="추천 상품을 불러오는 데 실패했습니다."
      onRetry={resetErrorBoundary}
    />
  )}
>
  <Suspense fallback={<ProductList.Loading text={'상품을 불러오는 중...'} />}>
    <ProductList filters={...} />
  </Suspense>
</ErrorBoundary>
```

**효과:**
- ✅ API 에러 발생 시 전체 앱이 아닌 **해당 영역만 에러 표시**
- ✅ "다시 시도" 버튼으로 **에러 복구 UX 제공**
- ✅ TanStack Query 캐시 리셋과 연동

#### URL 쿼리 파라미터 기반 상태 관리
**개선 전 문제:**
- useState로 관리되던 선택 상품 ID
- 새로고침 시 선택 상태 유실
- URL 공유 불가능

**개선 후:**
```typescript
// hooks/useProductSelection.ts
export const useProductSelection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProductId = searchParams.get('selectedProductId');

  const onSelect = (productId: string | null) => {
    setSearchParams(prev => {
      if (productId) {
        prev.set('selectedProductId', productId);
      } else {
        prev.delete('selectedProductId');
      }
      return prev;
    });
  };

  return { selectedProductId, onSelect };
};
```

**효과:**
- ✅ **새로고침해도 선택 상태 유지**
- ✅ **URL 공유 시 선택된 상품 그대로 전달**
- ✅ 브라우저 뒤로가기/앞으로가기 지원
- ✅ React Router v7의 `useSearchParams` 활용

#### 정렬 로직 주입 방식 개선
**개선 전:**
- `useFetchSavingsProducts` 내부에서 `order` 문자열로 하드코딩

**개선 후:**
```typescript
// 페이지에서 정렬 함수 직접 주입
<ProductList
  filters={[...]}
  sortBy={sortByAnnualRateDesc}  // 순수 함수 주입
  limit={2}
/>
```

**효과:**
- ✅ **정렬 로직을 순수 함수로 분리** (domain/savingsProducts.ts)
- ✅ Hook이 정렬 방식에 의존하지 않음 (OCP)
- ✅ 다양한 정렬 기준 쉽게 추가 가능

#### 유효하지 않은 상품 ID Fallback 처리
**추가된 기능:**
- URL에 존재하지 않는 `selectedProductId`가 포함된 경우 대응
- 상품 목록에서 해당 ID를 찾을 수 없으면 fallback 메시지 표시

**효과:**
- ✅ **잘못된 URL 파라미터에 대한 안전한 처리**
- ✅ 사용자에게 명확한 안내 제공

---

### 1. TanStack Query v5 도입 (2024-12-11)

**개선 전 문제:**
- ProductList와 CalculationResult에서 **동일한 API를 2번 호출**
- useState + useEffect로 수동 로딩 상태 관리
- 타입 안전성 부족 (data가 undefined일 가능성)

**개선 후:**
```typescript
// hooks/useFetchSavingsProducts.ts
export const useFetchSavingsProducts = ({ filters, order, limit }: ProductParams = {}) => {
  const { data: products } = useSuspenseQuery({
    queryKey: ['savings-products', 'list'],
    queryFn: async () => await http.get<SavingsProduct[]>(api.savingsProducts),
  });

  const processedProducts = useMemo(() => {
    return products.filter(...).sort(...).slice(...);
  }, [products, filters, order, limit]);

  return { products: processedProducts };
};
```

**효과:**
- ✅ 자동 캐싱으로 **API 호출 2회 → 1회**
- ✅ `useSuspenseQuery`로 **data는 항상 정의됨** (타입 안전)
- ✅ Suspense와 네이티브 통합
- ✅ `useMemo`로 필터링/정렬 성능 최적화

**QueryClient 설정:**
```typescript
// App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5분: 데이터 신선도
      gcTime: 1000 * 60 * 10,          // 10분: 메모리 보관 시간
      retry: 1,                         // 실패 시 재시도 1회
      refetchOnWindowFocus: false,      // 탭 포커스 시 재요청 비활성화
    },
  },
});
```

### 2. Suspense Boundary 세밀화

**개선 전 문제:**
- 전체 페이지를 Suspense로 감싸면 입력 폼조차 보이지 않음

**개선 후:**
```typescript
// SavingsCalculatorPage.tsx
<section>
  <h2 className="sr-only">적금 상품 목록</h2>
  <Suspense fallback={<ProductList.Loading text={'상품을 불러오는 중...'} />}>
    <ProductList filters={...} />
  </Suspense>
</section>

<section>
  <h2 className="sr-only">계산 결과</h2>
  <Suspense fallback={<CalculationResult.Loading text={'계산 결과를 불러오는 중...'} />}>
    <CalculationResult>
      <CalculationResult.Item ... />
    </CalculationResult>
  </Suspense>
</section>
```

**효과:**
- ✅ 입력 폼은 즉시 표시
- ✅ 데이터 영역만 로딩 표시
- ✅ Progressive Loading으로 향상된 UX

### 3. Compound Component Pattern 적용

**개선 전 (암묵적 추상화):**
```typescript
// 문제: UI 텍스트가 컴포넌트 내부에 숨겨져 있음
<CalculationResult
  savingsStates={savingsStates}
  selectedProductId={selectedProductId}
/>
// → "화면에 무엇이 표시되는지" 페이지 코드만 봐서는 알 수 없음
```

**개선 후 (명시적 추상화):**
```typescript
// 개선: "무엇을(label)" + "어떻게(calculate)" 모두 페이지에서 드러남
<CalculationResult
  selectedProductId={selectedProductId}
  savingsStates={savingsStates}
  fallback={'상품을 선택해주세요.'}
>
  <CalculationResult.Item
    label="예상 수익 금액"
    calculate={calculateExpectedTotal}
    fallback={'월 납입액을 입력해주세요.'}
  />
  <CalculationResult.Item
    label="목표 금액과의 차이"
    calculate={calculateDifference}
    fallback={'목표 금액과 월 납입액을 입력해주세요.'}
  />
  <CalculationResult.Item
    label="추천 월 납입 금액"
    calculate={calculateRecommended}
    fallback={'목표 금액을 입력해주세요.'}
  />
</CalculationResult>
```

**효과:**
- ✅ **UI 텍스트 1:1 매핑** (토스 라이브 해설 철학)
- ✅ 계산 로직 주입 가능 (Inversion of Control)
- ✅ Fallback 메시지 개별 설정
- ✅ 확장 시 Item만 추가하면 됨 (OCP)

### 4. 도메인 레이어 분리 (순수 함수)

**개선 전:**
- Hook 내부에 계산 로직 하드코딩
- 테스트 어려움
- 재사용 불가

**개선 후:**
```typescript
// domain/savingsProducts.ts - 필터링/정렬 로직
export const filterByMonthlyAmount = (
  product: SavingsProduct,
  monthlyAmount: number
): boolean => {
  if (monthlyAmount === 0) return true;
  return product.minMonthlyAmount <= monthlyAmount
    && monthlyAmount <= product.maxMonthlyAmount;
};

export const sortByAnnualRateDesc = (
  a: SavingsProduct,
  b: SavingsProduct
): number => {
  return b.annualRate - a.annualRate;
};

// domain/savingsCalculators.ts - 계산 로직
export const calculateExpectedTotal = (
  product: SavingsProduct | null,
  inputs: CalculatorInput
) => {
  if (!product || inputs.monthlyAmount === 0) return null;

  const rate = product.annualRate / 100;
  return Math.floor(inputs.monthlyAmount * inputs.term * (1 + rate * 0.5));
};
```

**효과:**
- ✅ 프레임워크 독립적
- ✅ 단위 테스트 용이
- ✅ 재사용 가능

### 5. Inversion of Control (IoC) 패턴

**개선 전:**
- `ProductList`가 `CalculatorInput` 타입에 강하게 결합
- 필터 로직이 컴포넌트 내부에 하드코딩

**개선 후:**
```typescript
// 페이지에서 필터 함수를 주입 (함수 배열 패턴)
<ProductList
  filters={[
    product => filterByMonthlyAmount(product, savingsStates.monthlyAmount),
    product => filterByTerm(product, savingsStates.term),
  ]}
  order={'annualRateDesc'}
  limit={2}
  fallback={'추천 상품이 없습니다.'}
/>
```

**효과:**
- ✅ `ProductList`는 `CalculatorInput` 타입에 의존하지 않음
- ✅ 필터 로직은 페이지에서 결정 (제어의 역전)
- ✅ OCP (Open-Closed Principle) 준수
- ✅ 토스 스타일 함수 배열 패턴 적용

### 6. 접근성 (Accessibility) 개선

```typescript
// 시맨틱 HTML + ARIA
<main>
  <header>
    <h1 className="sr-only">적금 계산기</h1>
    <NavigationBar title="적금 계산기" aria-hidden="true" />
  </header>

  <section>
    <h2 className="sr-only">적금 계산을 위해 목표 금액, 월 납입액, 저축 기간 입력하기</h2>
    {/* 입력 폼 */}
  </section>

  <section>
    <h2 className="sr-only">적금 상품 목록</h2>
    <ul>
      {/* ProductList의 ListRow는 <li> 렌더링 */}
    </ul>
  </section>
</main>
```

**효과:**
- ✅ 스크린 리더 지원
- ✅ 시맨틱 마크업
- ✅ SEO 향상

### 7. 에러 처리 및 복구 (2025-12-19)

**ErrorBoundary + Suspense 패턴:**
```typescript
// ErrorBoundary로 에러 격리, Suspense로 로딩 처리
<ErrorBoundary
  onReset={reset}
  fallbackRender={({ resetErrorBoundary }) => (
    <ProductList.Error
      message="추천 상품을 불러오는 데 실패했습니다."
      onRetry={resetErrorBoundary}
    />
  )}
>
  <Suspense fallback={<ProductList.Loading text={'상품을 불러오는 중...'} />}>
    <ProductList filters={...} />
  </Suspense>
</ErrorBoundary>
```

**ErrorFallback 컴포넌트:**
```typescript
// components/ErrorFallback.tsx
export interface ErrorFallbackProps {
  message: string;
  onRetry: () => void;
}

const ErrorFallback = ({ message, onRetry }: ErrorFallbackProps) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{ color: colors.red400 }}>{message}</span>
      <button onClick={onRetry}>다시 시도</button>
    </div>
  );
};
```

**효과:**
- ✅ **에러 격리**: API 실패 시 해당 섹션만 에러 표시, 다른 기능은 정상 작동
- ✅ **사용자 친화적 복구**: "다시 시도" 버튼으로 즉시 재시도 가능
- ✅ **TanStack Query 통합**: `useQueryErrorResetBoundary`로 캐시 리셋 연동
- ✅ **선언적 에러 처리**: try-catch 없이 컴포넌트 트리에서 에러 관리

## 🧮 계산 공식

### 1. 예상 수익 금액
```
최종 금액 = 월 납입액 × 저축 기간 × (1 + 연 이자율 × 0.5)
```

예시:
- 월 납입액: 100,000원
- 저축 기간: 12개월
- 연 이자율: 3.2%
- 결과: 100,000 × 12 × (1 + 3.2 × 0.5) = 1,192,000원

### 2. 목표 금액과의 차이
```
차이 = 목표 금액 - 예상 수익 금액
```

- 양수: 목표 금액보다 부족
- 음수: 목표 금액 초과
- 0: 목표 금액 정확히 달성

### 3. 추천 월 납입 금액
```
추천 월 납입액 = 목표 금액 ÷ (저축 기간 × (1 + 연 이자율 × 0.5))
※ 1,000원 단위로 반올림
```

예시:
- 목표 금액: 1,500,000원
- 저축 기간: 12개월
- 연 이자율: 3.2%
- 계산: 1,500,000 ÷ (12 × 1.016) = 123,027원
- 결과: 123,000원 (1,000원 단위 반올림)

### 4. 상품 필터링 조건
```
필터링 통과 조건:
1. product.minMonthlyAmount ≤ 입력한 월 납입액 ≤ product.maxMonthlyAmount
2. product.availableTerms === 선택한 저축 기간
```

### 5. 추천 상품 선택
```
1. 필터링된 상품을 연 이자율 높은 순으로 정렬
2. 상위 2개 선택
3. 사용자가 선택한 상품은 아이콘 표시
```

## 📐 설계 원칙

### 토스 프론트엔드 철학 적용

1. **UI 텍스트 명시적 노출**
   - "예상 수익 금액", "목표 금액과의 차이" 등의 텍스트가 페이지 코드에서 즉시 확인 가능
   - Compound Component로 1:1 매핑 달성

2. **함수 배열 패턴**
   - 필터링 로직을 함수 배열로 주입
   - 확장 시 필터만 추가하면 됨

3. **구현 세부사항 숨기기**
   - 데이터 페칭: 컴포넌트 내부 (useFetchSavingsProducts)
   - 로직: 순수 함수로 분리 (domain/)
   - UI: 명시적으로 노출

### SOLID 원칙

- **SRP (Single Responsibility)**: 각 훅/컴포넌트가 하나의 책임만 가짐
- **OCP (Open-Closed)**: 필터 추가 시 기존 코드 수정 불필요
- **DIP (Dependency Inversion)**: 추상화(함수)에 의존, 구현에 의존하지 않음

## 💻 실행 방법

### 개발 서버 실행
```bash
# 의존성 설치
yarn install

# 개발 서버 시작
yarn dev
```

### 접속
- 애플리케이션: http://localhost:5173
- API 테스트: http://localhost:5173/api/savings-products

## 🧪 테스트 가능한 설계

모든 비즈니스 로직은 순수 함수로 작성되어 테스트가 용이합니다:

```typescript
// domain/savingsCalculators.ts
export function calculateExpectedTotal(
  product: SavingsProduct | null,
  inputs: CalculatorInput
): number | null {
  if (!product || inputs.monthlyAmount === 0) return null;

  const rate = product.annualRate / 100;
  return Math.floor(inputs.monthlyAmount * inputs.term * (1 + rate * 0.5));
}

// 테스트 예시
expect(
  calculateExpectedTotal(
    { annualRate: 3.2, ... },
    { monthlyAmount: 100000, term: 12, ... }
  )
).toBe(1192000);
```

## 🚀 확장 가능성

현재 아키텍처는 다음과 같은 확장을 염두에 두고 설계되었습니다:

### 1. 새로운 계산 항목 추가
```typescript
// domain/savingsCalculators.ts에 함수 추가
export const calculateTax = (product, inputs) => { ... };

// 페이지에서 Item 추가
<CalculationResult.Item
  label="예상 세금"
  calculate={calculateTax}
  fallback="계산할 수 없습니다."
/>
```

### 2. 새로운 필터 조건 추가
```typescript
// domain/savingsProducts.ts에 함수 추가
export const filterByBankName = (product, bankName) => { ... };

// 페이지에서 filters 배열에 추가
<ProductList
  filters={[
    ...existingFilters,
    product => filterByBankName(product, selectedBank),
  ]}
/>
```

### 3. 상품 비교 기능
- `useProductComparison` 훅 추가
- Hook Composition 패턴 유지하면서 기능 확장

## 📚 참고 자료

- [TanStack Query v5 문서](https://tanstack.com/query/latest)
- [React Suspense 가이드](https://react.dev/reference/react/Suspense)
- [Compound Component Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [토스 SLASH 23 - Frontend Fundamentals](https://toss.im/slash-23)

## 📝 Git Commit 컨벤션

- `feat:` 새로운 기능 추가
- `refactor:` 리팩토링
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅

모든 커밋에 `#1` (이슈 번호) 포함
