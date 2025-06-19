
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

interface AuthenticatedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  requireAuth?: boolean;
}

export const useAuthenticatedQuery = <T,>({
  queryKey,
  queryFn,
  requireAuth = true,
  ...options
}: AuthenticatedQueryOptions<T>) => {
  const { initialized, session } = useAuth();

  const stableQueryKey = useMemo(() => queryKey, [queryKey.join(',')]);

  const canExecute = useMemo(() => {
    if (!requireAuth) {
      return true;
    }
    return initialized && !!session;
  }, [requireAuth, initialized, session]);

  console.log('AuthenticatedQuery status:', {
    queryKey: stableQueryKey.join('-'),
    requireAuth,
    initialized,
    hasSession: !!session,
    canExecute
  });

  const query = useQuery({
    queryKey: stableQueryKey,
    queryFn,
    enabled: canExecute,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      console.log('Query retry:', { failureCount, error, queryKey: stableQueryKey });
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    ...options
  });

  return {
    ...query,
    isAuthReady: canExecute
  };
};
