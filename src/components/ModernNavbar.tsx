
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useMobileDetection } from "@/hooks/useMobileDetection";

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const location = useLocation();
  const { isMobile } = useMobileDetection();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
    setExpandedMobileMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    {
      name: "Accueil",
      path: "/",
      hasDropdown: false
    },
    {
      name: "Présentation",
      path: "/presentation",
      hasDropdown: true,
      dropdownItems: [
        { name: "Mot du Doyen", path: "/mot-doyen" },
        { name: "Projet de développement", path: "/projet-developpement" },
        { name: "Historique", path: "/historique" },
        { name: "Organisation générale", path: "/organisation" },
        { name: "FSR en chiffres", path: "/fsr-chiffres" },
        { name: "Représentants de la faculté", path: "/representants" }
      ]
    },
    {
      name: "Formations",
      path: "/formations",
      hasDropdown: true,
      dropdownItems: [
        { name: "LMD : Mode d'emploi", path: "/lmd-guide" },
        { name: "Formation licence", path: "/formation-licence" },
        { name: "Formation master", path: "/formation-master" },
        { name: "Formation doctorat", path: "/formation-doctorat" },
        { name: "Formation continue", path: "/formation-continue" }
      ]
    },
    {
      name: "Recherche",
      path: "/recherche",
      hasDropdown: true,
      dropdownItems: [
        { name: "École doctorale", path: "/ecole-doctorale" },
        { name: "Valorisation de la recherche", path: "/valorisation-recherche" },
        { name: "Structures de recherche", path: "/recherche/structures" },
        { name: "Domaines de recherche", path: "/recherche/domaines" },
        { name: "Plateformes techniques", path: "/plateformes-techniques" }
      ]
    },
    {
      name: "Espace enseignants",
      path: "/espace-enseignants",
      hasDropdown: false
    },
    {
      name: "Espace étudiants",
      path: "/espace-etudiants",
      hasDropdown: false
    },
    {
      name: "Coopération",
      path: "/cooperation",
      hasDropdown: true,
      dropdownItems: [
        { name: "Coopération nationale", path: "/cooperation-nationale" },
        { name: "Coopération internationale", path: "/cooperation-internationale" }
      ]
    },
    {
      name: "Contact",
      path: "/contact",
      hasDropdown: false
    }
  ];

  const toggleMobileSubmenu = (menuName: string) => {
    setExpandedMobileMenu(expandedMobileMenu === menuName ? null : menuName);
  };

  const handleMobileNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    setExpandedMobileMenu(null);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b-2 border-blue-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/14d8950a-9b26-404a-a40b-7931ec76f547.png" 
              alt="FSR Logo" 
              className="h-16 w-auto" 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setHoveredMenu(item.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                {item.hasDropdown ? (
                  <>
                    <Button
                      variant="ghost"
                      className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 ${
                        location.pathname.startsWith(item.path) 
                          ? "text-blue-600 dark:text-blue-400" 
                          : ""
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                    {hoveredMenu === item.name && (
                      <div className="absolute top-full left-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="block text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 py-[10px] px-[16px]"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 ${
                        location.pathname === item.path 
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                          : ""
                      }`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600 relative"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-[55] transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 dark:text-gray-200"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <div key={item.name} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleMobileSubmenu(item.name)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                        expandedMobileMenu === item.name ? 'rotate-90' : ''
                      }`} />
                    </button>
                    
                    {expandedMobileMenu === item.name && (
                      <div className="bg-gray-50 dark:bg-gray-800">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            onClick={() => handleMobileNavigation(dropdownItem.path)}
                            className="block w-full text-left p-4 pl-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-t border-gray-200 dark:border-gray-700 first:border-t-0"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => handleMobileNavigation(item.path)}
                    className="block w-full text-left p-4 text-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Faculté des Sciences de Rabat
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
