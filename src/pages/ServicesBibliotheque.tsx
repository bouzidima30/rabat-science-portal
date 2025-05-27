
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, FileText } from "lucide-react";

const ServicesBibliotheque = () => {
  const services = [
    {
      title: "Inscription et Emprunt de Livres",
      icon: BookOpen,
      description: "Modalités d'inscription à la bibliothèque et conditions d'emprunt",
      details: [
        "Inscription gratuite pour tous les étudiants et personnel FSR",
        "Durée d'emprunt : 15 jours (renouvelable)",
        "Nombre d'ouvrages : 3 livres maximum",
        "Carte d'étudiant obligatoire",
        "Possibilité de réservation en ligne"
      ]
    },
    {
      title: "Organisation de Manifestations",
      icon: Users,
      description: "Services pour l'organisation d'événements scientifiques et socio-culturels",
      details: [
        "Réservation de salles de conférence",
        "Support technique et audiovisuel",
        "Aide à la recherche documentaire",
        "Expositions temporaires",
        "Accompagnement dans l'organisation"
      ]
    },
    {
      title: "Réservation d'Espaces de Travail",
      icon: Calendar,
      description: "Espaces collaboratifs et postes informatiques",
      details: [
        "Salles de travail en groupe (2-8 personnes)",
        "Postes informatiques individuels",
        "Accès WiFi dans tous les espaces",
        "Réservation en ligne ou sur place",
        "Équipements audiovisuels disponibles"
      ]
    },
    {
      title: "Dépôt de Projets et Thèses",
      icon: FileText,
      description: "Dépôt et archivage des travaux de fin d'études",
      details: [
        "Dépôt obligatoire en format papier et numérique",
        "Archivage et conservation à long terme",
        "Mise à disposition pour consultation",
        "Respect des droits d'auteur",
        "Procédure de validation par les directeurs de recherche"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Services de la Bibliothèque
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez tous les services proposés par la bibliothèque universitaire 
            pour accompagner vos études et recherches.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-[#006be5] flex items-center">
                    <div className="w-10 h-10 bg-[#006be5] rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-[#006be5] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informations pratiques */}
        <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                Pour Plus d'Informations
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-blue-800 dark:text-blue-200">
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p>+212 5 37 77 18 50</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>bibliotheque@fsr.ac.ma</p>
                </div>
                <div>
                  <p className="font-medium">Horaires</p>
                  <p>Lun-Ven: 8h-20h</p>
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

export default ServicesBibliotheque;
