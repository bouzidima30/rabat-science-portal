import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

// Enhanced query hook with automatic optimization
export const useOptimizedQuery = <TData, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    enabledConditions?: boolean[];
    staleTimeMinutes?: number;
    cacheTimeMinutes?: number;
  }
) => {
  const {
    enabledConditions = [],
    staleTimeMinutes = 5,
    cacheTimeMinutes = 10,
    ...queryOptions
  } = options;

  const optimizedOptions = useMemo(() => ({
    ...queryOptions,
    enabled: enabledConditions.length > 0 
      ? enabledConditions.every(condition => condition === true) && (queryOptions.enabled ?? true)
      : queryOptions.enabled ?? true,
    staleTime: staleTimeMinutes * 60 * 1000,
    gcTime: cacheTimeMinutes * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  }), [enabledConditions, staleTimeMinutes, cacheTimeMinutes, queryOptions]);

  return useQuery(optimizedOptions);
};