import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Users, BookOpen, Award, MapPin, Clock, ChevronRight, GraduationCap, Microscope, Building, FileText, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { NewsCategory } from "@/types/news";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { usePrefetchQueries } from "@/hooks/usePrefetchQueries";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";
import { supabase } from "@/integrations/supabase/client";
import OptimizedImage from "@/components/OptimizedImage";
import { optimizeImageUrl } from "@/utils/imageOptimization";
// Memoized components for performance
const OptimizedCard = memo(Card);
const OptimizedButton = memo(Button);

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  
  // Prefetch related data - defer to avoid blocking initial render
  const { prefetchNews, prefetchEvents, prefetchFormations } = usePrefetchQueries();
  
  useEffect(() => {
    // Defer prefetching to after initial render
    const timer = setTimeout(() => {
      prefetchNews();
      prefetchEvents();
      prefetchFormations();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [prefetchNews, prefetchEvents, prefetchFormations]);

  // Carousel news query
  const { data: carouselNews = [] } = useOptimizedQuery({
    queryKey: ['carousel-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_config')
        .select(`
          id,
          position,
          news:news_id (
            id,
            title,
            excerpt,
            image_url,
            created_at
          )
        `)
        .eq('type', 'news')
        .order('position', { ascending: true })
        .limit(3);
      if (error) throw error;
      return data?.map(item => item.news).filter(Boolean) || [];
    },
    staleTimeMinutes: 5,
    cacheTimeMinutes: 15,
    enabled: true,
  });

  // Carousel YouTube query
  const { data: carouselYoutube = [] } = useOptimizedQuery({
    queryKey: ['carousel-youtube'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_config')
        .select('id, youtube_url, youtube_title, position')
        .eq('type', 'youtube')
        .order('position', { ascending: true })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    staleTimeMinutes: 5,
    cacheTimeMinutes: 15,
    enabled: true,
  });

  // Optimized news query with reduced fields to minimize transfer size
  const { data: news = [] } = useOptimizedQuery({
    queryKey: ['latest-news', selectedCategory],
    queryFn: async () => {
      let query = supabase.from('news')
        .select('id,title,excerpt,image_url,created_at,category')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory as NewsCategory);
      }
      const { data, error } = await query.limit(3);
      if (error) throw error;
      return data || [];
    },
    staleTimeMinutes: 5,
    cacheTimeMinutes: 15,
    enabled: true, // Non-blocking query
  });

  // Optimized events query - non-blocking
  const { data: events = [] } = useOptimizedQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.from('events').select('*').gte('date_debut', today).order('date_debut', {
        ascending: true
      }).limit(3);
      if (error) throw error;
      return data || [];
    },
    staleTimeMinutes: 10,
    cacheTimeMinutes: 20,
    enabled: true, // Non-blocking query
  });
  // Memoized static data
  const newsCategories = useMemo(() => [
    { id: 'all', label: 'Toutes' },
    { id: 'reunion_travail', label: 'Réunion de travail' },
    { id: 'nouvelles_informations', label: 'Nouvelles informations' },
    { id: 'activites_parauniversitaire', label: 'Activités parauniversitaire' },
    { id: 'avis_etudiants', label: 'Avis étudiants' },
    { id: 'avis_enseignants', label: 'Avis enseignants' },
    { id: 'evenements_scientifique', label: 'Événements scientifique' }
  ], []);
  
  const carouselHighlights = useMemo(() => [
    {
      title: "Excellence Académique",
      description: "Plus de 50 formations d'excellence de la licence au doctorat",
      image: "/lovable-uploads/public/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png",
      link: "/formations"
    },
    {
      title: "Recherche de Pointe",
      description: "12 laboratoires de recherche et innovation scientifique",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
      link: "/recherche"
    },
    {
      title: "Partenariats Internationaux",
      description: "Coopération avec les meilleures universités mondiales",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop",
      link: "/cooperation"
    }
  ], []);

  // Optimized callback functions
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Preload first carousel image for faster LCP with proper sizing hints
  useEffect(() => {
    if (carouselNews.length > 0 && carouselNews[0]?.image_url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      // Preload optimized WebP version to improve LCP and serve next-gen format
      const optimizedHref = optimizeImageUrl(carouselNews[0].image_url, 398, 224, 80);
      link.href = optimizedHref;
      link.setAttribute('fetchpriority', 'high');
      link.setAttribute('imagesrcset', optimizedHref);
      link.setAttribute('imagesizes', '(max-width: 768px) 100vw, 398px');
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [carouselNews]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };
    
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dual Carousel Section */}
        <div className="mb-16 grid md:grid-cols-2 gap-6">
          {/* News Carousel */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Actualités
            </h2>
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {carouselNews.map((article: any, index) => (
                  <CarouselItem key={index}>
                    <Link to={`/actualite/${article.id}`}>
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                        <div className="relative h-72">
                          {article.image_url ? (
                            <OptimizedImage 
                              src={article.image_url} 
                              alt={`Image illustrant ${article.title}`}
                              className="w-full h-full object-cover"
                              context="card"
                              quality={85}
                              priority={index === 0}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                              <FileText className="h-20 w-20 text-white/50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                            <p className="text-sm opacity-90 line-clamp-2">{article.excerpt}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
                {carouselNews.length === 0 && (
                  <CarouselItem>
                    <Card className="h-72 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <FileText className="h-16 w-16 mx-auto mb-2" />
                        <p>Aucune actualité</p>
                      </div>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* YouTube Carousel */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Youtube className="h-6 w-6 mr-2 text-red-600" />
              Vidéos
            </h2>
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {carouselYoutube.map((video: any, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                      <div className="relative h-72">
                        <LazyYouTubeEmbed
                          url={video.youtube_url}
                          title={video.youtube_title}
                          className="w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                          <h3 className="text-white font-semibold">{video.youtube_title}</h3>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
                {carouselYoutube.length === 0 && (
                  <CarouselItem>
                    <Card className="h-72 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Youtube className="h-16 w-16 mx-auto mb-2" />
                        <p>Aucune vidéo</p>
                      </div>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
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
          
          <Link to="/recherche/ecole-doctorale">
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
            link: "/formations/formation-licence",
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
          }, {
            title: "Formation Master",
            description: "Spécialisations avancées et recherche appliquée",
            icon: GraduationCap,
            link: "/formations/formation-master",
            color: "text-cyan-600 dark:text-cyan-400",
            bgColor: "bg-cyan-100 dark:bg-cyan-900/20"
          }, {
            title: "Formation Doctorat",
            description: "Recherche de pointe et innovation scientifique",
            icon: Microscope,
            link: "/formations/formation-doctorat",
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-100 dark:bg-pink-900/20"
          }, {
            title: "Formation Continue",
            description: "Perfectionnement professionnel et mise à jour des compétences",
            icon: Award,
            link: "/formations/formation-continue",
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
            {newsCategories.map(category => <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} size="sm" onClick={() => handleCategoryChange(category.id)} className={selectedCategory === category.id ? 'bg-[#006be5] hover:bg-[#005bb5]' : ''}>
                {category.label}
              </Button>)}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map(article => <Link key={article.id} to={`/actualite/${article.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {article.image_url ? <OptimizedImage 
                      src={article.image_url} 
                      alt={`Image illustrant ${article.title}`}
                      className="w-full h-full object-cover"
                      context="card"
                      quality={85}
                    /> : <div className="w-full h-full flex items-center justify-center">
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
                  {event.image_url ? (
                    <OptimizedImage 
                      src={event.image_url}
                      alt={event.titre}
                      className="w-full h-full object-cover"
                      context="card"
                      quality={85}
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
