
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const CeDoc = () => {
  const formulaires = [
    {
      titre: "Soutenance de Thèse Doctorale",
      description: "Formulaires nécessaires pour la préparation et organisation de la soutenance",
      documents: [
        { nom: "Demande de soutenance", format: "PDF", taille: "120 KB" },
        { nom: "Formulaire d'autorisation", format: "DOC", taille: "85 KB" },
        { nom: "Composition du jury", format: "PDF", taille: "95 KB" }
      ]
    },
    {
      titre: "Inscription / Réinscription",
      description: "Documents pour l'inscription et la réinscription en doctorat",
      documents: [
        { nom: "Fiche d'inscription", format: "PDF", taille: "150 KB" },
        { nom: "Demande de réinscription", format: "DOC", taille: "110 KB" },
        { nom: "Convention de thèse", format: "PDF", taille: "200 KB" }
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
            CeDoc - Centre de Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Téléchargez tous les formulaires nécessaires pour la soutenance de thèse doctorale 
            et les procédures d'inscription/réinscription.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {formulaires.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  {section.titre}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-[#006be5] mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.nom}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.format} • {doc.taille}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006be5] hover:bg-[#0056b3]">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Information importante
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200">
                  Tous les formulaires doivent être dûment remplis et signés avant soumission. 
                  Pour toute question, contactez le secrétariat du CeDoc.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default CeDoc;
