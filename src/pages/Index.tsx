import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Users, BookOpen, Award, MapPin, Clock, ChevronRight, GraduationCap, Microscope, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { NewsCategory } from "@/types/news";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch latest news with category filter
  const {
    data: news = []
  } = useQuery({
    queryKey: ['latest-news', selectedCategory],
    queryFn: async () => {
      let query = supabase.from('news').select('*').eq('published', true).order('created_at', {
        ascending: false
      });
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory as NewsCategory);
      }
      const {
        data,
        error
      } = await query.limit(3);
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch upcoming events
  const {
    data: events = []
  } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const {
        data,
        error
      } = await supabase.from('events').select('*').gte('date_debut', today).order('date_debut', {
        ascending: true
      }).limit(3);
      if (error) throw error;
      return data || [];
    }
  });

  const newsCategories = [
    { id: 'all', label: 'Toutes' },
    { id: 'nouvelles_informations', label: 'Nouvelles' },
    { id: 'avis_etudiants', label: 'Étudiants' },
    { id: 'avis_enseignants', label: 'Enseignants' },
    { id: 'evenements_scientifique', label: 'Événements' }
  ];

  const carouselHighlights = [
    {
      title: "Excellence Académique",
      description: "Plus de 50 formations d'excellence de la licence au doctorat",
      image: "/lovable-uploads/14d8950a-9b26-404a-a40b-7931ec76f547.png",
      link: "/formations"
    },
    {
      title: "Recherche de Pointe",
      description: "12 laboratoires de recherche et innovation scientifique",
      image: "/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png",
      link: "/recherche"
    },
    {
      title: "Partenariats Internationaux",
      description: "Coopération avec les meilleures universités mondiales",
      image: "/lovable-uploads/14d8950a-9b26-404a-a40b-7931ec76f547.png",
      link: "/cooperation"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Faculté des Sciences de Rabat
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Un environnement d'apprentissage moderne et innovant pour l'excellence académique et scientifique
          </p>
        </div>

        {/* Modern Carousel */}
        <div className="mb-12">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {carouselHighlights.map((highlight, index) => (
                <CarouselItem key={index}>
                  <Link to={highlight.link}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative h-80 bg-gradient-to-r from-[#006be5] to-[#0056b3]">
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                        <div className="relative z-10 h-full flex items-center justify-center p-8">
                          <div className="text-center text-white">
                            <h3 className="text-3xl font-bold mb-4">
                              {highlight.title}
                            </h3>
                            <p className="text-lg opacity-90 max-w-2xl">
                              {highlight.description}
                            </p>
                            <Button variant="secondary" className="mt-6">
                              Découvrir
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Vision Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              Former les scientifiques de demain et contribuer activement au développement socio-économique 
              du Maroc grâce à l'excellence académique, la recherche de pointe et l'innovation technologique.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link to="/formations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-[#006be5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Découvrir nos Formations
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Programmes d'excellence de la licence au doctorat
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-[#006be5]" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/recherche">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                    <Microscope className="h-6 w-6 text-[#006be5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Explorer la Recherche
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Innovation scientifique et partenariats internationaux
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-[#006be5]" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* FSR Stats */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            La FSR en Chiffres
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, value: "15,000+", label: "Étudiants" },
              { icon: BookOpen, value: "50+", label: "Formations" },
              { icon: Award, value: "200+", label: "Enseignants" },
              { icon: Building, value: "12", label: "Laboratoires" }
            ].map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-[#006be5]" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Academic Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Nos Programmes Académiques
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Formation Licence",
                description: "Programmes de premier cycle dans toutes les disciplines scientifiques",
                icon: BookOpen,
                link: "/formations/licence"
              },
              {
                title: "Formation Master", 
                description: "Spécialisations avancées et recherche appliquée",
                icon: GraduationCap,
                link: "/formations/master"
              },
              {
                title: "Formation Doctorat",
                description: "Recherche de pointe et innovation scientifique", 
                icon: Microscope,
                link: "/formations/doctorat"
              },
              {
                title: "Formation Continue",
                description: "Perfectionnement professionnel et mise à jour des compétences",
                icon: Award,
                link: "/formations/continue"
              }
            ].map((program, index) => (
              <Link key={index} to={program.link}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                      <program.icon className="h-6 w-6 text-[#006be5]" />
                    </div>
                    <CardTitle className="text-xl">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Dernières Nouvelles
          </h2>

          {/* News Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {newsCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-[#006be5] hover:bg-[#005bb5]' : ''}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/actualite/${article.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[#006be5] mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/actualites">
              <Button variant="outline">
                Voir toutes les actualités
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Événements à Venir
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.titre} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-[#006be5] mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                    </div>
                    {event.heure_debut && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.heure_debut}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {event.titre}
                  </h3>
                  {event.lieu && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <MapPin className="h-4 w-4 text-[#006be5]" />
                      {event.lieu}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/evenements">
              <Button variant="outline">
                Voir tous les événements
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
