import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Mail, Phone,
  Users, Target, Building, ScrollText, Info,
} from "lucide-react";

const EcoleDoctorale = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Centre des Études Doctorales
          </h1>
          <p className="text-lg text-primary font-semibold mb-2">
            Sciences et Techniques (CEDoc-ST)
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            Le Centre d'Études Doctorales en Sciences et Technologies de Rabat (CEDESTR), créé en 2007
            en vertu de l'article 19 de la loi 01/00, est adossé aux structures de recherche accréditées
            par l'Université Mohammed V de Rabat.
          </p>
        </div>

        {/* Directeur Card */}
        <Card className="mb-8 border-l-4 border-l-primary shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Users className="h-5 w-5" />
              Directrice du Centre des Études Doctorales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                Professeure SOUAD EL HAJJAJI
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <a href="mailto:s.elhajjaji@um5r.ac.ma" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                  s.elhajjaji@um5r.ac.ma
                </a>
                <a href="mailto:souad.elhajjaji@fsr.um5.ac.ma" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                  souad.elhajjaji@fsr.um5.ac.ma
                </a>
                <a href="tel:+212661909369" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />
                  +212 661 909 369
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="presentation" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="presentation" className="gap-2 py-2.5">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Présentation</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="missions" className="gap-2 py-2.5">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Missions</span>
              <span className="sm:hidden">Missions</span>
            </TabsTrigger>
            <TabsTrigger value="organisation" className="gap-2 py-2.5">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Organisation</span>
              <span className="sm:hidden">Org.</span>
            </TabsTrigger>
            <TabsTrigger value="charte" className="gap-2 py-2.5">
              <ScrollText className="h-4 w-4" />
              <span className="hidden sm:inline">Charte</span>
              <span className="sm:hidden">Charte</span>
            </TabsTrigger>
          </TabsList>

          {/* Présentation - Potentiel d'accueil */}
          <TabsContent value="presentation" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Potentiel d'accueil du CEDoc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  La capacité d'accueil du CEDoc comprend :
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">6</div>
                    <p className="text-sm text-muted-foreground">
                      Centres, 4 laboratoires et 6 équipes de la FSR, le laboratoire de l'Institut
                      Scientifique « IS » et 2 laboratoires de l'École Normale Supérieure « ENS »
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">380</div>
                    <p className="text-sm text-muted-foreground">
                      Enseignants-Chercheurs encadrants au sein du CEDoc
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions */}
          <TabsContent value="missions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-primary" />
                  Missions du CEDoc « Sciences et Technologies »
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Mettre en place des formations doctorales",
                    "Accueillir et inscrire les doctorants",
                    "Assurer l'encadrement au sein des structures accréditées",
                    "Dispenser des formations complémentaires transversales durant la période de préparation du doctorat",
                    "Faciliter l'insertion professionnelle par le biais d'une ouverture sur le marché de l'emploi",
                    "Œuvrer pour l'élargissement de l'espace partenarial au niveau national et des liens de coopérations à l'international",
                    "Créer un environnement scientifique favorable dans l'établissement (organisation de conférences, congrès et séminaires...)",
                    "Veiller au respect des règlements et du cadre administratif relatif aux études doctorales",
                  ].map((mission, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{mission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organisation */}
          <TabsContent value="organisation" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building className="h-6 w-6 text-primary" />
                  Conseil du CEDoc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Le CEDoc est dirigé par un conseil composé des membres suivants :
                </p>
                <ul className="space-y-2 list-disc list-inside text-foreground marker:text-primary">
                  <li>Le Doyen de la Faculté des Sciences de Rabat, président du Conseil</li>
                  <li>Le Directeur du CEDoc « Sciences et Technologies »</li>
                  <li>Les deux Vice-doyens chargés de la recherche et des affaires académiques et pédagogiques</li>
                  <li>Les directeurs des six centres de recherche</li>
                  <li>Un représentant de l'ENS</li>
                  <li>Un doctorant élu par ses pairs appartenant au centre pour une durée de deux ans</li>
                  <li>Deux personnalités externes au CEDoc, choisies pour leur compétence dans les domaines scientifiques ou socio-économiques</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Commissions du CEDoc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Les Directeurs des laboratoires représentent le conseil du CEDoc en trois commissions :
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { title: "Commission des Thèses", short: "CT" },
                    { title: "Formations Complémentaires", short: "CFC" },
                    { title: "Relations Extérieures", short: "CRE" },
                  ].map((c) => (
                    <div key={c.short} className="p-4 rounded-lg border bg-muted/30 text-center">
                      <Badge variant="secondary" className="mb-2">{c.short}</Badge>
                      <p className="font-medium text-sm text-foreground">{c.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charte des Thèses */}
          <TabsContent value="charte" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ScrollText className="h-6 w-6 text-primary" />
                  Charte des Thèses de l'Université Mohammed V
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  La charte formalise l'accord conclu entre le doctorant, le directeur de thèse,
                  le directeur de l'unité de recherche, le directeur de l'école doctorale et le chef
                  d'établissement. Elle s'appuie sur les principes énoncés par le Ministère de
                  l'Éducation Nationale, de l'Enseignement Supérieur et de la Recherche (arrêté
                  ministériel n°1371-07 du 23 septembre 2008).
                </p>
                <p>
                  L'objectif de cette charte est de responsabiliser les partenaires et de définir les
                  droits et devoirs de chacun.
                </p>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Partenaires de la charte</h4>
                  <ul className="space-y-2 list-disc list-inside marker:text-primary">
                    <li><strong className="text-foreground">Le doctorant</strong> : remplit ses obligations administratives et respecte le règlement intérieur ; informe régulièrement son directeur de thèse de l'avancement de ses travaux.</li>
                    <li><strong className="text-foreground">Le directeur de thèse</strong> : responsable de l'encadrement scientifique ; définit les étapes de la thèse et veille au respect des délais.</li>
                    <li><strong className="text-foreground">Le directeur de la structure de recherche</strong> : assure l'intégration et l'accès aux moyens nécessaires au doctorant.</li>
                    <li><strong className="text-foreground">Le directeur de l'école doctorale</strong> : rend publique chaque année la liste des doctorants et de leurs encadrants ; met en œuvre le programme de formations.</li>
                    <li><strong className="text-foreground">Le chef de l'établissement</strong> : a la responsabilité administrative de la formation du doctorant.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Choix du sujet de thèse</h4>
                  <p>
                    Le choix du sujet repose sur l'accord entre le doctorant et le directeur de thèse,
                    formalisé au moment de la première inscription conformément à la « norme D3 » du CNPNCD.
                    Ce sujet doit aboutir à la réalisation d'un travail original, formateur et de qualité.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Encadrement et suivi</h4>
                  <p>
                    Conformément à la « norme D6 » du CNPNCD, le directeur de thèse est responsable
                    de la thèse et doit consacrer une part significative de son temps au suivi régulier
                    de la progression du travail. La direction d'une thèse ne peut en aucun cas être
                    déléguée. Les co-directions sont autorisées après avis favorable du CEDoc.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Durée et prorogation</h4>
                  <p>
                    La durée maximale réglementaire est fixée par la « norme D5 » du CNPNCD. Au-delà
                    de la troisième inscription, les demandes de dérogation doivent être assorties d'une
                    lettre motivée du doctorant et d'un avis du directeur de thèse précisant la date
                    prévisionnelle de soutenance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Publication et valorisation</h4>
                  <p>
                    Le directeur de thèse doit faciliter la parution de <strong className="text-foreground">deux publications minimum</strong> avant la soutenance, dans des revues à comité de lecture reconnues. Le doctorant doit apparaître au <strong className="text-foreground">premier rang</strong> parmi les co-auteurs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Soutenance et délivrance du diplôme</h4>
                  <p>
                    La soutenance se déroule conformément aux « normes D7 et D8 » du CNPNCD. Pour
                    obtenir le diplôme de docteur, le récipiendaire est tenu de déposer
                    <strong className="text-foreground"> 5 exemplaires</strong> de sa thèse après prise en compte des remarques du jury.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Médiation en cas de conflit</h4>
                  <p>
                    Tout conflit entre le doctorant et son directeur de thèse doit être porté à la
                    connaissance du directeur de la structure d'accueil et du directeur de l'école doctorale.
                    En cas de persistance, chaque signataire peut faire appel à la médiation du conseil
                    du CEDoc, puis en dernier recours au Doyen de l'établissement.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-foreground">
                    <strong>Important :</strong> La charte doit être signée au moment de la première
                    inscription en thèse par le doctorant, le(s) directeur(s) de thèse, le directeur
                    de la structure d'accueil et le directeur de l'école doctorale.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default EcoleDoctorale;
