
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";

const DynamicPage = () => {
  const { slug } = useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <ModernNavbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <ModernNavbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Page non trouvée
            </h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          {page.image_url && (
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
              <img 
                src={page.image_url} 
                alt={page.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-[#006be5] mb-8">
              {page.titre}
            </h1>
            
            <div 
              className="prose dark:prose-invert max-w-none prose-lg"
              dangerouslySetInnerHTML={{ __html: page.contenu }}
            />
            
            {page.fichiers && page.fichiers.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Fichiers attachés
                </h3>
                <div className="grid gap-3">
                  {page.fichiers.map((fichier, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      asChild
                      className="justify-start"
                    >
                      <a href={fichier} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger le fichier {index + 1}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default DynamicPage;
