
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* FSR Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png" 
                alt="FSR Logo" 
                className="h-12 w-auto"
              />
              <div>
                <div className="text-[#006be5] font-bold text-lg">FSR</div>
                <div className="text-sm text-gray-300">Faculté des Sciences Rabat</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-6">
              La Faculté des Sciences de Rabat, établissement d'enseignement supérieur et de recherche scientifique de l'Université Mohammed V.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/formations" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Formations
                </Link>
              </li>
              <li>
                <Link to="/recherche" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Recherche
                </Link>
              </li>
              <li>
                <Link to="/espace-etudiants" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Espace Étudiants
                </Link>
              </li>
              <li>
                <Link to="/espace-enseignants" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Espace Enseignants
                </Link>
              </li>
              <li>
                <Link to="/cooperation" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Coopération
                </Link>
              </li>
            </ul>
          </div>

          {/* Formations */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Formations</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/formations/licence" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Formation Licence
                </Link>
              </li>
              <li>
                <Link to="/formations/master" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Formation Master
                </Link>
              </li>
              <li>
                <Link to="/formations/doctorat" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Formation Doctorat
                </Link>
              </li>
              <li>
                <Link to="/formations/continue" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  Formation Continue
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#006be5] mt-0.5" />
                <div className="text-gray-300 text-sm">
                  Avenue Ibn Battouta, B.P. 1014 RP<br />
                  Rabat, Maroc
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#006be5]" />
                <span className="text-gray-300 text-sm">+212 5 37 77 18 34</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#006be5]" />
                <span className="text-gray-300 text-sm">contact@fsr.ac.ma</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Suivez-nous</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#006be5] transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 Faculté des Sciences de Rabat. Tous droits réservés.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-[#006be5] text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-[#006be5] text-sm transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
