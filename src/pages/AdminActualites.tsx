import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewsForm from "@/components/NewsForm";
import type { News } from "@/types/news";

const AdminActualites = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

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
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedNews(null);
    fetchNews();
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006be5]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Actualités
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Créez, modifiez et gérez les actualités de la faculté
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedNews(null);
            setIsFormOpen(true);
          }}
          className="bg-[#006be5] hover:bg-[#0056b3]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle actualité
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une actualité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredNews.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">
                      {categoryLabels[item.category as keyof typeof categoryLabels]}
                    </Badge>
                    <Badge variant={item.published ? "default" : "destructive"}>
                      {item.published ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedNews(item);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.excerpt || item.content.substring(0, 200) + "..."}
              </p>
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="mt-3 w-20 h-20 object-cover rounded"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
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
    </div>
  );
};

export default AdminActualites;
