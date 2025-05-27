
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, Phone, Mail } from "lucide-react";

const ServiceScolarite = () => {
  const formulaires = [
    {
      categorie: "Inscription",
      documents: [
        { nom: "Fiche d'inscription", format: "PDF", taille: "120 KB" },
        { nom: "Demande de transfert", format: "DOC", taille: "85 KB" },
        { nom: "Attestation d'inscription", format: "PDF", taille: "95 KB" }
      ]
    },
    {
      categorie: "Examens",
      documents: [
        { nom: "Demande de rattrapage", format: "PDF", taille: "110 KB" },
        { nom: "Autorisation d'absence", format: "DOC", taille: "75 KB" },
        { nom: "Relevé de notes", format: "PDF", taille: "130 KB" }
      ]
    },
    {
      categorie: "Diplômes",
      documents: [
        { nom: "Demande de diplôme", format: "PDF", taille: "140 KB" },
        { nom: "Attestation de réussite", format: "DOC", taille: "90 KB" },
        { nom: "Duplicata de diplôme", format: "PDF", taille: "105 KB" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Service de Scolarité
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Téléchargez tous les formulaires et documents administratifs nécessaires 
            pour vos démarches académiques.
          </p>
        </div>

        {/* Horaires et contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Horaires</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Lun - Ven: 8h - 16h<br />
                Sam: 8h - 12h
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Téléphone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                +212 5 37 77 18 34
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                scolarite@fsr.ac.ma
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulaires */}
        <div className="grid lg:grid-cols-3 gap-8">
          {formulaires.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#006be5] flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  {section.categorie}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-[#006be5] mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.nom}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.format} • {doc.taille}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceScolarite;
