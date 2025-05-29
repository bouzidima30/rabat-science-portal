
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, GraduationCap, Award, Users } from "lucide-react";

const LMDGuide = () => {
  const cycles = [
    {
      nom: "Licence",
      duree: "3 ans (6 semestres)",
      description: "Formation fondamentale dans les disciplines scientifiques",
      objectifs: [
        "Acquérir les bases scientifiques fondamentales",
        "Développer l'esprit d'analyse et de synthèse",
        "Préparer aux études de Master ou à l'insertion professionnelle"
      ],
      validation: "120 crédits minimum requis"
    },
    {
      nom: "Master",
      duree: "2 ans (4 semestres)",
      description: "Spécialisation et approfondissement des connaissances",
      objectifs: [
        "Approfondir les connaissances dans un domaine spécialisé",
        "Initiation à la recherche scientifique",
        "Préparation aux études doctorales ou insertion professionnelle"
      ],
      validation: "120 crédits minimum requis"
    },
    {
      nom: "Doctorat",
      duree: "3 ans minimum",
      description: "Formation par et pour la recherche",
      objectifs: [
        "Conduire des travaux de recherche originaux",
        "Développer l'autonomie scientifique",
        "Contribuer à l'avancement des connaissances"
      ],
      validation: "Soutenance de thèse"
    }
  ];

  const procedures = [
    {
      titre: "Inscription Semestrielle",
      description: "Procédure d'inscription pour chaque semestre",
      etapes: [
        "Vérification des prérequis",
        "Choix des modules",
        "Validation pédagogique",
        "Paiement des frais"
      ]
    },
    {
      titre: "Validation des Acquis",
      description: "Modalités de validation des semestres",
      etapes: [
        "Note minimale de 10/20 par module",
        "Compensation possible entre modules",
        "Rattrapage pour les modules non validés",
        "Capitalisation des crédits acquis"
      ]
    },
    {
      titre: "Affichage des Résultats",
      description: "Consultation et contestation des notes",
      etapes: [
        "Publication des résultats",
        "Délai de contestation (48h)",
        "Demande de révision si nécessaire",
        "Confirmation définitive"
      ]
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
            LMD : Mode d'emploi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Le guide LMD de la Faculté des Sciences de Rabat présente l'organisation des cycles 
            Licence, Master et Doctoral, ainsi que les règles de validation de chaque semestre 
            et l'obtention des diplômes. Il détaille en outre les procédures pratiques d'affichage 
            des notes, de l'inscription au semestre, garantissant transparence et suivi du parcours 
            académique des étudiants.
          </p>
        </div>

        {/* Guide téléchargeable */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5] flex items-center justify-center">
              <BookOpen className="h-6 w-6 mr-2" />
              Guide LMD Complet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Téléchargez le guide complet du système LMD pour avoir toutes les informations 
              détaillées sur les procédures et règlements.
            </p>
            <Button className="bg-[#006be5] hover:bg-[#0056b3]">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le Guide LMD (PDF)
            </Button>
          </CardContent>
        </Card>

        {/* Les trois cycles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Les Trois Cycles LMD
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {cycles.map((cycle, index) => {
              const icons = [GraduationCap, Award, Users];
              const IconComponent = icons[index];
              const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${colors[index]} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-[#006be5]">
                      {cycle.nom}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {cycle.duree}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {cycle.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Objectifs :
                      </h4>
                      <ul className="space-y-1">
                        {cycle.objectifs.map((objectif, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                            • {objectif}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm font-medium text-[#006be5]">
                        Validation : {cycle.validation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Procédures */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Procédures Importantes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {procedures.map((procedure, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#006be5]">
                    {procedure.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {procedure.description}
                  </p>
                  <div className="space-y-2">
                    {procedure.etapes.map((etape, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-6 h-6 bg-[#006be5] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-xs">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {etape}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Système de crédits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Système de Crédits ECTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Principe des Crédits
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• 1 crédit = 25 à 30 heures de travail étudiant</li>
                  <li>• 30 crédits par semestre (60 par année)</li>
                  <li>• Capitalisation des crédits acquis</li>
                  <li>• Transférabilité entre établissements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Validation des Modules
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Note minimale : 10/20</li>
                  <li>• Compensation possible au sein du semestre</li>
                  <li>• Rattrapage pour les modules &lt; 10/20</li>
                  <li>• Conservation des notes ≥ 10/20</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default LMDGuide;
