
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnecté",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-primary shadow-lg px-4 relative z-40 py-1.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:block text-sm text-primary-foreground/80 ml-2">
          Avenue Ibn Battouta, B.P. 1014 RP, Rabat – Maroc
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme} 
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 h-8 w-8"
            aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/admin">Administration</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profil">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10 text-sm font-medium">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 text-sm font-semibold rounded-full px-5 shadow-sm">
                  Inscription
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
