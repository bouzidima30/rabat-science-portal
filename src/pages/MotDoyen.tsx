
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const MotDoyen = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mot du Doyen
          </h1>
          <div className="w-24 h-1 bg-[#006be5] mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start mb-6">
                  <Quote className="h-8 w-8 text-[#006be5] mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      C'est avec un grand honneur que j'assume la responsabilité de diriger la Faculté des Sciences de Rabat, 
                      une institution d'excellence qui forme depuis des décennies les cadres scientifiques et techniques 
                      de notre pays.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Notre faculté s'engage résolument dans la voie de l'innovation pédagogique et de la recherche 
                      scientifique de haut niveau. Nous œuvrons quotidiennement pour offrir à nos étudiants une formation 
                      de qualité, adaptée aux défis du monde moderne et aux besoins du marché du travail.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      L'excellence académique que nous poursuivons s'appuie sur un corps professoral qualifié, 
                      des infrastructures modernes et des partenariats stratégiques avec des institutions nationales 
                      et internationales de renom.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Nous encourageons nos étudiants à développer leur esprit critique, leur créativité et leur 
                      capacité d'innovation pour devenir les acteurs du développement scientifique et technologique 
                      de demain.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Je vous souhaite une excellente année universitaire, riche en découvertes et en réussites.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Photo du Doyen</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Professeur [Nom du Doyen]
                  </h3>
                  <p className="text-[#006be5] font-medium mb-4">
                    Doyen de la Faculté des Sciences
                  </p>
                  <div className="text-left space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Formation :</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Docteur en Sciences
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Spécialité :</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        [Domaine de spécialité]
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Email :</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        doyen@fsr.ac.ma
                      </p>
                    </div>
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

export default MotDoyen;
