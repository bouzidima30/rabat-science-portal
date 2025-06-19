
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  Activity,
  Plus,
  Eye
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

  const mainModules = [
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
    }
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainModules.map((module, index) => {
          const IconComponent = module.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className={`rounded-lg p-4 ${module.bgColor} mb-4`}>
                  <div className="flex items-center justify-between">
                    <div>
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
                        <span className="text-sm text-gray-500">éléments</span>
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
