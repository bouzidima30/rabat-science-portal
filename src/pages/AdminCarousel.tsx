import { useState, useEffect } from "react";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Search, Youtube, FileText, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CarouselItem {
  id: string;
  type: 'news' | 'youtube';
  position: number;
  news_id?: string;
  youtube_url?: string;
  youtube_title?: string;
  created_at: string;
  news?: {
    title: string;
    image_url?: string;
  };
}

const AdminCarousel = () => {
  const [newsItems, setNewsItems] = useState<CarouselItem[]>([]);
  const [youtubeItems, setYoutubeItems] = useState<CarouselItem[]>([]);
  const [availableNews, setAvailableNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'news' | 'youtube'>('news');
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCarouselItems();
    fetchAvailableNews();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_config')
        .select(`
          *,
          news:news_id (
            title,
            image_url
          )
        `)
        .order('position', { ascending: true });

      if (error) throw error;

      const items = (data || []) as CarouselItem[];
      setNewsItems(items.filter(item => item.type === 'news'));
      setYoutubeItems(items.filter(item => item.type === 'youtube'));
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les éléments du carousel.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, image_url, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAvailableNews(data || []);
    } catch (error: any) {
      console.error("Error fetching news:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    try {
      const { error } = await supabase
        .from('carousel_config')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'élément a été supprimé.",
      });

      fetchCarouselItems();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const items = formType === 'news' ? newsItems : youtubeItems;
      const nextPosition = items.length > 0 ? Math.max(...items.map(i => i.position)) + 1 : 1;

      if (formType === 'news' && !selectedNewsId) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une actualité.",
          variant: "destructive",
        });
        return;
      }

      if (formType === 'youtube' && (!youtubeUrl || !youtubeTitle)) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs.",
          variant: "destructive",
        });
        return;
      }

      if (selectedItem) {
        const { error } = await supabase
          .from('carousel_config')
          .update({
            news_id: formType === 'news' ? selectedNewsId : null,
            youtube_url: formType === 'youtube' ? youtubeUrl : null,
            youtube_title: formType === 'youtube' ? youtubeTitle : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('carousel_config')
          .insert({
            type: formType,
            position: nextPosition,
            news_id: formType === 'news' ? selectedNewsId : null,
            youtube_url: formType === 'youtube' ? youtubeUrl : null,
            youtube_title: formType === 'youtube' ? youtubeTitle : null,
          });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: selectedItem ? "L'élément a été modifié." : "L'élément a été ajouté.",
      });

      setIsFormOpen(false);
      resetForm();
      fetchCarouselItems();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setSelectedNewsId("");
    setYoutubeUrl("");
    setYoutubeTitle("");
  };

  const openForm = (type: 'news' | 'youtube', item?: CarouselItem) => {
    setFormType(type);
    if (item) {
      setSelectedItem(item);
      if (type === 'news') {
        setSelectedNewsId(item.news_id || "");
      } else {
        setYoutubeUrl(item.youtube_url || "");
        setYoutubeTitle(item.youtube_title || "");
      }
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const filteredNews = availableNews.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <GripVertical className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Carousel Page d'Accueil
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gérez les actualités et vidéos YouTube affichées sur la page d'accueil
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Actualités</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{newsItems.length} / 3</p>
              </div>
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Vidéos YouTube</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">{youtubeItems.length} / 3</p>
              </div>
              <Youtube className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Actualités du Carousel</h2>
          <Button
            onClick={() => openForm('news')}
            disabled={newsItems.length >= 3}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une actualité
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                {item.news?.image_url && (
                  <img 
                    src={item.news.image_url} 
                    alt={item.news.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {item.news?.title}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm('news', item)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {newsItems.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune actualité dans le carousel</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* YouTube Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vidéos YouTube</h2>
          <Button
            onClick={() => openForm('youtube')}
            disabled={youtubeItems.length >= 3}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une vidéo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {youtubeItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 h-48 flex items-center justify-center">
                  <Youtube className="h-16 w-16 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.youtube_title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">
                  {item.youtube_url}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm('youtube', item)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {youtubeItems.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune vidéo YouTube dans le carousel</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedItem 
                ? `Modifier ${formType === 'news' ? "l'actualité" : "la vidéo"}` 
                : `Ajouter ${formType === 'news' ? "une actualité" : "une vidéo"}`}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {formType === 'news' ? (
              <div className="space-y-2">
                <Label>Sélectionner une actualité</Label>
                <div className="mb-4">
                  <Input
                    placeholder="Rechercher une actualité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <Select value={selectedNewsId} onValueChange={setSelectedNewsId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une actualité" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredNews.map((news) => (
                      <SelectItem key={news.id} value={news.id}>
                        {news.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Titre de la vidéo</Label>
                  <Input
                    value={youtubeTitle}
                    onChange={(e) => setYoutubeTitle(e.target.value)}
                    placeholder="Ex: Présentation de la FSR"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL YouTube</Label>
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Collez l'URL complète de la vidéo YouTube
                  </p>
                </div>
              </>
            )}

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                {selectedItem ? "Modifier" : "Ajouter"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCarousel;
