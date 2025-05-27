
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Cpu, FlaskConical, Zap, Camera, Settings } from "lucide-react";

const PlateformesTechniques = () => {
  const plateformes = [
    {
      nom: "Plateforme de Microscopie",
      description: "Équipements de microscopie électronique et optique de pointe",
      equipements: [
        "Microscope électronique à balayage (MEB)",
        "Microscope électronique à transmission (MET)",
        "Microscope confocal",
        "Microscope à force atomique (AFM)"
      ],
      icon: Microscope,
      color: "bg-blue-500"
    },
    {
      nom: "Plateforme Informatique",
      description: "Infrastructures de calcul haute performance et développement",
      equipements: [
        "Cluster de calcul parallèle",
        "Serveurs de développement",
        "Stations de travail spécialisées",
        "Logiciels de simulation scientifique"
      ],
      icon: Cpu,
      color: "bg-green-500"
    },
    {
      nom: "Plateforme d'Analyse Chimique",
      description: "Instruments d'analyse et de caractérisation chimique",
      equipements: [
        "Spectromètre de masse",
        "RMN haute résolution",
        "Chromatographe en phase gazeuse",
        "Spectrophotomètre UV-Visible"
      ],
      icon: FlaskConical,
      color: "bg-purple-500"
    },
    {
      nom: "Plateforme Électronique",
      description: "Équipements de mesure et test électronique",
      equipements: [
        "Analyseur de spectre",
        "Générateur de signaux",
        "Oscilloscope numérique",
        "Analyseur de réseaux"
      ],
      icon: Zap,
      color: "bg-orange-500"
    },
    {
      nom: "Plateforme d'Imagerie",
      description: "Systèmes d'acquisition et traitement d'images scientifiques",
      equipements: [
        "Caméras haute résolution",
        "Système d'imagerie thermique",
        "Scanner 3D",
        "Logiciels de traitement d'image"
      ],
      icon: Camera,
      color: "bg-red-500"
    },
    {
      nom: "Plateforme Mécanique",
      description: "Équipements d'usinage et de fabrication de précision",
      equipements: [
        "Machines-outils CNC",
        "Imprimante 3D professionnelle",
        "Banc d'essais mécaniques",
        "Équipements de métrologie"
      ],
      icon: Settings,
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Plateformes Techniques
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La FSR dispose de plateformes techniques de pointe mettant à disposition 
            des équipements scientifiques de haute technologie pour la recherche et la formation.
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-12 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#006be5] mb-6">
                Des Équipements d'Excellence au Service de la Recherche
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Nos plateformes techniques constituent un atout majeur pour la qualité 
                de la recherche menée à la FSR. Elles offrent un accès privilégié à 
                des technologies de pointe dans différents domaines scientifiques.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-xl font-bold text-[#006be5] mb-2">6+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Plateformes Actives</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#006be5] mb-2">50+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Équipements Majeurs</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#006be5] mb-2">200+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Utilisateurs/An</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plateformes */}
        <div className="grid md:grid-cols-2 gap-8">
          {plateformes.map((plateforme, index) => {
            const IconComponent = plateforme.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${plateforme.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[#006be5]">
                    {plateforme.nom}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {plateforme.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Équipements Disponibles :
                  </h4>
                  <ul className="space-y-2">
                    {plateforme.equipements.map((equipement, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-[#006be5] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {equipement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Accès et tarification */}
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Accès aux Plateformes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Procédure d'Accès
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#006be5] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                      1
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Demande d'accès via le formulaire en ligne
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#006be5] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                      2
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Validation du projet par le responsable de plateforme
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#006be5] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                      3
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Formation sur les équipements si nécessaire
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#006be5] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                      4
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Planification et réalisation des analyses
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Tarification
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#006be5] mb-2">Utilisateurs Internes</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Tarifs préférentiels pour les enseignants-chercheurs et étudiants de la FSR
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">Partenaires Académiques</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Tarifs négociés dans le cadre de collaborations de recherche
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-600 mb-2">Secteur Privé</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Tarifs de prestation pour les entreprises et organismes privés
                    </p>
                  </div>
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

export default PlateformesTechniques;
