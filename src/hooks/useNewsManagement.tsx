
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import type { News } from "@/types/news";

export const useNewsManagement = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) return;

    try {
      const newsItem = news.find(n => n.id === id);
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('delete_news', `Actualité supprimée: ${newsItem?.title || 'ID: ' + id}`);

      toast({
        title: "Succès",
        description: "L'actualité a été supprimée.",
      });

      fetchNews();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsFormOpen(true);
  };

  const handleNewNews = () => {
    setSelectedNews(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setSelectedNews(null);
    fetchNews();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedNews(null);
  };

  return {
    news,
    loading,
    searchQuery,
    setSearchQuery,
    selectedNews,
    isFormOpen,
    setIsFormOpen,
    handleDelete,
    handleEdit,
    handleNewNews,
    handleFormSuccess,
    handleFormCancel,
    fetchNews
  };
};
