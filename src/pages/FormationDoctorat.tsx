
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const FormationDoctorat = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Formation Doctorat
          </h1>
          <div className="w-24 h-1 bg-[#006be5] mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <GraduationCap className="h-8 w-8 text-[#006be5] mr-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Le Doctorat à la FSR
                  </h2>
                </div>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  La formation doctorale à la Faculté des Sciences de Rabat représente l'excellence 
                  académique et scientifique. Elle vise à former des chercheurs de haut niveau 
                  capables de contribuer significativement à l'avancement des connaissances 
                  scientifiques et technologiques.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Nos programmes doctoraux couvrent l'ensemble des disciplines scientifiques 
                  enseignées à la faculté : mathématiques, physique, chimie, biologie, géologie, 
                  informatique et sciences de la terre. Chaque programme est conçu pour offrir 
                  une formation rigoureuse alliant recherche fondamentale et applications pratiques.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  L'encadrement doctoral est assuré par des professeurs-chercheurs reconnus 
                  internationalement, garantissant ainsi une formation de qualité et une 
                  préparation optimale aux défis de la recherche contemporaine.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  La durée normale de préparation d'une thèse de doctorat est de trois années, 
                  durant lesquelles le doctorant développe ses compétences en recherche, 
                  participe à des projets innovants et contribue à la production scientifique 
                  de son laboratoire d'accueil.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-[#006be5] to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <GraduationCap className="h-24 w-24 mx-auto mb-4 opacity-90" />
                    <h3 className="text-xl font-semibold mb-2">Image du Campus Doctoral</h3>
                    <p className="text-blue-100">
                      Photo représentant la recherche doctorale à la FSR
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FormationDoctorat;
