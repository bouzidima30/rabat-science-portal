
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone } from "lucide-react";

const Representants = () => {
  const representants = [
    {
      nom: "Professeur [Nom]",
      poste: "Doyen",
      departement: "Administration",
      email: "doyen@fsr.ac.ma",
      telephone: "+212 5 37 77 18 34"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Vice-Doyen chargé des Affaires Académiques",
      departement: "Administration",
      email: "vice-doyen.academique@fsr.ac.ma",
      telephone: "+212 5 37 77 18 35"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Vice-Doyen chargé de la Recherche",
      departement: "Administration",
      email: "vice-doyen.recherche@fsr.ac.ma",
      telephone: "+212 5 37 77 18 36"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Chef du Département de Mathématiques",
      departement: "Mathématiques",
      email: "chef.math@fsr.ac.ma",
      telephone: "+212 5 37 77 18 40"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Chef du Département de Physique",
      departement: "Physique",
      email: "chef.physique@fsr.ac.ma",
      telephone: "+212 5 37 77 18 41"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Chef du Département de Chimie",
      departement: "Chimie",
      email: "chef.chimie@fsr.ac.ma",
      telephone: "+212 5 37 77 18 42"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Chef du Département de Biologie",
      departement: "Biologie",
      email: "chef.biologie@fsr.ac.ma",
      telephone: "+212 5 37 77 18 43"
    },
    {
      nom: "Professeur [Nom]",
      poste: "Chef du Département d'Informatique",
      departement: "Informatique",
      email: "chef.informatique@fsr.ac.ma",
      telephone: "+212 5 37 77 18 44"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Représentants de la Faculté
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez l'équipe dirigeante et les responsables des différents départements 
            de la Faculté des Sciences de Rabat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {representants.map((rep, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-[#006be5] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg text-center text-gray-900 dark:text-white">
                  {rep.nom}
                </CardTitle>
                <p className="text-center text-[#006be5] font-medium">
                  {rep.poste}
                </p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  {rep.departement}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-[#006be5]" />
                    <a href={`mailto:${rep.email}`} className="hover:text-[#006be5] transition-colors">
                      {rep.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-[#006be5]" />
                    <span>{rep.telephone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Representants;
