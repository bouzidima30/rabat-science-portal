
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  const { data: newsCount = 0 } = useQuery({
    queryKey: ['admin-news-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: eventsCount = 0 } = useQuery({
    queryKey: ['admin-events-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: usersCount = 0 } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: formationsCount = 0 } = useQuery({
    queryKey: ['admin-formations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('formations')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: cooperationsCount = 0 } = useQuery({
    queryKey: ['admin-cooperations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('cooperations')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: pagesCount = 0 } = useQuery({
    queryKey: ['admin-pages-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: filesCount = 0 } = useQuery({
    queryKey: ['admin-files-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  return {
    newsCount,
    eventsCount,
    usersCount,
    formationsCount,
    cooperationsCount,
    pagesCount,
    filesCount
  };
};
