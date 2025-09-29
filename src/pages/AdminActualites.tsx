import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, FileText, Calendar, Eye, Shield, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewsForm from "@/components/NewsForm";
import ContentStatusBadge from "@/components/ContentStatusBadge";
import ContentModerationDialog from "@/components/ContentModerationDialog";
import VersionHistoryDialog from "@/components/VersionHistoryDialog";
import type { News } from "@/types/news";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const AdminActualites = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [moderationItem, setModerationItem] = useState<News | null>(null);
  const [versionHistoryItem, setVersionHistoryItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const categoryLabels = {
    reunion_travail: "Réunion de travail",
    nouvelles_informations: "Nouvelles informations",
    activites_parauniversitaire: "Activités parauniversitaire",
    avis_etudiants: "Avis étudiants",
    avis_enseignants: "Avis enseignants",
    evenements_scientifique: "Événements scientifique"
  };

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

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setSelectedNews(null);
    fetchNews();
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (item as any).status === statusFilter ||
      (statusFilter === "published" && item.published);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredNews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);

  const getStatusCounts = () => {
    return {
      total: news.length,
      draft: news.filter(item => (item as any).status === 'draft').length,
      pending: news.filter(item => (item as any).status === 'pending_review').length,
      approved: news.filter(item => (item as any).status === 'approved').length,
      published: news.filter(item => item.published).length,
      rejected: news.filter(item => (item as any).status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Actualités
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez et publiez les actualités de la faculté
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedNews(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle actualité
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{statusCounts.total}</p>
              </div>
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Brouillons</p>
                <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{statusCounts.draft}</p>
              </div>
              <Edit className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">En attente</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{statusCounts.pending}</p>
              </div>
              <Eye className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Approuvés</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">{statusCounts.approved}</p>
              </div>
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Publiés</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{statusCounts.published}</p>
              </div>
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher une actualité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-3 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 rounded-md transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillons</option>
                <option value="pending_review">En attente de révision</option>
                <option value="approved">Approuvés</option>
                <option value="published">Publiés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-6">
        {paginatedNews.map((item) => (
          <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVersionHistoryItem(item)}
                          className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                          title="Voir l'historique"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setModerationItem(item)}
                          className="hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20"
                          title="Modérer"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedNews(item);
                            setIsFormOpen(true);
                          }}
                          className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      >
                        {categoryLabels[item.category as keyof typeof categoryLabels]}
                      </Badge>
                      <ContentStatusBadge status={(item as any).status || (item.published ? 'published' : 'draft')} />
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.excerpt || item.content.substring(0, 200) + "..."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNews.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucune actualité trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Créez votre première actualité pour commencer."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => {
                    setSelectedNews(null);
                    setIsFormOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle actualité
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedNews ? "Modifier l'actualité" : "Nouvelle actualité"}
            </DialogTitle>
          </DialogHeader>
          <NewsForm
            news={selectedNews}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {moderationItem && (
        <ContentModerationDialog
          isOpen={!!moderationItem}
          onClose={() => setModerationItem(null)}
          contentId={moderationItem.id}
          contentType="news"
          contentTitle={moderationItem.title}
          currentStatus={(moderationItem as any).status || (moderationItem.published ? 'published' : 'draft')}
          onStatusUpdate={fetchNews}
        />
      )}

      {versionHistoryItem && (
        <VersionHistoryDialog
          isOpen={!!versionHistoryItem}
          onClose={() => setVersionHistoryItem(null)}
          contentId={versionHistoryItem.id}
          contentType="news"
          contentTitle={versionHistoryItem.title}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AdminActualites;
