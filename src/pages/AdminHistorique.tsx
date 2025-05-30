
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  User, 
  Shield,
  Eye,
  Plus,
  Edit,
  Trash,
  Globe
} from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

const AdminHistorique = () => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as ActivityLog[];
    }
  });

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'add':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'update':
      case 'edit':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'delete':
      case 'remove':
        return <Trash className="h-4 w-4 text-red-600" />;
      case 'view':
      case 'access':
        return <Eye className="h-4 w-4 text-gray-600" />;
      case 'login':
      case 'logout':
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-indigo-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'add':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'update':
      case 'edit':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'delete':
      case 'remove':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'view':
      case 'access':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'login':
      case 'logout':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
            <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Journal d'Activité
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Historique des actions effectuées par les utilisateurs
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Total Activités</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{activities.length}</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Créations</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {activities.filter(a => a.action.toLowerCase().includes('create') || a.action.toLowerCase().includes('add')).length}
                </p>
              </div>
              <Plus className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Modifications</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {activities.filter(a => a.action.toLowerCase().includes('update') || a.action.toLowerCase().includes('edit')).length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Suppressions</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {activities.filter(a => a.action.toLowerCase().includes('delete') || a.action.toLowerCase().includes('remove')).length}
                </p>
              </div>
              <Trash className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    {getActionIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${getActionColor(activity.action)} flex items-center gap-1`}>
                        {activity.action}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(activity.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {activity.profiles?.full_name || 'Utilisateur inconnu'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({activity.profiles?.email})
                      </span>
                    </div>
                    
                    {activity.details && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {activity.details}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      {activity.ip_address && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {activity.ip_address}
                        </div>
                      )}
                      {activity.user_agent && (
                        <div className="flex items-center gap-1 max-w-md truncate">
                          <Shield className="h-3 w-3" />
                          {activity.user_agent}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucune activité
              </h3>
              <p className="text-gray-500">
                Les activités des utilisateurs apparaîtront ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHistorique;
