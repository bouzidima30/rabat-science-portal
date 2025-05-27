
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Award, Users, GraduationCap } from "lucide-react";

const Preselection = () => {
  const cycles = [
    {
      nom: "Cycle Licence d'Excellence",
      description: "Listes de présélection pour l'accès au cycle licence d'excellence",
      icon: Award,
      color: "bg-gold-500",
      documents: [
        { nom: "Licence Excellence - Sciences Mathématiques", fichier: "Preselection_LEX_SMath_2024.pdf", taille: "1.2 MB" },
        { nom: "Licence Excellence - Sciences Physiques", fichier: "Preselection_LEX_SPhys_2024.pdf", taille: "1.1 MB" },
        { nom: "Licence Excellence - Sciences de la Vie", fichier: "Preselection_LEX_SVie_2024.pdf", taille: "1.3 MB" },
        { nom: "Licence Excellence - Informatique", fichier: "Preselection_LEX_Info_2024.pdf", taille: "1.0 MB" }
      ]
    },
    {
      nom: "Cycle Master",
      description: "Listes de présélection pour l'accès aux différents masters",
      icon: Users,
      color: "bg-blue-500",
      documents: [
        { nom: "Master Mathématiques Appliquées", fichier: "Preselection_Master_MathApp_2024.pdf", taille: "0.9 MB" },
        { nom: "Master Physique des Matériaux", fichier: "Preselection_Master_PhysMat_2024.pdf", taille: "0.8 MB" },
        { nom: "Master Informatique", fichier: "Preselection_Master_Info_2024.pdf", taille: "1.1 MB" },
        { nom: "Master Chimie Organique", fichier: "Preselection_Master_ChimieOrg_2024.pdf", taille: "0.7 MB" },
        { nom: "Master Biologie Moléculaire", fichier: "Preselection_Master_BioMol_2024.pdf", taille: "0.9 MB" }
      ]
    },
    {
      nom: "Cycle Doctorat",
      description: "Listes de présélection pour l'accès aux formations doctorales",
      icon: GraduationCap,
      color: "bg-purple-500",
      documents: [
        { nom: "Doctorat Mathématiques", fichier: "Preselection_Doctorat_Math_2024.pdf", taille: "0.6 MB" },
        { nom: "Doctorat Physique", fichier: "Preselection_Doctorat_Phys_2024.pdf", taille: "0.5 MB" },
        { nom: "Doctorat Informatique", fichier: "Preselection_Doctorat_Info_2024.pdf", taille: "0.7 MB" },
        { nom: "Doctorat Chimie", fichier: "Preselection_Doctorat_Chimie_2024.pdf", taille: "0.4 MB" },
        { nom: "Doctorat Sciences de la Vie", fichier: "Preselection_Doctorat_SVie_2024.pdf", taille: "0.6 MB" }
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
            Listes de Présélection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les listes de présélection pour les différents cycles d'études : 
            Licence d'Excellence, Master et Doctorat.
          </p>
        </div>

        <div className="space-y-8">
          {cycles.map((cycle, index) => {
            const IconComponent = cycle.icon;
            return (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[#006be5] flex items-center">
                    <div className={`w-10 h-10 ${cycle.color} rounded-lg flex items-center justify-center mr-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    {cycle.nom}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {cycle.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cycle.documents.map((doc, docIndex) => (
                      <div key={docIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <FileText className="h-5 w-5 text-[#006be5] mr-3 mt-1" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                                {doc.nom}
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
            );
          })}
        </div>

        {/* Informations importantes */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Étapes Suivantes
                  </h3>
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
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Documents Requis
                  </h3>
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
