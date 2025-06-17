
import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Search, Moon, Sun, Settings, Shield } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

const TopBar = React.memo(() => {
  usePerformanceMonitor('TopBar');
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      toast({
        title: "Déconnecté",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  }, [signOut, toast]);

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const userEmail = useMemo(() => user?.email, [user?.email]);

  const authButtons = useMemo(() => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/10 border-0">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{userEmail}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Administration
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profil" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Mon Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button variant="outline" size="sm" className="border-white/30 border-white bg-[#0070e3] text-white">
            Connexion
          </Button>
        </Link>
        <Link to="/register">
          <Button size="sm" className="bg-white text-[#016BE5] hover:bg-white/90 hover:text-[#016BE5]">
            Inscription
          </Button>
        </Link>
      </div>
    );
  }, [user, userEmail, handleLogout]);

  return (
    <>
      <div className="bg-[#016BE5] shadow-lg px-4 relative z-40 py-[6px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-white/80 ml-8">
              Avenue Ibn Battouta, B.P. 1014 RP, Rabat – Maroc
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSearchOpen} 
              className="hidden sm:flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/10 border-0"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher</span>
            </Button>

            {process.env.NODE_ENV === 'development' && (
              <Link to="/security-test">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 border-0">
                  <Shield className="h-4 w-4 mr-1" />
                  Security Test
                </Button>
              </Link>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme} 
              className="text-white/80 hover:text-white hover:bg-white/10 border-0"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {authButtons}
          </div>
        </div>
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
});

TopBar.displayName = 'TopBar';

export default TopBar;
