
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Award, Building, Globe } from "lucide-react";

const FSRChiffres = () => {
  const statistics = [
    {
      title: "Étudiants",
      value: "8,500+",
      description: "Étudiants inscrits",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Enseignants",
      value: "350+",
      description: "Enseignants-chercheurs",
      icon: GraduationCap,
      color: "bg-green-500"
    },
    {
      title: "Formations",
      value: "45+",
      description: "Filières proposées",
      icon: BookOpen,
      color: "bg-purple-500"
    },
    {
      title: "Diplômés",
      value: "2,000+",
      description: "Diplômés par an",
      icon: Award,
      color: "bg-orange-500"
    },
    {
      title: "Laboratoires",
      value: "25+",
      description: "Laboratoires de recherche",
      icon: Building,
      color: "bg-red-500"
    },
    {
      title: "Partenariats",
      value: "50+",
      description: "Partenaires internationaux",
      icon: Globe,
      color: "bg-teal-500"
    }
  ];

  const departmentData = [
    { name: "Mathématiques", students: 1200, teachers: 45 },
    { name: "Physique", students: 1100, teachers: 42 },
    { name: "Chimie", students: 950, teachers: 38 },
    { name: "Biologie", students: 1300, teachers: 48 },
    { name: "Géologie", students: 800, teachers: 35 },
    { name: "Informatique", students: 1400, teachers: 52 },
    { name: "Sciences de la Terre", students: 750, teachers: 30 }
  ];

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
