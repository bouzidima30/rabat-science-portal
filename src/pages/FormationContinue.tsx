
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Eye, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormationContinue = () => {
  const [selectedDepartement, setSelectedDepartement] = useState<string>("all");

  const { data: formations, isLoading } = useQuery({
    queryKey: ['formations', 'Formation Continue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('type_formation', 'Formation Continue')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const departements = [
    'Biologie',
    'Chimie',
    'Géologie',
    'Informatique',
    'Mathématiques',
    'Physique'
  ];

  const filteredFormations = formations?.filter(formation => {
    if (selectedDepartement === "all") return true;
    return formation.departement === selectedDepartement;
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
            Formation Continue
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez nos formations continues proposées par la Faculté des Sciences de Rabat
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Filtrer par département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les départements</SelectItem>
                      {departements.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedDepartement !== "all" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDepartement("all")}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {filteredFormations?.map((formation) => (
            <Card key={formation.id} className="shadow-lg hover:shadow-xl transition-shadow">
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

        {!filteredFormations?.length && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Aucune formation disponible
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {selectedDepartement !== "all" 
                ? `Aucune formation trouvée pour le département ${selectedDepartement}.`
                : "Les formations continues seront bientôt disponibles."
              }
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default FormationContinue;
