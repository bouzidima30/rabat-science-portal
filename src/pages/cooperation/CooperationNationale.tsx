
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const CooperationNationale = () => {
  const { data: cooperations, isLoading } = useQuery({
    queryKey: ['cooperations', 'nationale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cooperations')
        .select('*')
        .eq('type_cooperation', 'nationale')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <ModernNavbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Coopération Nationale
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez nos partenariats et collaborations avec les institutions nationales
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {cooperations?.map((cooperation) => (
            <Card key={cooperation.id} className="shadow-lg hover:shadow-xl transition-shadow">
              {cooperation.image_url && (
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={cooperation.image_url} 
                    alt={cooperation.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {cooperation.titre}
                </CardTitle>
                {cooperation.domaine_recherche && (
                  <p className="text-sm text-muted-foreground">
                    {cooperation.domaine_recherche}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {cooperation.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {cooperation.annee_debut}
                    {cooperation.annee_fin && ` - ${cooperation.annee_fin}`}
                  </span>
                </div>

                <Link to={`/cooperation/${cooperation.id}`}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir détails
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {!cooperations?.length && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Aucune coopération disponible
            </h3>
            <p className="text-muted-foreground">
              Les coopérations nationales seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CooperationNationale;
