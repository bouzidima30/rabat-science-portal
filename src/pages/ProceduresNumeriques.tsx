
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Wifi, Mail, Key, HelpCircle, Download } from "lucide-react";

const ProceduresNumeriques = () => {
  const procedures = [
    {
      titre: "Création de Compte Utilisateur",
      description: "Procédure pour obtenir un compte informatique FSR",
      icon: Key,
      etapes: [
        "Remplir le formulaire de demande de compte",
        "Fournir une copie de la CIN et photo",
        "Déposer le dossier au service informatique",
        "Récupérer les identifiants (48h après)"
      ]
    },
    {
      titre: "Accès WiFi Campus",
      description: "Configuration de l'accès réseau sans fil",
      icon: Wifi,
      etapes: [
        "Obtenir ses identifiants réseau",
        "Se connecter au réseau FSR-WiFi",
        "Saisir login/mot de passe",
        "Accepter les conditions d'utilisation"
      ]
    },
    {
      titre: "Messagerie Électronique",
      description: "Configuration et utilisation de l'email institutionnel",
      icon: Mail,
      etapes: [
        "Activation du compte email",
        "Configuration du client mail",
        "Paramétrage IMAP/SMTP",
        "Synchronisation multi-appareils"
      ]
    },
    {
      titre: "Support Technique",
      description: "Procédure de demande d'assistance informatique",
      icon: HelpCircle,
      etapes: [
        "Identifier le type de problème",
        "Contacter le helpdesk par email/téléphone",
        "Fournir les détails du problème",
        "Suivre les instructions du technicien"
      ]
    }
  ];

  const ressources = [
    {
      nom: "Guide de Configuration WiFi",
      description: "Instructions détaillées pour la connexion WiFi",
      type: "PDF"
    },
    {
      nom: "Paramètres Messagerie",
      description: "Configuration Outlook, Thunderbird, et clients mobiles",
      type: "PDF"
    },
    {
      nom: "Politique d'Usage IT",
      description: "Règlement d'utilisation des ressources informatiques",
      type: "PDF"
    },
    {
      nom: "FAQ Informatique",
      description: "Questions fréquemment posées et leurs réponses",
      type: "PDF"
    }
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
            Guide complet des procédures liées aux services informatiques de la FSR. 
            Trouvez toutes les informations nécessaires pour utiliser nos ressources numériques.
          </p>
        </div>

        {/* Contact Service Informatique */}
        <Card className="mb-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Monitor className="h-8 w-8 text-[#006be5] mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Service Informatique - Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-blue-800 dark:text-blue-200">
                  <div>
                    <p><strong>Email :</strong> support-it@fsr.ac.ma</p>
                    <p><strong>Téléphone :</strong> +212 5 37 77 18 50</p>
                  </div>
                  <div>
                    <p><strong>Bureau :</strong> Bloc A, 1er étage</p>
                    <p><strong>Horaires :</strong> 8h30-16h30 (Lun-Ven)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Procédures principales */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Procédures Principales
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {procedures.map((procedure, index) => {
              const IconComponent = procedure.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#006be5] rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#006be5]">
                          {procedure.titre}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {procedure.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {procedure.etapes.map((etape, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-[#006be5] rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-xs font-bold">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {etape}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Documents et ressources */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5]">
              Documents et Ressources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {ressources.map((ressource, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center flex-1">
                    <Download className="h-5 w-5 text-[#006be5] mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {ressource.nom}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ressource.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-[#006be5] text-white px-2 py-1 rounded">
                      {ressource.type}
                    </span>
                    <Button size="sm" variant="outline">
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProceduresNumeriques;
