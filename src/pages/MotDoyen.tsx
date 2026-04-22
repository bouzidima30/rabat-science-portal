
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import doyenImage from "@/assets/doyen.jpg";

const MotDoyen = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mot du Doyen
          </h1>
          <div className="w-24 h-1 bg-[#006be5] mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start mb-6">
                  <Quote className="h-8 w-8 text-[#006be5] mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Ce mot se veut avant tout un engagement personnel et une invitation adressée à
                      l'ensemble des étudiants, enseignants-chercheurs, personnels administratifs et
                      partenaires institutionnels à œuvrer collectivement pour la promotion et le
                      rayonnement de la Faculté des Sciences de Rabat, dans une dynamique de continuité
                      et de renouveau.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Parler de la Faculté des Sciences de Rabat, c'est évoquer l'histoire du premier
                      établissement marocain d'enseignement supérieur et de recherche scientifique,
                      reconnu pour l'excellence de ses réalisations, l'ambition de ses projets et son
                      rayonnement constant aux niveaux national et international. Elle a formé des
                      générations de scientifiques, des chercheurs confirmés, ainsi que des compétences
                      de haut niveau, mises au service de la société marocaine.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Dans un contexte marqué par des transformations profondes, une course accrue à
                      l'innovation et un renouvellement permanent des savoirs, notre faculté est
                      appelée à renforcer son agilité et l'efficacité de son action à travers une
                      gouvernance intelligente, fondée sur la culture du résultat, la responsabilité,
                      la transparence, la participation, l'inclusion et le suivi-évaluation.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Nous entamons aujourd'hui une nouvelle phase majeure de transformation de
                      l'enseignement supérieur, portée par une vision nationale ambitieuse, insufflée
                      par les Hautes Orientations Royales, la stratégie Maroc Digital 2030 et le projet
                      de développement de l'Université Mohammed V. Cette dynamique nous invite à
                      repenser notre stratégie académique, scientifique et administrative.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      C'est dans ce cadre que s'inscrit notre Projet de Développement de l'Établissement
                      (PDE) 2025-2029. Fondé sur un diagnostic rigoureux, il propose une feuille de
                      route claire et structurée visant à renforcer le rayonnement et l'attractivité de
                      notre institution, à améliorer l'offre et la qualité des formations, et à
                      consolider notre position en tant que pôle de recherche de référence.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Sur le plan pédagogique, la croissance des effectifs étudiants, la diversification
                      de notre offre de formation et l'adoption des nouveaux régimes de Licence et de
                      Master nous imposent des défis importants, notamment en matière d'encadrement,
                      d'accompagnement pédagogique, de locaux et de modernisation des infrastructures.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Sur le plan scientifique, notre faculté est appelée à poursuivre son essor, à
                      valoriser son potentiel et à renforcer sa dynamique de recherche en créant des
                      conditions attractives pour accueillir les meilleurs doctorants et
                      enseignants-chercheurs. L'innovation, l'interdisciplinarité et l'ouverture à
                      l'international constituent les piliers de cette nouvelle phase, guidée par
                      l'excellence.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      La réussite de ce projet repose également sur l'adoption d'une gouvernance moderne
                      et agile, soutenue par une digitalisation intégrée, considérée comme un levier
                      stratégique et une condition sine qua non du déploiement du PDE.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Grâce à l'engagement de toutes et de tous, la Faculté des Sciences de Rabat
                      poursuivra son rayonnement et contribuera pleinement au développement scientifique,
                      économique et social de notre pays.
                    </p>

                    <blockquote className="border-l-4 border-[#006be5] pl-4 italic text-gray-600 dark:text-gray-400 my-6">
                      « La réforme judicieuse du système d'éducation et de formation est la voie
                      essentielle à emprunter pour relever les défis du développement […] nous n'avons
                      d'autre choix que de promouvoir la recherche et l'innovation, et d'assurer la mise
                      à niveau de nos ressources humaines, qui représentent notre principal atout. »
                      <footer className="text-sm not-italic mt-2 text-gray-500">
                        — Sa Majesté le Roi Mohammed VI, Discours du Trône, 30 juillet 2009
                      </footer>
                    </blockquote>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Œuvrons ensemble pour une faculté inclusive, innovante et tournée vers l'avenir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <img
                    src={doyenImage}
                    alt="Pr. Redouane Benaini, Doyen de la Faculté des Sciences de Rabat"
                    className="w-40 h-40 object-cover rounded-full mx-auto mb-4 shadow-md ring-4 ring-[#006be5]/10"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Pr. Redouane Benaini
                  </h3>
                  <p className="text-[#006be5] font-medium mb-4">
                    Doyen de la Faculté des Sciences
                  </p>
                  <div className="text-left space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Mandat :</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Depuis 2025
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Vision :</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Projet de Développement de l'Établissement (PDE) 2025-2029
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Email :</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        decanat@fsr.ac.ma
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MotDoyen;
