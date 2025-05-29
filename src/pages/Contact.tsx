
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Contactez la Faculté des Sciences de Rabat pour toute information ou demande.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5]">
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#006be5] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Adresse</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Avenue Ibn Battouta, B.P. 1014 RP<br />
                      Rabat, Maroc
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#006be5] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Téléphone</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +212 5 37 77 18 34<br />
                      +212 5 37 77 18 35
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-[#006be5] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      contact@fsr.ac.ma<br />
                      doyen@fsr.ac.ma
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-[#006be5] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Horaires d'ouverture</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Lundi - Vendredi : 8h00 - 18h00<br />
                      Samedi : 8h00 - 12h00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services administratifs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5]">
                  Services Administratifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#006be5] pl-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Décanat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bureau 101 - Bâtiment Administration<br />
                      Tél: +212 5 37 77 18 34
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-[#006be5] pl-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Service Scolarité</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bureau 201 - Bâtiment Administration<br />
                      Tél: +212 5 37 77 18 35
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-[#006be5] pl-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Service Recherche</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bureau 301 - Bâtiment Administration<br />
                      Tél: +212 5 37 77 18 36
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5]">
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom *
                      </label>
                      <Input placeholder="Votre nom" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prénom *
                      </label>
                      <Input placeholder="Votre prénom" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input type="email" placeholder="votre.email@exemple.com" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <Input placeholder="Votre numéro de téléphone" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sujet *
                    </label>
                    <Input placeholder="Objet de votre message" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Votre message..." 
                      rows={6}
                      required 
                    />
                  </div>
                  
                  <Button className="w-full bg-[#006be5] hover:bg-[#0056b3]">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plan d'accès */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Plan d'Accès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Carte Google Maps - Plan d'accès à la FSR
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                La Faculté des Sciences de Rabat est située sur l'Avenue Ibn Battouta, 
                facilement accessible par les transports en commun.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
