import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import FileExplorer from "@/components/FileExplorer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const PlanningEvaluations = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Planning & Calendrier des Évaluations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les plannings détaillés des évaluations et les calendriers 
            des évaluations de fin de semestre pour tous les niveaux d'études.
          </p>
        </div>

        {/* Planning des évaluations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-[#006be5]" />
            Planning des Évaluations
          </h2>
          <FileExplorer categoryFilter="planning_evaluations" showDownload={true} />
        </div>

        {/* Calendrier des évaluations de fin de semestre */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-[#006be5]" />
            Calendrier des Évaluations de Fin de Semestre
          </h2>
          <FileExplorer categoryFilter="calendrier_evaluations" showDownload={true} />
        </div>

        {/* Informations importantes */}
        <div className="grid md:grid-cols-2 gap-8">
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
                    Conseils Importants
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
