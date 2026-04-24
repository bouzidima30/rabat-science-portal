
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Building, FlaskConical, Users, Mail, User } from "lucide-react";

type Centre = {
  acronyme: string;
  nom: string;
  responsable: string;
  email: string;
  domaines: string;
};

type Laboratoire = {
  acronyme: string;
  nom: string;
  responsable: string;
  email: string;
  domaines: string;
  centre?: string;
};

type Equipe = {
  acronyme: string;
  nom: string;
  responsable: string;
  email: string;
  domaines: string;
  centre?: string;
};

const centres: Centre[] = [
  {
    acronyme: "CRE",
    nom: "Centre de Recherche en Energie",
    responsable: "Mzerd Ahmed",
    email: "mzerd@yahoo.fr",
    domaines:
      "Matériaux et Nanomatériaux, Composites, Nanocomposites, Couches minces, Mécanique, Énergétique et Énergies renouvelables (Conversion, Stockage, …), Matériaux à haute température (FGM), Modélisation et simulation.",
  },
  {
    acronyme: "CERNE2D",
    nom: "Centre Eau, Ressources Naturelles, Environnement et Développement Durable",
    responsable: "El Hajjaji Souad",
    email: "selhajjaji@hotmail.com",
    domaines:
      "Eau, Ressources Naturelles, Changement climatique, Matériaux, nanomatériaux, Environnement, Développement Durable.",
  },
  {
    acronyme: "CSM",
    nom: "Centre des Sciences des Matériaux",
    responsable: "Halim Mohammed",
    email: "halim@gmail.com",
    domaines:
      "Matériaux et Nanomatériaux, Valorisation des Ressources Naturelles, Biomatériaux, Corrosion, Caractérisation et analyse.",
  },
  {
    acronyme: "CEREMAR",
    nom: "Centre de Recherches Mathématiques et Applications de Rabat",
    responsable: "Zerouali El Hassan",
    email: "zeroualifsr@gmail.com",
    domaines:
      "Analyse, Algèbre, Géométrie, Probabilité, Statistique, Calcul scientifique, Systèmes d'Information et Applications.",
  },
];

