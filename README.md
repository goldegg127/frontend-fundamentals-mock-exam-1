# 토스 적금 계산기

> Frontend Fundamentals 모의고사 1회 과제

## 📋 구현 기능

### 요구사항 구현 현황

- ✅ **요구사항 1**: 적금 상품 목록 API 연동 및 표시
  - API 데이터 페칭 (GET /api/savings-products)
  - 천단위 콤마 포맷팅
  - 로딩 상태 및 에러 핸들링

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

- ✅ **요구사항 5**: 추천 상품 목록
  - 계산 결과 탭에 위치
  - 이자율 높은 추천 상품 2개 표시
  - 사용자가 선택한 적금 상품일 경우, 선택 아이콘 표시

## 🏗️ 기술 스택

- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안정성
- **Vite**: 빌드 도구
- **tosslib**: 토스 UI 컴포넌트 라이브러리
- **React Router v7**: 라우팅

## 📁 프로젝트 구조

### Feature-based Layered Architecture

```
src/
├── apis/                                # API 레이어
│   ├── savingsApi.ts                   # 적금 API 호출
│   └── index.ts
├── types/                               # 타입 레이어 (대칭 구조)
│   ├── apis/
│   │   ├── savingsApiTypes.ts          # API 응답 타입 (DTO)
│   │   └── index.ts
│   └── index.ts
├── constants/                           # 전역 상수
│   ├── savingsConstants.ts             # 적금 관련 상수
│   └── index.ts
├── utils/                               # 전역 유틸리티
│   └── format.ts                       # 숫자 포맷팅
├── components/                          # 공통 컴포넌트
│   └── common/
│       ├── Tabs.tsx                    # Compound Component Pattern
│       ├── PageHeader.tsx
│       ├── Divider.tsx
│       └── index.ts
│   pages/
│   └── SavingsCalculatorPage/           # [Layer] 라우팅 진입점
└── features/                            # [Slice] 도메인별 기능 격리
    └── savings/                         # 적금 도메인
        ├── SavingsCalculatorPage.tsx    # 라우팅 진입점 (Hook 조립)
        ├── types.ts                     # 도메인 모델 타입
        ├── constants.ts                 # 페이지 전용 상수
        ├── hooks/                       # Hook Composition Pattern
        │   ├── useSavingsFormState.ts   # 입력 상태
        │   ├── useSavingsProductData.ts # 데이터 조회
        │   ├── useProductSelection.ts   # 상품 선택
        │   ├── useSavingsResult.ts      # 계산 결과
        │   ├── useRecommendedProducts.ts # 추천 상품
        │   └── index.ts
        └── components/
            ├── SavingsForm.tsx
            ├── ProductList.tsx          # Inversion of Control
            ├── FilteredProducts.tsx
            ├── CalculationResult.tsx
            └── RecommendedProducts.tsx
```

### 구조 설계 원칙

**Symmetric Data Layer (대칭 데이터 레이어):**
- `apis/`와 `types/apis/`의 디렉토리 구조를 대칭적으로 설계
- API 정의와 타입 정의의 위치를 직관적으로 파악 가능
- DTO(API 응답)와 Domain Model(프론트엔드) 명시적 분리
- 백엔드 스키마 변경이 UI 로직까지 전파되는 것을 방지

**Page as Thin Layer:**
- Page는 라우팅 진입점 역할만 수행 (비즈니스 로직 X)
- Hook Orchestration(조립)을 통한 명시적 데이터 흐름
- 향후 '대출', '예금' 등 도메인 추가 시 격리된 구조 유지

## 🏗️ 설계 원칙 및 아키텍처 의사결정

> 본 프로젝트는 초기의 빠른 기능 구현에서 시작하여, **"장기적인 확장성과 유지보수성"**이라는 핵심 요구사항을 충족하기 위해 다음과 같은 진화 과정을 거쳤습니다.

### 설계 진화 과정: YAGNI → 점진적 리팩토링

