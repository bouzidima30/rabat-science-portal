
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
            Découvrez les statistiques clés de la Faculté des Sciences de Rabat, 
            témoignant de son rayonnement et de son excellence académique.
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Répartition par département */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Répartition par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Département
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Étudiants
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Enseignants
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {dept.name}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                        {dept.students}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                        {dept.teachers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Évolution et projets */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#006be5]">
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between">
                  <span>Amphithéâtres</span>
                  <span className="font-semibold">12</span>
                </li>
                <li className="flex justify-between">
                  <span>Salles de cours</span>
                  <span className="font-semibold">85</span>
                </li>
                <li className="flex justify-between">
                  <span>Laboratoires</span>
                  <span className="font-semibold">45</span>
                </li>
                <li className="flex justify-between">
                  <span>Bibliothèques</span>
                  <span className="font-semibold">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Centres de recherche</span>
                  <span className="font-semibold">8</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#006be5]">
                Recherche et Innovation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between">
                  <span>Publications scientifiques</span>
                  <span className="font-semibold">450+/an</span>
                </li>
                <li className="flex justify-between">
                  <span>Projets de recherche</span>
                  <span className="font-semibold">120+</span>
                </li>
                <li className="flex justify-between">
                  <span>Thèses soutenues</span>
                  <span className="font-semibold">80+/an</span>
                </li>
                <li className="flex justify-between">
                  <span>Brevets déposés</span>
                  <span className="font-semibold">15+/an</span>
                </li>
                <li className="flex justify-between">
                  <span>Spin-offs créées</span>
                  <span className="font-semibold">5+</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FSRChiffres;
