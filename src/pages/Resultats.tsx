import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileExplorer from "@/components/FileExplorer";

const Resultats = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Résultats des Examens
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez et téléchargez les résultats des sessions d'examens de l'année universitaire.
          </p>
        </div>

        <Tabs defaultValue="resultats_automne" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resultats_automne">Session d'Automne</TabsTrigger>
            <TabsTrigger value="resultats_printemps">Session de Printemps</TabsTrigger>
          </TabsList>

          <TabsContent value="resultats_automne">
            <FileExplorer categoryFilter="resultats_automne" showDownload />
          </TabsContent>

          <TabsContent value="resultats_printemps">
            <FileExplorer categoryFilter="resultats_printemps" showDownload />
          </TabsContent>
        </Tabs>

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
                  <p>• Les résultats sont publiés sous réserve de vérification et peuvent être modifiés.</p>
                  <p>• Pour toute contestation, vous disposez de 48h après la publication pour déposer une demande de révision.</p>
                  <p>• Les relevés de notes officiels sont disponibles au service scolarité.</p>
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
