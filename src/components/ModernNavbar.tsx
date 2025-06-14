
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMobileDetection } from "@/hooks/useMobileDetection";

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const location = useLocation();
  const { isMobile } = useMobileDetection();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

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

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-[52px] z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/14d8950a-9b26-404a-a40b-7931ec76f547.png" 
              alt="FSR Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
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
                      className={`
                        text-gray-700 dark:text-gray-200 
                        hover:text-[#016BE5] dark:hover:text-[#4A90E2] 
                        hover:bg-blue-50/50 dark:hover:bg-blue-900/20
                        text-sm font-medium 
                        transition-all duration-200 
                        px-3 py-2 h-auto
                        ${location.pathname.startsWith(item.path) ? "text-[#016BE5] dark:text-[#4A90E2] bg-blue-50/30 dark:bg-blue-900/10" : ""}
                      `}
                    >
                      <span>{item.name}</span>
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          hoveredMenu === item.name ? 'rotate-180' : ''
                        }`} 
                      />
                    </Button>
                    
                    {hoveredMenu === item.name && (
                      <div className="absolute top-full left-0 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden animate-fade-in">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link 
                            key={dropdownItem.name} 
                            to={dropdownItem.path}
                            className="block text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 hover:text-[#016BE5] dark:hover:text-[#4A90E2] transition-all duration-200 py-3 px-4 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0"
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
                      className={`
                        text-gray-700 dark:text-gray-200 
                        hover:text-[#016BE5] dark:hover:text-[#4A90E2] 
                        hover:bg-blue-50/50 dark:hover:bg-blue-900/20
                        text-sm font-medium 
                        transition-all duration-200 
                        px-3 py-2 h-auto
                        ${location.pathname === item.path ? "text-[#016BE5] dark:text-[#4A90E2] bg-blue-50/30 dark:bg-blue-900/10" : ""}
                      `}
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
            className="lg:hidden text-gray-700 dark:text-gray-200 hover:text-[#016BE5] hover:bg-blue-50/50 transition-all duration-200" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-fade-in">
            {menuItems.map((item) => (
              <div key={item.name} className="py-1">
                {item.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between text-left text-gray-700 dark:text-gray-200 hover:text-[#016BE5] hover:bg-blue-50/50 transition-all duration-200 px-4 py-3"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link 
                            to={dropdownItem.path} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full text-gray-700 dark:text-gray-200 hover:text-[#016BE5] transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className={`
                        w-full justify-start text-gray-700 dark:text-gray-200 
                        hover:text-[#016BE5] hover:bg-blue-50/50 
                        transition-all duration-200 px-4 py-3
                        ${location.pathname === item.path ? "text-[#016BE5] bg-blue-50/30" : ""}
                      `}
                    >
                      {item.name}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavbar;
