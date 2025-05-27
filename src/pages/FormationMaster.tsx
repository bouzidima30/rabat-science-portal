
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const FormationMaster = () => {
  const { data: formations, isLoading } = useQuery({
    queryKey: ['formations', 'Master'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('type_formation', 'Master')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Formations Master
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez nos formations de niveau Master proposées par la Faculté des Sciences de Rabat
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {formations?.map((formation) => (
            <Card key={formation.id} className="shadow-lg hover:shadow-xl transition-shadow">
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
                <CardTitle className="text-xl text-[#006be5]">
                  {formation.titre}
                </CardTitle>
                {formation.departement && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Département: {formation.departement}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {formation.description}
                </p>
                <div className="flex gap-2">
                  <Link to={`/formation/${formation.id}`}>
                    <Button size="sm" className="bg-[#006be5] hover:bg-[#0056b3]">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir détails
                    </Button>
                  </Link>
                  {formation.document_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={formation.document_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        {formation.document_name || 'Document'}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!formations?.length && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Aucune formation disponible
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Les formations Master seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default FormationMaster;
