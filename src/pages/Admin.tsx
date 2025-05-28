
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
  FileStack
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/TopBar";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Actualités", path: "/admin/actualites", icon: FileText },
    { name: "Événements", path: "/admin/evenements", icon: Calendar },
    { name: "Formations", path: "/admin/formations", icon: GraduationCap },
    { name: "Coopérations", path: "/admin/cooperations", icon: HandHeart },
    { name: "Pages", path: "/admin/pages", icon: FileStack },
    { name: "Fichiers", path: "/admin/fichiers", icon: File },
    { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
  ];

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        
        <div className="flex">
          {/* Modern Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700`}>
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Administration
                  </h2>
                  <p className="text-xs text-blue-100">Panneau de contrôle</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 px-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <IconComponent className={`h-5 w-5 mr-3 transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                        }`} />
                        {item.name}
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  FSR Administration
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Version 1.0
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:ml-0">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Administration
                </h1>
                <div className="w-10"></div>
              </div>
            </div>
            
            {/* Page Content */}
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default Admin;
