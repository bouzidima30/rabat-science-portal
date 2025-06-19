
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface UseAuthenticatedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  requireAuth?: boolean;
}

export const useAuthenticatedQuery = <T,>({
  queryKey,
  queryFn,
  requireAuth = true,
  enabled = true,
  ...options
}: UseAuthenticatedQueryOptions<T>) => {
  const { user, loading } = useAuth();

  const isAuthReady = !loading;
  const canQuery = !requireAuth || (requireAuth && user);

  return {
    ...useQuery({
      queryKey,
      queryFn,
      enabled: enabled && isAuthReady && canQuery,
      ...options,
    }),
    isAuthReady,
  };
};
