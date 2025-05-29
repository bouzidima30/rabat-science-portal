
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb, Users, Rocket } from "lucide-react";

const ProjetDeveloppement = () => {
  const projets = [
    {
      title: "Innovation Pédagogique",
      description: "Modernisation des méthodes d'enseignement et intégration des nouvelles technologies dans l'apprentissage.",
      icon: Lightbulb,
      status: "En cours",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Recherche d'Excellence",
      description: "Renforcement des capacités de recherche et développement de partenariats internationaux.",
      icon: Target,
      status: "Planifié",
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Infrastructure Moderne",
      description: "Amélioration des équipements de laboratoire et des espaces d'apprentissage.",
      icon: Rocket,
      status: "En cours",
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Partenariats Industriels",
      description: "Développement de collaborations avec le secteur privé pour l'employabilité des diplômés.",
      icon: Users,
      status: "Nouveau",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const objectifs = [
    "Améliorer la qualité de l'enseignement supérieur scientifique",
    "Développer la recherche scientifique et l'innovation",
    "Renforcer les partenariats nationaux et internationaux",
    "Moderniser l'infrastructure et les équipements",
    "Promouvoir l'entrepreneuriat et l'innovation technologique"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Projet de Développement
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La Faculté des Sciences de Rabat s'engage dans une démarche de développement continu 
            pour maintenir son excellence académique et répondre aux défis du 21e siècle.
          </p>
        </div>

        {/* Vision Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Notre Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              Être une faculté de référence dans l'enseignement supérieur scientifique et la recherche, 
              contribuant activement au développement socio-économique du Maroc et de la région, 
              tout en maintenant des standards internationaux d'excellence.
            </p>
          </CardContent>
        </Card>

        {/* Objectifs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Objectifs Stratégiques
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectifs.map((objectif, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#006be5] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {objectif}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Projets en cours */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Projets de Développement
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projets.map((projet, index) => {
              const IconComponent = projet.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-[#006be5]" />
                      </div>
                      <Badge className={projet.color}>
                        {projet.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {projet.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {projet.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Axes de développement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Axes de Développement Prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Formation et Pédagogie
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Digitalisation des contenus pédagogiques</li>
                  <li>• Formation continue des enseignants</li>
                  <li>• Développement de nouvelles filières</li>
                  <li>• Renforcement de l'accompagnement étudiant</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Recherche et Innovation
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Création de nouveaux laboratoires de recherche</li>
                  <li>• Développement de projets multidisciplinaires</li>
                  <li>• Valorisation des résultats de recherche</li>
                  <li>• Coopération internationale renforcée</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProjetDeveloppement;
