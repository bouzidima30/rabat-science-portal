
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Formations = () => {
  const formationTypes = [
    {
      title: "Formation Licence",
      description: "Découvrez nos formations de premier cycle universitaire (Bac+3) dans tous les domaines scientifiques.",
      icon: BookOpen,
      link: "/formation-licence",
      color: "bg-blue-500"
    },
    {
      title: "Formation Master",
      description: "Approfondissez vos connaissances avec nos formations de deuxième cycle (Bac+5) spécialisées.",
      icon: GraduationCap,
      link: "/formation-master",
      color: "bg-green-500"
    },
    {
      title: "Formation Doctorat",
      description: "Rejoignez l'excellence de la recherche scientifique avec nos programmes doctoraux (Bac+8).",
      icon: Trophy,
      link: "/formation-doctorat",
      color: "bg-purple-500"
    },
    {
      title: "Formation Continue",
      description: "Poursuivez votre développement professionnel avec nos formations continues adaptées.",
      icon: Users,
      link: "/formation-continue",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Formations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La Faculté des Sciences de Rabat propose une gamme complète de formations 
            scientifiques de haute qualité, du niveau Licence au Doctorat, ainsi que 
            des formations continues pour les professionnels.
          </p>
          <div className="w-24 h-1 bg-[#006be5] mx-auto mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {formationTypes.map((formation, index) => {
            const IconComponent = formation.icon;
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${formation.color} mr-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      {formation.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {formation.description}
                  </p>
                  <Link to={formation.link}>
                    <Button className="w-full bg-[#006be5] hover:bg-[#0056b3] text-white">
                      Découvrir les formations
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="shadow-lg bg-gradient-to-r from-[#006be5] to-[#0056b3] text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Besoin d'aide pour choisir votre formation ?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Notre équipe pédagogique est là pour vous accompagner dans votre choix 
                et répondre à toutes vos questions.
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Nous contacter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Formations;
