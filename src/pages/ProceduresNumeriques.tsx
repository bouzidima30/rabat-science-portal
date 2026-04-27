
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Mail,
  ExternalLink,
  IdCard,
  LayoutDashboard,
  LogIn,
  GraduationCap,
  Languages,
  Smartphone,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const ProceduresNumeriques = () => {
  type Lien = {
    label: string;
    url: string;
    info?: string;
    internal?: boolean;
  };

  type Procedure = {
    titre: string;
    description: string;
    icon: typeof LayoutDashboard;
    note?: string;
    liens: Lien[];
  };

  const procedures: Procedure[] = [
    {
      titre: "Compte Institutionnel Microsoft",
      description:
        "Récupération et gestion de votre compte institutionnel Microsoft (Université Mohammed V).",
      icon: LayoutDashboard,
      liens: [
        {
          label: "Récupérer mon compte institutionnel",
          url: "https://etu.um5.ac.ma/index.php?:nav=comptes::index",
          info: "site de l'Université Mohammed V",
        },
        {
          label: "Comment récupérer mon compte",
          url: "/procedures-numeriques/recuperer-mot-de-passe",
          internal: true,
        },
        {
          label: "Authentification multifacteur (MFA)",
          url: "https://youtu.be/t4hshW6Epio",
        },
        {
          label: "Difficultés liées au compte",
          url: "/procedures-numeriques/difficulte-mot-de-passe",
          internal: true,
        },
      ],
    },
    {
      titre: "Compte Institutionnel Google",
      description:
        "Information importante concernant les comptes Google Classroom des étudiants.",
      icon: Mail,
      note: "Les comptes Google Classroom ne sont plus délivrés par l'Université Mohammed V.",
      liens: [],
    },
    {
      titre: "Carte d'Étudiant",
      description:
        "Demandes, suivis, réclamations et déclarations de perte liées à la carte d'étudiant.",
      icon: IdCard,
      liens: [
        {
          label: "Demande de la carte étudiant",
          url: "/procedures-numeriques/recuperation-carte",
          internal: true,
        },
        {
          label: "Suivi de l'état de la demande",
          url: "/procedures-numeriques/suivi-impression-cartes",
          internal: true,
        },
        {
          label: "Réclamations",
          url: "/procedures-numeriques/reclamation-carte",
          internal: true,
        },
        {
          label: "Prototype de déclaration de perte de la carte",
          url: "http://www.fsr.ac.ma/DOC/service-info/partage/Carte%20declaration%20de%20perte.pdf",
        },
        {
          label:
            "Prototype de déclaration de perte de l'attestation de dépôt de dossier",
          url: "http://www.fsr.ac.ma/DOC/service-info/partage/Recus%20declaration%20de%20perte.pdf",
        },
      ],
    },
    {
      titre: "Espace Numérique de Travail",
      description:
        "Accès à votre ENT (ETU 4.0) de l'Université Mohammed V et tutoriel d'utilisation.",
      icon: LayoutDashboard,
      liens: [
        {
          label: "Accéder à votre Espace Numérique de Travail",
          url: "http://etu.um5.ac.ma/",
          info: "site de l'Université Mohammed V",
        },
        {
          label: "Tutoriel : Nouvel ENT « ETU 4.0 » pour les étudiants",
          url: "/procedures-numeriques/tutoriel-ent",
          internal: true,
        },
      ],
    },
    {
      titre: "Connexion à Campus Connecté",
      description:
        "Méthode de connexion et récupération du mot de passe pour la plateforme Campus Connecté.",
      icon: LogIn,
      liens: [
        {
          label: "Comment récupérer mon mot de passe",
          url: "/procedures-numeriques/recuperer-mot-de-passe",
          internal: true,
        },
        {
          label: "Récupération du mot de passe",
          url: "https://etu.um5.ac.ma/index.php?:nav=comptes::index",
          info: "site de l'Université Mohammed V",
        },
        {
          label: "Méthode de connexion",
          url: "https://campusconnecte.online/",
        },
      ],
    },
    {
      titre: "Plate-forme Moodle",
      description:
        "Plateforme d'enseignement à distance de l'Université Mohammed V et capsule explicative.",
      icon: GraduationCap,
      liens: [
        {
          label: "Accéder à la plate-forme Moodle",
          url: "https://moodle-fsr.um5.ac.ma/",
          info: "site de l'Université Mohammed V",
        },
        {
          label: "Capsule Moodle",
          url: "/procedures-numeriques/plateforme-moodle",
          internal: true,
        },
      ],
    },
    {
      titre: "Compte ROSETTA STONE",
      description:
        "Activation de votre compte d'apprentissage des langues Rosetta Stone et résolution des problèmes liés.",
      icon: Languages,
      liens: [
        {
          label: "Accéder à la plate-forme ROSETTA STONE",
          url: "/procedures-numeriques/activer-compte-rosetta",
          internal: true,
        },
        {
          label: "Problèmes de configuration du compte Rosetta Stone",
          url: "/procedures-numeriques/probleme-rosetta",
          internal: true,
        },
        {
          label: "Capsule Rosetta Stone",
          url: "/procedures-numeriques/capsule-rosetta",
          internal: true,
        },
      ],
    },
    {
      titre: "Carte 4G SIM",
      description: "Information sur la distribution des cartes SIM 4G.",
      icon: Smartphone,
      note: "Les cartes SIM sont délivrées lors de la première inscription à la FSR.",
      liens: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Procédures Numériques
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Les étudiants de la Faculté des Sciences de Rabat trouveront ici les
            différentes procédures pour accéder aux services numériques de la FSR
            et de l'Université Mohammed V.
          </p>
        </div>

        {/* HelpDesk officiel */}
        <Card className="mb-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start">
              <HelpCircle className="h-8 w-8 text-[#006be5] mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  HelpDesk
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-2">
                  Pour toute demande d'information, merci de nous écrire à
                  l'adresse :{" "}
                  <a
                    href="mailto:helpdesk@fsr.ac.ma"
                    className="font-semibold underline hover:text-[#006be5]"
                  >
                    helpdesk@fsr.ac.ma
                  </a>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Vous devez spécifier{" "}
                  <strong>« Demande d'information »</strong> comme objet de votre
                  e-mail et donner votre <strong>code Apogée</strong> ainsi qu'un{" "}
                  <strong>numéro de téléphone</strong> où l'on peut vous joindre.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Procédures principales */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Services Numériques
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {procedures.map((procedure, index) => {
              const IconComponent = procedure.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 bg-[#006be5] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#006be5]">
                          {procedure.titre}
                        </CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {procedure.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {procedure.note && (
                      <div className="mb-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
                        {procedure.note}
                      </div>
                    )}
                    {procedure.liens && procedure.liens.length > 0 && (
                      <ul className="space-y-2">
                        {procedure.liens.map((lien, idx) => (
                          <li key={idx}>
                            {lien.internal ? (
                              <Link
                                to={lien.url}
                                className="flex items-start text-sm text-gray-700 dark:text-gray-300 hover:text-[#006be5] dark:hover:text-[#006be5] group"
                              >
                                <ChevronRight className="h-4 w-4 mt-0.5 mr-2 text-[#006be5] flex-shrink-0" />
                                <span className="group-hover:underline">
                                  {lien.label}
                                </span>
                              </Link>
                            ) : (
                              <a
                                href={lien.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start text-sm text-gray-700 dark:text-gray-300 hover:text-[#006be5] dark:hover:text-[#006be5] group"
                              >
                                <ChevronRight className="h-4 w-4 mt-0.5 mr-2 text-[#006be5] flex-shrink-0" />
                                <span>
                                  <span className="group-hover:underline">
                                    {lien.label}
                                  </span>
                                  {lien.info && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                      ({lien.info})
                                    </span>
                                  )}
                                  <ExternalLink className="inline h-3 w-3 ml-1 opacity-60" />
                                </span>
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Source officielle */}
        <Card className="shadow-lg bg-gradient-to-r from-[#006be5] to-blue-600 text-white">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Source officielle
                </h3>
                <p className="text-sm text-blue-50">
                  Toutes les informations sont issues du site officiel de la
                  Faculté des Sciences de Rabat.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="secondary"
              className="bg-white text-[#006be5] hover:bg-blue-50"
            >
              <a
                href="https://www.fsr.ac.ma/content/proc%C3%A9dures-num%C3%A9riques"
                target="_blank"
                rel="noopener noreferrer"
              >
                Consulter sur fsr.ac.ma
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProceduresNumeriques;
