
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Building, GraduationCap, BookOpen } from "lucide-react";

const Historique = () => {
  const periodes = [
    {
      annee: "1953",
      titre: "Inauguration",
      description: "Inauguration du Centre d'Études Supérieures Scientifiques de Rabat.",
      icon: Building,
    },
    {
      annee: "1956",
      titre: "Conseil National Consultatif",
      description: "Réunions du Conseil National Consultatif au grand amphithéâtre.",
      icon: Users,
    },
    {
      annee: "1957",
      titre: "Institut Supérieur des Sciences",
      description: "Création de l'Institut Supérieur des Sciences.",
      icon: BookOpen,
    },
    {
      annee: "1958",
      titre: "Faculté des Sciences",
      description: "L'institut supérieur des sciences devient « Faculté des Sciences ».",
      icon: Building,
    },
    {
      annee: "1959",
      titre: "Officialisation",
      description: "Officialisation du nom de la Faculté des Sciences de Rabat par le dahir n° 1-58-390 du 15 Moharrem 1379 (21 Juillet 1959).",
      icon: Award,
    },
    {
      annee: "1960",
      titre: "Premier Parlement",
      description: "Réunions du premier parlement marocain au sein du grand amphithéâtre.",
      icon: Users,
    },
    {
      annee: "1997",
      titre: "Formations DESA, DESS, Doctorat",
      description: "Formations aux Diplôme d'Études Supérieures Approfondies (DESA), Diplôme d'Études Supérieures Spécialisées (DESS) et Doctorat National.",
      icon: GraduationCap,
    },
    {
      annee: "2003",
      titre: "Système LMD",
      description: "Mise en place du système Licence-Master-Doctorat (LMD), création d'une douzaine de Licences fondamentales et professionnelles et d'une vingtaine de Masters à vocation recherche et professionnelle.",
      icon: GraduationCap,
    },
    {
      annee: "2008",
      titre: "Création du CeDoc",
      description: "Création du Centre des Études Doctorales en Sciences et Technologies (CeDoc).",
      icon: Award,
    },
  ];

  const chiffres = [
    { label: "Années d'existence", valeur: "70+", description: "Depuis 1953" },
    { label: "Départements", valeur: "6", description: "Académiques" },
    { label: "Cycles de formation", valeur: "LMD", description: "Licence, Master, Doctorat" },
    { label: "Centre Doctoral", valeur: "CeDoc", description: "Depuis 2008" },
  ];

  const doyens = [
    { periode: "1958-1960", nom: "Louis PASQUALINI" },
    { periode: "1960-1963", nom: "Jean DESCHAMPS" },
    { periode: "1963-1969", nom: "Albert SASSON" },
    { periode: "1969-1975", nom: "Abdellatif BENABDEJLIL" },
    { periode: "1975-1985", nom: "Idriss KHALIL" },
    { periode: "1985-1987", nom: "Ahmed KARKOUR" },
    { periode: "1987-1996", nom: "Abderahmane ESSAID" },
    { periode: "1996-1999", nom: "Hajjoub MSOUGAR" },
    { periode: "1999-2005", nom: "Hassan CHLYAH" },
    { periode: "2005-2010", nom: "Wail BENJELLOUN" },
    { periode: "2010-2015", nom: "Saaid AMZAZI" },
    { periode: "2015-2020", nom: "Mourad EL BELKACEMI" },
    { periode: "2020-2025", nom: "Mohammed REGRAGUI" },
    { periode: "2025 à ce jour", nom: "Redouane BENAINI" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Historique de la Faculté
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Depuis sa création, l'histoire de la Faculté des Sciences de Rabat a connu plusieurs
            moments forts et marquants aussi bien du point de vue politique, scientifique que
            pédagogique.
          </p>
        </div>

        {/* Chiffres clés */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {chiffres.map((chiffre, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#006be5] mb-2">
                  {chiffre.valeur}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {chiffre.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {chiffre.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Chronologie Historique
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#006be5] hidden md:block"></div>
            
            <div className="space-y-8">
              {periodes.map((periode, index) => {
                const IconComponent = periode.icon;
                return (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-6 w-4 h-4 bg-[#006be5] rounded-full -ml-2 mt-6"></div>
                    
                    <Card className="md:ml-16 w-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#006be5] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                              <IconComponent className="h-5 w-5 text-[#006be5]" />
                            </div>
                            <CardTitle className="text-xl">
                              {periode.titre}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-[#006be5] text-white">
                            {periode.annee}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {periode.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doyens de la faculté */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Doyens de la Faculté des Sciences
          </h2>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doyens.map((doyen, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <Badge variant="outline" className="mr-3 mt-1 shrink-0">
                      {doyen.periode}
                    </Badge>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {doyen.nom}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission historique */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Mission Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Depuis sa création en 1953, la Faculté des Sciences de Rabat s'est imposée comme
                le premier établissement marocain d'enseignement supérieur et de recherche
                scientifique. Elle a formé des générations de scientifiques, chercheurs et cadres
                qui contribuent aujourd'hui au développement du pays dans tous les secteurs.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Notre faculté continue de porter les valeurs d'excellence, d'innovation et 
                d'ouverture qui ont marqué son histoire, tout en s'adaptant aux défis 
                contemporains de la science et de la technologie.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Historique;
