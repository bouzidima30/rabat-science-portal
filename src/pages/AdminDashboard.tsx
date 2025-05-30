
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Calendar, 
  Users, 
  Eye, 
  Plus, 
  TrendingUp, 
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Clock,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [newsCount, eventsCount, usersCount, cooperationsCount, formationsCount] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('cooperations').select('id', { count: 'exact' }),
        supabase.from('formations').select('id', { count: 'exact' })
      ]);

      return {
        news: newsCount.count || 0,
        events: eventsCount.count || 0,
        users: usersCount.count || 0,
        cooperations: cooperationsCount.count || 0,
        formations: formationsCount.count || 0
      };
    }
  });

  // Fetch recent activities
  const { data: recentNews } = useQuery({
    queryKey: ['recent-news'],
    queryFn: async () => {
      const { data } = await supabase
        .from('news')
        .select('id, title, created_at, published')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  const { data: recentEvents } = useQuery({
    queryKey: ['recent-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('id, titre, created_at, date_debut')
        .order('created_at', { ascending: false })
        .limit(3);
      return data || [];
    }
  });

  const dashboardCards = [
    {
      title: "Actualités",
      value: stats?.news || 0,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
      change: "+12%",
      link: "/admin/actualites"
    },
    {
      title: "Événements",
      value: stats?.events || 0,
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
      change: "+8%",
      link: "/admin/evenements"
    },
    {
      title: "Utilisateurs",
      value: stats?.users || 0,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
      change: "+23%",
      link: "/admin/utilisateurs"
    },
    {
      title: "Coopérations",
      value: stats?.cooperations || 0,
      icon: Eye,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      textColor: "text-orange-600 dark:text-orange-400",
      change: "+5%",
      link: "/admin/cooperations"
    }
  ];

  const quickActions = [
    {
      title: "Nouvelle Actualité",
      description: "Publier une actualité sur le site",
      icon: FileText,
      color: "bg-blue-500 hover:bg-blue-600",
      link: "/admin/actualites"
    },
    {
      title: "Nouvel Événement",
      description: "Créer un événement à venir",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600",
      link: "/admin/evenements"
    },
    {
      title: "Gestion Fichiers",
      description: "Organiser les documents",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      link: "/admin/fichiers"
    },
    {
      title: "Gérer Utilisateurs",
      description: "Administration des comptes",
      icon: Users,
      color: "bg-orange-500 hover:bg-orange-600",
      link: "/admin/utilisateurs"
    }
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tableau de Bord
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Vue d'ensemble de votre administration FSR
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              Mis à jour il y a quelques secondes
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Link key={index} to={card.link}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800 group cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${card.textColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {card.change}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <span className="text-xs text-gray-500 ml-1">Voir détails</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Actions Rapides
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <div className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg text-white ${action.color} transition-transform group-hover:scale-110`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNews?.slice(0, 3).map((news) => (
                <div key={news.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {news.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {news.published ? 'Publié' : 'Brouillon'} • {new Date(news.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentEvents?.slice(0, 2).map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.titre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Événement • {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/admin/actualites" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1">
                Voir toute l'activité
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Chart */}
      <Card className="mt-6 border-0 shadow-lg bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            Aperçu des Contenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.news || 0}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Actualités</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.events || 0}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Événements</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.cooperations || 0}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Coopérations</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.formations || 0}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Formations</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats?.users || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
