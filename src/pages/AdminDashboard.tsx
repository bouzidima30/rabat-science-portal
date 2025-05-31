import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  TrendingUp,
  Activity,
  Eye,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useActivityLogger } from "@/hooks/useActivityLogger";

const AdminDashboard = () => {
  const { logActivity } = useActivityLogger();

  useEffect(() => {
    logActivity('access', 'Accès au tableau de bord administrateur');
  }, [logActivity]);

  const { data: newsCount = 0 } = useQuery({
    queryKey: ['admin-news-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: eventsCount = 0 } = useQuery({
    queryKey: ['admin-events-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: usersCount = 0 } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: formationsCount = 0 } = useQuery({
    queryKey: ['admin-formations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('formations')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const stats = [
    {
      title: "Actualités",
      value: newsCount,
      icon: FileText,
      color: "bg-blue-500",
      change: "+2.5%",
      link: "/admin/actualites"
    },
    {
      title: "Événements",
      value: eventsCount,
      icon: Calendar,
      color: "bg-green-500",
      change: "+4.1%",
      link: "/admin/evenements"
    },
    {
      title: "Utilisateurs",
      value: usersCount,
      icon: Users,
      color: "bg-purple-500",
      change: "+1.2%",
      link: "/admin/utilisateurs"
    },
    {
      title: "Formations",
      value: formationsCount,
      icon: GraduationCap,
      color: "bg-orange-500",
      change: "+3.8%",
      link: "/admin/formations"
    }
  ];

  const quickActions = [
    {
      title: "Nouvelle Actualité",
      description: "Créer une nouvelle actualité",
      icon: Plus,
      link: "/admin/actualites",
      color: "bg-blue-500"
    },
    {
      title: "Nouvel Événement",
      description: "Ajouter un événement",
      icon: Plus,
      link: "/admin/evenements",
      color: "bg-green-500"
    },
    {
      title: "Voir l'Historique",
      description: "Consulter les logs d'activité",
      icon: Activity,
      link: "/admin/historique",
      color: "bg-indigo-500"
    },
    {
      title: "Gérer les Fichiers",
      description: "Gestionnaire de documents",
      icon: Eye,
      link: "/admin/fichiers",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Vue d'ensemble de l'administration du site
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Nouvelle actualité publiée
                  </p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
                <Badge variant="outline">Nouveau</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Événement ajouté
                  </p>
                  <p className="text-xs text-gray-500">Il y a 4 heures</p>
                </div>
                <Badge variant="outline">Événement</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Nouvel utilisateur inscrit
                  </p>
                  <p className="text-xs text-gray-500">Il y a 1 jour</p>
                </div>
                <Badge variant="outline">Utilisateur</Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <Link to="/admin/historique">
                <Button variant="outline" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Voir l'historique complet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