**Phase 1: 빠른 구현 (YAGNI 원칙)**
- 초기에는 "You Aren't Gonna Need It" 원칙에 따라 빠른 기능 구현에 집중
- 모든 코드를 `pages/SavingsCalculatorPage/` 내부에 집중 (Colocation)
- 섣부른 추상화를 경계하고 실제 필요가 드러날 때까지 대기

**Phase 2: 리팩토링을 통한 확장성 확보**
- 기능 구현 완료 후, 과제의 핵심 요구사항인 **"유지보수성"**과 **"확장성"**을 위한 점진적 리팩토링 진행
- 관심사의 물리적 분리, Hook 세분화, 컴포넌트 추상화 등을 단계적으로 적용
- 각 변경사항을 커밋으로 기록하여 의사결정 과정 추적 가능

### 1. 아키텍처: Feature-based Layered Architecture

**도메인 격리 (Domain Isolation)**

초기에는 pages 내부에 모든 로직이 집중된 모놀리식 구조였으나, 도메인의 확장 가능성을 고려하여 관심사를 물리적으로 분리했습니다.

**Page vs Feature 분리:**
- **Page** (`pages/`): 라우팅 진입점 역할만 수행하며, 비즈니스 로직을 포함하지 않는 Thin Layer로 유지
- **Feature** (향후 확장): 적금 도메인과 관련된 UI, 상태, 로직을 응집시켜 도메인 격리 달성
- 향후 '대출', '예금' 등 도메인이 추가되어도 상호 영향을 주지 않음

**Symmetric Data Layer:**
- `apis/`와 `types/apis/`의 디렉토리 구조를 대칭적으로 설계
- API 정의와 타입 정의의 위치를 직관적으로 파악 가능
- **DTO와 Domain Model 분리**: 서버 응답 타입(`SavingsProductAPIResponse`)과 프론트엔드 모델(`SavingsProduct`)을 명시적으로 구분
- 백엔드 스키마 변경이 UI 로직까지 전파되는 것을 방지

### 2. 비즈니스 로직: Hook Composition Pattern

초기에는 하나의 거대한 훅(`useSavingsCalculator`)이 모든 로직을 담당하는 Facade 패턴을 고려했으나, 데이터 흐름의 불투명성과 낮은 응집도 문제를 해결하기 위해 **Hook Composition 패턴**으로 전환했습니다.

**책임의 분리 (Separation of Concerns):**
```
useSavingsFormState      → 입력 상태 관리
useSavingsProductData    → API 데이터 조회
useProductSelection      → 상품 선택 로직
useSavingsResult         → 계산 결과 도출
useRecommendedProducts   → 추천 상품 로직
```

**명시적 데이터 흐름 (Explicit Data Flow):**
- 페이지 컴포넌트가 하위 훅들을 조립(Orchestration)하는 주체
- **Input → Data → Selection → Result**로 이어지는 데이터 흐름을 코드 레벨에서 투명하게 표현
- 중개자(Middle Man) 제거: 단순히 하위 훅을 감싸기만 하는 불필요한 추상화 계층 제거

**예시 코드:**
```typescript
// SavingsCalculatorPage.tsx
const formState = useSavingsFormState();
const { products } = useSavingsProductData();
const selection = useProductSelection();
const result = useSavingsResult(formState, products, selection);
const recommended = useRecommendedProducts(products, formState);
```

### 3. 컴포넌트 설계: 추상화와 유연성

UI의 재사용성과 변경 용이성을 확보하기 위해 다양한 컴포넌트 디자인 패턴을 적용했습니다.

**Compound Component Pattern (합성 컴포넌트 패턴):**
- `Tabs` 컴포넌트를 `Tabs.Panel`과 함께 사용
- 탭의 구조와 상태 관리를 캡슐화하면서도 선언적으로 UI 구성 가능 (OCP 준수)

