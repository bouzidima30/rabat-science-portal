
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Clock } from "lucide-react";

const PlanAcces = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Plan d'Accès - Bibliothèque
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Localisez facilement la bibliothèque et ses différents espaces.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <MapPin className="h-6 w-6 mr-2" />
                  Plan de la Bibliothèque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Plan détaillé de la bibliothèque</p>
                    <p className="text-sm mt-2">Incluant tous les étages et espaces</p>
                  </div>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rez-de-chaussée</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Accueil et renseignements</li>
                      <li>• Prêt et retour</li>
                      <li>• Catalogues informatisés</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1er étage</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Salle de lecture</li>
                      <li>• Collections générales</li>
                      <li>• Périodiques</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations pratiques */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#006be5] flex items-center">
                  <Navigation className="h-5 w-5 mr-2" />
                  Accès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Adresse :</strong><br />
                  Faculté des Sciences<br />
                  Avenue Ibn Battouta<br />
                  BP 1014, Rabat</p>
                  
                  <p><strong>Transport :</strong><br />
                  • Bus : Lignes 17, 28<br />
                  • Tramway : Station Université</p>
                  
                  <p><strong>Parking :</strong><br />
                  Disponible sur le campus</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#006be5] flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>8h - 20h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>8h - 16h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>Fermé</span>
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

export default PlanAcces;
