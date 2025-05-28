
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Search
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/TopBar";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, description: "Vue d'ensemble" },
    { name: "Actualités", path: "/admin/actualites", icon: FileText, description: "Gestion des actualités" },
    { name: "Événements", path: "/admin/evenements", icon: Calendar, description: "Calendrier des événements" },
    { name: "Formations", path: "/admin/formations", icon: GraduationCap, description: "Programmes de formation" },
    { name: "Coopérations", path: "/admin/cooperations", icon: HandHeart, description: "Partenariats" },
    { name: "Pages", path: "/admin/pages", icon: FileStack, description: "Gestion des pages" },
    { name: "Fichiers", path: "/admin/fichiers", icon: File, description: "Gestionnaire de documents" },
    { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users, description: "Comptes utilisateurs" },
  ];

  const currentPage = sidebarItems.find(item => item.path === location.pathname);

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <TopBar />
        
        <div className="flex">
          {/* Modern Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/50 dark:border-gray-700/50`}>
            
            {/* Sidebar Header */}
            <div className="relative h-24 px-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
              <div className="relative flex items-center justify-between h-full">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <LayoutDashboard className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Administration
                    </h2>
                    <p className="text-xs text-blue-100/80">Panneau de contrôle FSR</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-white/20 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            
            {/* Current Page Info */}
            {currentPage && (
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <currentPage.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentPage.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {currentPage.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 hover:text-blue-700 dark:hover:text-blue-300"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-white/20" 
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50"
                      }`}>
                        <IconComponent className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs transition-colors ${
                          isActive 
                            ? "text-blue-100" 
                            : "text-gray-500 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="text-center space-y-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  FSR Administration
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Version 2.0 • © 2024
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:ml-0">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between h-16 px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentPage?.name || "Administration"}
                </h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Page Content */}
            <main className="flex-1 min-h-screen bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default Admin;
