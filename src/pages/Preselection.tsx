import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Award, Users, GraduationCap, PenLine, Mic, CheckCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const SUB_SECTIONS = [
  { suffix: "ecrit", label: "Liste des Candidats convoqués pour passer l'examen écrit", icon: PenLine },
  { suffix: "oral", label: "Liste des candidats admis pour passer l'examen oral", icon: Mic },
  { suffix: "retenus", label: "Liste des candidats retenus", icon: CheckCircle },
];

const CYCLES = [
  { key: "preselection_licence", nom: "Cycle Licence d'Excellence", icon: Award, color: "bg-yellow-500" },
  { key: "preselection_master", nom: "Cycle Master", icon: Users, color: "bg-blue-500" },
  { key: "preselection_doctorat", nom: "Cycle Doctorat", icon: GraduationCap, color: "bg-purple-500" },
];

const ALL_CATEGORIES = CYCLES.flatMap(c => SUB_SECTIONS.map(s => `${c.key}_${s.suffix}`));

const Preselection = () => {
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["preselection-public-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .in("category", ALL_CATEGORIES)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatSize = (size: number | null) => {
    if (!size) return "";
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Listes de Présélection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les listes de présélection pour les différents cycles d'études : 
            Licence d'Excellence, Master et Doctorat.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-10">
            {CYCLES.map((cycle) => {
              const CycleIcon = cycle.icon;
              return (
                <Card key={cycle.key} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#006be5] flex items-center">
                      <div className={`w-10 h-10 ${cycle.color} rounded-lg flex items-center justify-center mr-3`}>
                        <CycleIcon className="h-6 w-6 text-white" />
                      </div>
                      {cycle.nom}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {SUB_SECTIONS.map((sub) => {
                      const SubIcon = sub.icon;
                      const category = `${cycle.key}_${sub.suffix}`;
                      const subFiles = files.filter(f => f.category === category);
                      return (
                        <div key={sub.suffix}>
                          <div className="flex items-center gap-2 mb-3">
                            <SubIcon className="h-5 w-5 text-[#006be5]" />
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{sub.label}</h3>
                          </div>
                          {subFiles.length === 0 ? (
                            <p className="text-gray-500 text-sm pl-7 py-2">Aucun document disponible pour le moment.</p>
                          ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pl-7">
                              {subFiles.map((file) => (
                                <div key={file.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start min-w-0">
                                      <FileText className="h-5 w-5 text-[#006be5] mr-2 mt-0.5 shrink-0" />
                                      <div className="min-w-0">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm truncate">
                                          {file.original_name}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {file.mime_type?.includes("pdf") ? "PDF" : file.original_name.split(".").pop()?.toUpperCase()} • {formatSize(file.file_size)}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-[#006be5] hover:bg-[#0056b3] ml-2 shrink-0"
                                      onClick={() => window.open(file.file_url, "_blank")}
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      PDF
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Étapes Suivantes</h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    Les candidats présélectionnés recevront une convocation pour les épreuves 
                    écrites et/ou orales. Surveillez votre email et le site web pour les mises à jour.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Documents Requis</h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Préparez vos documents : copies des diplômes, relevés de notes, 
                    lettre de motivation et pièce d'identité pour la suite du processus.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Preselection;
