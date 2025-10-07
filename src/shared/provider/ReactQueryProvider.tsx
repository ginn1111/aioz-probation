import { type ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider as ReactQueryCacheProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryCacheProvider client={queryClient}>
      {children}
    </ReactQueryCacheProvider>
  );
};

export default ReactQueryProvider;