const laboratoires: Laboratoire[] = [
  {
    acronyme: "LMNE",
    nom: "Laboratoire des Matériaux, Nanotechnologies et Environnement",
    responsable: "Guenbour Abdallah",
    email: "a_guenbour@yahoo.fr",
    domaines: "Matériaux, Énergie, Catalyse, Corrosion, Nanotechnologies, Environnement",
    centre: "CSM",
  },
  {
    acronyme: "LCAM",
    nom: "Laboratoire de Chimie Appliquée des Matériaux",
    responsable: "El Ammari Lahcen",
    email: "l_elammari@yahoo.fr",
    domaines: "Physico-chimie des matériaux",
    centre: "CSM",
  },
  {
    acronyme: "LS3MN2E",
    nom: "Laboratoire de Spectroscopie, Modélisation Moléculaire, Matériaux, Nanomatériaux, Eau et Environnement",
    responsable: "El Hajjaji Souad",
    email: "selhajjaji@hotmail.com",
    domaines:
      "Spectroscopies et modélisation moléculaire, valorisation de déchets et synthèses de nanomatériaux pour la dépollution de l'eau et du sol, protection des matériaux",
    centre: "CERNE2D",
  },
  {
    acronyme: "L-G2E",
    nom: "Laboratoire de Géosciences, Eau et Environnement",
    responsable: "Kacimi Ilias",
    email: "iliaskacimi@yahoo.fr",
    domaines:
      "Sciences de l'eau, Géosciences côtières, Géomatique, Géologie de l'Ingénieur, Géologie du Quaternaire littoral, Géodynamique des bassins, Océanologie, Paléoclimatologie, Environnement et Aménagement",
    centre: "CERNE2D",
  },
  {
    acronyme: "LABMIA-SI",
    nom: "Laboratoire de Mathématiques, Informatique et Applications, Sécurité de l'Information",
    responsable: "El Hajji Said",
    email: "elhajji.said@gmail.com",
    domaines: "Mathématiques, Informatique et Applications - Sécurité de l'Information",
    centre: "CEREMAR",
  },
  {
    acronyme: "LAMA",
    nom: "Laboratoire Analyse Mathématique et Applications",
    responsable: "Raissi Nadia",
    email: "nadiaraissi11@gmail.com",
    domaines: "Recherche fondamentale et appliquée en Analyse Mathématique",
    centre: "CEREMAR",
  },
  {
    acronyme: "LMSA",
    nom: "Laboratoire de Mathématiques, Statistique et Applications",
    responsable: "Zoglat Abdelhak",
    email: "azoglat@gmail.com",
    domaines: "Mathématiques, Statistique et Applications",
    centre: "CEREMAR",
  },
  {
    acronyme: "BGCG",
    nom: "Laboratoire de Biodiversité, Écologie et Génome",
    responsable: "Benhoussa Abdelaziz",
    email: "benhoussa@fsr.ac.ma",
    domaines:
      "Écologie, Génétique, Parasitologie, Biologie marine, Écotoxicologie, Biodiversité et fonctionnement des écosystèmes",
    centre: "BIOBIO",
  },
  {
    acronyme: "LAMCSCI",
    nom: "Laboratoire de Matière Condensée et Sciences Interdisciplinaires",
    responsable: "Ez-Zahraouy Hamid",
    email: "ezahamid@gmail.com",
    domaines: "Matière Condensée et Sciences Interdisciplinaires",
  },
  {
    acronyme: "LCS",
    nom: "Laboratoire Conception et Systèmes (électronique, signaux et informatique)",
    responsable: "Ettouhami Aziz",
    email: "ettouhami@fsr.ac.ma",
    domaines: "Électronique, Signaux et Informatique",
  },
  {
    acronyme: "LIRT",
    nom: "Laboratoire de Recherche en Informatique et Télécommunications",
    responsable: "—",
    email: "",
    domaines: "Informatique et Télécommunications",
  },
  {
    acronyme: "LERSG",
    nom: "Laboratoire d'Études et de Recherche en Sciences de Gestion",
    responsable: "—",
    email: "",
    domaines: "Sciences de Gestion",
  },
  {
    acronyme: "BIOPATH",
    nom: "Laboratoire de Biologie des Pathologies Humaines",
    responsable: "—",
    email: "",
    domaines: "Biologie des pathologies humaines",
  },
];

