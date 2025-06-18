
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
      console.log('AuthenticatedQuery: Checking if can execute', { 
        requireAuth, 
        initialized, 
        hasSession: !!session 
      });

      if (!requireAuth) {
        // Si l'auth n'est pas requise, attendre quand même l'initialisation
        if (!initialized) {
          console.log('AuthenticatedQuery: Waiting for auth initialization...');
          await waitForInitialization();
        }
        setCanExecute(true);
        return;
      }

      if (!initialized) {
        console.log('AuthenticatedQuery: Auth not initialized, waiting...');
        await waitForInitialization();
      }
      
      console.log('AuthenticatedQuery: Auth ready, can execute');
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

  console.log('AuthenticatedQuery status:', {
    queryKey,
    canExecute,
    isAuthReady: canExecute,
    queryEnabled: query.isLoading || query.isFetching,
    hasData: !!query.data
  });

  return {
    ...query,
    isAuthReady: canExecute
  };
};
