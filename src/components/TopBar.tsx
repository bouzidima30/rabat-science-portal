
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Search } from "lucide-react";
import GlobalSearch from "./GlobalSearch";

const TopBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnecté",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/');
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 relative z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png" 
              alt="FSR Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                Faculté des Sciences de Rabat
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Université Mohammed V
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher</span>
              <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default TopBar;
