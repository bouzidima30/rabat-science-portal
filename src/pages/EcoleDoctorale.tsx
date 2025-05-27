
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, Award, FileText } from "lucide-react";

const EcoleDoctorale = () => {
  const specialites = [
    "Mathématiques et Applications",
    "Physique et Sciences des Matériaux", 
    "Chimie et Chimie Physique",
    "Sciences de la Vie et de la Santé",
    "Sciences de la Terre et de l'Univers",
    "Informatique et Télécommunications"
  ];

  const statistiques = [
    { titre: "Doctorants Inscrits", valeur: "450+", icon: Users },
    { titre: "Thèses Soutenues/An", valeur: "80+", icon: Award },
    { titre: "Directeurs de Thèse", valeur: "120+", icon: BookOpen },
    { titre: "Laboratoires Partenaires", valeur: "25+", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            École Doctorale
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            L'École Doctorale de la FSR forme les futurs chercheurs et enseignants-chercheurs 
            dans les différentes disciplines scientifiques.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statistiques.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#006be5] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.valeur}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {stat.titre}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#006be5] flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                Mission de l'École Doctorale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  L'École Doctorale de la Faculté des Sciences de Rabat a pour mission principale 
                  de coordonner et d'encadrer la formation doctorale dans les différentes 
                  disciplines scientifiques.
                </p>
                <ul className="space-y-2">
                  <li>• Organiser et superviser les formations doctorales</li>
                  <li>• Assurer le suivi pédagogique des doctorants</li>
                  <li>• Faciliter les échanges scientifiques internationaux</li>
                  <li>• Promouvoir l'excellence en recherche</li>
                  <li>• Favoriser l'insertion professionnelle des docteurs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Spécialités */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#006be5]">
                Spécialités Doctorales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specialites.map((specialite, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-[#006be5] rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">{specialite}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Processus d'admission */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Processus d'Admission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#006be5]">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Candidature</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dépôt du dossier de candidature avec projet de recherche
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#006be5]">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Évaluation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Examen du dossier par la commission d'admission
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#006be5]">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Inscription</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Finalisation de l'inscription et début de la formation
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

export default EcoleDoctorale;
