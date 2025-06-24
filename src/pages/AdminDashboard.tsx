
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  GraduationCap,
  Globe,
  FileUp,
  Users,
  History,
  Plus,
  Eye,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
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

  const { data: formationsCount = 0 } = useQuery({
    queryKey: ['admin-formations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('formations')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: cooperationsCount = 0 } = useQuery({
    queryKey: ['admin-cooperations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('cooperations')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: pagesCount = 0 } = useQuery({
    queryKey: ['admin-pages-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: filesCount = 0 } = useQuery({
    queryKey: ['admin-files-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('files')
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

  const modules = [
    {
      title: "Actualités",
      description: "Gérez et publiez les actualités",
      count: newsCount,
      icon: FileText,
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400",
      link: "/admin/actualites",
    },
    {
      title: "Événements", 
      description: "Organisez et planifiez les événements",
      count: eventsCount,
      icon: Calendar,
      bgColor: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400",
      link: "/admin/evenements",
    },
    {
      title: "Formations",
      description: "Gérez les programmes de formation",
      count: formationsCount,
      icon: GraduationCap,
      bgColor: "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      textColor: "text-orange-600 dark:text-orange-400",
      link: "/admin/formations",
    },
    {
      title: "Coopérations",
      description: "Gérez les partenariats et coopérations",
      count: cooperationsCount,
      icon: Globe,
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      textColor: "text-purple-600 dark:text-purple-400",
      link: "/admin/cooperations",
    },
    {
      title: "Pages",
      description: "Gérez le contenu des pages statiques",
      count: pagesCount,
      icon: FileText,
      bgColor: "bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
      textColor: "text-cyan-600 dark:text-cyan-400",
      link: "/admin/pages",
    },
    {
      title: "Fichiers",
      description: "Gérez les fichiers et documents",
      count: filesCount,
      icon: FileUp,
      bgColor: "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      link: "/admin/fichiers",
    },
    {
      title: "Historique",
      description: "Consultez l'historique des activités",
      count: "-",
      icon: History,
      bgColor: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
      textColor: "text-gray-600 dark:text-gray-400",
      link: "/admin/historique",
    },
    {
      title: "Utilisateurs",
      description: "Gérez les comptes utilisateurs",
      count: usersCount,
      icon: Users,
      bgColor: "bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20",
      textColor: "text-rose-600 dark:text-rose-400",
      link: "/admin/utilisateurs",
    }
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tableau de Bord
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Vue d'ensemble de l'administration du site
            </p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module, index) => {
          const IconComponent = module.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className={`rounded-lg p-4 ${module.bgColor} mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${module.textColor}`}>
                          {module.count}
                        </span>
                        {module.count !== "-" && (
                          <span className="text-sm text-gray-500">éléments</span>
                        )}
                      </div>
                    </div>
                    <IconComponent className={`h-8 w-8 ${module.textColor}`} />
                  </div>
                </div>
                
                <Link to={module.link}>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Accéder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
