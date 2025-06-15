import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Users, BookOpen, Award, MapPin, Clock, ChevronRight, GraduationCap, Microscope, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { NewsCategory } from "@/types/news";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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
  const carouselHighlights = [{
    title: "Excellence Académique",
    description: "Plus de 50 formations d'excellence de la licence au doctorat",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
    link: "/formations"
  }, {
    title: "Recherche de Pointe",
    description: "12 laboratoires de recherche et innovation scientifique",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
    link: "/recherche"
  }, {
    title: "Partenariats Internationaux",
    description: "Coopération avec les meilleures universités mondiales",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop",
    link: "/cooperation"
  }];
  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Modern Carousel */}
        <div className="mb-16">
          <Carousel className="w-full max-w-6xl mx-auto" opts={{
          align: "start",
          loop: true
        }} setApi={setApi}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {carouselHighlights.map((highlight, index) => <CarouselItem key={index} className="pl-2 md:pl-4">
                  <Link to={highlight.link} className="block group">
                    <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="relative h-96 md:h-[32rem]">
                        <img src={highlight.image} alt={highlight.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#006be5]/60 to-transparent"></div>
                        
                        {/* Content overlay */}
                        <div className="absolute inset-0 flex items-end p-8 md:p-12">
                          <div className="text-white max-w-2xl">
                            <div className="mb-4">
                              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                                FSR Mohammed V
                              </span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                              {highlight.title}
                            </h3>
                            <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                              {highlight.description}
                            </p>
                            <Button size="lg" className="bg-white text-[#006be5] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-x-2">
                              Découvrir
                              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-8 right-8 w-20 h-20 border-2 border-white/30 rounded-full backdrop-blur-sm"></div>
                        <div className="absolute bottom-8 right-16 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"></div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>)}
            </CarouselContent>
            
            {/* Enhanced Navigation */}
            <CarouselPrevious className="left-2 md:-left-6 w-12 h-12 border-2 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300" />
            <CarouselNext className="right-2 md:-right-6 w-12 h-12 border-2 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300" />
            
            {/* Interactive Dots indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {carouselHighlights.map((_, index) => <button key={index} className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${current === index + 1 ? 'bg-[#006be5] w-8' : 'bg-gray-300 hover:bg-[#006be5]/50'}`} onClick={() => api?.scrollTo(index)} aria-label={`Aller à la diapositive ${index + 1}`} />)}
            </div>
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
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Découvrir nos Formations
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Programmes d'excellence de la licence au doctorat
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/recherche">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                    <Microscope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Explorer la Recherche
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Innovation scientifique et partenariats internationaux
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-purple-600 dark:text-purple-400" />
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
            {[{
            icon: Users,
            value: "15,000+",
            label: "Étudiants",
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20"
          }, {
            icon: BookOpen,
            value: "50+",
            label: "Formations",
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/20"
          }, {
            icon: Award,
            value: "200+",
            label: "Enseignants",
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20"
          }, {
            icon: Building,
            value: "12",
            label: "Laboratoires",
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/20"
          }].map((stat, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Academic Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Nos Programmes Académiques
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
            title: "Formation Licence",
            description: "Programmes de premier cycle dans toutes les disciplines scientifiques",
            icon: BookOpen,
            link: "/formations/licence",
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
          }, {
            title: "Formation Master",
            description: "Spécialisations avancées et recherche appliquée",
            icon: GraduationCap,
            link: "/formations/master",
            color: "text-cyan-600 dark:text-cyan-400",
            bgColor: "bg-cyan-100 dark:bg-cyan-900/20"
          }, {
            title: "Formation Doctorat",
            description: "Recherche de pointe et innovation scientifique",
            icon: Microscope,
            link: "/formations/doctorat",
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-100 dark:bg-pink-900/20"
          }, {
            title: "Formation Continue",
            description: "Perfectionnement professionnel et mise à jour des compétences",
            icon: Award,
            link: "/formations/continue",
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-100 dark:bg-amber-900/20"
          }].map((program, index) => <Link key={index} to={program.link}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 ${program.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <program.icon className={`h-6 w-6 ${program.color}`} />
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
              </Link>)}
          </div>
        </div>

        {/* News Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Dernières Nouvelles
          </h2>

          {/* News Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {newsCategories.map(category => <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category.id)} className={selectedCategory === category.id ? 'bg-[#006be5] hover:bg-[#005bb5]' : ''}>
                {category.label}
              </Button>)}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map(article => <Link key={article.id} to={`/actualite/${article.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {article.image_url ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-gray-400" />
                      </div>}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[#006be5] mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {article.excerpt}
                      </p>}
                  </CardContent>
                </Card>
              </Link>)}
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
            {events.slice(0, 3).map(event => <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {event.image_url ? <img src={event.image_url} alt={event.titre} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-[#006be5] mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                    </div>
                    {event.heure_debut && <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.heure_debut}
                      </div>}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {event.titre}
                  </h3>
                  {event.lieu && <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <MapPin className="h-4 w-4 text-[#006be5]" />
                      {event.lieu}
                    </div>}
                  {event.description && <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                      {event.description}
                    </p>}
                </CardContent>
              </Card>)}
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
    </div>;
};
export default Index;