
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, BookOpen, Download, Users } from "lucide-react";

const RessourcesElectroniques = () => {
  const databases = [
    {
      nom: "ScienceDirect",
      description: "Base de données multidisciplinaire d'Elsevier",
      domaines: ["Sciences physiques", "Chimie", "Mathématiques", "Biologie"],
      acces: "Campus + VPN"
    },
    {
      nom: "Springer Link",
      description: "Plateforme de livres et revues scientifiques",
      domaines: ["Sciences exactes", "Informatique", "Médecine"],
      acces: "Campus + VPN"
    },
    {
      nom: "IEEE Xplore",
      description: "Base de données en informatique et électronique",
      domaines: ["Informatique", "Électronique", "Télécommunications"],
      acces: "Campus uniquement"
    },
    {
      nom: "MathSciNet",
      description: "Base de données spécialisée en mathématiques",
      domaines: ["Mathématiques pures", "Mathématiques appliquées"],
      acces: "Campus + VPN"
    }
  ];

  const revues = [
    "Nature", "Science", "Physical Review", "Journal of Chemistry",
    "Bioinformatics", "Computer Science", "Mathematical Reviews"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ressources Électroniques
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Accédez à une vaste collection de bases de données, revues électroniques 
            et ressources numériques pour vos recherches.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Monitor className="h-8 w-8 text-[#006be5] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">15+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Bases de données</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-[#006be5] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">5000+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Revues en ligne</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Download className="h-8 w-8 text-[#006be5] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Illimité</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Téléchargements</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-[#006be5] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24/7</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Accès disponible</p>
            </CardContent>
          </Card>
        </div>

        {/* Bases de données */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Principales Bases de Données
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {databases.map((db, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#006be5]">{db.nom}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{db.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        Domaines couverts :
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {db.domaines.map((domaine, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                            {domaine}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Accès : {db.acces}
                      </span>
                      <Button size="sm" className="bg-[#006be5] hover:bg-[#0056b3]">
                        Accéder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Revues populaires */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl text-[#006be5] text-center">
              Revues Scientifiques Populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {revues.map((revue, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{revue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guide d'utilisation */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
                Comment Accéder aux Ressources ?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-green-800 dark:text-green-200">
                <div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p className="font-medium mb-2">Depuis le Campus</p>
                  <p className="text-sm">Connexion directe via le réseau FSR</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p className="font-medium mb-2">À Distance</p>
                  <p className="text-sm">Utilisation du VPN institutionnel</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p className="font-medium mb-2">Support</p>
                  <p className="text-sm">Formation et assistance disponibles</p>
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

export default RessourcesElectroniques;
