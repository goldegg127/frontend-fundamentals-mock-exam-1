import { colors } from 'tosslib';

export interface ErrorFallbackProps {
  message: string;
  onRetry: () => void;
}

const ErrorFallback = ({ message, onRetry }: ErrorFallbackProps) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{ color: colors.red400 }}>{message}</span>
      <button
        onClick={onRetry}
        style={{
          padding: '8px 16px',
          backgroundColor: colors.blue600,
          color: colors.white,
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        다시 시도
      </button>
    </div>
  );
};

export default ErrorFallback;
