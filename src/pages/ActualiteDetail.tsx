import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";

const ActualiteDetail = () => {
  const { id } = useParams();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Actualité non trouvée');
      return data;
    },
    enabled: !!id
  });

  const categoryLabels = {
    reunion_travail: "Réunion de travail",
    nouvelles_informations: "Nouvelles informations", 
    activites_parauniversitaire: "Activités parauniversitaire",
    avis_etudiants: "Avis étudiants",
    avis_enseignants: "Avis enseignants",
    evenements_scientifique: "Événements scientifique"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <ModernNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <ModernNavbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Actualité non trouvée</h2>
              <p className="text-gray-600 mb-4">Cette actualité n'existe pas ou a été supprimée.</p>
              <Link to="/actualites">
                <Button>
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
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/actualites">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux actualités
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                {categoryLabels[news.category as keyof typeof categoryLabels] || news.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(news.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {news.author_id && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Auteur
                  </div>
                )}
              </div>
            </div>

            {news.image_url && (
              <div className="mb-8">
                <img 
                  src={news.image_url} 
                  alt={news.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {news.content}
              </div>
            </div>

            {news.document_url && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Document joint</h3>
                <a 
                  href={news.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {news.document_name || "Télécharger le document"}
                </a>
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
