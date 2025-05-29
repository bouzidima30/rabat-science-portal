
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardList,
  Building,
  Award,
  Monitor,
  Clock
} from "lucide-react";

const EspaceEtudiants = () => {
  const services = [
    {
      title: "Procédures Numériques",
      description: "Procédures liées au service informatique",
      icon: Monitor,
      path: "/procedures-numeriques",
      color: "bg-blue-500"
    },
    {
      title: "CeDoc",
      description: "Formulaires pour la Soutenance de la Thèse Doctorale et Inscription/Réinscription",
      icon: GraduationCap,
      path: "/cedoc",
      color: "bg-green-500"
    },
    {
      title: "Service de Scolarité",
      description: "Formulaires et documents administratifs",
      icon: FileText,
      path: "/service-scolarite",
      color: "bg-purple-500"
    },
    {
      title: "Bibliothèque",
      description: "Services, plan d'accès et ressources électroniques",
      icon: BookOpen,
      path: "/bibliotheque",
      color: "bg-orange-500"
    },
    {
      title: "Résultats",
      description: "Résultats des examens Session automne et printemps",
      icon: Award,
      path: "/resultats",
      color: "bg-red-500"
    },
    {
      title: "Sections et Groupes",
      description: "Sections et groupes des étudiants par session",
      icon: Users,
      path: "/sections-groupes",
      color: "bg-teal-500"
    },
    {
      title: "Activités para-universitaires",
      description: "Liste des clubs de la faculté",
      icon: Users,
      path: "/activites-para-universitaires",
      color: "bg-pink-500"
    },
    {
      title: "Présélection",
      description: "Listes de présélection des étudiants par cycle",
      icon: ClipboardList,
      path: "/preselection",
      color: "bg-indigo-500"
    },
    {
      title: "Cours / TDs / TPs",
      description: "Accès aux cours en ligne et documents pédagogiques",
      icon: BookOpen,
      path: "/cours-tds-tps",
      color: "bg-yellow-500"
    },
    {
      title: "Listes des examens",
      description: "Listes des étudiants pour passer les examens",
      icon: ClipboardList,
      path: "/listes-examens",
      color: "bg-gray-500"
    },
    {
      title: "Planning & Calendrier des Évaluations",
      description: "Planning des évaluations",
      icon: Calendar,
      path: "/planning-evaluations",
      color: "bg-cyan-500"
    },
    {
      title: "Calendrier & Emploi du temps",
      description: "Emplois du temps, calendriers des semaines et vacances",
      icon: Clock,
      path: "/calendrier-emploi-temps",
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Espace Étudiants
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Accédez à tous les services et ressources dédiés aux étudiants de la Faculté des Sciences de Rabat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Information importante */}
        <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Information importante
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Pour toute question concernant vos démarches administratives ou académiques, 
                  n'hésitez pas à contacter le service scolarité ou à vous rendre directement 
                  au bureau des étudiants.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default EspaceEtudiants;
