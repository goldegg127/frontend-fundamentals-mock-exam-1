// 숫자를 "1,000" 형태의 문자열로 변환
export function formatAmount(value: number): string {
  if (value === 0) {
    return '';
  }

  return value.toLocaleString('ko-KR');
}

// "1,000" 형태의 문자열을 숫자 1000으로 변환 (NaN 방지)
export function parseNumber(value: string): number {
  return Number(value.replace(/[^0-9]/g, '')) || 0;
}
