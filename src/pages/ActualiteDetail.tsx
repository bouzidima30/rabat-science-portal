
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Download, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import type { News } from "@/types/news";

const ActualiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [actualite, setActualite] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const categoryLabels = {
    "reunion_travail": "Réunion de travail",
    "nouvelles_informations": "Nouvelles informations",
    "activites_parauniversitaire": "Activités parauniversitaires",
    "avis_etudiants": "Avis étudiants",
    "avis_enseignants": "Avis enseignants",
    "evenements_scientifique": "Événements scientifiques",
  };

  useEffect(() => {
    if (id) {
      fetchActualite();
    }
  }, [id]);

  const fetchActualite = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      setActualite(data);
    } catch (error) {
      console.error('Error fetching actualité:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-3 text-gray-800 dark:text-gray-100">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2">• $1</li>')
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

  if (!actualite) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Actualité non trouvée
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                L'actualité que vous recherchez n'existe pas ou a été supprimée.
              </p>
              <Link to="/actualites">
                <Button className="bg-[#006be5] hover:bg-[#0056b3]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux actualités
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/actualites">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux actualités
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          {actualite.image_url && (
            <div className="aspect-video overflow-hidden">
              <img 
                src={actualite.image_url} 
                alt={actualite.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="secondary">
                {categoryLabels[actualite.category as keyof typeof categoryLabels]}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(actualite.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <CardTitle className="text-3xl mb-4">{actualite.title}</CardTitle>
            
            {actualite.excerpt && (
              <div className="text-lg text-gray-600 dark:text-gray-300 italic mb-6">
                {actualite.excerpt}
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <div 
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(actualite.content)
              }}
            />
            
            {actualite.document_url && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Document associé
                </h3>
                <Button
                  variant="outline"
                  onClick={() => window.open(actualite.document_url!, '_blank')}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {actualite.document_name || "Télécharger le document"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ActualiteDetail;
