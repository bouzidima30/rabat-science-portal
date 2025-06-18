
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FormationDetail = () => {
  const { id } = useParams();

  const { data: formation, isLoading } = useQuery({
    queryKey: ['formation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <ModernNavbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006be5]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <ModernNavbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Formation non trouvée
            </h1>
            <Link to="/formations">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux formations
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
          <Link to={`/formation-${formation.type_formation.toLowerCase().replace(' ', '-')}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux formations {formation.type_formation}
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          {formation.image_url && (
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
              <img 
                src={formation.image_url} 
                alt={formation.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-[#006be5] mb-2">
                  {formation.titre}
                </CardTitle>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="bg-[#006be5] text-white px-3 py-1 rounded-full">
                    {formation.type_formation}
                  </span>
                  {formation.departement && (
                    <span>Département: {formation.departement}</span>
                  )}
                </div>
              </div>
              {formation.document_url && (
                <Button asChild>
                  <a href={formation.document_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    {formation.document_name || 'Télécharger'}
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {formation.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default FormationDetail;
