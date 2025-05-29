
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";

const Historique = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Historique</h1>
        <p className="text-center text-gray-600">
          Histoire et évolution de la Faculté des Sciences de Rabat.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Historique;
