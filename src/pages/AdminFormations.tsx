
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, GraduationCap, BookOpen, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface Formation {
  id: string;
  titre: string;
  description: string | null;
  type_formation: string;
  departement: string | null;
  image_url: string | null;
  document_url: string | null;
  document_name: string | null;
  created_at: string;
  updated_at: string;
}

const AdminFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_formation: 'licence',
    departement: '',
    image_url: '',
    document_url: '',
    document_name: ''
  });
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const typeFormationLabels = {
    licence: "Licence",
    master: "Master", 
    doctorat: "Doctorat",
    formation_continue: "Formation Continue"
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFormations(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les formations.",
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
      if (selectedFormation) {
        // Update existing formation
        const { error } = await supabase
          .from('formations')
          .update(formData)
          .eq('id', selectedFormation.id);

        if (error) throw error;

        await logActivity('update_formation', `Formation modifiée: ${formData.titre}`);

        toast({
          title: "Succès",
          description: "La formation a été mise à jour.",
        });
      } else {
        // Create new formation
        const { error } = await supabase
          .from('formations')
          .insert(formData);

        if (error) throw error;

        await logActivity('create_formation', `Formation créée: ${formData.titre} (${typeFormationLabels[formData.type_formation as keyof typeof typeFormationLabels]})`);

        toast({
          title: "Succès",
          description: "La formation a été créée.",
        });
      }

      setIsFormOpen(false);
      setSelectedFormation(null);
      setFormData({
        titre: '',
        description: '',
        type_formation: 'licence',
        departement: '',
        image_url: '',
        document_url: '',
        document_name: ''
      });
      fetchFormations();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la formation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return;

    try {
      const formation = formations.find(f => f.id === id);
      const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logActivity('delete_formation', `Formation supprimée: ${formation?.titre || 'ID: ' + id}`);

      toast({
        title: "Succès",
        description: "La formation a été supprimée.",
      });

      fetchFormations();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la formation.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (formation: Formation) => {
    setSelectedFormation(formation);
    setFormData({
      titre: formation.titre,
      description: formation.description || '',
      type_formation: formation.type_formation,
      departement: formation.departement || '',
      image_url: formation.image_url || '',
      document_url: formation.document_url || '',
      document_name: formation.document_name || ''
    });
    setIsFormOpen(true);
  };

  const filteredFormations = formations.filter(formation =>
    formation.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formation.type_formation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (formation.departement && formation.departement.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formationsByType = formations.reduce((acc, formation) => {
    acc[formation.type_formation] = (acc[formation.type_formation] || 0) + 1;
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
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
              <GraduationCap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Formations
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez l'offre de formations de la faculté
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedFormation(null);
              setFormData({
                titre: '',
                description: '',
                type_formation: 'licence',
                departement: '',
                image_url: '',
                document_url: '',
                document_name: ''
              });
              setIsFormOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{formations.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Licence</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formationsByType.licence || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Master</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formationsByType.master || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Doctorat</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formationsByType.doctorat || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
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
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formations List */}
      <div className="space-y-6">
        {filteredFormations.map((formation) => (
          <Card key={formation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  {formation.image_url && (
                    <img 
                      src={formation.image_url} 
                      alt={formation.titre}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {formation.titre}
                      </h3>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(formation)}
                          className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(formation.id)}
                          className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                      >
                        {typeFormationLabels[formation.type_formation as keyof typeof typeFormationLabels]}
                      </Badge>
                      {formation.departement && (
                        <Badge variant="outline">
                          {formation.departement}
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(formation.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    {formation.description && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {formation.description.length > 200 
                          ? formation.description.substring(0, 200) + "..." 
                          : formation.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFormations.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucune formation trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Créez votre première formation pour commencer."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle formation
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
              {selectedFormation ? "Modifier la formation" : "Nouvelle formation"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Titre de la formation" 
              value={formData.titre} 
              onChange={(e) => setFormData({...formData, titre: e.target.value})} 
              required 
            />
            <Textarea 
              placeholder="Description de la formation..." 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              rows={4}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de formation</label>
                <select
                  value={formData.type_formation}
                  onChange={(e) => setFormData({...formData, type_formation: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="licence">Licence</option>
                  <option value="master">Master</option>
                  <option value="doctorat">Doctorat</option>
                  <option value="formation_continue">Formation Continue</option>
                </select>
              </div>
              <Input 
                placeholder="Département" 
                value={formData.departement} 
                onChange={(e) => setFormData({...formData, departement: e.target.value})} 
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {selectedFormation ? "Modifier" : "Créer"}
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

export default AdminFormations;
