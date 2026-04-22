
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, BookOpen, Microscope } from "lucide-react";

const StructuresRecherche = () => {
  const structures = [
    {
      nom: "Centre de Recherche en Sciences Mathématiques et Applications",
      acronyme: "Mathématiques",
      description:
        "Centre de recherche accrédité regroupant les laboratoires et équipes du Département de Mathématiques de la FSR.",
      domaines: ["Analyse", "Algèbre", "Géométrie", "Probabilités"],
    },
    {
      nom: "Centre de Recherche en Sciences Physiques",
      acronyme: "Physique",
      description:
        "Centre de recherche accrédité regroupant les laboratoires en physique fondamentale, hautes énergies, matière condensée et énergies renouvelables.",
      domaines: ["Physique théorique", "Hautes énergies", "Matière condensée"],
    },
    {
      nom: "Centre de Recherche en Sciences Chimiques",
      acronyme: "Chimie",
      description:
        "Centre de recherche accrédité dédié à la chimie organique, inorganique, analytique et aux sciences des matériaux.",
      domaines: ["Chimie organique", "Chimie verte", "Matériaux"],
    },
    {
      nom: "Centre de Recherche en Sciences de la Vie",
      acronyme: "Biologie",
      description:
        "Centre de recherche accrédité couvrant la biologie moléculaire, l'écologie, la microbiologie et les biotechnologies.",
      domaines: ["Biologie moléculaire", "Microbiologie", "Biotechnologies"],
    },
    {
      nom: "Centre de Recherche en Sciences et Technologies de l'Information",
      acronyme: "Informatique & Géosciences",
      description:
        "Centre de recherche accrédité couvrant l'informatique, l'IA, la cybersécurité et les sciences de la Terre.",
      domaines: ["Intelligence artificielle", "Cybersécurité", "Géosciences"],
    },
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
