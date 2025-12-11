import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';

import 'styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <Routes />
      </GlobalPortal.Provider>
    </QueryClientProvider>
  );
}
