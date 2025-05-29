
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin, Clock, BookOpen, Users, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";

const Index = () => {
  // Fetch recent news
  const { data: recentNews = [] } = useQuery({
    queryKey: ['recent-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch upcoming events
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date_debut', today)
        .order('date_debut', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  const categoryLabels = {
    reunion_travail: "Réunion de travail",
    nouvelles_informations: "Nouvelles informations",
    activites_parauniversitaire: "Activités parauniversitaire",
    avis_etudiants: "Avis étudiants",
    avis_enseignants: "Avis enseignants",
    evenements_scientifique: "Événements scientifique"
  };

  const stats = [
    { icon: Users, label: "Étudiants", value: "12,000+", color: "text-blue-600" },
    { icon: BookOpen, label: "Programmes", value: "45+", color: "text-green-600" },
    { icon: Award, label: "Laboratoires", value: "25+", color: "text-purple-600" },
    { icon: Globe, label: "Partenariats", value: "100+", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <ModernNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bienvenue à la 
              <span className="block text-blue-300">Faculté des Sciences</span>
              <span className="block">de Rabat</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Un établissement d'excellence en enseignement supérieur et recherche scientifique, 
              formant les leaders de demain dans les sciences et technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/formations">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-3">
                  Découvrir nos formations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/recherche">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3">
                  Nos recherches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Actualités Récentes</h2>
            <p className="text-xl text-gray-600">Restez informé des dernières nouvelles de notre faculté</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {recentNews.map((news) => (
              <Link key={news.id} to={`/actualite/${news.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                  {news.image_url && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={news.image_url} 
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {categoryLabels[news.category as keyof typeof categoryLabels]}
                    </Badge>
                    <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {news.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {news.excerpt || news.content.substring(0, 120) + "..."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(news.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                        Lire plus
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/actualites">
              <Button size="lg" variant="outline">
                Voir toutes les actualités
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Événements à Venir</h2>
            <p className="text-xl text-gray-600">Découvrez les prochains événements de notre faculté</p>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {upcomingEvents.map((event) => (
                <Link key={event.id} to={`/evenement/${event.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    {event.image_url && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={event.image_url} 
                          alt={event.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.titre}
                      </CardTitle>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                          {event.date_fin && event.date_fin !== event.date_debut && (
                            <span> - {new Date(event.date_fin).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                        {event.heure_debut && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.heure_debut}
                            {event.heure_fin && <span> - {event.heure_fin}</span>}
                          </div>
                        )}
                        {event.lieu && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.lieu}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement à venir</h3>
              <p className="text-gray-500">Les prochains événements seront annoncés bientôt.</p>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/evenements">
              <Button size="lg" variant="outline">
                Voir tous les événements
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Accès Rapide</h2>
            <p className="text-xl text-blue-100">Trouvez rapidement ce que vous cherchez</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Formations", description: "Découvrez nos programmes", path: "/formations", icon: BookOpen },
              { title: "Recherche", description: "Nos domaines d'expertise", path: "/recherche", icon: Award },
              { title: "Espace Étudiants", description: "Services aux étudiants", path: "/espace-etudiants", icon: Users },
              { title: "Coopération", description: "Nos partenariats", path: "/cooperation", icon: Globe }
            ].map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link key={index} to={link.path}>
                  <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="h-12 w-12 text-blue-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-white mb-2 group-hover:text-blue-200 transition-colors">
                        {link.title}
                      </CardTitle>
                      <p className="text-blue-100 text-sm">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
