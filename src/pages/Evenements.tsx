
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Evenements = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_debut', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events?.filter(event => new Date(event.date_debut) >= today) || [];
  const pastEvents = events?.filter(event => new Date(event.date_debut) < today) || [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const EventCard = ({ event }: { event: any }) => (
    <Link to={`/evenements/${event.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {event.image_url && (
              <img 
                src={event.image_url} 
                alt={event.titre}
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#006be5] mb-2">
                {event.titre}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.date_debut)}
                  {event.date_fin && event.date_fin !== event.date_debut && (
                    <span> - {formatDate(event.date_fin)}</span>
                  )}
                </div>
                {event.heure_debut && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.heure_debut}
                    {event.heure_fin && <span> - {event.heure_fin}</span>}
                  </div>
                )}
                {event.lieu && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.lieu}
                  </div>
                )}
              </div>
              {event.description && (
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Événements
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Découvrez les événements de la Faculté des Sciences de Rabat
          </p>
        </div>

        {/* Événements à venir */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Événements à venir
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun événement à venir
              </h3>
              <p className="text-gray-500">Revenez bientôt pour découvrir nos prochains événements.</p>
            </div>
          )}
        </section>

        {/* Événements passés */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Événements passés
          </h2>
          {pastEvents.length > 0 ? (
            <div className="space-y-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun événement passé
              </h3>
            </div>
          )}
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Evenements;
