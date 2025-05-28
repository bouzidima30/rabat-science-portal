
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Mail, Calendar, FileText, BookOpen } from "lucide-react";

const EspaceEnseignants = () => {
  const services = [
    {
      titre: "Espace Cours en ligne",
      description: "Accédez à la plateforme Moodle pour gérer vos cours et interactions avec les étudiants",
      icon: BookOpen,
      link: "https://moodle-fsr.um5.ac.ma/",
      color: "bg-blue-500"
    },
    {
      titre: "E-mail institutionnel",
      description: "Accès à votre messagerie institutionnelle de l'Université Mohammed V",
      icon: Mail,
      link: "https://mail.um5.ac.ma/",
      color: "bg-green-500"
    }
  ];

  const documents = [
    {
      categorie: "Réservations",
      description: "Formulaires de réservation des salles et équipements",
      fichiers: [
        { nom: "Demande de réservation salle", type: "PDF" },
        { nom: "Réservation équipement labo", type: "DOC" },
        { nom: "Planning des réservations", type: "PDF" }
      ]
    },
    {
      categorie: "Demandes administratives",
      description: "Formulaires pour les demandes administratives diverses",
      fichiers: [
        { nom: "Demande de congé", type: "PDF" },
        { nom: "Ordre de mission", type: "DOC" },
        { nom: "Demande de matériel", type: "PDF" }
      ]
    },
    {
      categorie: "Événements",
      description: "Organisation d'événements au sein de la faculté",
      fichiers: [
        { nom: "Formulaire organisation événement", type: "PDF" },
        { nom: "Guide procédures événements", type: "PDF" }
      ]
    },
    {
      categorie: "Textes et lois",
      description: "Documentation réglementaire et juridique",
      fichiers: [
        { nom: "Statut personnel enseignant", type: "PDF" },
        { nom: "Règlement intérieur", type: "PDF" },
        { nom: "Procédures disciplinaires", type: "PDF" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Espace Enseignants
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Accédez à tous les services et documents nécessaires pour votre activité d'enseignement 
            et de recherche au sein de la Faculté des Sciences de Rabat.
          </p>
        </div>

        {/* Services en ligne */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Services en Ligne
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-[#006be5]">
                      {service.titre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {service.description}
                    </p>
                    <Button 
                      className="w-full bg-[#006be5] hover:bg-[#0056b3]"
                      onClick={() => window.open(service.link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Accéder au service
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Documents et formulaires */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Documents et Formulaires
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <FileText className="h-6 w-6 text-[#006be5] mr-2" />
                    <CardTitle className="text-xl text-[#006be5]">
                      {doc.categorie}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {doc.description}
                  </p>
                  <div className="space-y-2">
                    {doc.fichiers.map((fichier, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {fichier.nom}
                          </span>
                        </div>
                        <span className="text-xs bg-[#006be5] text-white px-2 py-1 rounded">
                          {fichier.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Organisation d'événements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#006be5] flex items-center justify-center">
              <Calendar className="h-6 w-6 mr-2" />
              Organisation d'Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Si vous souhaitez organiser un événement au sein de la faculté, 
                veuillez renseigner le formulaire ci-dessous et le déposer au décanat.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-[#006be5] mb-4">
                  Procédure d'organisation
                </h3>
                <ol className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                  <li>1. Télécharger et remplir le formulaire de demande</li>
                  <li>2. Joindre tous les documents requis</li>
                  <li>3. Déposer le dossier complet au décanat</li>
                  <li>4. Attendre la validation et les instructions</li>
                </ol>
                <Button className="mt-4 bg-[#006be5] hover:bg-[#0056b3]">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le formulaire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default EspaceEnseignants;
