import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Atom, Beaker, Brain, Globe, Dna, Monitor, CheckCircle2 } from "lucide-react";

type Domaine = {
  id: string;
  nom: string;
  icon: typeof Atom;
  couleur: string;
  axes: string[];
};

const domaines: Domaine[] = [
  {
    id: "physique",
    nom: "Sciences de la Matière — Physique",
    icon: Atom,
    couleur: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    axes: [
      "Matériaux et nanomatériaux",
      "Couches minces",
      "Mécanique",
      "Énergétique et énergies renouvelables (conversion, stockage, …)",
      "Matériaux à haute température (FGM)",
      "Modélisation et simulation",
      "Matière condensée et sciences interdisciplinaires",
      "Électronique, signaux et informatique",
      "Électronique, télécommunications, recherche opérationnelle, algorithmes génétiques, traitement d'images, cryptographie, traitement du signal, génie logiciel, informatique",
      "Conversion photovoltaïque, batteries rechargeables et matériaux pour l'énergie et le stockage",
      "Mécanique des fluides et des structures",
      "Mécanique des matériaux, composites et nanocomposites, mécanique des fluides et mécanique des structures pour le bâtiment et le génie civil",
      "Physique nucléaire, physique des réacteurs, environnement, sécurité nucléaire et radioprotection",
      "Physique des matériaux et nanomatériaux",
      "Énergie renouvelable, matériaux, géo-matériaux et efficacité énergétique du bâtiment, géo-ressources, didactique des sciences et de l'énergie",
      "Physique des hautes énergies, théorie des champs, théorie des cordes, cryptographie et information quantique, nouveaux matériaux et applications, physique médicale et environnement",
      "Énergétique",
      "Science de la matière et du rayonnement",
    ],
  },
  {
    id: "chimie",
    nom: "Sciences de la Matière — Chimie",
    icon: Beaker,
    couleur: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    axes: [
      "Matériaux, énergie, catalyse, corrosion, nanotechnologies, environnement",
      "Physico-chimie des matériaux",
      "Étude par spectroscopies et modélisation moléculaire",
      "Valorisation de déchets et synthèses de nanomatériaux pour la dépollution de l'eau et du sol",
      "Protection des matériaux",
      "Chimie organique et organométallique",
      "Chimie organique, chimie des plantes",
      "Chimie organique hétérocyclique",
    ],
  },
  {
    id: "maths",
    nom: "Sciences Mathématiques Appliquées",
    icon: Brain,
    couleur: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    axes: [
      "Mathématiques, informatique et applications — Sécurité de l'information",
      "Recherche fondamentale et appliquée en analyse mathématique",
      "Mathématiques, statistique et applications",
      "Algèbre, analyse fonctionnelle",
      "Statistique, stochastique, calcul numérique, équations différentielles",
      "Analyse non linéaire et applications aux problématiques de développement",
      "Analyse réelle et complexe, analyse hypercomplexe, analyse de Fourier, polynômes orthogonaux et fonctions spéciales, interpolation et échantillonnage, géométrie spectrale",
      "Algèbre, géométrie et applications",
      "Sécurité multi-niveaux des réseaux informatiques, sécurité des réseaux émergents, sécurité des données, codes correcteurs d'erreurs, cryptologie et stéganographie",
      "Modélisation mathématique et simulation numérique, optimisation combinatoire et recherche opérationnelle, méthodes heuristiques et méta-heuristiques, modèles à retard, algèbre linéaire numérique",
      "Mathématiques appliquées, informatique, reconnaissance de formes, intelligence artificielle, télécommunications, robotique",
    ],
  },
  {
    id: "terre",
    nom: "Sciences de la Terre et de l'Univers",
    icon: Globe,
    couleur: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    axes: [
      "Géologie côtière, risques côtiers, géophysique marine, géologie sismotectonique",
      "Sciences de l'eau, géosciences côtières, géomatique, géologie de l'ingénieur",
      "Géologie du Quaternaire littoral, géodynamique des bassins, océanologie, paléoclimatologie, environnement et aménagement",
      "Océanologie, géodynamique et génie géologique",
      "Géodynamique, géoinformation et géoenvironnement",
      "Océanologie et géodynamique des bassins sédimentaires",
      "Géologie appliquée : ressources naturelles, patrimoine géologique et environnement",
      "Ressources minières et ressources en eau",
      "Sédimentologie et géologie marine",
      "Biostratigraphie, géodynamique et patrimoine géologique",
      "Géotourisme, écotourisme et environnements désertiques",
      "Risques géologiques",
      "Télédétection",
      "Paléo-environnements anciens et actuels",
    ],
  },
  {
    id: "vie",
    nom: "Sciences de la Vie et de la Santé",
    icon: Dna,
    couleur: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    axes: [
      "Écologie, génétique, parasitologie, biologie marine, écotoxicologie, biodiversité et fonctionnement des écosystèmes",
      "Biochimie, pharmacologie, immunologie, virologie, cancérologie, biologie de la reproduction, immunogénétique, biologie du cancer, génétique moléculaire, phytothérapie, biologie cellulaire et moléculaire",
      "Endocrinologie, physiologie cardio-vasculaire et rénale, neurosciences, pharmacologie, immunologie, immunogénétique, nutrition et santé",
      "Botanique, mycologie, algologie, phytopathologie, biosystématique, ethnobotanique, écologie et télédétection",
      "Biotechnologie végétale, physiologie des stress abiotiques, amélioration génétique des végétaux, transgenèse végétale",
      "Microbiologie, biologie moléculaire, génomique, bioinformatique, biotechnologies",
    ],
  },
  {
    id: "info",
    nom: "Sciences Informatiques",
    icon: Monitor,
    couleur: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    axes: [
      "Systèmes intelligents, réseaux et systèmes, qualité et génie logiciel et algorithmes",
      "Informatique et télécommunications",
      "Multimédia, intelligence artificielle et reconnaissance de formes",
    ],
  },
];

const DomainesRecherche = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Domaines de Recherche
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Les structures de recherche de la Faculté des Sciences de Rabat couvrent
            plusieurs domaines scientifiques. Voici la liste des spécialités correspondantes.
          </p>
        </div>

        {/* Synthèse */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
          {domaines.map((d) => {
            const Icon = d.icon;
            return (
              <Card key={d.id} className="text-center bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className={`w-10 h-10 rounded-full ${d.couleur} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#006be5]">{d.axes.length}</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">
                    Axes
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Accordéon des domaines */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-[#006be5]">
              Liste des domaines scientifiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["physique"]} className="space-y-3">
              {domaines.map((d) => {
                const Icon = d.icon;
                return (
                  <AccordionItem
                    key={d.id}
                    value={d.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left flex-1">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${d.couleur} flex items-center justify-center`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {d.nom}
                          </h3>
                        </div>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          {d.axes.length} axes
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <ul className="space-y-2">
                        {d.axes.map((axe, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle2 className="h-4 w-4 text-[#006be5] mt-0.5 flex-shrink-0" />
                            <span>{axe}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DomainesRecherche;
