
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface CacheOptions {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

export const useContentCache = <T,>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus = false
  } = options;

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const updateCache = useCallback((updater: (oldData: T | undefined) => T) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient, queryKey]);

  const prefetchRelated = useCallback((relatedKey: string[], relatedFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey: relatedKey,
      queryFn: relatedFn,
      staleTime
    });
  }, [queryClient, staleTime]);

  return {
    ...query,
    invalidateCache,
    updateCache,
    prefetchRelated
  };
};

// Specific cache hooks for common content types
export const useNewsCache = (enabled = true) => {
  return useContentCache(
    ['news', 'published'],
    async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes for news
      refetchOnWindowFocus: false
    }
  );
};

export const useEventsCache = (enabled = true) => {
  return useContentCache(
    ['events', 'upcoming'],
    async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date_debut', new Date().toISOString().split('T')[0])
        .order('date_debut', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    {
      staleTime: 15 * 60 * 1000 // 15 minutes for events
    }
  );
};

export const useFormationsCache = (type?: string) => {
  const queryKey = type ? ['formations', type] : ['formations'];
  
  return useContentCache(
    queryKey,
    async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      let query = supabase
        .from('formations')
        .select('*')
        .eq('status', 'published');
      
      if (type) {
        query = query.eq('type_formation', type);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    {
      staleTime: 20 * 60 * 1000 // 20 minutes for formations
    }
  );
};
