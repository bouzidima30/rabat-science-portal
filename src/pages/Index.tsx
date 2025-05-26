
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, Users, BookOpen, Trophy, ArrowRight, GraduationCap, Microscope, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      title: "Excellence Académique",
      description: "La Faculté des Sciences de Rabat, un centre d'excellence pour l'enseignement supérieur et la recherche scientifique"
    },
    {
      url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
      title: "Innovation et Recherche",
      description: "Des laboratoires de pointe pour une recherche scientifique d'excellence"
    },
    {
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      title: "Campus Moderne",
      description: "Un environnement d'apprentissage moderne et stimulant"
    }
  ];

  const recentNews = [
    {
      id: 1,
      title: "Nouvelle formation en Intelligence Artificielle",
      excerpt: "Lancement d'un nouveau Master en IA pour répondre aux besoins du marché",
      date: "15 Mars 2024",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b"
    },
    {
      id: 2,
      title: "Partenariat international avec l'Université de Sorbonne",
      excerpt: "Signature d'un accord de coopération scientifique",
      date: "10 Mars 2024",
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3"
    },
    {
      id: 3,
      title: "Journée portes ouvertes 2024",
      excerpt: "Découvrez nos formations et visitez nos laboratoires",
      date: "05 Mars 2024",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
    }
  ];

  const fsrStats = [
    { label: "Étudiants", value: "8,500+", icon: Users },
    { label: "Enseignants", value: "350+", icon: GraduationCap },
    { label: "Formations", value: "120+", icon: BookOpen },
    { label: "Laboratoires", value: "25+", icon: Microscope }
  ];

  const academicPrograms = [
    {
      title: "Licence",
      description: "Formations de base dans diverses disciplines scientifiques",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Master",
      description: "Spécialisations avancées et recherche appliquée",
      icon: GraduationCap,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Doctorat",
      description: "Formation doctorale et recherche de pointe",
      icon: Trophy,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Formation Continue",
      description: "Programmes de perfectionnement professionnel",
      icon: Globe,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const upcomingEvents = [
    {
      title: "Conférence Internationale sur l'IA",
      date: "25-27 Avril 2024",
      location: "Amphithéâtre Principal"
    },
    {
      title: "Soutenance de Thèse - Physique Quantique",
      date: "30 Mars 2024",
      location: "Salle de Conférence"
    },
    {
      title: "Workshop - Biotechnologies",
      date: "15 Avril 2024",
      location: "Laboratoire de Biologie"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] overflow-hidden">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {carouselImages.map((slide, index) => (
              <CarouselItem key={index} className="relative">
                <div 
                  className="w-full h-[600px] bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${slide.url})` }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl px-4">
                      <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                        {slide.title}
                      </h1>
                      <p className="text-xl mb-8 animate-fade-in">
                        {slide.description}
                      </p>
                      <Button 
                        size="lg" 
                        className="bg-[#006be5] hover:bg-[#0056b3] text-white animate-fade-in"
                      >
                        Découvrir la FSR
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-8" />
          <CarouselNext className="right-8" />
        </Carousel>
      </section>

      {/* Recent News Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Actualités Récentes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Restez informés des dernières nouvelles de la faculté
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {recentNews.map((news) => (
            <Card key={news.id} className="hover-scale cursor-pointer">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {news.date}
                </Badge>
                <CardTitle className="text-lg">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{news.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" className="border-[#006be5] text-[#006be5] hover:bg-[#006be5] hover:text-white">
            Toutes les actualités
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FSR Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              La FSR en Chiffres
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Notre impact en quelques statistiques clés
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {fsrStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <IconComponent className="h-12 w-12 text-[#006be5] mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Programs Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Programmes Académiques
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Découvrez notre offre de formation complète
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {academicPrograms.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <Card key={index} className="hover-scale cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${program.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {program.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Événements à Venir
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ne manquez pas nos prochains événements
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover-scale cursor-pointer">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-[#006be5] mr-2" />
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    📍 {event.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
