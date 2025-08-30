
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SecurityNotice } from "@/components/SecurityNotice";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CooperationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: cooperation, isLoading } = useQuery({
    queryKey: ['cooperation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cooperations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <ModernNavbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006be5]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cooperation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <ModernNavbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Coopération non trouvée
            </h1>
            <Link to="/cooperations">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux coopérations
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to={`/cooperation-${cooperation.type_cooperation.toLowerCase()}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux coopérations {cooperation.type_cooperation.toLowerCase()}s
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          {cooperation.image_url && (
            <div className="bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
              <img 
                src={cooperation.image_url} 
                alt={cooperation.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="text-3xl text-[#006be5] mb-4">
              {cooperation.titre}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-[#006be5] text-white px-3 py-1 rounded-full">
                {cooperation.type_cooperation}
              </span>
              {cooperation.domaine_recherche && (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                  {cooperation.domaine_recherche}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {cooperation.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#006be5]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Période</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {cooperation.annee_debut}
                      {cooperation.annee_fin && ` - ${cooperation.annee_fin}`}
                    </p>
                  </div>
                </div>

                {cooperation.pays && cooperation.pays.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#006be5] mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Pays</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cooperation.pays.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {cooperation.coordinateur && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-[#006be5] mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Coordinateur</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cooperation.coordinateur}
                      </p>
                      {cooperation.email_coordinateur && user && (
                        <p className="text-gray-600 dark:text-gray-400">
                          <Mail className="h-4 w-4 inline mr-1" />
                          {cooperation.email_coordinateur}
                        </p>
                      )}
                      {cooperation.email_coordinateur && !user && (
                        <div className="mt-2">
                          <SecurityNotice type="email-protected" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {cooperation.appel_offre && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-2">Appel d'offre</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {cooperation.appel_offre}
                    </p>
                  </div>
                )}

                {cooperation.partenaires && cooperation.partenaires.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-2">Partenaires</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {cooperation.partenaires.map((partenaire, index) => (
                        <li key={index}>{partenaire}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default CooperationDetail;
