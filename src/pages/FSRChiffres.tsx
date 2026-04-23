
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Award, Building, Globe, Briefcase, FlaskConical, Library, FileText, Trophy, Network } from "lucide-react";

const FSRChiffres = () => {
  const ressourcesHumaines = [
    { title: "Enseignants-chercheurs", value: "380", description: "Dont près des 2/3 sont des professeurs de l'enseignement supérieur", icon: GraduationCap, color: "bg-blue-500" },
    { title: "Personnel administratif", value: "99", description: "Administratifs", icon: Briefcase, color: "bg-cyan-500" },
  ];

  const effectifsEtudiants = [
    { title: "Licence", value: "8 494", description: "Étudiants inscrits en Licence", icon: Users, color: "bg-blue-500" },
    { title: "Master", value: "1 300", description: "Étudiants inscrits en Master", icon: Users, color: "bg-green-500" },
    { title: "Doctorat National", value: "2 300", description: "Étudiants inscrits en Doctorat National (UFR et CEDoc)", icon: Users, color: "bg-purple-500" },
    { title: "Doctorat d'État", value: "157", description: "Étudiants en Doctorat d'État", icon: Users, color: "bg-orange-500" },
    { title: "Temps aménagé", value: "250", description: "Étudiants en temps aménagé", icon: Users, color: "bg-rose-500" },
  ];

  const formations = [
    { title: "Formations fondamentales", value: "20", description: "Filières fondamentales", icon: BookOpen, color: "bg-blue-500" },
    { title: "Formations professionnelles", value: "12", description: "Filières professionnelles", icon: BookOpen, color: "bg-green-500" },
    { title: "Masters en temps aménagés", value: "2", description: "Masters en temps aménagés", icon: BookOpen, color: "bg-purple-500" },
    { title: "Formation doctorale", value: "1", description: "Formation doctorale pluridisciplinaire", icon: GraduationCap, color: "bg-orange-500" },
  ];

  const recherche = [
    { title: "Départements", value: "6", description: "Départements d'enseignement et de recherche", icon: Building, color: "bg-blue-500" },
    { title: "Pôles de compétence", value: "7", description: "Pôles sur 16 nationaux", icon: Network, color: "bg-green-500" },
    { title: "Centres de recherche", value: "5", description: "14 laboratoires et 18 équipes", icon: FlaskConical, color: "bg-purple-500" },
    { title: "Conventions", value: "100+", description: "Conventions nationales et internationales", icon: Globe, color: "bg-teal-500" },
  ];

  const bibliotheque = [
    { title: "Thèses de Doctorat", value: "5 207", description: "Thèses de 3ème cycle et de Doctorat d'État", icon: FileText, color: "bg-blue-500" },
    { title: "Ouvrages", value: "28 783+", description: "Ouvrages disponibles", icon: Library, color: "bg-green-500" },
    { title: "Périodiques", value: "15 000+", description: "Périodiques pour consultation", icon: BookOpen, color: "bg-purple-500" },
  ];

  const laureats = [
    { title: "Licence", value: "1 000", description: "Titulaires de licence par an", icon: Award, color: "bg-blue-500" },
    { title: "Master", value: "600", description: "Titulaires de Master par an", icon: Award, color: "bg-green-500" },
    { title: "Doctorat National", value: "96", description: "Titulaires de Doctorat national par an", icon: Trophy, color: "bg-purple-500" },
    { title: "Doctorat d'État", value: "11", description: "Titulaires de Doctorat d'État soutenues par an", icon: Trophy, color: "bg-orange-500" },
  ];

  const renderStatGrid = (items: typeof ressourcesHumaines) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-3">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{stat.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            FSR en Chiffres
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            60 ans au service de l'excellence — Découvrez les chiffres clés de la
            Faculté des Sciences de Rabat, témoignant de son rayonnement et de
            son excellence académique.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#006be5] mb-6">Ressources Humaines</h2>
          {renderStatGrid(ressourcesHumaines)}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#006be5] mb-6">Effectifs Étudiants</h2>
          {renderStatGrid(effectifsEtudiants)}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#006be5] mb-6">Offre de Formation</h2>
          {renderStatGrid(formations)}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#006be5] mb-6">Recherche & Coopération</h2>
          {renderStatGrid(recherche)}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#006be5] mb-6">Bibliothèque</h2>
          {renderStatGrid(bibliotheque)}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#006be5] mb-6">Lauréats par an</h2>
          {renderStatGrid(laureats)}
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default FSRChiffres;
