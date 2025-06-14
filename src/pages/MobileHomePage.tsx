
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Users, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import MobileLayout from "@/components/MobileLayout";
import ResponsiveContainer from "@/components/ResponsiveContainer";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import OptimizedImage from "@/components/OptimizedImage";
import { useMobileDetection, useResponsiveImageSize } from "@/hooks/useMobileDetection";
import { usePWA } from "@/utils/pwaUtils";

const MobileHomePage = () => {
  const { isMobile, screenSize } = useMobileDetection();
  const { heroImageSize, cardImageSize } = useResponsiveImageSize();
  const { registerServiceWorker } = usePWA();

  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();
  }, [registerServiceWorker]);

  const quickActions = [
    {
      title: "Actualités",
      description: "Dernières nouvelles",
      icon: BookOpen,
      path: "/actualites",
      color: "bg-blue-500"
    },
    {
      title: "Événements",
      description: "Calendrier des événements",
      icon: Calendar,
      path: "/evenements",
      color: "bg-green-500"
    },
    {
      title: "Formations",
      description: "Programmes d'études",
      icon: Users,
      path: "/formations",
      color: "bg-purple-500"
    },
    {
      title: "Contact",
      description: "Nous contacter",
      icon: Phone,
      path: "/contact",
      color: "bg-orange-500"
    }
  ];

  return (
    <MobileLayout>
      <TopBar />
      <ModernNavbar />
      
      <ResponsiveContainer className="py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <OptimizedImage
            src="/lovable-uploads/14d8950a-9b26-404a-a40b-7931ec76f547.png"
            alt="FSR Logo"
            className={`mx-auto mb-4 ${isMobile ? 'w-24 h-24' : 'w-32 h-32'}`}
            priority
          />
          <h1 className={`font-bold text-gray-900 dark:text-white mb-4 ${
            isMobile ? 'text-2xl' : 'text-4xl'
          }`}>
            Faculté des Sciences de Rabat
          </h1>
          <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${
            isMobile ? 'text-sm px-2' : 'text-lg'
          }`}>
            Excellence académique et innovation scientifique au service du développement
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className={`grid gap-4 mb-8 ${
          isMobile ? 'grid-cols-2' : screenSize === 'tablet' ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardContent className={`p-4 text-center ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                  <div className={`${action.color} rounded-full mx-auto flex items-center justify-center ${
                    isMobile ? 'w-12 h-12' : 'w-16 h-16'
                  }`}>
                    <action.icon className={`text-white ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
                  </div>
                  <h3 className={`font-semibold text-gray-900 dark:text-white ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    {action.title}
                  </h3>
                  {!isMobile && (
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {action.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Latest News Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className={`text-[#006be5] ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Dernières Actualités
            </CardTitle>
            <Link to="/actualites">
              <Button variant="ghost" size={isMobile ? "sm" : "default"}>
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 ${
                  isMobile ? 'w-full h-32' : 'w-20 h-20'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    Titre de l'actualité {item}
                  </h4>
                  <p className={`text-gray-600 dark:text-gray-300 line-clamp-2 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    Description courte de l'actualité qui donne un aperçu du contenu...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Il y a 2 jours
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className={`text-[#006be5] flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
              <MapPin className="h-5 w-5 mr-2" />
              Infos Pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className={`font-medium text-gray-900 dark:text-white ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  Adresse
                </p>
                <p className={`text-gray-600 dark:text-gray-300 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Avenue Ibn Battouta, BP 1014, Rabat
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className={`font-medium text-gray-900 dark:text-white ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  Téléphone
                </p>
                <p className={`text-gray-600 dark:text-gray-300 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  +212 5 37 77 18 34
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className={`font-medium text-gray-900 dark:text-white ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  Email
                </p>
                <p className={`text-gray-600 dark:text-gray-300 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  contact@fsr.ac.ma
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveContainer>

      <Footer />
      <PWAInstallBanner />
    </MobileLayout>
  );
};

export default MobileHomePage;
