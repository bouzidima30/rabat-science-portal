import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Users, BookOpen, Award, MapPin, Clock, ChevronRight, GraduationCap, Microscope, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { NewsCategory } from "@/types/news";

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

  const carouselImages = [
    {
      src: "/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png",
      title: "Campus de la Faculté des Sciences",
      description: "Un environnement d'apprentissage moderne et innovant"
    },
    {
      src: "https://images.unsplash.com/photo-1562774053-701939374585",
      title: "Laboratoires de Recherche",
      description: "Des équipements de pointe pour la recherche scientifique"
    },
    {
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
      title: "Vie Étudiante",
      description: "Une communauté dynamique et engagée"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-4">
          <button 
            onClick={prevSlide}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-white rotate-180" />
          </button>
          
          <div className="text-center text-white max-w-3xl mx-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Faculté des Sciences
              <br />
              <span className="text-[#016BE5]">de Rabat</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              {carouselImages[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/formations">
                <Button size="lg" className="bg-[#016BE5] hover:bg-[#015bb3] text-white px-6 py-3">
                  Découvrir nos Formations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/recherche">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3">
                  Explorer la Recherche
                </Button>
              </Link>
            </div>
          </div>
          
          <button 
            onClick={nextSlide}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-6 bg-[#016BE5]' 
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dernières Nouvelles
            </h2>
            <p className="text-lg text-gray-600">
              Restez informés des dernières nouvelles de notre faculté
            </p>
          </div>

          {/* News Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {newsCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? 'bg-[#016BE5] hover:bg-[#015bb3] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-[#016BE5] hover:text-[#016BE5]'
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/actualite/${article.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
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
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/actualites">
              <Button variant="outline" className="border-[#016BE5] text-[#016BE5] hover:bg-[#016BE5] hover:text-white">
                Voir toutes les actualités
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FSR Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              La FSR en Chiffres
            </h2>
            <p className="text-lg text-gray-600">
              45 années d'excellence académique et scientifique
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, value: "15,000+", label: "Étudiants" },
              { icon: BookOpen, value: "50+", label: "Formations" },
              { icon: Award, value: "200+", label: "Enseignants" },
              { icon: Building, value: "12", label: "Laboratoires" }
            ].map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#016BE5] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Programmes Académiques
            </h2>
            <p className="text-lg text-gray-600">
              Des formations d'excellence pour tous les niveaux
            </p>
          </div>
          
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
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-[#016BE5] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <program.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Événements à Venir
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos prochains événements et activités
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video bg-gray-100 overflow-hidden">
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
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {event.titre}
                  </h3>
                  {event.lieu && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      {event.lieu}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-gray-600 line-clamp-3 text-sm">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/evenements">
              <Button variant="outline" className="border-[#016BE5] text-[#016BE5] hover:bg-[#016BE5] hover:text-white">
                Voir tous les événements
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
