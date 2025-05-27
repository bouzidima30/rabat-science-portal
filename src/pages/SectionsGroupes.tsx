
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Download, Calendar } from "lucide-react";

const SectionsGroupes = () => {
  const sessions = [
    {
      nom: "Session Automne 2023-2024",
      date: "Septembre 2023",
      documents: [
        { niveau: "Licence S1", filiere: "Sciences Mathématiques", fichier: "Sections_L1_SMath_Automne.pdf", taille: "1.2 MB" },
        { niveau: "Licence S1", filiere: "Sciences Physiques", fichier: "Sections_L1_SPhys_Automne.pdf", taille: "1.1 MB" },
        { niveau: "Licence S3", filiere: "Sciences de la Vie", fichier: "Sections_L3_SVie_Automne.pdf", taille: "1.3 MB" },
        { niveau: "Master M1", filiere: "Informatique", fichier: "Sections_M1_Info_Automne.pdf", taille: "0.8 MB" },
        { niveau: "Master M1", filiere: "Chimie", fichier: "Sections_M1_Chimie_Automne.pdf", taille: "0.9 MB" }
      ]
    },
    {
      nom: "Session Printemps 2023-2024",
      date: "Février 2024",
      documents: [
        { niveau: "Licence S2", filiere: "Sciences Mathématiques", fichier: "Sections_L2_SMath_Printemps.pdf", taille: "1.4 MB" },
        { niveau: "Licence S2", filiere: "Sciences Physiques", fichier: "Sections_L2_SPhys_Printemps.pdf", taille: "1.2 MB" },
        { niveau: "Licence S4", filiere: "Sciences de la Vie", fichier: "Sections_L4_SVie_Printemps.pdf", taille: "1.5 MB" },
        { niveau: "Master M2", filiere: "Informatique", fichier: "Sections_M2_Info_Printemps.pdf", taille: "0.7 MB" },
        { niveau: "Master M2", filiere: "Chimie", fichier: "Sections_M2_Chimie_Printemps.pdf", taille: "0.8 MB" }
      ]
    }
  ];

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
                <div className="grid lg:grid-cols-2 gap-4">
                  {session.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-[#006be5] mr-3 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {doc.niveau} - {doc.filiere}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              PDF • {doc.taille}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {doc.fichier}
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
