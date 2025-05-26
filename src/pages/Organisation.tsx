
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, GraduationCap, Award } from "lucide-react";

const Organisation = () => {
  const departements = [
    {
      nom: "Mathématiques",
      description: "Département de mathématiques pures et appliquées",
      specialites: ["Analyse", "Algèbre", "Géométrie", "Probabilités"]
    },
    {
      nom: "Physique",
      description: "Département de physique fondamentale et appliquée",
      specialites: ["Physique théorique", "Physique expérimentale", "Optique", "Matière condensée"]
    },
    {
      nom: "Chimie",
      description: "Département de chimie et sciences des matériaux",
      specialites: ["Chimie organique", "Chimie inorganique", "Chimie analytique", "Matériaux"]
    },
    {
      nom: "Biologie",
      description: "Département des sciences de la vie",
      specialites: ["Biologie moléculaire", "Écologie", "Microbiologie", "Génétique"]
    },
    {
      nom: "Géologie",
      description: "Département des sciences de la Terre",
      specialites: ["Géologie structurale", "Pétrologie", "Hydrogéologie", "Géophysique"]
    },
    {
      nom: "Informatique",
      description: "Département d'informatique et technologies",
      specialites: ["Intelligence artificielle", "Réseaux", "Systèmes", "Développement"]
    }
  ];

  const services = [
    {
      nom: "Décanat",
      description: "Direction générale de la faculté",
      icon: Building
    },
    {
      nom: "Scolarité",
      description: "Gestion des inscriptions et examens",
      icon: GraduationCap
    },
    {
      nom: "Recherche",
      description: "Coordination des activités de recherche",
      icon: Award
    },
    {
      nom: "Relations Extérieures",
      description: "Partenariats et coopération",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Organisation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La Faculté des Sciences de Rabat est structurée en départements spécialisés 
            et services administratifs pour garantir l'excellence académique et la recherche.
          </p>
        </div>

        {/* Structure générale */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Structure Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-[#006be5] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-[#006be5]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {service.nom}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Départements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Départements Académiques
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departements.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-[#006be5]">
                    {dept.nom}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {dept.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dept.specialites.map((specialite, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialite}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Organigramme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Organigramme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="bg-[#006be5] text-white p-4 rounded-lg inline-block mb-6">
                <h3 className="text-lg font-semibold">Décanat</h3>
                <p className="text-sm opacity-90">Direction Générale</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#006be5] mb-2">Vice-Décanat Académique</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Coordination pédagogique et académique
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Vice-Décanat Recherche</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Coordination recherche et partenariats
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-600 mb-2">Secrétariat Général</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Administration et services
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Organisation;
