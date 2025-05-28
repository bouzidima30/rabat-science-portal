
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MapPin, Settings, LogOut, Moon, Sun, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import GlobalSearch from "./GlobalSearch";

const TopBar = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-blue-200 dark:border-gray-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12 text-sm">
            <div className="flex items-center text-blue-700 dark:text-blue-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="font-medium">Avenue Ibn Battouta, B.P. 1014 RP, Rabat, Maroc</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="h-8 gap-2 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-gray-600"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Rechercher</span>
                <span className="hidden md:inline text-xs opacity-70">(Ctrl+K)</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-gray-600"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {profile ? (
                <>
                  <span className="text-blue-800 dark:text-blue-200 font-medium">
                    {profile.full_name || profile.email}
                  </span>
                  
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="h-8 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-gray-600">
                        <Settings className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="h-8 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-gray-600"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="h-8 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-gray-600">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
                      Inscription
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default TopBar;
