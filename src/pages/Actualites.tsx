
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  document_url: string | null;
  document_name: string | null;
  created_at: string;
}

const Actualites = () => {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryOptions = [
    { value: "reunion_travail", label: "Réunion de travail" },
    { value: "nouvelles_informations", label: "Nouvelles informations" },
    { value: "activites_parauniversitaire", label: "Activités parauniversitaire" },
    { value: "avis_etudiants", label: "Avis étudiants" },
    { value: "avis_enseignants", label: "Avis enseignants" },
    { value: "evenements_scientifique", label: "Événements scientifique" },
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, selectedCategory]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  };

  const formatContent = (content: string) => {
    // Simple Markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006be5]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Actualités
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Restez informés des dernières nouvelles de la Faculté des Sciences de Rabat
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans les actualités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-[#006be5] hover:bg-[#0056b3]" : ""}
            >
              Toutes
            </Button>
            {categoryOptions.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? "bg-[#006be5] hover:bg-[#0056b3]" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid gap-6">
          {filteredNews.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="md:flex">
                {item.image_url && (
                  <div className="md:w-1/3">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className={`flex-1 ${item.image_url ? 'md:w-2/3' : 'w-full'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">
                        {categoryOptions.find(cat => cat.value === item.category)?.label}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 mb-4"
                      dangerouslySetInnerHTML={{ 
                        __html: formatContent(item.excerpt || item.content.substring(0, 300) + "...") 
                      }}
                    />
                    
                    {item.document_url && (
                      <div className="flex items-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.document_url!, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {item.document_name || "Télécharger le document"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucune actualité trouvée.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Actualites;
