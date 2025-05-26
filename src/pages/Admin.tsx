
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Globe, 
  File, 
  Users,
  Menu,
  X
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
    { name: "Coopérations", path: "/admin/cooperations", icon: Globe },
    { name: "Pages", path: "/admin/pages", icon: File },
    { name: "Fichiers", path: "/admin/fichiers", icon: File },
    { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
  ];

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        
        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Administration
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="mt-6 px-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#006be5] text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <IconComponent className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:ml-0">
            <div className="lg:hidden">
              <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Administration
                </h1>
              </div>
            </div>
            
            <main className="p-6">
              <Outlet />
            </main>
          </div>
        </div>

        {/* Overlay */}
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
