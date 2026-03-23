
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileExplorer from "@/components/FileExplorer";

const SectionsGroupes = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sections et Groupes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez la répartition des étudiants par sections et groupes pour chaque semestre 
            et filière d'études.
          </p>
        </div>

        <Tabs defaultValue="sections_groupes_automne" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sections_groupes_automne">Session d'Automne</TabsTrigger>
            <TabsTrigger value="sections_groupes_printemps">Session de Printemps</TabsTrigger>
          </TabsList>

          <TabsContent value="sections_groupes_automne">
            <FileExplorer categoryFilter="sections_groupes_automne" showDownload />
          </TabsContent>

          <TabsContent value="sections_groupes_printemps">
            <FileExplorer categoryFilter="sections_groupes_printemps" showDownload />
          </TabsContent>
        </Tabs>

        {/* Informations utiles */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Organisation des Groupes
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Les groupes sont formés selon l'ordre alphabétique et équilibrés en nombre. 
                    Chaque groupe ne dépasse pas 40 étudiants pour optimiser l'encadrement pédagogique.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Modification de Groupe
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Les demandes de changement de groupe doivent être déposées au service scolarité 
                    dans les deux semaines suivant la publication des listes.
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

export default SectionsGroupes;
