
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Atom, Beaker, Dna, Monitor, Zap } from "lucide-react";

const DomainesRecherche = () => {
  const domaines = [
    {
      nom: "Mathématiques et Applications",
      icon: Brain,
      couleur: "bg-blue-100 text-blue-800",
      description: "Recherche fondamentale et appliquée en mathématiques pures, analyse numérique, probabilités et statistiques.",
      sousdomaines: [
        "Analyse Fonctionnelle",
        "Géométrie Différentielle", 
        "Probabilités et Statistiques",
        "Mathématiques Appliquées",
        "Modélisation Mathématique"
      ],
      projets: 15,
      publications: 45
    },
    {
      nom: "Physique Fondamentale et Appliquée",
      icon: Atom,
      couleur: "bg-purple-100 text-purple-800",
      description: "Étude des phénomènes physiques fondamentaux et développement d'applications technologiques innovantes.",
      sousdomaines: [
        "Physique Quantique",
        "Physique de la Matière Condensée",
        "Optique et Photonique",
        "Physique des Matériaux",
        "Énergies Renouvelables"
      ],
      projets: 18,
      publications: 52
    },
    {
      nom: "Chimie et Sciences des Matériaux",
      icon: Beaker,
      couleur: "bg-green-100 text-green-800",
      description: "Synthèse de nouveaux composés, caractérisation des matériaux et développement de procédés chimiques verts.",
      sousdomaines: [
        "Chimie Organique",
        "Chimie Inorganique",
        "Chimie Analytique",
        "Sciences des Matériaux",
        "Chimie Verte"
      ],
      projets: 22,
      publications: 38
    },
    {
      nom: "Sciences Biologiques et Biotechnologies",
      icon: Dna,
      couleur: "bg-red-100 text-red-800",
      description: "Recherche en biologie moléculaire, génétique et développement d'applications biotechnologiques.",
      sousdomaines: [
        "Biologie Moléculaire",
        "Génétique",
        "Microbiologie",
        "Biotechnologies",
        "Biologie Cellulaire"
      ],
      projets: 20,
      publications: 41
    },
    {
      nom: "Informatique et Technologies de l'Information",
      icon: Monitor,
      couleur: "bg-orange-100 text-orange-800",
      description: "Développement d'algorithmes, intelligence artificielle, systèmes distribués et cybersécurité.",
      sousdomaines: [
        "Intelligence Artificielle",
        "Systèmes Distribués",
        "Cybersécurité",
        "Traitement d'Images",
        "Réseaux de Télécommunications"
      ],
      projets: 25,
      publications: 35
    },
    {
      nom: "Sciences de l'Environnement",
      icon: Zap,
      couleur: "bg-teal-100 text-teal-800",
      description: "Étude des écosystèmes, changement climatique, pollution et développement durable.",
      sousdomaines: [
        "Écologie",
        "Sciences du Climat",
        "Pollution Environnementale",
        "Développement Durable",
        "Énergies Propres"
      ],
      projets: 12,
      publications: 28
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Domaines de Recherche
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            La FSR mène des recherches de pointe dans six grands domaines scientifiques, 
            contribuant à l'avancement des connaissances et au développement technologique.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {domaines.map((domaine, index) => {
            const IconComponent = domaine.icon;
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-full ${domaine.couleur}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-[#006be5]">
                      {domaine.nom}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {domaine.description}
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        Sous-domaines:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {domaine.sousdomaines.map((sousdomaine, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {sousdomaine}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#006be5]">
                          {domaine.projets}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Projets actifs
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#006be5]">
                          {domaine.publications}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Publications 2024
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-r from-[#006be5] to-blue-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Recherche Interdisciplinaire
              </h3>
              <p className="opacity-90 mb-4">
                Nos équipes collaborent activement entre les différents domaines 
                pour développer des approches innovantes et résoudre des défis complexes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[#006be5]">
                  Bioinformatique
                </Badge>
                <Badge variant="secondary" className="text-[#006be5]">
                  Chimie Quantique
                </Badge>
                <Badge variant="secondary" className="text-[#006be5]">
                  Physique Biologique
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Innovation et Transfert
              </h3>
              <p className="opacity-90 mb-4">
                Nos recherches débouchent sur des innovations concrètes 
                et des collaborations avec le secteur industriel.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-green-600">
                  Brevets
                </Badge>
                <Badge variant="secondary" className="text-green-600">
                  Start-ups
                </Badge>
                <Badge variant="secondary" className="text-green-600">
                  Partenariats
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

export default DomainesRecherche;
