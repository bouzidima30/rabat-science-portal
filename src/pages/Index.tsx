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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      <TopBar />
      <Navbar />
      
      {/* Modern Hero Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
            </div>
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-4">
          <button 
            onClick={prevSlide}
            className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <ChevronRight className="h-6 w-6 text-white rotate-180" />
          </button>
          
          <div className="text-center text-white max-w-4xl mx-8">
            <div className="mb-6 inline-block px-4 py-2 bg-[#016BE5]/20 backdrop-blur-sm rounded-full border border-[#016BE5]/30">
              <span className="text-[#87CEEB] text-sm font-medium">Excellence • Innovation • Recherche</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Faculté des Sciences
              <br />
              <span className="bg-gradient-to-r from-[#016BE5] to-[#87CEEB] bg-clip-text text-transparent">
                de Rabat
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
              {carouselImages[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/formations">
                <Button size="lg" className="bg-[#016BE5] hover:bg-[#015bb3] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Découvrir nos Formations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/recherche">
                <Button size="lg" variant="outline" className="border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-semibold text-white hover:text-white transition-all duration-300 hover:scale-105">
                  Explorer la Recherche
                </Button>
              </Link>
            </div>
          </div>
          
          <button 
            onClick={nextSlide}
            className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Modern slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-[#016BE5]' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Modern News Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#016BE5]/10 rounded-full mb-4">
              <span className="text-[#016BE5] text-sm font-semibold uppercase tracking-wide">Actualités</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Dernières Nouvelles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Restez informés des dernières nouvelles de notre faculté
            </p>
          </div>

          {/* Modern News Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {newsCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#016BE5] hover:bg-[#015bb3] text-white shadow-lg'
                    : 'border-2 border-gray-200 hover:border-[#016BE5] hover:text-[#016BE5] hover:scale-105'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/actualite/${article.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg h-full cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm hover:scale-[1.02]">
                  <div className="aspect-video bg-gradient-to-br from-[#016BE5]/10 to-blue-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden relative">
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-[#016BE5]/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#016BE5] transition-colors duration-300">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/actualites">
              <Button variant="outline" className="group border-2 border-[#016BE5] text-[#016BE5] hover:bg-[#016BE5] hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Voir toutes les actualités
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern FSR Stats */}
      <section className="py-20 bg-gradient-to-br from-[#016BE5]/5 via-blue-50/50 to-indigo-50/30 dark:from-blue-900/10 dark:via-blue-900/5 dark:to-indigo-900/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#016BE5]/10 rounded-full mb-4">
              <span className="text-[#016BE5] text-sm font-semibold uppercase tracking-wide">Excellence</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              La FSR en Chiffres
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              45 années d'excellence académique et scientifique
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "15,000+", label: "Étudiants", color: "blue" },
              { icon: BookOpen, value: "50+", label: "Formations", color: "green" },
              { icon: Award, value: "200+", label: "Enseignants", color: "purple" },
              { icon: Building, value: "12", label: "Laboratoires", color: "orange" }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm hover:scale-105 group">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Academic Programs */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#016BE5]/10 rounded-full mb-4">
              <span className="text-[#016BE5] text-sm font-semibold uppercase tracking-wide">Formation</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Nos Programmes Académiques
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Des formations d'excellence pour tous les niveaux
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Formation Licence",
                description: "Programmes de premier cycle dans toutes les disciplines scientifiques",
                icon: BookOpen,
                link: "/formations/licence",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Formation Master", 
                description: "Spécialisations avancées et recherche appliquée",
                icon: GraduationCap,
                link: "/formations/master",
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Formation Doctorat",
                description: "Recherche de pointe et innovation scientifique", 
                icon: Microscope,
                link: "/formations/doctorat",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Formation Continue",
                description: "Perfectionnement professionnel et mise à jour des compétences",
                icon: Award,
                link: "/formations/continue", 
                gradient: "from-orange-500 to-orange-600"
              }
            ].map((program, index) => (
              <Link key={index} to={program.link}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg h-full cursor-pointer bg-white/90 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <program.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#016BE5] transition-colors duration-300">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Events Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50/80 via-white/50 to-blue-50/30 dark:from-gray-900/80 dark:via-gray-900/50 dark:to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#016BE5]/10 rounded-full mb-4">
              <span className="text-[#016BE5] text-sm font-semibold uppercase tracking-wide">Événements</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Événements à Venir
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez nos prochains événements et activités
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
                <div className="aspect-video bg-gradient-to-br from-green-100/50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20 overflow-hidden relative">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.titre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-green-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#016BE5] transition-colors duration-300">
                    {event.titre}
                  </h3>
                  {event.lieu && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="h-4 w-4" />
                      {event.lieu}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/evenements">
              <Button variant="outline" className="group border-2 border-[#016BE5] text-[#016BE5] hover:bg-[#016BE5] hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Voir tous les événements
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
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
