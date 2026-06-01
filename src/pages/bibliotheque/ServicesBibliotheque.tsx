import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Calendar, FileText, Download, Mail } from "lucide-react";

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
      <Icon className="h-6 w-6 text-primary" />
      {title}
    </h2>
    <div className="text-foreground/80 leading-relaxed space-y-3">{children}</div>
  </section>
);

const ServicesBibliotheque = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 border-l-4 border-primary pl-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-2">
            Services de la bibliothèque de la Faculté des Sciences de Rabat
          </p>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8 space-y-10">
            {/* I. Inscription et emprunt */}
            <Section icon={BookOpen} title="I. Inscription et emprunt">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Inscription</h3>
                <p>
                  Tous les étudiants nouvellement inscrits à la première année universitaire
                  bénéficient des services de la bibliothèque tout au long de leur cycle de formation
                  de licence pour une durée de trois années.
                </p>
                <p>
                  Les étudiants inscrits au cycle de Master ou au Doctorat au niveau de
                  l'établissement doivent se présenter à la bibliothèque pour effectuer leur
                  inscription annuellement.
                </p>
                <p>
                  Les étudiants issus d'autres établissements peuvent s'inscrire au niveau de
                  l'établissement pour une période d'une année renouvelable. Les pièces à fournir
                  sont :
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>2 photos</li>
                  <li>Copie de la carte d'identité nationale (ou de la carte de séjour pour les étrangers)</li>
                  <li>1 attestation d'inscription dans l'établissement d'appartenance</li>
                  <li>1 attestation de travail (pour les employés)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. L'emprunt des livres</h3>
                <p>
                  Les usagers de la bibliothèque de la FSR ont le droit d'emprunter des documents
                  selon le règlement suivant :
                </p>

                <p className="font-medium mt-3">a. Cas des étudiants inscrits dans le cycle de la licence fondamentale</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Présenter la carte de l'étudiant.</li>
                  <li>L'étudiant peut emprunter 2 livres pour une période de 7 jours.</li>
                  <li>Il est possible de demander un prolongement de la durée de l'emprunt de 2 jours : renouvelable une seule fois.</li>
                </ul>

                <p className="font-medium mt-3">b. Cas des étudiants inscrits dans le cycle de master et de doctorat</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Présenter la carte de l'étudiant.</li>
                  <li>L'étudiant peut emprunter 2 livres pour une période de 14 jours.</li>
                  <li>Il est possible de demander un prolongement de la durée de l'emprunt de 2 jours : renouvelable une seule fois.</li>
                </ul>

                <p className="font-medium mt-3">c. À savoir</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Les ouvrages disponibles en 1 ou 2 exemplaires uniquement sont exclus du prêt.</li>
                  <li>Manipuler les documents avec soin.</li>
                  <li>Il est interdit de noter, de marquer ou de souligner dans les documents consultés.</li>
                  <li>Tout document perdu ou détérioré devra être remplacé par l'emprunteur.</li>
                  <li>Il faut signaler au service de la bibliothèque, au moment du prêt, toute dégradation constatée sur les documents consultés ou empruntés.</li>
                  <li>
                    En cas de perte :
                    <ul className="list-[circle] pl-6 mt-1 space-y-1">
                      <li>Un retrait définitif de la carte de l'étudiant</li>
                      <li>Un PV est établi et archivé dans le dossier administratif de l'étudiant.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </Section>

            {/* II. Manifestation */}
            <Section icon={Users} title="II. Organisation d'une manifestation scientifique ou socio-culturelle">
              <p>
                L'établissement peut mettre à la disposition des organisateurs d'une manifestation
                scientifique ou socioculturelle (colloques, congrès, séminaires, forum, conférence
                …etc.) plusieurs espaces. Les organisateurs peuvent avoir le statut d'un(e) :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Laboratoire ou équipe de recherche</li>
                <li>Enseignant-chercheur</li>
                <li>Étudiant(e)</li>
                <li>Association</li>
                <li>Organisme externe</li>
              </ul>
              <p>
                Les intéressés peuvent adresser une demande (ci-dessous) qui sera soumise au chef de
                l'établissement pour approbation.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Demande d'organisation d'un événement :{" "}
                  <a
                    href="http://www.fsr.ac.ma/DOC/biblio/Formulaire_organiser_une_manifestation.doc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Cliquez ici pour télécharger
                  </a>
                </li>
                <li>
                  La demande doit être envoyée à l'adresse email :{" "}
                  <a
                    href="mailto:sdic@fsr.ac.ma"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Mail className="h-4 w-4" />
                    sdic@fsr.ac.ma
                  </a>
                </li>
                <li>Après traitement de la demande, les intéressés seront contactés par email.</li>
              </ul>
              <p>
                Les différents supports relatifs à la manifestation doivent être déposés au service
                de la communication au plus tard 3 semaines avant la date prévue de la
                manifestation :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Note de présentation</li>
                <li>Affiche</li>
                <li>Programme</li>
                <li>Dépliants</li>
                <li>Autres …</li>
              </ul>
            </Section>

            {/* III. Réservation */}
            <Section
              icon={Calendar}
              title="III. Réservation d'un espace de travail collaboratif et/ou d'un ordinateur"
            >
              <p>
                La bibliothèque de l'établissement met à la disposition des usagers, sous
                réservation, des espaces permettant l'utilisation d'un :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ordinateur, réservation : (Veuillez contacter le service de la bibliothèque)</li>
                <li>BOX de travail collaboratif, réservation : (Veuillez contacter le service de la bibliothèque)</li>
              </ul>
              <p className="bg-muted p-3 rounded-md text-sm">
                <strong>NB :</strong> Toutes les réservations se font au plus tard 24 heures avant
                le créneau demandé.
              </p>
            </Section>

            {/* IV. Dépôt */}
            <Section icon={FileText} title="IV. Dépôt de projets de fin d'études, de mémoires et de thèses">
              <div className="bg-destructive/10 border-l-4 border-destructive p-3 rounded-md">
                <p className="font-semibold text-foreground text-sm">
                  N.B : Toute réclamation au sujet de la correction des diplômes ne sera pas
                  acceptée après l'édition et la signature des diplômes, veuillez vérifier la
                  conformité de vos données personnelles sur votre état civil (etu.um5.ac.ma).
                </p>
              </div>

              <p>
                La bibliothèque répertorie les thèses et les mémoires soutenus à la Faculté en
                formats papier et électronique.
              </p>
              <p>
                Après la soutenance, l'étudiant doit déposer son PFE, mémoire ou thèse au niveau de
                la bibliothèque. Ce dépôt conditionne l'octroi de l'attestation de réussite. La
                procédure de dépôt est la suivante :
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  1. Dépôt des projets de fin d'études (PFE) et de mémoire de Master
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    1.1. Renseigner le formulaire fourni par la bibliothèque puis joindre :{" "}
                    <a
                      href="http://biblio-02.fsr.ac.ma/form"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Formulaire
                    </a>{" "}
                    (en intranet seulement)
                    <ul className="list-[circle] pl-6 mt-1 space-y-1">
                      <li>a. La version électronique du mémoire en format PDF</li>
                      <li>b. L'état civil de l'étudiant à partir de l'espace numérique « etu.um5.ac.ma »</li>
                    </ul>
                  </li>
                  <li>
                    1.2. L'autorisation originale de dépôt final du mémoire (
                    <a
                      href="http://www.fsr.ac.ma/DOC/biblio/Autorisationdepotfinalmemoire.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Cliquez ici pour télécharger
                    </a>
                    ) datée et signée par l'encadrant et par vice du coordinateur du module.
                  </li>
                  <li>1.3. Copie en format papier de la page de garde du mémoire.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Dépôt d'une thèse de doctorat</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    2.1. Renseigner le formulaire fourni par la bibliothèque, puis joindre :{" "}
                    <a
                      href="http://biblio-02.fsr.ac.ma/form"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Formulaire
                    </a>{" "}
                    (en intranet seulement)
                    <ul className="list-[circle] pl-6 mt-1 space-y-1">
                      <li>a. La version électronique du mémoire en format PDF</li>
                      <li>
                        b. L'autorisation originale de diffusion (
                        <a
                          href="http://www.fsr.ac.ma/DOC/biblio/Autorisationdiffusionthese.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Cliquez ici pour télécharger
                        </a>
                        ) datée et signée par l'auteur.
                      </li>
                    </ul>
                  </li>
                  <li>2.2. Un exemplaire en format papier de la thèse visé par le directeur du CEDOC.</li>
                  <li>
                    2.3. L'autorisation originale de tirage de la thèse datée et signée par le
                    président de jury et l'encadrant.
                  </li>
                  <li>2.4. Copie en format papier de la page de garde de la thèse.</li>
                </ul>
              </div>
            </Section>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesBibliotheque;
