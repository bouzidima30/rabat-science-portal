
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Clock, FileText } from "lucide-react";

const PlanningEvaluations = () => {
  const plannings = [
    {
      session: "Session d'Automne 2024",
      periode: "Janvier 2024",
      description: "Planning des évaluations pour la session de rattrapage d'automne",
      documents: [
        {
          niveau: "Licence - Semestres Impairs (S1, S3, S5)",
          fichier: "Planning_Evaluations_Licence_Impairs_Automne2024.pdf",
          taille: "2.1 MB",
          datePublication: "05 Janvier 2024"
        },
        {
          niveau: "Master - Semestres Impairs (M1, M3)",
          fichier: "Planning_Evaluations_Master_Impairs_Automne2024.pdf", 
          taille: "1.8 MB",
          datePublication: "05 Janvier 2024"
        }
      ]
    },
    {
      session: "Session de Printemps 2024",
      periode: "Juin 2024",
      description: "Planning des évaluations pour la session principale de printemps",
      documents: [
        {
          niveau: "Licence - Semestres Pairs (S2, S4, S6)",
          fichier: "Planning_Evaluations_Licence_Pairs_Printemps2024.pdf",
          taille: "2.3 MB",
          datePublication: "20 Mai 2024"
        },
        {
          niveau: "Master - Semestres Pairs (M2, M4)",
          fichier: "Planning_Evaluations_Master_Pairs_Printemps2024.pdf",
          taille: "1.9 MB", 
          datePublication: "20 Mai 2024"
        }
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
            Planning & Calendrier des Évaluations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les plannings détaillés des évaluations pour toutes les sessions 
            et tous les niveaux d'études.
          </p>
        </div>

        <div className="space-y-8">
          {plannings.map((planning, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <Calendar className="h-6 w-6 mr-2" />
                  {planning.session}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  {planning.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {planning.periode}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {planning.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {doc.niveau}
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#006be5]" />
                              <span>{doc.fichier}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500">Taille: {doc.taille}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500">Publié le: {doc.datePublication}</span>
                            </div>
                          </div>
                        </div>
                        <Button className="bg-[#006be5] hover:bg-[#0056b3]">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations importantes */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Planification des Examens
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Les plannings incluent les dates, heures, salles et modalités de chaque évaluation. 
                    Vérifiez régulièrement les mises à jour car des modifications peuvent survenir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Conseils Important
                  </h3>
                  <ul className="text-orange-800 dark:text-orange-200 text-sm space-y-1">
                    <li>• Vérifiez votre planning 48h avant chaque examen</li>
                    <li>• Notez les changements de salle éventuels</li>
                    <li>• Préparez vos documents d'identification</li>
                    <li>• Arrivez 15 minutes avant l'heure prévue</li>
                  </ul>
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

export default PlanningEvaluations;
