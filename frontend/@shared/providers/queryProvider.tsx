'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { ApiError } from '@/@shared/libs/api-error';
import { auth } from '@/@shared/libs/auth';

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({
  children,
}: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            handleGlobalError(error);
          },
        }),

        mutationCache: new MutationCache({
          onError: (error) => {
            handleGlobalError(error);
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function handleGlobalError(error: Error) {
  if (!(error instanceof ApiError)) {
    toast.error('حدث خطأ غير متوقع');
    return;
  }

  if (error.status === 401) {
    if (!auth.getToken()) {
      if (window.location.pathname === '/login') toast.error(error.message);
      return;
    }
    toast.error('انتهت جلسة تسجيل الدخول');

    auth.removeAuth();

    window.location.replace('/login');

    return;
  }

  if (error.status === 403) {
    toast.error('ليس لديك صلاحية لتنفيذ هذا الإجراء');
    return;
  }

  if (error.status >= 500) {
    toast.error('حدث خطأ في الخادم');
    return;
  }

  toast.error(error.message);
}
