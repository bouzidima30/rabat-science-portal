
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MapPin, Users, Monitor, Clock, Phone, Mail } from "lucide-react";

const Bibliotheque = () => {
  const services = [
    {
      title: "Plan d'Accès",
      description: "Consultez le plan détaillé de la bibliothèque",
      icon: MapPin,
      path: "/bibliotheque/plan-acces",
      color: "bg-blue-500"
    },
    {
      title: "Services",
      description: "Inscription, emprunt, réservation d'espaces",
      icon: Users,
      path: "/bibliotheque/services",
      color: "bg-green-500"
    },
    {
      title: "Ressources Électroniques",
      description: "Accès aux bases de données et revues en ligne",
      icon: Monitor,
      path: "/bibliotheque/ressources-electroniques",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bibliothèque Universitaire
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Votre centre de ressources documentaires et d'apprentissage au cœur de la FSR.
          </p>
        </div>

        {/* Informations générales */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Horaires</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Lun - Ven: 8h - 20h<br />
                Sam: 8h - 16h<br />
                Dim: Fermé
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                +212 5 37 77 18 50
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                bibliotheque@fsr.ac.ma
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {service.description}
                  </p>
                  <Link to={service.path}>
                    <Button className="w-full bg-[#006be5] hover:bg-[#0056b3]">
                      Accéder
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Présentation */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5] flex items-center justify-center">
              <BookOpen className="h-6 w-6 mr-2" />
              À Propos de Notre Bibliothèque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Collections
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Plus de 50,000 ouvrages scientifiques</li>
                  <li>• 200+ revues spécialisées</li>
                  <li>• Bases de données électroniques</li>
                  <li>• Thèses et mémoires</li>
                  <li>• Documents audiovisuels</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Espaces
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Salle de lecture silencieuse</li>
                  <li>• Espaces de travail collaboratif</li>
                  <li>• Salle informatique</li>
                  <li>• Espace multimédia</li>
                  <li>• Salles de formation</li>
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

export default Bibliotheque;
