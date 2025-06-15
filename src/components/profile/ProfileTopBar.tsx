import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Home, Moon, Sun, Shield, LogOut, User } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ProfileTopBar = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Déconnecté",
        description: "Vous avez été déconnecté avec succès"
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Mon Profil
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {profile?.role === 'admin' && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Administration</span>
              </Button>
            </Link>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTopBar;
