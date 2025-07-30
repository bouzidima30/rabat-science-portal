import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePrefetchQueries = () => {
  const queryClient = useQueryClient();

  const prefetchNews = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['latest-news', 'all'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(6);
        if (error) throw error;
        return data || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const prefetchEvents = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['upcoming-events'],
      queryFn: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date_debut', today)
          .order('date_debut', { ascending: true })
          .limit(6);
        if (error) throw error;
        return data || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const prefetchFormations = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['formations'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('formations')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        return data || [];
      },
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);

  return {
    prefetchNews,
    prefetchEvents,
    prefetchFormations,
  };
};