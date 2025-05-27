
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Clock, Plane } from "lucide-react";

const CalendrierEmploiTemps = () => {
  const emploisTemps = [
    {
      niveau: "Licence S1",
      documents: [
        { nom: "Emploi du temps - Groupe A", fichier: "EDT_L1_GroupeA.pdf", taille: "1.2 MB" },
        { nom: "Emploi du temps - Groupe B", fichier: "EDT_L1_GroupeB.pdf", taille: "1.1 MB" }
      ]
    },
    {
      niveau: "Licence S3",
      documents: [
        { nom: "Emploi du temps - Math", fichier: "EDT_L3_Math.pdf", taille: "1.3 MB" },
        { nom: "Emploi du temps - Physique", fichier: "EDT_L3_Phys.pdf", taille: "1.2 MB" }
      ]
    },
    {
      niveau: "Master M1",
      documents: [
        { nom: "Emploi du temps - Informatique", fichier: "EDT_M1_Info.pdf", taille: "0.9 MB" },
        { nom: "Emploi du temps - Mathématiques", fichier: "EDT_M1_Math.pdf", taille: "0.8 MB" }
      ]
    }
  ];

  const calendriers = [
    {
      type: "Calendrier des Semaines",
      description: "Répartition des semaines de cours et d'examens",
      fichier: "Calendrier_Semaines_2023-2024.pdf",
      taille: "2.1 MB"
    },
    {
      type: "Calendrier des Vacances",
      description: "Dates officielles des vacances universitaires",
      fichier: "Calendrier_Vacances_2023-2024.pdf",
      taille: "1.5 MB"
    },
    {
      type: "Calendrier Académique Complet",
      description: "Planning complet de l'année universitaire",
      fichier: "Calendrier_Academique_2023-2024.pdf",
      taille: "3.2 MB"
    }
  ];

  const periodes = [
    {
      nom: "Vacances d'Automne",
      dates: "28 Oct - 5 Nov 2024",
      duree: "1 semaine"
    },
    {
      nom: "Vacances d'Hiver",
      dates: "23 Déc 2024 - 7 Jan 2025",
      duree: "2 semaines"
    },
    {
      nom: "Vacances de Printemps",
      dates: "24 Mars - 7 Avril 2025",
      duree: "2 semaines"
    },
    {
      nom: "Vacances d'Été",
      dates: "1 Juillet - 31 Août 2025",
      duree: "2 mois"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Calendrier & Emploi du Temps
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Consultez les emplois du temps, calendriers des semaines et planning 
            des vacances pour l'année universitaire en cours.
          </p>
        </div>

        {/* Emplois du temps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Emplois du Temps
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {emploisTemps.map((niveau, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-[#006be5] flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {niveau.niveau}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {niveau.documents.map((doc, docIndex) => (
                      <div key={docIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.nom}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF • {doc.taille}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Calendriers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Calendriers Officiels
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {calendriers.map((calendrier, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#006be5] flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {calendrier.type}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {calendrier.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {calendrier.fichier}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {calendrier.taille}
                      </p>
                    </div>
                    <Button className="bg-[#006be5] hover:bg-[#0056b3]">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Périodes de vacances */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-[#006be5] flex items-center">
              <Plane className="h-6 w-6 mr-2" />
              Vacances Universitaires 2024-2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {periodes.map((periode, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {periode.nom}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {periode.dates}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {periode.duree}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informations pratiques */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Mise à Jour des Emplois
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Les emplois du temps peuvent être modifiés en cours de semestre. 
                    Consultez régulièrement cette page et vos tableaux d'affichage 
                    pour les dernières mises à jour.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Application Mobile
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Téléchargez l'application mobile FSR pour avoir accès à votre 
                    emploi du temps personnel, notifications de changements et 
                    rappels d'examens directement sur votre téléphone.
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

export default CalendrierEmploiTemps;
