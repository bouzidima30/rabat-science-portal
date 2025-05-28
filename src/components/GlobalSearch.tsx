
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SearchResult {
  id: string;
  type: 'actualite' | 'evenement' | 'page' | 'cooperation' | 'formation';
  title: string;
  description?: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['globalSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      
      const results: SearchResult[] = [];

      // Search actualités
      const { data: news } = await supabase
        .from('news')
        .select('id, title, excerpt')
        .eq('published', true)
        .ilike('title', `%${searchQuery}%`)
        .limit(5);
      
      if (news) {
        results.push(...news.map(item => ({
          id: item.id,
          type: 'actualite' as const,
          title: item.title,
          description: item.excerpt,
          url: `/actualites/${item.id}`
        })));
      }

      // Search événements
      const { data: events } = await supabase
        .from('events')
        .select('id, titre, description')
        .ilike('titre', `%${searchQuery}%`)
        .limit(5);
      
      if (events) {
        results.push(...events.map(item => ({
          id: item.id,
          type: 'evenement' as const,
          title: item.titre,
          description: item.description,
          url: `/evenements/${item.id}`
        })));
      }

      // Search pages
      const { data: pages } = await supabase
        .from('pages')
        .select('id, titre, contenu, slug')
        .ilike('titre', `%${searchQuery}%`)
        .limit(5);
      
      if (pages) {
        results.push(...pages.map(item => ({
          id: item.id,
          type: 'page' as const,
          title: item.titre,
          description: item.contenu?.substring(0, 100),
          url: `/${item.slug}`
        })));
      }

      // Search coopérations
      const { data: cooperations } = await supabase
        .from('cooperations')
        .select('id, titre, description')
        .ilike('titre', `%${searchQuery}%`)
        .limit(5);
      
      if (cooperations) {
        results.push(...cooperations.map(item => ({
          id: item.id,
          type: 'cooperation' as const,
          title: item.titre,
          description: item.description,
          url: `/cooperation/${item.id}`
        })));
      }

      // Search formations
      const { data: formations } = await supabase
        .from('formations')
        .select('id, titre, description')
        .ilike('titre', `%${searchQuery}%`)
        .limit(5);
      
      if (formations) {
        results.push(...formations.map(item => ({
          id: item.id,
          type: 'formation' as const,
          title: item.titre,
          description: item.description,
          url: `/formation/${item.id}`
        })));
      }

      return results;
    },
    enabled: searchQuery.length >= 2
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'actualite': return 'Actualité';
      case 'evenement': return 'Événement';
      case 'page': return 'Page';
      case 'cooperation': return 'Coopération';
      case 'formation': return 'Formation';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'actualite': return 'bg-blue-100 text-blue-800';
      case 'evenement': return 'bg-green-100 text-green-800';
      case 'page': return 'bg-purple-100 text-purple-800';
      case 'cooperation': return 'bg-orange-100 text-orange-800';
      case 'formation': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {searchQuery.length >= 2 && (
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#006be5] mx-auto"></div>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={result.url}
                      onClick={onClose}
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {result.title}
                          </h3>
                          {result.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          )}

          {searchQuery.length < 2 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Tapez au moins 2 caractères pour rechercher
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
