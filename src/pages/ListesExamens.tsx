
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, MapPin } from "lucide-react";

const ListesExamens = () => {
  const sessions = [
    {
      nom: "Session d'Automne 2024",
      periode: "Janvier 2024",
      examens: [
        {
          module: "Analyse 1",
          niveau: "Licence S1",
          date: "15 Janvier 2024",
          heure: "08:00 - 10:00",
          salle: "Amphi A",
          fichier: "Liste_Analyse1_S1_Automne2024.pdf",
          taille: "850 KB"
        },
        {
          module: "Algèbre Générale",
          niveau: "Licence S1", 
          date: "17 Janvier 2024",
          heure: "14:00 - 16:00",
          salle: "Amphi B",
          fichier: "Liste_Algebre_S1_Automne2024.pdf",
          taille: "780 KB"
        },
        {
          module: "Probabilités",
          niveau: "Licence S3",
          date: "19 Janvier 2024", 
          heure: "10:00 - 12:00",
          salle: "Salle 201",
          fichier: "Liste_Probabilites_S3_Automne2024.pdf",
          taille: "920 KB"
        },
        {
          module: "Analyse Fonctionnelle",
          niveau: "Master M1",
          date: "22 Janvier 2024",
          heure: "08:00 - 11:00", 
          salle: "Salle 105",
          fichier: "Liste_AnalyseFonc_M1_Automne2024.pdf",
          taille: "650 KB"
        }
      ]
    },
    {
      nom: "Session de Printemps 2024",
      periode: "Juin 2024",
      examens: [
        {
          module: "Analyse 2",
          niveau: "Licence S2",
          date: "10 Juin 2024",
          heure: "08:00 - 10:00",
          salle: "Amphi A",
          fichier: "Liste_Analyse2_S2_Printemps2024.pdf",
          taille: "890 KB"
        },
        {
          module: "Physique 2",
          niveau: "Licence S2",
          date: "12 Juin 2024",
          heure: "14:00 - 16:00",
          salle: "Amphi C",
          fichier: "Liste_Physique2_S2_Printemps2024.pdf",
          taille: "820 KB"
        },
        {
          module: "Statistiques",
          niveau: "Licence S4",
          date: "14 Juin 2024",
          heure: "10:00 - 12:00",
          salle: "Salle 301",
          fichier: "Liste_Statistiques_S4_Printemps2024.pdf",
          taille: "750 KB"
        },
        {
          module: "Algorithmes Avancés",
          niveau: "Master M2",
          date: "17 Juin 2024",
          heure: "08:00 - 11:00",
          salle: "Lab Info",
          fichier: "Liste_AlgoAvances_M2_Printemps2024.pdf",
          taille: "680 KB"
        }
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
            Listes des Examens
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les listes des étudiants autorisés à passer les examens, 
            avec les détails de date, heure et salle pour chaque épreuve.
          </p>
        </div>

        <div className="space-y-8">
          {sessions.map((session, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  {session.nom}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Période : {session.periode}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  {session.examens.map((examen, examIndex) => (
                    <div key={examIndex} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                            {examen.module}
                          </h4>
                          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {examen.niveau}
                          </span>
                        </div>
                        <Button size="sm" className="bg-[#006be5] hover:bg-[#0056b3]">
                          <Download className="h-3 w-3 mr-1" />
                          Liste
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4 mr-2 text-[#006be5]" />
                          <span>{examen.date} • {examen.heure}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-[#006be5]" />
                          <span>{examen.salle}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <FileText className="h-4 w-4 mr-2 text-[#006be5]" />
                          <span>{examen.fichier} • {examen.taille}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
