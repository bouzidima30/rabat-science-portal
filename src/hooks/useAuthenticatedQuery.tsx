
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
    if (!requireAuth) return true;
    return initialized && !!session;
  }, [requireAuth, initialized, session]);

  const query = useQuery({
    queryKey: stableQueryKey,
    queryFn,
    enabled: canExecute,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Reduced retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    ...options
  });

  return {
    ...query,
    isAuthReady: canExecute
  };
};