**Inversion of Control (제어의 역전):**
- `ProductList` 컴포넌트에서 데이터가 없을 때의 처리를 내부에 하드코딩하지 않음
- `fallback` prop을 통해 외부에서 주입받도록 설계
- '검색 결과'와 '추천 상품'이라는 서로 다른 맥락에서 동일한 리스트 컴포넌트를 유연하게 재사용

**Semantic Markup & Styling Logic Isolation:**
- `ProductList`가 `<ul>` 태그와 스타일 초기화 로직을 책임
- `ProductRow`는 `<li>` 역할만 수행하여 시맨틱한 마크업 구조 강제

### 4. 코드 품질과 지역성 (Locality & Colocation)

무분별한 추상화보다는 **가독성과 응집도를 최우선** 가치로 두었습니다.

**Colocation (위치시키기):**
- 단순 UI 텍스트(Label, Placeholder)는 과도하게 상수로 분리하지 않고 컴포넌트 내부에 위치
- 코드를 읽는 흐름이 끊기지 않도록 유지
- 반면, 비즈니스 로직에 영향을 주는 설정값(저축 기간 옵션 등)과 재사용되는 유효성 메시지는 `constants`로 분리

**Performance Optimization:**
- `React.memo`와 `useCallback`을 적절히 사용
- 입력값 변경 시 불필요한 하위 컴포넌트(정적 UI, 상품 목록 등)의 리렌더링 방지

### 5. 타입 안정성과 테스트 가능성

**DTO와 Domain Model 분리:**
```typescript
// types/apis/savingsApiTypes.ts (DTO)
export interface SavingsProductAPIResponse { ... }

// pages/SavingsCalculatorPage/types.ts (Domain Model)
export interface SavingsProduct { ... }
```

**순수 함수로 계산 로직 작성:**
```typescript
// 테스트 가능하고 예측 가능한 코드
export function calculateExpectedAmount(
  monthlyAmount: number,
  term: number,
  annualRate: number
): number {
  return Math.round(monthlyAmount * term * (1 + annualRate * 0.5));
}
```

**효과:**
- 컴파일 타임에 에러 발견
- 사이드 이펙트 없는 순수 함수로 단위 테스트 작성 용이
- 리팩토링 안전성 향상

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

## 🚀 향후 확장 가능성

현재 아키텍처는 다음과 같은 확장 시나리오를 염두에 두고 설계되었습니다.

### 새로운 도메인 추가 시나리오

**1. 예금/대출 계산기 추가**
```
src/
├── apis/
│   ├── savingsApi.ts
│   ├── depositApi.ts        # 신규 추가
│   └── loanApi.ts            # 신규 추가
├── types/apis/
│   ├── savingsApiTypes.ts
│   ├── depositApiTypes.ts    # 신규 추가
│   └── loanApiTypes.ts       # 신규 추가
└── pages/
    ├── SavingsCalculatorPage/
    ├── DepositCalculatorPage/ # 신규 추가
    └── LoanCalculatorPage/    # 신규 추가
```
- 각 도메인이 물리적으로 격리되어 있어 상호 영향 없이 추가 가능
- Symmetric Data Layer 덕분에 API와 타입의 위치를 직관적으로 파악

**2. 공통 컴포넌트 추출**
- 여러 페이지에서 동일한 컴포넌트가 필요할 때 `components/common/`으로 이동
- 예: `ProductList` → `FinancialProductList`로 일반화하여 재사용

**3. 상품 비교 기능**
- `useProductComparison` 훅 추가
- Hook Composition 패턴을 유지하면서 새로운 기능 추가 가능

### 확장 시 유지해야 할 원칙

- **Domain Isolation**: 새로운 도메인 추가 시 기존 코드 변경 최소화
- **Hook Composition**: 새로운 비즈니스 로직은 독립된 훅으로 분리
- **Symmetric Structure**: API와 타입의 대칭 구조 유지
- **DTO/Domain 분리**: 백엔드 의존성 격리 유지

