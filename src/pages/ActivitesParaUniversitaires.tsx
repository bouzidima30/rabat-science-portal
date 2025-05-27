
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, BookOpen, Monitor } from "lucide-react";

const ActivitesParaUniversitaires = () => {
  const clubs = [
    {
      nom: "Club Scientifique",
      description: "Promotion de la recherche et de l'innovation scientifique",
      activites: ["Conférences scientifiques", "Concours d'innovation", "Projets de recherche"],
      contact: "club.scientifique@fsr.ac.ma",
      icon: Award,
      color: "bg-blue-500"
    },
    {
      nom: "Club Informatique",
      description: "Développement des compétences en programmation et technologies",
      activites: ["Hackathons", "Formations en programmation", "Projets open source"],
      contact: "club.informatique@fsr.ac.ma",
      icon: Monitor,
      color: "bg-green-500"
    },
    {
      nom: "Club Mathématiques",
      description: "Approfondissement des connaissances mathématiques",
      activites: ["Olympiades mathématiques", "Séminaires", "Tutorat"],
      contact: "club.mathematiques@fsr.ac.ma",
      icon: BookOpen,
      color: "bg-purple-500"
    },
    {
      nom: "Club Environnement",
      description: "Sensibilisation aux enjeux environnementaux",
      activites: ["Campagnes de sensibilisation", "Projets écologiques", "Sorties nature"],
      contact: "club.environnement@fsr.ac.ma",
      icon: Users,
      color: "bg-emerald-500"
    },
    {
      nom: "Club Physique",
      description: "Exploration pratique des phénomènes physiques",
      activites: ["Expériences pratiques", "Ateliers", "Expositions scientifiques"],
      contact: "club.physique@fsr.ac.ma",
      icon: Award,
      color: "bg-orange-500"
    },
    {
      nom: "Club Chimie",
      description: "Découverte de la chimie par l'expérimentation",
      activites: ["Laboratoire ouvert", "Démonstrations", "Concours de chimie"],
      contact: "club.chimie@fsr.ac.ma",
      icon: BookOpen,
      color: "bg-red-500"
    },
    {
      nom: "Club Biologie",
      description: "Étude de la biodiversité et des sciences du vivant",
      activites: ["Sorties botaniques", "Observations microscopiques", "Conférences"],
      contact: "club.biologie@fsr.ac.ma",
      icon: Users,
      color: "bg-teal-500"
    },
    {
      nom: "Club Géologie",
      description: "Exploration des sciences de la Terre",
      activites: ["Excursions géologiques", "Collection de minéraux", "Études terrain"],
      contact: "club.geologie@fsr.ac.ma",
      icon: Award,
      color: "bg-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Activités Para-universitaires
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez tous les clubs et associations de la Faculté des Sciences de Rabat. 
            Participez aux activités qui enrichiront votre parcours universitaire !
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {clubs.map((club, index) => {
            const IconComponent = club.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${club.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {club.nom}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {club.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                        Activités principales :
                      </h4>
                      <ul className="space-y-1">
                        {club.activites.map((activite, idx) => (
                          <li key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#006be5] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            {activite}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Contact :</p>
                      <p className="text-xs text-[#006be5] break-all">{club.contact}</p>
                    </div>
                    <Button className="w-full bg-[#006be5] hover:bg-[#0056b3] text-sm">
                      Rejoindre le Club
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information sur l'adhésion */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                Comment Rejoindre un Club ?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Contactez le Club
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Envoyez un email au club qui vous intéresse
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Participez aux Réunions
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Assistez aux réunions d'information et activités
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Devenez Membre
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Remplissez le formulaire d'adhésion
                  </p>
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

export default ActivitesParaUniversitaires;
