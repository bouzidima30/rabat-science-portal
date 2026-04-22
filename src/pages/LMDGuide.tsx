import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Award, Users, Info } from "lucide-react";

const LMDGuide = () => {
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
            La Faculté des Sciences de Rabat propose un catalogue riche en formations aussi bien
            pour les licences fondamentales, professionnelles ou d'excellence que pour les masters
            recherche et spécialisés. Vous découvrirez ici les normes régissant les enseignements
            et les évaluations dans les divers cycles de formations.
          </p>
        </div>

        {/* Cycles tabs */}
        <Tabs defaultValue="licence" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="licence">
              <GraduationCap className="h-4 w-4 mr-2" />
              Cycle Licence
            </TabsTrigger>
            <TabsTrigger value="master">
              <Award className="h-4 w-4 mr-2" />
              Cycle Master
            </TabsTrigger>
            <TabsTrigger value="doctorat">
              <Users className="h-4 w-4 mr-2" />
              Cycle Doctoral
            </TabsTrigger>
            <TabsTrigger value="general">
              <Info className="h-4 w-4 mr-2" />
              Informations générales
            </TabsTrigger>
          </TabsList>

          {/* CYCLE LICENCE */}
          <TabsContent value="licence">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center">
                  <GraduationCap className="h-6 w-6 mr-2" />
                  Cycle Licence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    1. Organisation du cycle Licence
                  </h3>
                  <p>
                    Le cycle de Licence est organisé en six semestres. Les semestres S1, S3 et S5
                    se déroulent dans la session d'automne et les semestres S2, S4 et S6 dans la
                    session de printemps.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Une filière Licence comporte 28 modules dont 26 sont réservés pour le DEUG.</li>
                    <li>Chaque semestre comprend 6 modules (volume horaire global : 360 heures).</li>
                    <li>
                      Un module d'enseignement se déroule sur un semestre et correspond, en moyenne,
                      à un volume horaire de 45 heures d'enseignement et d'évaluation.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    2. Validation du semestre
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Un semestre est validé si la moyenne des notes des modules est ≥ 10/20, et
                      qu'aucune note de module n'est inférieure à 5/20 (ni aucune note d'élément).
                    </li>
                    <li>
                      Un module acquis par compensation satisfait les pré-requis pour l'inscription
                      dans un autre module.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    3. Validation et obtention du diplôme de Licence
                  </h3>
                  <p>Une filière de cycle Licence est validée si l'une des conditions suivantes est satisfaite :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Tous les modules de la filière sont validés</li>
                    <li>Tous les semestres sont validés</li>
                  </ul>
                  <p className="mt-2">Une filière validée donne droit au :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Diplôme de la Licence</li>
                    <li>
                      Le diplôme intermédiaire de DEUG peut être délivré à la demande des intéressés
                      ayant validé les quatre premiers semestres des filières Licence correspondantes.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    4. Affichage des notes et consultation des copies
                  </h3>
                  <p>
                    À l'issue de chaque contrôle ou évaluation de TP, l'enseignant porte les notes à
                    la connaissance des étudiants et leur permet de consulter leurs copies avant le
                    contrôle suivant, dans un délai préalablement affiché.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      Demande de consultation par lettre manuscrite au coordonnateur de filière dans
                      un délai de 48 H après affichage des notes.
                    </li>
                    <li>
                      Réclamations sur les résultats définitifs : durant les 7 jours ouvrables après
                      proclamation, via formulaire disponible au service de scolarité.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    5. Cas du semestre non validé
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reconduction automatique en S2 si la moyenne est ≥ 03/20.</li>
                    <li>Soumis aux modalités d'inscription pour les S2, S3, S4 ou S5.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    6. Inscription au semestre
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      L'inscription nécessite la satisfaction des pré-requis des modules
                      (sauf passage S1 → S2).
                    </li>
                    <li>
                      Inscription aux modules offerts pendant la session d'Automne (S1, S3, S5) et
                      la session de Printemps (S2, S4, S6).
                    </li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CYCLE MASTER */}
          <TabsContent value="master">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center">
                  <Award className="h-6 w-6 mr-2" />
                  Cycle Master
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    1. Organisation du cycle Master
                  </h3>
                  <p>
                    Le cycle du Master comprend 4 semestres après la Licence, dénommés S7, S8, S9 et
                    S10. L'étudiant s'inscrit semestriellement aux modules du Master en fonction des
                    pré-requis spécifiés dans leurs descriptifs.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    2. Progression de l'étudiant et inscription dans les modules
                  </h3>
                  <p>
                    L'inscription au S8 se fait automatiquement après le S7. L'accès au S9 nécessite
                    la validation des 12 modules entre S7 et S8.
                  </p>
                  <p className="mt-2">Pour l'inscription au S10, l'étudiant doit valider :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Soit la totalité des modules</li>
                    <li>Soit 11 modules sur 12 avec une note ≥ 7/20 au douzième module</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    3. Stages d'initiation à la recherche en milieu professionnel
                  </h3>
                  <p>
                    Les stages prévus dans les filières Master ou Master spécialisé accréditées sont
                    obligatoires et s'étalent sur le S10. Pour le Master spécialisé, le stage doit
                    <strong> obligatoirement</strong> avoir lieu en milieu professionnel.
                  </p>
                  <p className="mt-2">
                    Ces stages sont menés à terme avant la fin de la 16ᵉ semaine du semestre. Ils
                    font l'objet d'un mémoire et d'une soutenance devant un jury d'au moins trois
                    membres : coordonnateur du Master, encadrant (et co-encadrant) et un examinateur
                    du département ou d'une institution partenaire.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    4. Note du stage
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      La note du stage/mémoire correspond à 2 modules du S10 (coefficient 2 par
                      rapport aux notes des autres modules de S7 à S9).
                    </li>
                    <li>
                      Elle prend en compte l'assiduité de l'étudiant, les résultats obtenus, la
                      qualité du mémoire et sa présentation.
                    </li>
                    <li>
                      En cas d'ajournement, l'étudiant bénéficie d'un semestre supplémentaire pour
                      refaire le stage et présenter un nouveau mémoire en soutenance.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    5. Jury de la filière et obtention du diplôme de Master
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      L'obtention du diplôme de Master ou Master spécialisé est conditionnée par la
                      validation de tous les modules de la filière.
                    </li>
                    <li>Le Jury de Master statue également, en premier lieu, sur les cas de fraude.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    6. Les absences et retards
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>La présence aux enseignements est <strong>obligatoire</strong> pour tous les étudiants inscrits au Master.</li>
                    <li>
                      Au-delà de trois absences non justifiées, l'étudiant ne peut se présenter aux
                      examens et le module concerné n'est pas validé.
                    </li>
                    <li>
                      Absence justifiée : avertir par écrit dans un délai de 7 jours le chef
                      d'établissement et fournir les pièces justificatives. Un contrôle de
                      rattrapage pourra être envisagé après examen du jury.
                    </li>
                    <li>
                      Les retards justifiés aux examens sont acceptés dans un délai de 15 minutes
                      après le début de l'épreuve (aucun candidat ne peut sortir avant la fin de ces
                      15 minutes).
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    7. Fraudes (Master)
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      La fraude est sanctionnée par l'exclusion de la formation après authentification
                      des faits par le jury du Master concerné.
                    </li>
                    <li>
                      Le responsable du Master informe par écrit le Doyen, qui informe à son tour
                      le Conseil de l'Établissement. Une sanction définitive est prononcée par le
                      Conseil de la Faculté constitué en Conseil de discipline.
                    </li>
                    <li>
                      Le plagiat étant une grave atteinte au droit d'auteur et à la propriété
                      intellectuelle, tout mémoire de fin d'études démontré copié sera annulé.
                    </li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CYCLE DOCTORAL */}
          <TabsContent value="doctorat">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center">
                  <Users className="h-6 w-6 mr-2" />
                  Cycle Doctoral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Charte de la thèse
                  </h3>
                  <p>
                    La charte de la thèse définit les engagements réciproques du doctorant, de son
                    directeur de thèse et de l'établissement, ainsi que les bonnes pratiques en
                    matière de recherche et d'éthique scientifique.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Cahier des normes pédagogiques du Doctorat
                  </h3>
                  <p>
                    Le cahier des normes pédagogiques précise les conditions d'inscription, le
                    déroulement de la formation doctorale, les modalités d'encadrement, les
                    obligations du doctorant, ainsi que les conditions de soutenance et d'obtention
                    du diplôme de Doctorat.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Présentation du CeDoc
                  </h3>
                  <p>
                    Le Centre d'Études Doctorales (CeDoc) coordonne l'ensemble des formations
                    doctorales de la Faculté des Sciences de Rabat. Il regroupe les structures de
                    recherche accréditées et organise les activités scientifiques et pédagogiques
                    des doctorants.
                  </p>
                  <a
                    href="/cedoc"
                    className="inline-block mt-3 text-[#006be5] hover:underline font-medium"
                  >
                    → Accéder à la page du CeDoc
                  </a>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INFOS GENERALES */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#006be5] flex items-center">
                  <Info className="h-6 w-6 mr-2" />
                  Informations générales sur le système LMD
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    1. Mention
                  </h3>
                  <p>Le diplôme de fin de cycle est délivré avec l'une des mentions suivantes :</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <Badge variant="outline" className="justify-start py-2 px-3">
                      Très bien : moyenne ≥ 16/20
                    </Badge>
                    <Badge variant="outline" className="justify-start py-2 px-3">
                      Bien : 14/20 ≤ moyenne &lt; 16/20
                    </Badge>
                    <Badge variant="outline" className="justify-start py-2 px-3">
                      Assez bien : 12/20 ≤ moyenne &lt; 14/20
                    </Badge>
                    <Badge variant="outline" className="justify-start py-2 px-3">
                      Passable : 10/20 ≤ moyenne &lt; 12/20
                    </Badge>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    2. Nature des évaluations
                  </h3>
                  <p>
                    L'évaluation des connaissances, des aptitudes et des compétences pour chaque
                    module est définie par le cahier des normes pédagogiques de chaque formation
                    (examens, tests, devoirs, exposés, rapports de stage ou autres).
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    3. Organisation des évaluations
                  </h3>
                  <p>
                    Au début de chaque semestre, un planning des contrôles, élaboré de façon
                    harmonisée entre les six modules du semestre, est affiché à l'attention des
                    étudiants. À ces contrôles peuvent s'ajouter des évaluations de travaux
                    pratiques (TP).
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    4. Pondération
                  </h3>
                  <p>
                    La note d'un module est une moyenne pondérée des différentes évaluations du
                    module ou des éléments qui le composent. La pondération tient compte de la
                    nature de l'évaluation (contrôle continu, TP, contrôle final), des volumes
                    horaires des composantes et de leur nature. Elle est définie par le cahier des
                    normes pédagogiques de la filière.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    5. Modalités de validation des modules et des rattrapages
                  </h3>
                  <p>
                    L'épreuve de rattrapage concerne le contrôle final et/ou les TP. Elle peut se
                    dérouler sous forme écrite, orale ou pratique. La note obtenue remplacera, au
                    sein de l'élément, la note inférieure à 10/20 du contrôle final et/ou du TP.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    6. Consultation des notes par l'étudiant
                  </h3>
                  <p>
                    Les étudiants peuvent consulter directement leurs notes sur le site Web de la
                    Faculté après avoir introduit leur code et leur CNE.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    7. Discipline
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      La commission disciplinaire de la Faculté statue, dans les mêmes conditions
                      que dans les cas de fraudes, sur les cas d'indiscipline et d'atteinte à
                      l'ordre de l'établissement de la part des étudiants.
                    </li>
                    <li>Les sanctions sont laissées à l'appréciation du Conseil de la Faculté.</li>
                    <li>Ces sanctions doivent être reportées dans le dossier pédagogique de l'étudiant.</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Source */}
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-[#006be5]/30">
          <CardContent className="p-6 flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-[#006be5] mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Contenu issu du cahier des normes pédagogiques nationales et du règlement intérieur
              de la Faculté des Sciences de Rabat – Université Mohammed V.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default LMDGuide;
