
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, BookOpen, Microscope } from "lucide-react";

const StructuresRecherche = () => {
  const structures = [
    {
      nom: "Laboratoire de Mathématiques et Applications",
      acronyme: "LMA",
      directeur: "Prof. Ahmed BENALI",
      equipes: ["Analyse Fonctionnelle", "Géométrie Différentielle", "Probabilités"],
      description: "Le LMA développe des recherches de pointe en mathématiques pures et appliquées, avec un focus particulier sur l'analyse fonctionnelle et ses applications en physique mathématique.",
      domaines: ["Mathématiques", "Analyse", "Géométrie"]
    },
    {
      nom: "Laboratoire de Physique de la Matière Condensée",
      acronyme: "LPMC",
      directeur: "Prof. Fatima ZAHRA",
      equipes: ["Physique des Matériaux", "Optique Quantique", "Nanotechnologies"],
      description: "Le LPMC se consacre à l'étude des propriétés fondamentales de la matière condensée et au développement de nouveaux matériaux aux propriétés exceptionnelles.",
      domaines: ["Physique", "Matériaux", "Nanotechnologies"]
    },
    {
      nom: "Laboratoire de Chimie Organique et Analytique",
      acronyme: "LCOA",
      directeur: "Prof. Mohamed ALAMI",
      equipes: ["Synthèse Organique", "Chimie Analytique", "Chimie Verte"],
      description: "Le LCOA développe de nouvelles méthodes de synthèse respectueuses de l'environnement et met au point des techniques analytiques innovantes.",
      domaines: ["Chimie", "Environnement", "Synthèse"]
    },
    {
      nom: "Laboratoire de Biologie Moléculaire et Cellulaire",
      acronyme: "LBMC",
      directeur: "Prof. Aicha MERNISSI",
      equipes: ["Génétique Moléculaire", "Biologie Cellulaire", "Biotechnologies"],
      description: "Le LBMC étudie les mécanismes fondamentaux du vivant au niveau moléculaire et cellulaire, avec des applications en biotechnologie et médecine.",
      domaines: ["Biologie", "Génétique", "Biotechnologies"]
    },
    {
      nom: "Laboratoire d'Informatique et Systèmes",
      acronyme: "LIS",
      directeur: "Prof. Omar BENALI",
      equipes: ["Intelligence Artificielle", "Systèmes Distribués", "Sécurité Informatique"],
      description: "Le LIS développe des solutions innovantes en informatique avec un focus sur l'IA, les systèmes distribués et la cybersécurité.",
      domaines: ["Informatique", "IA", "Sécurité"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Structures de Recherche
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            La Faculté des Sciences de Rabat abrite plusieurs laboratoires de recherche de renommée 
            internationale, couvrant l'ensemble des disciplines scientifiques.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {structures.map((structure, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-[#006be5] mb-2">
                      {structure.nom}
                    </CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {structure.acronyme}
                    </Badge>
                  </div>
                  <Building className="h-8 w-8 text-[#006be5]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>Directeur: {structure.directeur}</span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {structure.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Équipes de recherche:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {structure.equipes.map((equipe, idx) => (
                        <li key={idx}>{equipe}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Microscope className="h-4 w-4" />
                      Domaines:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {structure.domaines.map((domaine, idx) => (
                        <Badge key={idx} variant="outline">
                          {domaine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="bg-[#006be5] text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Rejoignez nos équipes de recherche
              </h3>
              <p className="text-lg opacity-90 mb-6">
                La FSR accueille des chercheurs nationaux et internationaux dans ses laboratoires. 
                Découvrez les opportunités de collaboration et de formation doctorale.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-[#006be5]">
                  Formation Doctorale
                </Badge>
                <Badge variant="secondary" className="text-[#006be5]">
                  Collaborations Internationales
                </Badge>
                <Badge variant="secondary" className="text-[#006be5]">
                  Projets de Recherche
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StructuresRecherche;
