
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, ArrowRight } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { title: "Formations", href: "/formations" },
    { title: "Recherche", href: "/recherche" },
    { title: "Espace Étudiants", href: "/espace-etudiants" },
    { title: "Espace Enseignants", href: "/espace-enseignants" },
    { title: "Coopération", href: "/cooperation" }
  ];

  const formations = [
    { title: "Formation Licence", href: "/formations/licence" },
    { title: "Formation Master", href: "/formations/master" },
    { title: "Formation Doctorat", href: "/formations/doctorat" },
    { title: "Formation Continue", href: "/formations/continue" }
  ];

  const actualNews = [
    { title: "Nouvelle rentrée universitaire 2024-2025", date: "15 Sept 2024" },
    { title: "Conférence internationale sur l'IA", date: "20 Oct 2024" },
    { title: "Journées portes ouvertes", date: "25 Nov 2024" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          {/* FSR Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/a6746f93-07ad-4ae4-a5ea-79f98c731a2a.png" 
                alt="FSR Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              Faculté des Sciences de Rabat
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Établissement d'enseignement supérieur et de recherche scientifique de l'Université Mohammed V, 
              dédié à l'excellence académique depuis 1957.
            </p>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-300">Suivez-nous</h4>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                  { icon: Twitter, href: "#", color: "hover:text-sky-400" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-500" },
                  { icon: Youtube, href: "#", color: "hover:text-red-400" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 ${social.color} transform hover:scale-110`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="group flex items-center text-gray-300 hover:text-blue-300 transition-colors duration-300"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Formations */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">Nos Formations</h3>
            <ul className="space-y-3">
              {formations.map((formation, index) => (
                <li key={index}>
                  <Link 
                    to={formation.href} 
                    className="group flex items-center text-gray-300 hover:text-blue-300 transition-colors duration-300"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    {formation.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & News */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">Contact</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  Avenue Ibn Battouta, B.P. 1014 RP<br />
                  Rabat, Maroc
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors">
                  <Phone className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">+212 5 37 77 18 34</span>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-orange-600/20 rounded-lg group-hover:bg-orange-600/30 transition-colors">
                  <Mail className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-gray-300 text-sm">contact@fsr.ac.ma</span>
              </div>
            </div>

            {/* Recent News */}
            <div>
              <h4 className="font-semibold mb-4 text-blue-300">Actualités Récentes</h4>
              <div className="space-y-3">
                {actualNews.map((news, index) => (
                  <div key={index} className="group">
                    <Link to="/actualites" className="block">
                      <h5 className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors line-clamp-2">
                        {news.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">{news.date}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-blue-300">Restez Informés</h3>
            <p className="text-gray-300 mb-6">
              Recevez les dernières actualités et événements de la FSR directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm text-center lg:text-left">
              © 2025 Faculté des Sciences de Rabat. Tous droits réservés.
              <span className="mx-2">•</span>
              Université Mohammed V
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="/plan-acces" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                Plan d'accès
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-blue-300 text-sm transition-colors">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
