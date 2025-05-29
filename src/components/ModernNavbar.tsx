import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const menuItems = [{
    name: "Accueil",
    path: "/",
    hasDropdown: false
  }, {
    name: "Présentation",
    path: "/presentation",
    hasDropdown: true,
    dropdownItems: [{
      name: "Mot du Doyen",
      path: "/mot-doyen"
    }, {
      name: "Projet de développement",
      path: "/projet-developpement"
    }, {
      name: "Historique",
      path: "/historique"
    }, {
      name: "Organisation générale",
      path: "/organisation"
    }, {
      name: "FSR en chiffres",
      path: "/fsr-chiffres"
    }, {
      name: "Représentants de la faculté",
      path: "/representants"
    }]
  }, {
    name: "Formations",
    path: "/formations",
    hasDropdown: true,
    dropdownItems: [{
      name: "LMD : Mode d'emploi",
      path: "/lmd-guide"
    }, {
      name: "Formation licence",
      path: "/formations/licence"
    }, {
      name: "Formation master",
      path: "/formations/master"
    }, {
      name: "Formation doctorat",
      path: "/formation-doctorat"
    }, {
      name: "Formation continue",
      path: "/formations/continue"
    }]
  }, {
    name: "Recherche",
    path: "/recherche",
    hasDropdown: true,
    dropdownItems: [{
      name: "École doctorale",
      path: "/ecole-doctorale"
    }, {
      name: "Valorisation de la recherche",
      path: "/valorisation-recherche"
    }, {
      name: "Structures de recherche",
      path: "/recherche/structures"
    }, {
      name: "Domaines de recherche",
      path: "/recherche/domaines"
    }, {
      name: "Plateformes techniques",
      path: "/plateformes-techniques"
    }]
  }, {
    name: "Espace enseignants",
    path: "/espace-enseignants",
    hasDropdown: false
  }, {
    name: "Espace étudiants",
    path: "/espace-etudiants",
    hasDropdown: false
  }, {
    name: "Coopération",
    path: "/cooperation",
    hasDropdown: true,
    dropdownItems: [{
      name: "Coopération nationale",
      path: "/cooperation/nationale"
    }, {
      name: "Coopération internationale",
      path: "/cooperation/internationale"
    }]
  }, {
    name: "Actualités",
    path: "/actualites",
    hasDropdown: false
  }, {
    name: "Événements",
    path: "/evenements",
    hasDropdown: false
  }, {
    name: "Contact",
    path: "/contact",
    hasDropdown: false
  }];
  return <nav className="bg-white dark:bg-gray-900 shadow-lg border-b-2 border-blue-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img src="/lovable-uploads/14d8950a-9b26-404a-a40b-7931ec76f547.png" alt="FSR Logo" className="h-16 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map(item => <div key={item.name} className="relative" onMouseEnter={() => item.hasDropdown && setHoveredMenu(item.name)} onMouseLeave={() => setHoveredMenu(null)}>
                {item.hasDropdown ? <>
                    <Button variant="ghost" className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 ${location.pathname.startsWith(item.path) ? "text-blue-600 dark:text-blue-400" : ""}`}>
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                    {hoveredMenu === item.name && <div className="absolute top-full left-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        {item.dropdownItems?.map(dropdownItem => <Link key={dropdownItem.name} to={dropdownItem.path} className="block text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 py-[10px] px-[16px]">
                            {dropdownItem.name}
                          </Link>)}
                      </div>}
                  </> : <Link to={item.path}>
                    <Button variant="ghost" className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 ${location.pathname === item.path ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : ""}`}>
                      {item.name}
                    </Button>
                  </Link>}
              </div>)}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {menuItems.map(item => <div key={item.name} className="py-2">
                {item.hasDropdown ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50">
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {item.dropdownItems?.map(dropdownItem => <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link to={dropdownItem.path} onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                            {dropdownItem.name}
                          </Link>
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu> : <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50">
                      {item.name}
                    </Button>
                  </Link>}
              </div>)}
          </div>}
      </div>
    </nav>;
};
export default ModernNavbar;