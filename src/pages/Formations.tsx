
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, School, BookCopy, UserCheck } from "lucide-react";

const formationsList = [
  {
    title: "Formations Licence",
    link: "/formation-licence",
    icon: <School className="h-8 w-8 text-[#006be5] mb-4" />,
    description: "Découvrez toutes les formations de Licence proposées.",
  },
  {
    title: "Formations Master",
    link: "/formation-master",
    icon: <BookCopy className="h-8 w-8 text-[#006be5] mb-4" />,
    description: "Explorez notre large choix de formations Master.",
  },
  {
    title: "Formation Doctorat",
    link: "/formation-doctorat",
    icon: <GraduationCap className="h-8 w-8 text-[#006be5] mb-4" />,
    description: "Informations sur la formation doctorale.",
  },
  {
    title: "Formation Continue",
    link: "/formation-continue",
    icon: <UserCheck className="h-8 w-8 text-[#006be5] mb-4" />,
    description: "Découvrez nos programmes de formation continue.",
  },
];

const Formations = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Formations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choisissez un niveau de formation pour découvrir l’ensemble de l’offre proposée par la Faculté des Sciences de Rabat.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {formationsList.map((formation) => (
            <Link to={formation.link} key={formation.link} className="focus-visible:outline-none">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col justify-between">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  {formation.icon}
                  <CardTitle className="text-2xl mb-2 text-[#006be5]">{formation.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-base">
                    {formation.description}
                  </p>
                  <span className="inline-block text-[#006be5] font-semibold">
                    Voir&nbsp;&rarr;
                  </span>
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
