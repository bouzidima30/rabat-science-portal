
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

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
  const { initialized, session, waitForInitialization } = useAuth();
  const [canExecute, setCanExecute] = useState(false);

  useEffect(() => {
    const checkCanExecute = async () => {
      if (!requireAuth) {
        setCanExecute(true);
        return;
      }

      if (!initialized) {
        await waitForInitialization();
      }
      
      setCanExecute(true);
    };

    checkCanExecute();
  }, [initialized, session, requireAuth, waitForInitialization]);

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: canExecute && (requireAuth ? !!session : true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  });

  return {
    ...query,
    isAuthReady: canExecute
  };
};
