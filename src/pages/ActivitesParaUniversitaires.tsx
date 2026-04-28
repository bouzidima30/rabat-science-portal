import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OptimizedImage from "@/components/OptimizedImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";

interface Club {
  id: string;
  titre: string;
  image_url: string | null;
}

const ActivitesParaUniversitaires = () => {
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["public-clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, titre, image_url, display_order, created_at")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as Club[];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Activités Para-universitaires
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez tous les clubs et associations de la Faculté des Sciences de Rabat.
            Participez aux activités qui enrichiront votre parcours universitaire !
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : clubs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Aucun club disponible pour le moment.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Link key={club.id} to={`/club/${club.id}`} className="block group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                    {club.image_url ? (
                      <OptimizedImage
                        src={club.image_url}
                        alt={club.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Users className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#006be5] transition-colors">
                      {club.titre}
                    </h2>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ActivitesParaUniversitaires;
