
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";

const Resultats = () => {
  const sessions = [
    {
      nom: "Session Automne 2023-2024",
      date: "Janvier 2024",
      resultats: [
        { niveau: "S1 - Semestre 1", fichier: "Resultats_S1_Automne_2024.pdf", taille: "2.1 MB" },
        { niveau: "S3 - Semestre 3", fichier: "Resultats_S3_Automne_2024.pdf", taille: "1.8 MB" },
        { niveau: "S5 - Semestre 5", fichier: "Resultats_S5_Automne_2024.pdf", taille: "1.9 MB" },
        { niveau: "M1 - Master 1", fichier: "Resultats_M1_Automne_2024.pdf", taille: "1.2 MB" },
        { niveau: "M3 - Master 3", fichier: "Resultats_M3_Automne_2024.pdf", taille: "1.0 MB" }
      ]
    },
    {
      nom: "Session Printemps 2023-2024",
      date: "Juin 2024",
      resultats: [
        { niveau: "S2 - Semestre 2", fichier: "Resultats_S2_Printemps_2024.pdf", taille: "2.3 MB" },
        { niveau: "S4 - Semestre 4", fichier: "Resultats_S4_Printemps_2024.pdf", taille: "2.0 MB" },
        { niveau: "S6 - Semestre 6", fichier: "Resultats_S6_Printemps_2024.pdf", taille: "1.7 MB" },
        { niveau: "M2 - Master 2", fichier: "Resultats_M2_Printemps_2024.pdf", taille: "1.1 MB" },
        { niveau: "M4 - Master 4", fichier: "Resultats_M4_Printemps_2024.pdf", taille: "0.9 MB" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Résultats des Examens
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez et téléchargez les résultats des sessions d'examens de l'année universitaire.
          </p>
        </div>

        <div className="space-y-8">
          {sessions.map((session, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <Calendar className="h-6 w-6 mr-2" />
                  {session.nom}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Publiés en {session.date}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {session.resultats.map((resultat, resultIndex) => (
                    <div key={resultIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-[#006be5] mr-3 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {resultat.niveau}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              PDF • {resultat.taille}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {resultat.fichier}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#006be5] hover:bg-[#0056b3] ml-2">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information importante */}
        <Card className="mt-12 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Information Importante
                </h3>
                <div className="text-red-800 dark:text-red-200 space-y-2">
                  <p>
                    • Les résultats sont publiés sous réserve de vérification et peuvent être modifiés.
                  </p>
                  <p>
                    • Pour toute contestation, vous disposez de 48h après la publication pour déposer une demande de révision.
                  </p>
                  <p>
                    • Les relevés de notes officiels sont disponibles au service scolarité.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Resultats;
