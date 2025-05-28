
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, X, FileText, Calendar, File, Users, GraduationCap } from "lucide-react";
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
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'actualite': return <FileText className="h-4 w-4" />;
      case 'evenement': return <Calendar className="h-4 w-4" />;
      case 'page': return <File className="h-4 w-4" />;
      case 'cooperation': return <Users className="h-4 w-4" />;
      case 'formation': return <GraduationCap className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'actualite': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'evenement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'page': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'cooperation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'formation': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans tout le site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-12 w-12">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {searchQuery.length >= 2 && (
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={result.url}
                      onClick={onClose}
                      className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                          {getTypeLabel(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
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
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun résultat trouvé</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Essayez avec d'autres mots-clés
                  </p>
                </div>
              )}
            </div>
          )}

          {searchQuery.length < 2 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Rechercher dans tout le contenu
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Actualités • Événements • Pages • Coopérations • Formations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
