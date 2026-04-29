import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Users, BookOpen, Award, MapPin, Clock, ChevronRight, GraduationCap, Microscope, Building, FileText, Youtube, Tag, Sparkles, Globe } from "lucide-react";
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
import AnimatedCounter from "@/components/AnimatedCounter";
import { optimizeImageUrl } from "@/utils/imageOptimization";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { prefetchNews, prefetchEvents, prefetchFormations } = usePrefetchQueries();

  useEffect(() => {
    const timer = setTimeout(() => {
      prefetchNews();
      prefetchEvents();
      prefetchFormations();
    }, 100);
    return () => clearTimeout(timer);
  }, [prefetchNews, prefetchEvents, prefetchFormations]);

  const { data: carouselNews = [] } = useOptimizedQuery({
    queryKey: ['carousel-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_config')
        .select(`id, position, news:news_id (id, title, excerpt, image_url, created_at)`)
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
    enabled: true,
  });

  const { data: events = [] } = useOptimizedQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.from('events').select('*').gte('date_debut', today).order('date_debut', { ascending: true }).limit(3);
      if (error) throw error;
      return data || [];
    },
    staleTimeMinutes: 10,
    cacheTimeMinutes: 20,
    enabled: true,
  });

  const newsCategories = useMemo(() => [
    { id: 'all', label: 'Toutes', color: 'bg-secondary text-secondary-foreground' },
    { id: 'reunion_travail', label: 'Réunion de travail', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'nouvelles_informations', label: 'Nouvelles', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
    { id: 'activites_parauniversitaire', label: 'Activités', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { id: 'avis_etudiants', label: 'Avis étudiants', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
    { id: 'avis_enseignants', label: 'Avis enseignants', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
    { id: 'evenements_scientifique', label: 'Événements', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' }
  ], []);

  const getCategoryStyle = useCallback((categoryId: string) => {
    const cat = newsCategories.find(c => c.id === categoryId);
    return cat?.color || 'bg-secondary text-secondary-foreground';
  }, [newsCategories]);

  const getCategoryLabel = useCallback((categoryId: string) => {
    const cat = newsCategories.find(c => c.id === categoryId);
    return cat?.label || categoryId;
  }, [newsCategories]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  useEffect(() => {
    if (carouselNews.length > 0 && carouselNews[0]?.image_url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      const optimizedHref = optimizeImageUrl(carouselNews[0].image_url, 398, 224, 80);
      link.href = optimizedHref;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      return () => { if (document.head.contains(link)) document.head.removeChild(link); };
    }
  }, [carouselNews]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const handleSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", handleSelect);
    return () => { api.off("select", handleSelect); };
  }, [api]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-800 dark:from-primary/80 dark:via-blue-900 dark:to-slate-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Université Mohammed V — Rabat
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Faculté des Sciences
                <span className="block text-blue-200">de Rabat</span>
              </h1>
              <p className="text-lg text-blue-100/90 max-w-lg leading-relaxed">
                Former les scientifiques de demain et contribuer au développement du Maroc grâce à l'excellence académique et la recherche de pointe.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/formations">
                  <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-semibold rounded-full px-8 shadow-lg shadow-black/10">
                    Découvrir nos formations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero image / FSR logo area */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl scale-110" />
                <img
                  src="/lovable-uploads/FSR.webp"
                  alt="FSR Logo"
                  className="relative w-72 h-auto drop-shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Stats Bar ─── */}
      <section className="relative -mt-8 z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedCounter icon={Users} value={15000} suffix="+" label="Étudiants" color="text-primary" bgColor="bg-accent" />
          <AnimatedCounter icon={BookOpen} value={50} suffix="+" label="Formations" color="text-orange-600 dark:text-orange-400" bgColor="bg-orange-100 dark:bg-orange-900/20" />
          <AnimatedCounter icon={Award} value={200} suffix="+" label="Enseignants" color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-100 dark:bg-emerald-900/20" />
          <AnimatedCounter icon={Building} value={12} label="Laboratoires" color="text-rose-600 dark:text-rose-400" bgColor="bg-rose-100 dark:bg-rose-900/20" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* ─── Carousels Section ─── */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* News Carousel */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Actualités</h2>
              </div>
              <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                <CarouselContent>
                  {carouselNews.map((article: any, index) => (
                    <CarouselItem key={index}>
                      <Link to={`/actualite/${article.id}`}>
                        <Card className="overflow-hidden border-0 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500">
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
                              <div className="w-full h-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
                                <FileText className="h-20 w-20 text-white/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 p-6 text-white">
                              <h3 className="text-xl font-bold mb-2 leading-snug">{article.title}</h3>
                              <p className="text-sm text-white/80 line-clamp-2">{article.excerpt}</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                  {carouselNews.length === 0 && (
                    <CarouselItem>
                      <Card className="h-72 flex items-center justify-center border-dashed">
                        <div className="text-center text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">Aucune actualité</p>
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Vidéos</h2>
              </div>
              <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                <CarouselContent>
                  {carouselYoutube.map((video: any, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden border-0 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500">
                        <div className="relative h-72">
                          <LazyYouTubeEmbed url={video.youtube_url} title={video.youtube_title} className="w-full h-full" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                            <h3 className="text-white font-semibold">{video.youtube_title}</h3>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                  {carouselYoutube.length === 0 && (
                    <CarouselItem>
                      <Card className="h-72 flex items-center justify-center border-dashed">
                        <div className="text-center text-muted-foreground">
                          <Youtube className="h-12 w-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">Aucune vidéo</p>
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
        </section>

        {/* ─── Quick Actions ─── */}
        <section className="pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/formations" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative">
                  <BookOpen className="h-10 w-10 mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Découvrir nos Formations</h3>
                  <p className="text-emerald-100/90">Programmes d'excellence de la licence au doctorat</p>
                  <ArrowRight className="mt-4 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            <Link to="/recherche/ecole-doctorale" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-8 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative">
                  <Microscope className="h-10 w-10 mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Explorer la Recherche</h3>
                  <p className="text-violet-100/90">Innovation scientifique et partenariats internationaux</p>
                  <ArrowRight className="mt-4 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── Academic Programs ─── */}
        <section className="pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nos Programmes Académiques
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Des parcours d'excellence adaptés à chaque ambition scientifique
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Formation Licence", description: "Programmes de premier cycle dans toutes les disciplines scientifiques", icon: BookOpen, link: "/formations/formation-licence", gradient: "from-indigo-500 to-indigo-600" },
              { title: "Formation Master", description: "Spécialisations avancées et recherche appliquée", icon: GraduationCap, link: "/formations/formation-master", gradient: "from-cyan-500 to-cyan-600" },
              { title: "Formation Doctorat", description: "Recherche de pointe et innovation scientifique", icon: Microscope, link: "/formations/formation-doctorat", gradient: "from-pink-500 to-pink-600" },
              { title: "Formation Continue", description: "Perfectionnement professionnel et mise à jour des compétences", icon: Award, link: "/formations/formation-continue", gradient: "from-amber-500 to-amber-600" },
            ].map((program, index) => (
              <Link key={index} to={program.link} className="group">
                <Card className="h-full border-0 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500 overflow-hidden group-hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <program.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── News Section ─── */}
        <section className="pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Dernières Nouvelles
            </h2>
            <p className="text-muted-foreground">Restez informé des dernières actualités de la FSR</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {newsCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, 3).map((article, index) => (
              <Link key={article.id} to={`/actualite/${article.id}`} className="group">
                <div className="bg-card rounded-2xl overflow-hidden border-0 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                    {article.image_url ? (
                      <OptimizedImage
                        src={article.image_url}
                        alt={`Image illustrant ${article.title}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        context="card"
                        quality={85}
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${getCategoryStyle(article.category)}`}>
                        <Tag className="h-3 w-3" />
                        {getCategoryLabel(article.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{article.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-300">
                      Lire la suite
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/actualites">
              <Button variant="outline" className="rounded-full px-8 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                Voir toutes les actualités
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ─── Events Section ─── */}
        <section className="pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Événements à Venir
            </h2>
            <p className="text-muted-foreground">Ne manquez aucun événement de la faculté</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map(event => (
              <Card key={event.id} className="border-0 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-500 overflow-hidden hover:-translate-y-1">
                <div className="aspect-video bg-muted overflow-hidden">
                  {event.image_url ? (
                    <OptimizedImage src={event.image_url} alt={event.titre} className="w-full h-full object-cover" context="card" quality={85} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Calendar className="h-10 w-10 text-primary/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-primary mb-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                    </div>
                    {event.heure_debut && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {event.heure_debut}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2">{event.titre}</h3>
                  {event.lieu && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.lieu}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-muted-foreground line-clamp-3 text-sm">{event.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/evenements">
              <Button variant="outline" className="rounded-full px-8 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                Voir tous les événements
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
