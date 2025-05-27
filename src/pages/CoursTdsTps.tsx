
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Monitor, FileText, ExternalLink } from "lucide-react";

const CoursTdsTps = () => {
  const cours = [
    {
      niveau: "Licence S1",
      matieres: [
        { nom: "Analyse 1", fichier: "Cours_Analyse1_S1.pdf", taille: "2.3 MB", type: "Cours" },
        { nom: "Algèbre 1", fichier: "Cours_Algebre1_S1.pdf", taille: "1.8 MB", type: "Cours" },
        { nom: "Physique Générale", fichier: "Cours_Physique_S1.pdf", taille: "3.1 MB", type: "Cours" },
        { nom: "TDs Analyse 1", fichier: "TDs_Analyse1_S1.pdf", taille: "1.2 MB", type: "TD" }
      ]
    },
    {
      niveau: "Licence S3",
      matieres: [
        { nom: "Analyse 3", fichier: "Cours_Analyse3_S3.pdf", taille: "2.1 MB", type: "Cours" },
        { nom: "Probabilités", fichier: "Cours_Probabilites_S3.pdf", taille: "1.9 MB", type: "Cours" },
        { nom: "Physique Quantique", fichier: "Cours_PhysiqueQ_S3.pdf", taille: "2.8 MB", type: "Cours" },
        { nom: "TPs Physique", fichier: "TPs_Physique_S3.pdf", taille: "1.5 MB", type: "TP" }
      ]
    },
    {
      niveau: "Master M1",
      matieres: [
        { nom: "Analyse Fonctionnelle", fichier: "Cours_AnalyseFonc_M1.pdf", taille: "2.5 MB", type: "Cours" },
        { nom: "Algorithmique Avancée", fichier: "Cours_AlgoAvancee_M1.pdf", taille: "2.2 MB", type: "Cours" },
        { nom: "TDs Analyse Fonctionnelle", fichier: "TDs_AnalyseFonc_M1.pdf", taille: "1.3 MB", type: "TD" }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cours": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "TD": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "TP": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cours / TDs / TPs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Accédez aux supports de cours, travaux dirigés et travaux pratiques 
            de tous les niveaux d'études.
          </p>
        </div>

        {/* Accès Moodle */}
        <Card className="mb-12 bg-gradient-to-r from-[#006be5] to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-12 w-12 mr-6" />
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Plateforme Moodle FSR</h3>
                  <p className="text-blue-100">
                    Accédez à tous vos cours en ligne, forums de discussion et devoirs 
                    via notre plateforme d'apprentissage officielle.
                  </p>
                </div>
              </div>
              <Button 
                className="bg-white text-[#006be5] hover:bg-gray-100 font-semibold px-6 py-3"
                onClick={() => window.open('https://moodle-fsr.um5.ac.ma/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Accéder à Moodle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cours par niveau */}
        <div className="space-y-8">
          {cours.map((niveau, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <BookOpen className="h-6 w-6 mr-2" />
                  {niveau.niveau}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {niveau.matieres.map((matiere, matiereIndex) => (
                    <div key={matiereIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-[#006be5] mr-3 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {matiere.nom}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded ${getTypeColor(matiere.type)}`}>
                                {matiere.type}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {matiere.taille}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {matiere.fichier}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#006be5] hover:bg-[#0056b3]">
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

        {/* Informations pratiques */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Documents Complémentaires
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Pour accéder à l'intégralité des supports de cours, exercices corrigés 
                    et ressources multimédia, connectez-vous à la plateforme Moodle avec 
                    vos identifiants étudiants.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Monitor className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Support Technique
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    En cas de problème d'accès à Moodle ou aux documents, 
                    contactez le service informatique : support@fsr.ac.ma 
                    ou rendez-vous au bureau des systèmes d'information.
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

export default CoursTdsTps;
