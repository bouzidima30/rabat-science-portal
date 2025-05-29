
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";

const MotDoyen = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Mot du Doyen</h1>
        <p className="text-center text-gray-600">
          Message de bienvenue du Doyen de la Faculté des Sciences de Rabat.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default MotDoyen;
