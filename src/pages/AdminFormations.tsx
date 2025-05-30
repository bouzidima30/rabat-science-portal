import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Upload, GraduationCap, BookOpen, Users, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminFormations = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_formation: '',
    departement: '',
    image_url: '',
    document_url: '',
    document_name: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: formations, isLoading } = useQuery({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('formations')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
      setFormData({
        titre: '',
        description: '',
        type_formation: '',
        departement: '',
        image_url: '',
        document_url: '',
        document_name: ''
      });
      setIsEditing(false);
      toast({
        title: "Formation créée",
        description: "La formation a été créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la formation",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('formations')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
      setFormData({
        titre: '',
        description: '',
        type_formation: '',
        departement: '',
        image_url: '',
        document_url: '',
        document_name: ''
      });
      setIsEditing(false);
      setEditingId(null);
      toast({
        title: "Formation modifiée",
        description: "La formation a été modifiée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la formation",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
      toast({
        title: "Formation supprimée",
        description: "La formation a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la formation",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (formation: any) => {
    setFormData({
      titre: formation.titre,
      description: formation.description || '',
      type_formation: formation.type_formation,
      departement: formation.departement || '',
      image_url: formation.image_url || '',
      document_url: formation.document_url || '',
      document_name: formation.document_name || ''
    });
    setEditingId(formation.id);
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('formation-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('formation-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));

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

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('formation-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('formation-documents')
        .getPublicUrl(filePath);

      setFormData(prev => ({ 
        ...prev, 
        document_url: data.publicUrl,
        document_name: file.name
      }));

      toast({
        title: "Document téléchargé",
        description: "Le document a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du document",
        variant: "destructive",
      });
    }
  };

  const filteredFormations = formations?.filter(formation =>
    formation.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formation.type_formation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (formation.departement && formation.departement.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Formations
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez les formations et programmes académiques
              </p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Formation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Formations</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formations?.length || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Licences</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formations?.filter(f => f.type_formation === 'Licence').length || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Masters</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formations?.filter(f => f.type_formation === 'Master').length || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
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

      {/* Form */}
      {isEditing && (
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {editingId ? 'Modifier la Formation' : 'Nouvelle Formation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Titre *</label>
                  <Input
                    value={formData.titre}
                    onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Type de Formation *</label>
                  <Select 
                    value={formData.type_formation} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type_formation: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Licence">Licence</SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                      <SelectItem value="Formation Continue">Formation Continue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Département</label>
                <Input
                  value={formData.departement}
                  onChange={(e) => setFormData(prev => ({ ...prev, departement: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="h-12"
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-4 h-24 w-24 object-cover rounded-md shadow-sm" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Document PDF</label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDocumentUpload}
                    className="h-12"
                  />
                  {formData.document_name && (
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Fichier sélectionné: {formData.document_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Modifier' : 'Créer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                    setFormData({
                      titre: '',
                      description: '',
                      type_formation: '',
                      departement: '',
                      image_url: '',
                      document_url: '',
                      document_name: ''
                    });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formations List */}
      <div className="space-y-6">
        {filteredFormations.map((formation) => (
          <Card key={formation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{formation.titre}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant="outline" 
                      className={
                        formation.type_formation === 'Licence' ? 
                        'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300' : 
                        formation.type_formation === 'Master' ?
                        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300' :
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
                      }
                    >
                      {formation.type_formation}
                    </Badge>
                    {formation.departement && (
                      <Badge variant="outline">
                        {formation.departement}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {formation.description}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(formation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteMutation.mutate(formation.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Formation
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminFormations;
