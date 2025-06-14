import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Calendar, MapPin, Clock, Eye, Shield, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContentStatusBadge from "@/components/ContentStatusBadge";
import ContentModerationDialog from "@/components/ContentModerationDialog";
import VersionHistoryDialog from "@/components/VersionHistoryDialog";
import EventForm from "@/components/EventForm";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface Event {
  id: string;
  titre: string;
  description: string | null;
  date_debut: string;
  date_fin: string | null;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
  image_url: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
}

const AdminEvenements = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [moderationItem, setModerationItem] = useState<any>(null);
  const [versionHistoryItem, setVersionHistoryItem] = useState<any>(null);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_debut', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;

    try {
      const event = events.find(e => e.id === id);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('delete_event', `Événement supprimé: ${event?.titre || 'ID: ' + id}`);

      toast({
        title: "Succès",
        description: "L'événement a été supprimé.",
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
    fetchEvents();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.lieu && event.lieu.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      total: events.length,
      draft: events.filter(event => event.status === 'draft').length,
      pending: events.filter(event => event.status === 'pending_review').length,
      approved: events.filter(event => event.status === 'approved').length,
      published: events.filter(event => event.status === 'published').length,
      upcoming: events.filter(event => new Date(event.date_debut) >= new Date()).length,
      past: events.filter(event => new Date(event.date_debut) < new Date()).length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Événements
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez et organisez les événements de la faculté
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setIsFormOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{statusCounts.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Brouillons</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{statusCounts.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Publiés</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{statusCounts.published}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-3 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 rounded-md transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillons</option>
                <option value="pending_review">En attente de révision</option>
                <option value="approved">Approuvés</option>
                <option value="published">Publiés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  {event.image_url && (
                    <img 
                      src={event.image_url} 
                      alt={event.titre}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {event.titre}
                      </h3>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVersionHistoryItem(event)}
                          className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                          title="Voir l'historique"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setModerationItem({
                            id: event.id,
                            title: event.titre,
                            status: event.status || 'draft',
                            type: 'event'
                          })}
                          className="hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20"
                          title="Modérer"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsFormOpen(true);
                          }}
                          className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <ContentStatusBadge status={event.status || 'draft'} />
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                        {event.date_fin && event.date_fin !== event.date_debut && (
                          <span> - {new Date(event.date_fin).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                      {event.heure_debut && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.heure_debut}
                          {event.heure_fin && ` - ${event.heure_fin}`}
                        </div>
                      )}
                      {event.lieu && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.lieu}
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {event.description.length > 200 
                          ? event.description.substring(0, 200) + "..." 
                          : event.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEvents.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Créez votre premier événement pour commencer."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => {
                    setSelectedEvent(null);
                    setIsFormOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel événement
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedEvent ? "Modifier l'événement" : "Nouvel événement"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={selectedEvent}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {moderationItem && (
        <ContentModerationDialog
          isOpen={!!moderationItem}
          onClose={() => setModerationItem(null)}
          contentId={moderationItem.id}
          contentType="event"
          contentTitle={moderationItem.title}
          currentStatus={moderationItem.status || 'draft'}
          onStatusUpdate={fetchEvents}
        />
      )}

      {versionHistoryItem && (
        <VersionHistoryDialog
          isOpen={!!versionHistoryItem}
          onClose={() => setVersionHistoryItem(null)}
          contentId={versionHistoryItem.id}
          contentType="event"
          contentTitle={versionHistoryItem.titre}
        />
      )}
    </div>
  );
};

export default AdminEvenements;
