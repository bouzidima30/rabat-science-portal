
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Building, Users, Award, Target, Mail, Phone, MapPin, CheckCircle2, Briefcase, Handshake, FileText, Search } from "lucide-react";

const ValorisationRecherche = () => {
  const missions = [
    {
      texte: "Développer les partenariats et les relations extérieures de la FSR, notamment avec les entreprises, la région, les organismes publics et privés et les autres acteurs socio-économiques.",
      icon: Handshake,
    },
    {
      texte: "Prospecter, organiser et gérer des sessions de formation continue au profit du monde socio-économique en coordination avec les enseignants-chercheurs de la FSR.",
      icon: Users,
    },
    {
      texte: "Prospecter, négocier, rédiger et gérer des contrats de recherche et de prestations de service réalisés par les enseignants-chercheurs de la FSR.",
      icon: FileText,
    },
    {
      texte: "Développer l'esprit entrepreneurial au sein de l'Établissement et faire émerger les projets de création d'entreprises innovantes.",
      icon: Lightbulb,
    },
    {
      texte: "Incuber les projets d'entreprises innovantes.",
      icon: Building,
    },
    {
      texte: "Faciliter le transfert des résultats de la recherche vers le milieu socio-économique.",
      icon: TrendingUp,
    },
    {
      texte: "Accompagner les inventeurs dans la démarche d'acquisition du droit d'auteur par la protection de la propriété intellectuelle (dépôt d'un brevet, d'un modèle ou d'une invention).",
      icon: Award,
    },
    {
      texte: "Assurer des activités de veille scientifique, technologique et économique.",
      icon: Search,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Valorisation de la Recherche
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La structure de valorisation de la recherche « SV-Sciences » de la Faculté des Sciences de Rabat,
            interface entre l'Université et l'Entreprise.
          </p>
        </div>

        {/* Présentation */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5] flex items-center justify-center">
              <Target className="h-6 w-6 mr-2" />
              Présentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
              <p>
                Animée d'une ferme volonté et fidèle à son engagement, la Faculté des Sciences de Rabat,
                l'un des leviers historiques du rebond économique, s'est assignée, entre autres, la mission
                de développer des outils de valorisation, de permettre leur appropriation par les chercheurs
                à travers des campagnes de sensibilisation et d'accompagner la maturation des projets des chercheurs.
              </p>
              <p>
                Fortement impliquée dans les projets prioritaires, la Faculté des Sciences de Rabat définit
                sa stratégie de valorisation en collaboration étroite avec ses partenaires socio-économiques
                par l'intermédiaire de l'interface de la <strong>structure de la valorisation de la recherche</strong> à
                la FSR « <strong>la SV-Sciences</strong> ».
              </p>
              <p>
                Cette structure s'inscrit dans le cadre de la réforme universitaire qui vise à doter les
                universités marocaines d'interfaces « Université-Entreprise » en vue de promouvoir la nouvelle
                mission citoyenne et entrepreneuriale de l'Université.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missions de la SV-Sciences */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Les principales missions de la SV-Sciences
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {missions.map((mission, index) => {
              const IconComponent = mission.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#006be5]/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-[#006be5]" />
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {mission.texte}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <Card className="shadow-lg bg-gradient-to-br from-[#006be5] to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center">
              <Briefcase className="h-6 w-6 mr-2" />
              Contact SV-Sciences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Adresse</h4>
                  <p className="text-sm opacity-90">
                    Faculté des Sciences Rabat<br />
                    Avenue Ibn Batouta, B.P. 1014
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Téléphone</h4>
                  <p className="text-sm opacity-90">
                    Tél. : +212 37 77 80 12<br />
                    Fax : +212 37 77 54 61
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a
                    href="mailto:interface-sciences@fsr.ac.ma"
                    className="text-sm opacity-90 hover:opacity-100 underline break-all"
                  >
                    interface-sciences@fsr.ac.ma
                  </a>
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

export default ValorisationRecherche;
