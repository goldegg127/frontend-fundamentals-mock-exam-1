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

### 페이지 집중형 (Colocation) 아키텍처

```
src/
├── utils/
│   └── format.ts                        # 전역: 숫자 포맷팅
└── pages/
    └── SavingsCalculatorPage/           # 적금 계산기 전용 영역
        ├── index.tsx                    # export
        ├── SavingsCalculatorPage.tsx    # 메인 페이지
        ├── types.ts                     # 타입 정의
        ├── constants.ts                 # 상수
        ├── utils/
        │   └── calculate.ts             # 계산 로직
        ├── hooks/
        │   ├── useSavingsProducts.ts    # API 호출
        │   └── useSavingsCalculator.ts  # 비즈니스 로직
        └── components/
            ├── SavingsForm.tsx
            ├── ProductList.tsx
            ├── ProductItem.tsx
            ├── CalculationResult.tsx
            └── RecommendedProducts.tsx
```

### 구조 선택 이유

**페이지 집중형 (Colocation)을 선택한 이유:**
- 관련된 모든 파일이 한 곳에 위치 → 응집도 향상
- 수정 시 영향 범위가 명확 → 변경에 강함
- 삭제 및 수정이 안전 → 다른 곳에서 사용 여부 걱정 불필요
- 새 팀원이 코드 파악하기 쉬움
- 기능 구현 이후 유지보수나 장기적인 확장성을 고려한 설계 고려 예정

**선택하지 않은 것:**
- 전역 `components/savings/` 구조
  - 이유: 재사용 가능성이 불확실한 상태에서 미리 추출하는 것은 섣부른 추상화
  - YAGNI 원칙 적용: "You Aren't Gonna Need It"

## 🎯 설계 의사결정

### 1. 책임 분리 (Separation of Concerns)

**로직과 UI의 명확한 분리**
- 비즈니스 로직: hooks/useSavingsCalculator.ts
- UI 렌더링: components/ProductList.tsx
- 메인 페이지: index.tsx (오케스트레이션만)

**레이어별 책임:**
- **Utils**: 순수 함수로 계산 로직만 (테스트 용이)
- **Hooks**: 상태 관리 + 비즈니스 로직
- **Components**: Props 받아서 렌더링만
- **Pages**: 훅 + 컴포넌트 조합

### 2. 타입 안정성

**모든 데이터에 명확한 타입 정의**

```typescript
// types.ts
export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export interface FormInputs {
  targetAmount: number;
  monthlyAmount: number;
  savingPeriod: 6 | 12 | 24;
}

export interface CalculationResult {
  expectedAmount: number;
  difference: number;
  recommendedMonthly: number;
}
```

**효과:**
- 컴파일 타임에 에러 발견
- IDE 자동완성 지원
- 리팩토링 안전성 향상

### 3. 순수 함수로 계산 로직 작성

**테스트 가능하고 예측 가능한 코드**

```typescript
// utils/calculate.ts
export function calculateExpectedAmount(
  monthlyAmount: number,
  term: number,
  annualRate: number
): number {
  return Math.round(monthlyAmount * term * (1 + annualRate * 0.5));
}

export function filterProducts(
  products: SavingsProduct[],
  inputs: FormInputs
): SavingsProduct[] {
  return products.filter(p =>
    p.minMonthlyAmount <= inputs.monthlyAmount &&
    p.maxMonthlyAmount >= inputs.monthlyAmount &&
    p.availableTerms === inputs.savingPeriod
  );
}
```

**장점:**
- 사이드 이펙트 없음
- 단위 테스트 작성 용이
- 동일한 입력 → 동일한 출력 보장

### 4. Custom Hook으로 상태 관리

**useState + Custom Hook 조합**

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

## 🎨 UX 개선 사항

### 구현한 것

### 추가 개선 아이디어

## 🔄 트레이드오프

## 🚀 향후 확장 가능성

### 새로운 기능 추가 시나리오

1. **예금 계산기 추가**

2. **복리 계산 추가**

3. **상품 비교 기능**

4. **사용자 인증 추가**

### 확장 시 유의사항

- 

## 📚 참고 자료

## 📝 회고

