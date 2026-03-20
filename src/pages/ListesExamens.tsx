import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import FileExplorer from "@/components/FileExplorer";

const ListesExamens = () => {
  const sections = [
    { title: "Session d'Automne", category: "listes_examens_automne" },
    { title: "Session de Printemps", category: "listes_examens_printemps" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Listes des Examens
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les listes des étudiants autorisés à passer les examens, 
            avec les détails de date, heure et salle pour chaque épreuve.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.category} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileExplorer categoryFilter={section.category} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions importantes */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    Conditions d'Accès
                  </h3>
                  <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                    <li>• Carte d'étudiant obligatoire</li>
                    <li>• Pièce d'identité valide</li>
                    <li>• Présence 15 min avant l'heure</li>
                    <li>• Vérifier votre nom sur la liste</li>
                  </ul>
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
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    En Cas d'Absence
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Si votre nom n'apparaît pas sur la liste ou en cas de problème, 
                    contactez immédiatement le service scolarité avant l'examen.
                    Aucune modification ne sera acceptée le jour J.
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

export default ListesExamens;
