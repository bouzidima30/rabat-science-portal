import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  GraduationCap, 
  File, 
  Users,
  Menu,
  X,
  HandHeart,
  FileStack,
  Settings,
  Bell,
  Home,
  Upload,
  LogOut,
  User,
  Moon,
  Sun,
  Activity,
  MessageSquare,
  GripVertical,
  Clock
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
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

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground dark:text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground dark:text-white mb-4">
            Accès refusé
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
          <Link to="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, description: "Vue d'ensemble" },
    { name: "Actualités", path: "/admin/actualites", icon: FileText, description: "Gestion des actualités" },
    { name: "Événements", path: "/admin/evenements", icon: Calendar, description: "Calendrier des événements" },
    { name: "Formations", path: "/admin/formations", icon: GraduationCap, description: "Programmes de formation" },
    { name: "Coopérations", path: "/admin/cooperations", icon: HandHeart, description: "Partenariats" },
    { name: "Pages", path: "/admin/pages", icon: FileStack, description: "Gestion des pages" },
    { name: "Contact", path: "/admin/contact", icon: MessageSquare, description: "Messages de contact" },
    { name: "Carousel", path: "/admin/carousel", icon: GripVertical, description: "Gestion des carousels" },
    { name: "Emplois du Temps", path: "/admin/emploi-temps", icon: Clock, description: "Gestion des emplois du temps" },
    { name: "Planning Évaluations", path: "/admin/planning-evaluations", icon: Calendar, description: "Planning & calendrier des évaluations" },
    { name: "CeDoc", path: "/admin/cedoc", icon: FileText, description: "Documents CeDoc" },
    { name: "Fichiers", path: "/admin/fichiers", icon: File, description: "Gestionnaire de documents" },
    { name: "Upload Files", path: "/admin/upload-files", icon: Upload, description: "Télécharger des fichiers" },
    { name: "Listes Examens", path: "/admin/listes-examens", icon: FileText, description: "Listes des examens par session" },
    { name: "Présélection", path: "/admin/preselection", icon: GraduationCap, description: "Documents de présélection" },
    { name: "Sections & Groupes", path: "/admin/sections-groupes", icon: Users, description: "Sections et groupes par session" },
    { name: "Scolarité", path: "/admin/scolarite", icon: FileText, description: "Documents du service scolarité" },
    { name: "Résultats Examens", path: "/admin/resultats", icon: FileText, description: "Résultats par session" },
    { name: "Clubs para-uni.", path: "/admin/clubs", icon: Users, description: "Gestion des clubs para-universitaires" },
    { name: "Historique", path: "/admin/historique", icon: Activity, description: "Journal d'activité" },
    { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users, description: "Comptes utilisateurs" },
  ];

  const currentPage = sidebarItems.find(item => item.path === location.pathname);

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-muted/30 dark:bg-gray-900 flex">
        {/* Fixed Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-card dark:bg-gray-900 shadow-xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-out lg:translate-x-0 border-r border-border dark:border-gray-800 flex flex-col`}>
          
          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-border dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-card/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Administration</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-card/20"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "text-muted-foreground dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className={`h-5 w-5 mr-3 ${
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-blue-600"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${
                      isActive ? "text-blue-100" : "text-muted-foreground group-hover:text-blue-600"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border dark:border-gray-800 flex-shrink-0">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                FSR Administration
              </p>
              <p className="text-xs text-muted-foreground">© 2025</p>
            </div>
          </div>
        </div>

        {/* Main content with fixed sidebar offset */}
        <div className="flex-1 lg:ml-80">
          {/* Fixed TopBar */}
          <div className="fixed top-0 right-0 left-0 lg:left-80 z-40 h-16 bg-card dark:bg-gray-900 border-b border-border dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 gap-2">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-muted-foreground hover:text-blue-600"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl font-semibold text-foreground dark:text-white truncate">
                    {currentPage?.name || "Administration"}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground truncate hidden sm:block">
                    {currentPage?.description || "Panneau de contrôle"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                <Link to="/">
                  <Button variant="outline" size="sm" className="hidden sm:flex shadow-sm">
                    <Home className="h-4 w-4 mr-2" />
                    Accueil
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme}
                  className="text-muted-foreground hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">{user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
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
                )}

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-600">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Page Content with top padding for fixed header */}
          <main className="pt-16 min-h-screen bg-muted/30 dark:bg-gray-900">
            <Outlet />
          </main>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default Admin;
