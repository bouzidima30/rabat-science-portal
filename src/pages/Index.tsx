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
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { News, NewsCategory } from "@/types/news";

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  created_at: string;
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);

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

  const categoryOptions = [
    { value: "reunion_travail" as NewsCategory, label: "Réunion de travail" },
    { value: "nouvelles_informations" as NewsCategory, label: "Nouvelles informations" },
    { value: "activites_parauniversitaire" as NewsCategory, label: "Activités parauniversitaire" },
    { value: "avis_etudiants" as NewsCategory, label: "Avis étudiants" },
    { value: "avis_enseignants" as NewsCategory, label: "Avis enseignants" },
    { value: "evenements_scientifique" as NewsCategory, label: "Événements scientifique" },
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

  useEffect(() => {
    fetchRecentNews();
  }, [selectedCategory]);

  const fetchRecentNews = async () => {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRecentNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopBar />
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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-[#006be5] hover:bg-[#0056b3]" : ""}
            size="sm"
          >
            Toutes
          </Button>
          {categoryOptions.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "bg-[#006be5] hover:bg-[#0056b3]" : ""}
              size="sm"
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {recentNews.map((news) => (
            <Card key={news.id} className="hover-scale cursor-pointer">
              {news.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={news.image_url} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {new Date(news.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Badge>
                <CardTitle className="text-lg">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContent(news.excerpt || news.content.substring(0, 150) + "...") 
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/actualites">
            <Button variant="outline" className="border-[#006be5] text-[#006be5] hover:bg-[#006be5] hover:text-white">
              Toutes les actualités
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
