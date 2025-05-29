
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, Users, Building } from "lucide-react";

const Historique = () => {
  const periodes = [
    {
      annee: "1957",
      titre: "Création",
      description: "Création de la Faculté des Sciences de Rabat dans le cadre de l'Université Mohammed V.",
      icon: Building,
      type: "fondation"
    },
    {
      annee: "1960-1970",
      titre: "Premiers Développements",
      description: "Mise en place des premiers départements et laboratoires de recherche.",
      icon: Users,
      type: "developpement"
    },
    {
      annee: "1980-1990",
      titre: "Expansion",
      description: "Création de nouveaux cycles de formation et développement de la recherche.",
      icon: Award,
      type: "expansion"
    },
    {
      annee: "2000-2010",
      titre: "Modernisation",
      description: "Adoption du système LMD et modernisation des équipements de recherche.",
      icon: Award,
      type: "modernisation"
    },
    {
      annee: "2010-2020",
      titre: "Excellence",
      description: "Renforcement de la coopération internationale et développement de l'innovation.",
      icon: Award,
      type: "excellence"
    },
    {
      annee: "2020-Aujourd'hui",
      titre: "Transformation Numérique",
      description: "Digitalisation de l'enseignement et développement de nouveaux programmes.",
      icon: Award,
      type: "transformation"
    }
  ];

  const chiffres = [
    { label: "Années d'existence", valeur: "67+", description: "Depuis 1957" },
    { label: "Générations formées", valeur: "100,000+", description: "Diplômés" },
    { label: "Départements", valeur: "12", description: "Spécialisés" },
    { label: "Laboratoires", valeur: "25+", description: "De recherche" }
  ];

  const personnalites = [
    {
      nom: "Pr. Ahmed Ben Bella",
      poste: "Premier Doyen (1957-1965)",
      contribution: "Fondateur de la faculté et architecte de sa vision académique."
    },
    {
      nom: "Pr. Fatima Zahra Ammor",
      poste: "Doyenne (1990-1998)",
      contribution: "Pionnière dans le développement de la recherche en sciences de la vie."
    },
    {
      nom: "Pr. Mohammed Benchrif",
      poste: "Doyen (2000-2008)",
      contribution: "Artisan de la modernisation et de l'adoption du système LMD."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Historique de la Faculté
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Plus de six décennies d'excellence académique et de contribution au développement 
            scientifique du Maroc et de la région.
          </p>
        </div>

        {/* Chiffres clés */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {chiffres.map((chiffre, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#006be5] mb-2">
                  {chiffre.valeur}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {chiffre.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {chiffre.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Chronologie Historique
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#006be5] hidden md:block"></div>
            
            <div className="space-y-8">
              {periodes.map((periode, index) => {
                const IconComponent = periode.icon;
                return (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-6 w-4 h-4 bg-[#006be5] rounded-full -ml-2 mt-6"></div>
                    
                    <Card className="md:ml-16 w-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                              <IconComponent className="h-5 w-5 text-[#006be5]" />
                            </div>
                            <CardTitle className="text-xl">
                              {periode.titre}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-[#006be5] text-white">
                            {periode.annee}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {periode.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Personnalités marquantes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Personnalités Marquantes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {personnalites.map((personnalite, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#006be5]">
                    {personnalite.nom}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {personnalite.poste}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {personnalite.contribution}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission historique */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Mission Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Depuis sa création en 1957, la Faculté des Sciences de Rabat s'est imposée comme 
                un pilier de l'enseignement supérieur scientifique au Maroc. Elle a formé des 
                générations de scientifiques, chercheurs et cadres qui contribuent aujourd'hui 
                au développement du pays dans tous les secteurs.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Notre faculté continue de porter les valeurs d'excellence, d'innovation et 
                d'ouverture qui ont marqué son histoire, tout en s'adaptant aux défis 
                contemporains de la science et de la technologie.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Historique;
