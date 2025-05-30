
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  Activity
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark' ||
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

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

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, description: "Vue d'ensemble" },
    { name: "Actualités", path: "/admin/actualites", icon: FileText, description: "Gestion des actualités" },
    { name: "Événements", path: "/admin/evenements", icon: Calendar, description: "Calendrier des événements" },
    { name: "Formations", path: "/admin/formations", icon: GraduationCap, description: "Programmes de formation" },
    { name: "Coopérations", path: "/admin/cooperations", icon: HandHeart, description: "Partenariats" },
    { name: "Pages", path: "/admin/pages", icon: FileStack, description: "Gestion des pages" },
    { name: "Fichiers", path: "/admin/fichiers", icon: File, description: "Gestionnaire de documents" },
    { name: "Upload Files", path: "/admin/upload-files", icon: Upload, description: "Télécharger des fichiers" },
    { name: "Historique", path: "/admin/historique", icon: Activity, description: "Journal d'activité" },
    { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users, description: "Comptes utilisateurs" },
  ];

  const currentPage = sidebarItems.find(item => item.path === location.pathname);

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Fixed Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-out lg:translate-x-0 border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
          
          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Administration</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/20"
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
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className={`h-5 w-5 mr-3 ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${
                      isActive ? "text-blue-100" : "text-gray-500 group-hover:text-blue-600"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                FSR Administration
              </p>
              <p className="text-xs text-gray-500">© 2025</p>
            </div>
          </div>
        </div>

        {/* Main content with fixed sidebar offset */}
        <div className="flex-1 lg:ml-80">
          {/* Fixed TopBar */}
          <div className="fixed top-0 right-0 left-0 lg:left-80 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-blue-600"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentPage?.name || "Administration"}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentPage?.description || "Panneau de contrôle"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
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
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
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

                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Page Content with top padding for fixed header */}
          <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
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
