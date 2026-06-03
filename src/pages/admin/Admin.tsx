import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Clock,
  ChevronDown,
  Newspaper,
  FolderOpen,
  BookOpen,
  ShieldCheck
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Accès refusé
          </h1>
          <p className="text-muted-foreground mb-6">
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

  const sidebarGroups: Array<{
    label: string;
    icon: any;
    items: Array<{ name: string; path: string; icon: any; description: string }>;
  }> = [
    {
      label: "Tableau de bord",
      icon: LayoutDashboard,
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard, description: "Vue d'ensemble" },
      ],
    },
    {
      label: "Contenu & Communication",
      icon: Newspaper,
      items: [
        { name: "Actualités", path: "/admin/actualites", icon: FileText, description: "Gestion des actualités" },
        { name: "Événements", path: "/admin/evenements", icon: Calendar, description: "Calendrier des événements" },
        { name: "Pages", path: "/admin/pages", icon: FileStack, description: "Gestion des pages" },
        { name: "Carousel", path: "/admin/carousel", icon: GripVertical, description: "Gestion des carousels" },
        { name: "Contact", path: "/admin/contact", icon: MessageSquare, description: "Messages de contact" },
      ],
    },
    {
      label: "Formations & Recherche",
      icon: GraduationCap,
      items: [
        { name: "Formations", path: "/admin/formations", icon: GraduationCap, description: "Programmes de formation" },
        { name: "CeDoc", path: "/admin/cedoc", icon: FileText, description: "Documents CeDoc" },
        { name: "Coopérations", path: "/admin/cooperations", icon: HandHeart, description: "Partenariats" },
      ],
    },
    {
      label: "Scolarité",
      icon: BookOpen,
      items: [
        { name: "Emplois du Temps", path: "/admin/emploi-temps", icon: Clock, description: "Gestion des emplois du temps" },
        { name: "Planning Évaluations", path: "/admin/planning-evaluations", icon: Calendar, description: "Planning & calendrier des évaluations" },
        { name: "Listes Examens", path: "/admin/listes-examens", icon: FileText, description: "Listes des examens par session" },
        { name: "Présélection", path: "/admin/preselection", icon: GraduationCap, description: "Documents de présélection" },
        { name: "Sections & Groupes", path: "/admin/sections-groupes", icon: Users, description: "Sections et groupes par session" },
        { name: "Scolarité", path: "/admin/scolarite", icon: FileText, description: "Documents du service scolarité" },
        { name: "Résultats Examens", path: "/admin/resultats", icon: FileText, description: "Résultats par session" },
      ],
    },
    {
      label: "Fichiers & Documents",
      icon: FolderOpen,
      items: [
        { name: "Fichiers", path: "/admin/fichiers", icon: File, description: "Gestionnaire de documents" },
        { name: "Upload Files", path: "/admin/upload-files", icon: Upload, description: "Télécharger des fichiers" },
      ],
    },
    {
      label: "Vie Étudiante",
      icon: Users,
      items: [
        { name: "Clubs para-uni.", path: "/admin/clubs", icon: Users, description: "Gestion des clubs para-universitaires" },
      ],
    },
    {
      label: "Administration",
      icon: ShieldCheck,
      items: [
        { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users, description: "Comptes utilisateurs" },
        { name: "Historique", path: "/admin/historique", icon: Activity, description: "Journal d'activité" },
      ],
    },
  ];

  const allItems = sidebarGroups.flatMap((g) => g.items);
  const currentPage = allItems.find((item) => item.path === location.pathname);

  const isGroupOpen = (label: string) => {
    if (openGroups[label] !== undefined) return openGroups[label];
    const group = sidebarGroups.find((g) => g.label === label);
    return group?.items.some((i) => i.path === location.pathname) ?? false;
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !isGroupOpen(label) }));
  };

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background flex">
        {/* Fixed Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-card shadow-xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-out lg:translate-x-0 border-r border-border flex flex-col`}>
          
          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-border bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
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
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarGroups.map((group) => {
              const GroupIcon = group.icon;
              const hasActive = group.items.some((i) => i.path === location.pathname);

              // Single-item groups render as a flat link
              if (group.items.length === 1) {
                const item = group.items[0];
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={group.label}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700"
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-blue-600"}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              }

              const open = isGroupOpen(group.label);
              return (
                <Collapsible key={group.label} open={open} onOpenChange={() => toggleGroup(group.label)}>
                  <CollapsibleTrigger
                    className={`w-full group flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      hasActive
                        ? "text-blue-700 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/20"
                        : "text-foreground hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700"
                    }`}
                  >
                    <GroupIcon className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="mt-1 ml-4 pl-3 border-l border-border space-y-1">
                      {group.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700"
                            }`}
                          >
                            <IconComponent className={`h-4 w-4 mr-2.5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-blue-600"}`} />
                            <span className="font-medium truncate">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                FSR Administration
              </p>
              <p className="text-xs text-muted-foreground">© 2025</p>
            </div>
          </div>
        </div>

        {/* Main content with fixed sidebar offset */}
        <div className="flex-1 lg:ml-80">
          {/* Fixed TopBar */}
          <div className="fixed top-0 right-0 left-0 lg:left-80 z-40 h-16 bg-card border-b border-border shadow-sm">
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
                  <h1 className="text-base sm:text-xl font-semibold text-foreground truncate">
                    {currentPage?.name || "Administration"}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
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
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">
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
          <main className="pt-16 min-h-screen bg-background">
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
