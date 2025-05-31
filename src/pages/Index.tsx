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
  const newsCategories = [{
    id: 'all',
    label: 'Toutes'
  }, {
    id: 'nouvelles_informations',
    label: 'Nouvelles'
  }, {
    id: 'avis_etudiants',
    label: 'Étudiants'
  }, {
    id: 'avis_enseignants',
    label: 'Enseignants'
  }, {
    id: 'evenements_scientifique',
    label: 'Événements'
  }];
  const carouselImages = [{
    src: "/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png",
    title: "Campus de la Faculté des Sciences",
    description: "Un environnement d'apprentissage moderne et innovant"
  }, {
    src: "https://images.unsplash.com/photo-1562774053-701939374585",
    title: "Laboratoires de Recherche",
    description: "Des équipements de pointe pour la recherche scientifique"
  }, {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    title: "Vie Étudiante",
    description: "Une communauté dynamique et engagée"
  }];
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselImages.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + carouselImages.length) % carouselImages.length);
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      {/* Hero Carousel */}
      <section className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={image.src} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>)}
        </div>
        
        <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-4">
          <button onClick={prevSlide} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <ChevronRight className="h-6 w-6 text-white rotate-180" />
          </button>
          
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Faculté des Sciences de <span className="text-blue-300">Rabat</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              {carouselImages[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/formations">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8">
                  Nos Formations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/recherche">
                <Button size="lg" variant="outline" className="border-white hover:bg-white px-8 text-blue-900">
                  Recherche
                </Button>
              </Link>
            </div>
          </div>
          
          <button onClick={nextSlide} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`} />)}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Actualités Récentes
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Restez informés des dernières nouvelles de notre faculté
              </p>
            </div>
            <Link to="/actualites">
              <Button variant="outline" className="group">
                Voir tout
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* News Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {newsCategories.map(category => <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category.id)} className="rounded-full">
                {category.label}
              </Button>)}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, 3).map(article => <Link key={article.id} to={`/actualite/${article.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full cursor-pointer overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 overflow-hidden">
                    {article.image_url ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-blue-400" />
                      </div>}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {article.excerpt}
                      </p>}
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* FSR en Chiffres */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              La FSR en Chiffres
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              45 années d'excellence académique et scientifique
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            icon: Users,
            value: "15,000+",
            label: "Étudiants",
            color: "text-blue-600"
          }, {
            icon: BookOpen,
            value: "50+",
            label: "Formations",
            color: "text-green-600"
          }, {
            icon: Award,
            value: "200+",
            label: "Enseignants",
            color: "text-purple-600"
          }, {
            icon: Building,
            value: "12",
            label: "Laboratoires",
            color: "text-orange-600"
          }].map((stat, index) => <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${stat.color.replace('text', 'bg').replace('600', '100')} dark:${stat.color.replace('text', 'bg').replace('600', '900/20')}`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Programmes Académiques */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Programmes Académiques
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Des formations d'excellence pour tous les niveaux
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            title: "Formation Licence",
            description: "Programmes de premier cycle dans toutes les disciplines scientifiques",
            icon: BookOpen,
            link: "/formations/licence",
            color: "blue"
          }, {
            title: "Formation Master",
            description: "Spécialisations avancées et recherche appliquée",
            icon: GraduationCap,
            link: "/formations/master",
            color: "green"
          }, {
            title: "Formation Doctorat",
            description: "Recherche de pointe et innovation scientifique",
            icon: Microscope,
            link: "/formations/doctorat",
            color: "purple"
          }, {
            title: "Formation Continue",
            description: "Perfectionnement professionnel et mise à jour des compétences",
            icon: Award,
            link: "/formations/continue",
            color: "orange"
          }].map((program, index) => <Link key={index} to={program.link}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-${program.color}-100 dark:bg-${program.color}-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <program.icon className={`h-8 w-8 text-${program.color}-600 dark:text-${program.color}-400`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Événements à Venir
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Découvrez nos prochains événements et activités
              </p>
            </div>
            <Link to="/evenements">
              <Button variant="outline" className="group">
                Voir tout
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map(event => <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 overflow-hidden">
                  {event.image_url ? <img src={event.image_url} alt={event.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-green-400" />
                    </div>}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                    </div>
                    {event.heure_debut && <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.heure_debut}
                      </div>}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {event.titre}
                  </h3>
                  {event.lieu && <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="h-4 w-4" />
                      {event.lieu}
                    </div>}
                  {event.description && <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {event.description}
                    </p>}
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;
