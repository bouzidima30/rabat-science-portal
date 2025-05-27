
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Building, Users, Award, Target } from "lucide-react";

const ValorisationRecherche = () => {
  const axes = [
    {
      titre: "Transfert de Technologie",
      description: "Faciliter le transfert des innovations vers l'industrie",
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      titre: "Création d'Entreprises",
      description: "Accompagnement des spin-offs et start-ups scientifiques",
      icon: Building,
      color: "bg-green-500"
    },
    {
      titre: "Partenariats Industriels",
      description: "Développement de collaborations avec le secteur privé",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      titre: "Propriété Intellectuelle",
      description: "Protection et valorisation des brevets et inventions",
      icon: Award,
      color: "bg-orange-500"
    }
  ];

  const resultats = [
    { titre: "Brevets Déposés", valeur: "15+", description: "Par année" },
    { titre: "Spin-offs Créées", valeur: "5+", description: "Entreprises innovantes" },
    { titre: "Contrats R&D", valeur: "30+", description: "Partenariats actifs" },
    { titre: "Licences Accordées", valeur: "8+", description: "Technologies transférées" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Valorisation de la Recherche
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La FSR s'engage activement dans la valorisation de ses recherches pour créer 
            de la valeur économique et sociale à partir des découvertes scientifiques.
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5] flex items-center justify-center">
              <Target className="h-6 w-6 mr-2" />
              Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                La valorisation de la recherche à la FSR vise à transformer les résultats 
                de recherche en innovations concrètes bénéficiant à la société et à l'économie 
                marocaine. Nous accompagnons nos chercheurs dans le processus de transfert 
                technologique et de création de valeur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Axes principaux */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Axes de Valorisation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {axes.map((axe, index) => {
              const IconComponent = axe.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 ${axe.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-[#006be5]">
                      {axe.titre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 text-sm text-center">
                      {axe.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Nos Résultats
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resultats.map((resultat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-3xl font-bold text-[#006be5] mb-2">
                    {resultat.valeur}
                  </h3>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {resultat.titre}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {resultat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5] flex items-center justify-center">
              <Lightbulb className="h-6 w-6 mr-2" />
              Services Offerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Accompagnement à l'Innovation
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Évaluation du potentiel de valorisation</li>
                  <li>• Étude de marché et de faisabilité</li>
                  <li>• Aide à la rédaction de brevets</li>
                  <li>• Recherche de financements</li>
                  <li>• Mise en relation avec les industriels</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Support à l'Entrepreneuriat
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Formation à l'entrepreneuriat</li>
                  <li>• Accompagnement business plan</li>
                  <li>• Incubation de start-ups</li>
                  <li>• Réseautage et mentoring</li>
                  <li>• Accès aux espaces de co-working</li>
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

export default ValorisationRecherche;
