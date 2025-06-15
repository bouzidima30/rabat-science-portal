
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const formationLinks = [
  {
    title: "Licence",
    description: "Explorez nos programmes de Licence.",
    href: "/formation-licence",
  },
  {
    title: "Master",
    description: "Découvrez nos formations de Master.",
    href: "/formation-master",
  },
  {
    title: "Doctorat",
    description: "Informations sur les études doctorales.",
    href: "/formation-doctorat",
  },
  {
    title: "Formation Continue",
    description: "Nos offres de formation continue.",
    href: "/formation-continue",
  },
];

const Formations = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Formations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La Faculté des Sciences de Rabat offre un large éventail de formations, de la Licence au Doctorat, conçues pour répondre aux besoins du marché du travail et aux défis de la recherche scientifique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {formationLinks.map((link) => (
            <Link to={link.href} key={link.href} className="group">
              <Card className="shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#006be5] group-hover:underline">
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {link.description}
                  </p>
                  <div className="flex items-center text-[#006be5] font-semibold mt-auto">
                    Voir les formations
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Formations;
