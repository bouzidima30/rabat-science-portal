import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Plus, Edit, Trash2, Upload, MapPin, Clock, Search, CalendarDays, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminEvenements = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_debut: '',
    heure_debut: '',
    date_fin: '',
    heure_fin: '',
    lieu: '',
    image_url: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_debut', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const eventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsDialogOpen(false);
      setEditingEvent(null);
      setFormData({
        titre: '',
        description: '',
        date_debut: '',
        heure_debut: '',
        date_fin: '',
        heure_fin: '',
        lieu: '',
        image_url: ''
      });
      toast({
        title: editingEvent ? "Événement modifié" : "Événement créé",
        description: `L'événement a été ${editingEvent ? "modifié" : "créé"} avec succès`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès",
      });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      
      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    eventMutation.mutate(formData);
  };

  const openEditDialog = (event: any) => {
    setEditingEvent(event);
    setFormData({
      titre: event.titre,
      description: event.description || '',
      date_debut: event.date_debut,
      heure_debut: event.heure_debut || '',
      date_fin: event.date_fin || '',
      heure_fin: event.heure_fin || '',
      lieu: event.lieu || '',
      image_url: event.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const filteredEvents = events?.filter(event =>
    event.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.lieu?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const upcomingEvents = events?.filter(event => new Date(event.date_debut) >= new Date()).length || 0;
  const pastEvents = events?.filter(event => new Date(event.date_debut) < new Date()).length || 0;

  if (isLoading) {
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
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <CalendarDays className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Événements
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Planifiez et gérez les événements de la faculté
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingEvent(null);
                setFormData({
                  titre: '',
                  description: '',
                  date_debut: '',
                  heure_debut: '',
                  date_fin: '',
                  heure_fin: '',
                  lieu: '',
                  image_url: ''
                });
              }} className="bg-purple-600 hover:bg-purple-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Événement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingEvent ? "Modifier l'événement" : "Créer un événement"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Titre de l'événement"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  required
                  className="h-12"
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de début</label>
                    <Input
                      type="date"
                      value={formData.date_debut}
                      onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de début</label>
                    <Input
                      type="time"
                      value={formData.heure_debut}
                      onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de fin</label>
                    <Input
                      type="date"
                      value={formData.date_fin}
                      onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de fin</label>
                    <Input
                      type="time"
                      value={formData.heure_fin}
                      onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                    />
                  </div>
                </div>
                <Input
                  placeholder="Lieu"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  className="h-12"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl shadow-md" />
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={eventMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                    {editingEvent ? "Modifier" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{events?.length || 0}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">À venir</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{upcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Passés</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{pastEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
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
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openEditDialog(event)}
                          className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteEventMutation.mutate(event.id)}
                          disabled={deleteEventMutation.isPending}
                          className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
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
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {event.description}
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
              <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Créez votre premier événement pour commencer."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => {
                    setEditingEvent(null);
                    setFormData({
                      titre: '',
                      description: '',
                      date_debut: '',
                      heure_debut: '',
                      date_fin: '',
                      heure_fin: '',
                      lieu: '',
                      image_url: ''
                    });
                    setIsDialogOpen(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Événement
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminEvenements;
