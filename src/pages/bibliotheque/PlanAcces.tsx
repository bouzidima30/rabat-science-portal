
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const PlanAcces = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 border-l-4 border-primary pl-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            Plan d'accès aux différentes bibliothèques de la faculté des sciences
          </h1>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6 space-y-8">
            <figure className="text-center">
              <img
                src="https://www.fsr.ac.ma/sites/default/files/miftah.jpeg"
                alt="Clé d'accès aux bibliothèques de la FSR"
                loading="lazy"
                className="mx-auto rounded-md max-w-full h-auto"
              />
            </figure>

            <figure className="text-center">
              <img
                src="https://www.fsr.ac.ma/sites/default/files/styles/large/public/plan_bib.jpg?itok=ZC8jYmYm"
                alt="Plan détaillé des bibliothèques de la Faculté des Sciences de Rabat"
                loading="lazy"
                className="mx-auto rounded-md max-w-full h-auto border border-border"
              />
              <figcaption className="text-sm text-muted-foreground mt-3">
                Plan d'implantation des bibliothèques au sein de la Faculté des Sciences de Rabat
              </figcaption>
            </figure>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PlanAcces;
