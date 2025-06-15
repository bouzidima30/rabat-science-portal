import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Globe, Users, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import CooperationImageUpload from "@/components/admin/CooperationImageUpload";

interface Cooperation {
  id: string;
  titre: string;
  description: string | null;
  type_cooperation: string;
  coordinateur: string | null;
  email_coordinateur: string | null;
  partenaires: string[] | null;
  pays: string[] | null;
  domaine_recherche: string | null;
  appel_offre: string | null;
  annee_debut: number | null;
  annee_fin: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const AdminCooperations = () => {
  const [cooperations, setCooperations] = useState<Cooperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCooperation, setSelectedCooperation] = useState<Cooperation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_cooperation: 'internationale',
    coordinateur: '',
    email_coordinateur: '',
    partenaires: '',
    pays: '',
    domaine_recherche: '',
    appel_offre: '',
    annee_debut: '',
    annee_fin: '',
    image_url: ''
  });
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const typeCooperationLabels = {
    internationale: "Internationale",
    nationale: "Nationale"
  };

  useEffect(() => {
    fetchCooperations();
  }, []);

  const fetchCooperations = async () => {
    try {
      const { data, error } = await supabase
        .from('cooperations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCooperations(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les coopérations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cooperationData = {
        titre: formData.titre,
        description: formData.description || null,
        type_cooperation: formData.type_cooperation,
        coordinateur: formData.coordinateur || null,
        email_coordinateur: formData.email_coordinateur || null,
        partenaires: formData.partenaires ? formData.partenaires.split(',').map(p => p.trim()) : null,
        pays: formData.pays ? formData.pays.split(',').map(p => p.trim()) : null,
        domaine_recherche: formData.domaine_recherche || null,
        appel_offre: formData.appel_offre || null,
        annee_debut: formData.annee_debut ? parseInt(formData.annee_debut) : null,
        annee_fin: formData.annee_fin ? parseInt(formData.annee_fin) : null,
        image_url: formData.image_url || null
      };

      if (selectedCooperation) {
        // Update existing cooperation
        const { error } = await supabase
          .from('cooperations')
          .update(cooperationData)
          .eq('id', selectedCooperation.id);

        if (error) throw error;

        await logActivity('update_cooperation', `Coopération modifiée: ${formData.titre}`);

        toast({
          title: "Succès",
          description: "La coopération a été mise à jour.",
        });
      } else {
        // Create new cooperation
        const { error } = await supabase
          .from('cooperations')
          .insert(cooperationData);

        if (error) throw error;

        await logActivity('create_cooperation', `Coopération créée: ${formData.titre} (${typeCooperationLabels[formData.type_cooperation as keyof typeof typeCooperationLabels]})`);

        toast({
          title: "Succès",
          description: "La coopération a été créée.",
        });
      }

      setIsFormOpen(false);
      setSelectedCooperation(null);
      setFormData({
        titre: '',
        description: '',
        type_cooperation: 'internationale',
        coordinateur: '',
        email_coordinateur: '',
        partenaires: '',
        pays: '',
        domaine_recherche: '',
        appel_offre: '',
        annee_debut: '',
        annee_fin: '',
        image_url: ''
      });
      fetchCooperations();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la coopération.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette coopération ?")) return;

    try {
      const cooperation = cooperations.find(c => c.id === id);
      const { error } = await supabase
        .from('cooperations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('delete_cooperation', `Coopération supprimée: ${cooperation?.titre || 'ID: ' + id}`);

      toast({
        title: "Succès",
        description: "La coopération a été supprimée.",
      });

      fetchCooperations();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la coopération.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (cooperation: Cooperation) => {
    setSelectedCooperation(cooperation);
    setFormData({
      titre: cooperation.titre,
      description: cooperation.description || '',
      type_cooperation: cooperation.type_cooperation,
      coordinateur: cooperation.coordinateur || '',
      email_coordinateur: cooperation.email_coordinateur || '',
      partenaires: cooperation.partenaires ? cooperation.partenaires.join(', ') : '',
      pays: cooperation.pays ? cooperation.pays.join(', ') : '',
      domaine_recherche: cooperation.domaine_recherche || '',
      appel_offre: cooperation.appel_offre || '',
      annee_debut: cooperation.annee_debut ? cooperation.annee_debut.toString() : '',
      annee_fin: cooperation.annee_fin ? cooperation.annee_fin.toString() : '',
      image_url: cooperation.image_url || ''
    });
    setIsFormOpen(true);
  };

  const filteredCooperations = cooperations.filter(cooperation =>
    cooperation.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cooperation.type_cooperation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cooperation.coordinateur && cooperation.coordinateur.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const cooperationsByType = cooperations.reduce((acc, cooperation) => {
    acc[cooperation.type_cooperation] = (acc[cooperation.type_cooperation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Coopérations
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez les partenariats et coopérations de la faculté
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedCooperation(null);
              setFormData({
                titre: '',
                description: '',
                type_cooperation: 'internationale',
                coordinateur: '',
                email_coordinateur: '',
                partenaires: '',
                pays: '',
                domaine_recherche: '',
                appel_offre: '',
                annee_debut: '',
                annee_fin: '',
                image_url: ''
              });
              setIsFormOpen(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle coopération
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{cooperations.length}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Internationales</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{cooperationsByType.internationale || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Nationales</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{cooperationsByType.nationale || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
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
              placeholder="Rechercher une coopération..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cooperations List */}
      <div className="space-y-6">
        {filteredCooperations.map((cooperation) => (
          <Card key={cooperation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  {cooperation.image_url && (
                    <img 
                      src={cooperation.image_url} 
                      alt={cooperation.titre}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {cooperation.titre}
                      </h3>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(cooperation)}
                          className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cooperation.id)}
                          className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                      >
                        {typeCooperationLabels[cooperation.type_cooperation as keyof typeof typeCooperationLabels]}
                      </Badge>
                      {cooperation.coordinateur && (
                        <Badge variant="outline">
                          {cooperation.coordinateur}
                        </Badge>
                      )}
                      {cooperation.annee_debut && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {cooperation.annee_debut}
                          {cooperation.annee_fin && ` - ${cooperation.annee_fin}`}
                        </div>
                      )}
                    </div>
                    
                    {cooperation.description && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        {cooperation.description.length > 200 
                          ? cooperation.description.substring(0, 200) + "..." 
                          : cooperation.description
                        }
                      </p>
                    )}

                    {cooperation.partenaires && cooperation.partenaires.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cooperation.partenaires.slice(0, 3).map((partenaire, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {partenaire}
                          </Badge>
                        ))}
                        {cooperation.partenaires.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{cooperation.partenaires.length - 3} autres
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCooperations.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucune coopération trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Créez votre première coopération pour commencer."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle coopération
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
              {selectedCooperation ? "Modifier la coopération" : "Nouvelle coopération"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Titre de la coopération" 
              value={formData.titre} 
              onChange={(e) => setFormData({...formData, titre: e.target.value})} 
              required 
            />
            <Textarea 
              placeholder="Description de la coopération..." 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              rows={4}
            />
            <CooperationImageUpload
              imageUrl={formData.image_url}
              onImageChange={(url) => setFormData({...formData, image_url: url})}
              disabled={loading}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de coopération</label>
                <select
                  value={formData.type_cooperation}
                  onChange={(e) => setFormData({...formData, type_cooperation: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="internationale">Internationale</option>
                  <option value="nationale">Nationale</option>
                </select>
              </div>
              <Input 
                placeholder="Coordinateur" 
                value={formData.coordinateur} 
                onChange={(e) => setFormData({...formData, coordinateur: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Email coordinateur" 
                type="email"
                value={formData.email_coordinateur} 
                onChange={(e) => setFormData({...formData, email_coordinateur: e.target.value})} 
              />
              <Input 
                placeholder="Domaine de recherche" 
                value={formData.domaine_recherche} 
                onChange={(e) => setFormData({...formData, domaine_recherche: e.target.value})} 
              />
            </div>
            <Input 
              placeholder="Partenaires (séparés par des virgules)" 
              value={formData.partenaires} 
              onChange={(e) => setFormData({...formData, partenaires: e.target.value})} 
            />
            <Input 
              placeholder="Pays (séparés par des virgules)" 
              value={formData.pays} 
              onChange={(e) => setFormData({...formData, pays: e.target.value})} 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                placeholder="Appel d'offre" 
                value={formData.appel_offre} 
                onChange={(e) => setFormData({...formData, appel_offre: e.target.value})} 
              />
              <Input 
                placeholder="Année début" 
                type="number"
                value={formData.annee_debut} 
                onChange={(e) => setFormData({...formData, annee_debut: e.target.value})} 
              />
              <Input 
                placeholder="Année fin" 
                type="number"
                value={formData.annee_fin} 
                onChange={(e) => setFormData({...formData, annee_fin: e.target.value})} 
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {selectedCooperation ? "Modifier" : "Créer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCooperations;