const equipes: Equipe[] = [
  {
    acronyme: "MANAPSE",
    nom: "Matériaux, Nanomatériaux pour la Conversion photovoltaïque et le Stockage Électrochimique",
    responsable: "Abd-lefdil Mohammed",
    email: "Abdlefdil@gmail.com",
    domaines:
      "Conversion Photovoltaïque, Batteries Rechargeables et Matériaux pour l'Énergie et le Stockage",
    centre: "CRE",
  },
  {
    acronyme: "MSME",
    nom: "Modélisation et Simulation en Mécanique et Énergétique",
    responsable: "Gueraoui Kamal",
    email: "kgueraoui@yahoo.fr",
    domaines: "Mécanique des Fluides et des Structures",
    centre: "CRE",
  },
  {
    acronyme: "EMM",
    nom: "Mécanique et des Matériaux",
    responsable: "Bensalah Mohammed Ouadi",
    email: "bensalahouadi@gmail.com",
    domaines:
      "Mécanique des Matériaux, Composites et Nanocomposites, Mécanique des Fluides et Mécanique des Structures pour le Bâtiment et le Génie Civil",
    centre: "CRE",
  },
  {
    acronyme: "PRESN",
    nom: "Énergétique et Physique des Réacteurs Nucléaires, Sécurité Nucléaire et Environnement",
    responsable: "Chetaine Abdelouahid",
    email: "chetaine@fsr.ac.ma",
    domaines:
      "Physique Nucléaire, Physique des Réacteurs, Environnement, Sécurité Nucléaire et Radioprotection",
    centre: "CRE",
  },
  {
    acronyme: "STCE",
    nom: "Semi-conducteurs et Technologie des Capteurs pour l'Environnement",
    responsable: "Mzerd Ahmed",
    email: "mzerd@yahoo.fr",
    domaines: "Physique des Matériaux",
    centre: "CRE",
  },
  {
    acronyme: "TE",
    nom: "Thermodynamique - Énergétique",
    responsable: "Samaouali Abderrahim",
    email: "abderrahimsamaouali@yahoo.fr",
    domaines:
      "Énergie Renouvelable, Matériaux, Géo-matériaux et Efficacité Énergétique du Bâtiment, Géo-ressources, Didactique des Sciences et de l'Énergie",
    centre: "CRE",
  },
  {
    acronyme: "LPHE-MS",
    nom: "Physique des Hautes Énergies - Modélisation et Simulation",
    responsable: "Saidi El Hassane",
    email: "hassanin@fsr.ac.ma",
    domaines:
      "Physique des Hautes Énergies, Théorie des champs, Théorie des Cordes, Cryptographie et Information quantique, Nouveaux matériaux et Applications, Physique Médicale et Environnement",
  },
  {
    acronyme: "EESE",
    nom: "Énergie Solaire et Environnement",
    responsable: "Bargach Mohammed Najib",
    email: "bargach@fsr.ac.ma",
    domaines: "Énergétique",
    centre: "CRE",
  },
  {
    acronyme: "ESMAR",
    nom: "Science de la Matière et du Rayonnement",
    responsable: "Tayalati Yahya",
    email: "Yahya.Tayalati@cern.ch",
    domaines: "Science de la Matière et du Rayonnement",
  },
  {
    acronyme: "GRAAF",
    nom: "Groupe d'Algèbre et d'Analyse Fonctionnelle",
    responsable: "Zine el Abidine Abdelali",
    email: "zineelabidineabdelali@gmail.com",
    domaines: "Algèbre, Analyse Fonctionnelle",
    centre: "CEREMAR",
  },
  {
    acronyme: "ECSSN",
    nom: "Calcul Stochastique, Statistique et Numérique",
    responsable: "Belbachir Mohammadine",
    email: "mohammadine.belbachir@gmail.com",
    domaines:
      "Statistique, Stochastique, Calcul Numérique, Équations Différentielles",
    centre: "CEREMAR",
  },
  {
    acronyme: "ANLIMAD",
    nom: "Analyse Non Linéaire, Modélisation et Aide à la Décision",
    responsable: "El Khattabi Noha",
    email: "nohakhatabi@yahoo.fr",
    domaines:
      "Analyse Non Linéaire et applications aux problématiques de développement",
    centre: "CEREMAR",
  },
  {
    acronyme: "AGS",
    nom: "Analyse et Géométrie Spectrale",
    responsable: "Ghanmi Allal",
    email: "allaghanmi@gmail.com",
    domaines:
      "Analyse Réelle et Complexe, Analyse Hypercomplexe, Analyse de Fourier, Polynômes orthogonaux et Fonctions Spéciales, Interpolation et Échantillonnage, Géométrie Spectrale",
    centre: "CEREMAR",
  },
  {
    acronyme: "AGA",
    nom: "Algèbre, Géométrie et Applications",
    responsable: "El Mostafa Jabbouri",
    email: "jabbouri0003@gmail.com",
    domaines: "Algèbre, Géométrie et Applications",
    centre: "CEREMAR",
  },
  {
    acronyme: "CCSI",
    nom: "Codes, Cryptologie et Sécurité de l'Information",
    responsable: "El Mamoun Souidi",
    email: "souidi@fsr.ac.ma",
    domaines:
      "Sécurité multi-niveaux des réseaux informatiques, sécurité des réseaux émergents, sécurité des données, codes correcteurs d'erreurs, cryptologie et stéganographie",
    centre: "CEREMAR",
  },
  {
    acronyme: "MSO",
    nom: "Modélisation, Simulation et Optimisation",
    responsable: "Souad El Bernoussi",
    email: "souad.elbernoussi@gmail.com",
    domaines:
      "Modélisation mathématique et simulation numérique, optimisation combinatoire et recherche opérationnelle, méthodes heuristiques et métaheuristiques",
    centre: "CEREMAR",
  },
  {
    acronyme: "IMIARF",
    nom: "Informatique, Mathématiques Appliquées, Intelligence Artificielle et Reconnaissance de Formes",
    responsable: "Himmi Mohammed Majid",
    email: "himmi.fsr@gmail.com",
    domaines:
      "Mathématiques Appliquées, Informatique, Reconnaissance de Formes, Intelligence Artificielle, Télécommunications, Robotique",
  },
  {
    acronyme: "BOVAREF",
    nom: "Botanique et Valorisation des Ressources Végétales et Fongiques",
    responsable: "Arahou Moustapha",
    email: "arahou_moustapha@hotmail.com",
    domaines:
      "Botanique, Mycologie, Algologie, Phytopathologie, Biosystématique, Ethnobotanique, Écologie et Télédétection",
    centre: "BIOBIO",
  },
  {
    acronyme: "BIOPV",
    nom: "Biotechnologie et Physiologie Végétales",
    responsable: "Bendaou Najib",
    email: "najib.bendaou@gmail.com",
    domaines:
      "Biotechnologie Végétale, Physiologie des stress abiotiques, Amélioration Génétique des Végétaux, Transgenèse Végétale",
    centre: "BIOBIO",
  },
  {
    acronyme: "EMBM",
    nom: "Microbiologie et Biologie Moléculaire",
    responsable: "Filali Maltouf Abdelkarim",
    email: "",
    domaines: "Microbiologie et Biologie Moléculaire",
    centre: "BIOBIO",
  },
  {
    acronyme: "IPSS",
    nom: "Intelligent Processing And Security of Systems",
    responsable: "Omary Fouzia",
    email: "omaryfouzia@gmail.com",
    domaines: "Informatique",
  },
];

