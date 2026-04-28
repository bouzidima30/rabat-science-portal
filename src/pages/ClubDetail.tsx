import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

interface Club {
  id: string;
  titre: string;
  image_url: string | null;
  description: string | null;
}

const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: club, isLoading, error } = useQuery({
    queryKey: ["public-club", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, titre, image_url, description")
        .eq("id", id as string)
        .maybeSingle();
      if (error) throw error;
      return data as Club | null;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/activites-parauniversitaire">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux clubs
          </Button>
        </Link>

        {isLoading ? (
          <LoadingSpinner />
        ) : !club || error ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Club introuvable
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ce club n'existe pas ou a été supprimé.
            </p>
          </div>
        ) : (
          <article>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
              {club.image_url ? (
                <OptimizedImage
                  src={club.image_url}
                  alt={club.titre}
                  className=""w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Users className="h-24 w-24" />
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {club.titre}
            </h1>

            {club.description ? (
              <div className="prose dark:prose-invert max-w-none">
                {club.description.split("\n").map((p, i) =>
                  p.trim() ? (
                    <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {p}
                    </p>
                  ) : null
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Aucune description disponible pour ce club.
              </p>
            )}
          </article>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ClubDetail;
