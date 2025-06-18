
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

  // Stabiliser les query keys
  const stableQueryKey = useMemo(() => queryKey, [queryKey.join(',')]);

  // Logique simple pour déterminer si on peut exécuter la requête
  const canExecute = useMemo(() => {
    if (!requireAuth) {
      return true; // Données publiques, toujours exécuter
    }
    return initialized && !!session; // Données privées, attendre auth + session
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log('Query retry:', { failureCount, error, queryKey: stableQueryKey });
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    ...options
  });

  return {
    ...query,
    isAuthReady: canExecute
  };
};
