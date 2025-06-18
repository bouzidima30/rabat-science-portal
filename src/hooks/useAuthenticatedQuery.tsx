
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
      console.log('AuthenticatedQuery: Checking execution rights', { 
        requireAuth, 
        initialized, 
        hasSession: !!session,
        queryKey: queryKey.join('-')
      });

      // Pour les données publiques, ne pas attendre l'auth si elle tarde
      if (!requireAuth) {
        if (initialized) {
          console.log('AuthenticatedQuery: Public data, auth initialized, proceeding');
          setCanExecute(true);
        } else {
          // Attendre un maximum de 2 secondes pour l'initialisation
          const timeout = setTimeout(() => {
            console.log('AuthenticatedQuery: Public data, timeout reached, proceeding anyway');
            setCanExecute(true);
          }, 2000);

          try {
            await waitForInitialization();
            clearTimeout(timeout);
            console.log('AuthenticatedQuery: Public data, auth initialized');
            setCanExecute(true);
          } catch (error) {
            clearTimeout(timeout);
            console.log('AuthenticatedQuery: Public data, auth failed but proceeding');
            setCanExecute(true);
          }
        }
        return;
      }

      // Pour les données privées, attendre l'auth obligatoirement
      if (!initialized) {
        console.log('AuthenticatedQuery: Private data, waiting for auth...');
        try {
          await waitForInitialization();
        } catch (error) {
          console.error('AuthenticatedQuery: Auth initialization failed', error);
          return;
        }
      }
      
      if (session) {
        console.log('AuthenticatedQuery: Private data, authenticated user, proceeding');
        setCanExecute(true);
      } else {
        console.log('AuthenticatedQuery: Private data, no session');
        setCanExecute(false);
      }
    };

    checkCanExecute();
  }, [initialized, session, requireAuth, waitForInitialization, queryKey]);

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: canExecute && (requireAuth ? !!session : true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log('AuthenticatedQuery: Retry attempt', { failureCount, error, queryKey });
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  });

  console.log('AuthenticatedQuery final status:', {
    queryKey: queryKey.join('-'),
    canExecute,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    hasData: !!query.data,
    error: query.error,
    requireAuth
  });

  return {
    ...query,
    isAuthReady: canExecute
  };
};