const StructureCard = ({
  acronyme,
  nom,
  responsable,
  email,
  domaines,
  centre,
  icon: Icon,
}: {
  acronyme: string;
  nom: string;
  responsable: string;
  email: string;
  domaines: string;
  centre?: string;
  icon: typeof Building;
}) => (
  <AccordionItem value={acronyme} className="border rounded-lg px-4 bg-white dark:bg-gray-800">
    <AccordionTrigger className="hover:no-underline py-4">
      <div className="flex items-start gap-3 text-left flex-1">
        <div className="flex-shrink-0 w-10 h-10 bg-[#006be5]/10 rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#006be5]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="default" className="bg-[#006be5]">{acronyme}</Badge>
            {centre && (
              <Badge variant="outline" className="text-xs">
                Adhésion : {centre}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{nom}</h3>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="pt-2 pb-4">
      <div className="space-y-3 pl-13 ml-13">
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-[#006be5] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Responsable : </span>
              <span className="text-gray-700 dark:text-gray-300">{responsable}</span>
            </div>
          </div>
          {email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-[#006be5] mt-0.5 flex-shrink-0" />
              <a
                href={`mailto:${email}`}
                className="text-[#006be5] hover:underline break-all"
              >
                {email}
              </a>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Domaines de recherche :
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {domaines}
          </p>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
);

const StructuresRecherche = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Structures de Recherche
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Vous trouverez ci-dessous l'ensemble des structures de recherche adossées à
            la Faculté des Sciences de Rabat ainsi que celles auxquelles certains
            chercheurs de l'établissement sont attachés.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          <Card className="text-center bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <Building className="h-6 w-6 text-[#006be5] mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#006be5]">{centres.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Centres</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <FlaskConical className="h-6 w-6 text-[#006be5] mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#006be5]">{laboratoires.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Laboratoires</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-[#006be5] mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#006be5]">{equipes.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Équipes</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="centres" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
            <TabsTrigger value="centres" className="py-2">
              <Building className="h-4 w-4 mr-2" />
              Centres
            </TabsTrigger>
            <TabsTrigger value="laboratoires" className="py-2">
              <FlaskConical className="h-4 w-4 mr-2" />
              Laboratoires
            </TabsTrigger>
            <TabsTrigger value="equipes" className="py-2">
              <Users className="h-4 w-4 mr-2" />
              Équipes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="centres">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center gap-2">
                  <Building className="h-6 w-6" />
                  Centres de Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-3">
                  {centres.map((c) => (
                    <StructureCard key={c.acronyme} {...c} icon={Building} />
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="laboratoires">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center gap-2">
                  <FlaskConical className="h-6 w-6" />
                  Laboratoires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-3">
                  {laboratoires.map((l) => (
                    <StructureCard key={l.acronyme} {...l} icon={FlaskConical} />
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipes">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Équipes de Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-3">
                  {equipes.map((e) => (
                    <StructureCard key={e.acronyme} {...e} icon={Users} />
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default StructuresRecherche;
