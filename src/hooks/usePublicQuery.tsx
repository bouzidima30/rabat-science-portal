
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

interface PublicQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
}

export const usePublicQuery = <T,>({
  queryKey,
  queryFn,
  ...options
}: PublicQueryOptions<T>) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes par défaut
    gcTime: 30 * 60 * 1000, // 30 minutes par défaut
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    ...options
  });
};
