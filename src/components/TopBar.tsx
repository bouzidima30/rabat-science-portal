
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MapPin, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const TopBar = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
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
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-10 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Avenue Ibn Battouta, B.P. 1014 RP, Rabat, Maroc</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {profile ? (
              <>
                <span className="text-gray-700 dark:text-gray-200">
                  {profile.full_name || profile.email}
                </span>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="h-8"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-8">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-8 bg-[#006be5] hover:bg-[#0056b3]">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
