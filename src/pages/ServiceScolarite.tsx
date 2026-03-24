
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, Phone, Mail } from "lucide-react";

const ServiceScolarite = () => {

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


      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceScolarite;
