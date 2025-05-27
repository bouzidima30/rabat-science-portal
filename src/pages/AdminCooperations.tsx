
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCooperations = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    type_cooperation: '',
    domaine_recherche: '',
    pays: [] as string[],
    appel_offre: '',
    annee_debut: '',
    annee_fin: '',
    coordinateur: '',
    email_coordinateur: '',
    description: '',
    partenaires: [] as string[],
    image_url: ''
  });
  const [newPays, setNewPays] = useState('');
  const [newPartenaire, setNewPartenaire] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cooperations, isLoading } = useQuery({
    queryKey: ['admin-cooperations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cooperations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('cooperations')
        .insert([{
          ...data,
          annee_debut: data.annee_debut ? parseInt(data.annee_debut) : null,
          annee_fin: data.annee_fin ? parseInt(data.annee_fin) : null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cooperations'] });
      resetForm();
      toast({
        title: "Coopération créée",
        description: "La coopération a été créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la coopération",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('cooperations')
        .update({
          ...data,
          annee_debut: data.annee_debut ? parseInt(data.annee_debut) : null,
          annee_fin: data.annee_fin ? parseInt(data.annee_fin) : null
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cooperations'] });
      resetForm();
      toast({
        title: "Coopération modifiée",
        description: "La coopération a été modifiée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la coopération",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cooperations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cooperations'] });
      toast({
        title: "Coopération supprimée",
        description: "La coopération a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la coopération",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      titre: '',
      type_cooperation: '',
      domaine_recherche: '',
      pays: [],
      appel_offre: '',
      annee_debut: '',
      annee_fin: '',
      coordinateur: '',
      email_coordinateur: '',
      description: '',
      partenaires: [],
      image_url: ''
    });
    setIsEditing(false);
    setEditingId(null);
    setNewPays('');
    setNewPartenaire('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (cooperation: any) => {
    setFormData({
      titre: cooperation.titre,
      type_cooperation: cooperation.type_cooperation,
      domaine_recherche: cooperation.domaine_recherche || '',
      pays: cooperation.pays || [],
      appel_offre: cooperation.appel_offre || '',
      annee_debut: cooperation.annee_debut?.toString() || '',
      annee_fin: cooperation.annee_fin?.toString() || '',
      coordinateur: cooperation.coordinateur || '',
      email_coordinateur: cooperation.email_coordinateur || '',
      description: cooperation.description || '',
      partenaires: cooperation.partenaires || [],
      image_url: cooperation.image_url || ''
    });
    setEditingId(cooperation.id);
    setIsEditing(true);
  };

  const addPays = () => {
    if (newPays.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        pays: [...prev.pays, newPays.trim()] 
      }));
      setNewPays('');
    }
  };

  const removePays = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      pays: prev.pays.filter((_, i) => i !== index) 
    }));
  };

  const addPartenaire = () => {
    if (newPartenaire.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        partenaires: [...prev.partenaires, newPartenaire.trim()] 
      }));
      setNewPartenaire('');
    }
  };

  const removePartenaire = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      partenaires: prev.partenaires.filter((_, i) => i !== index) 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cooperation-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('cooperation-images')
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

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des Coopérations
        </h1>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Coopération
        </Button>
      </div>

      {isEditing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Modifier la Coopération' : 'Nouvelle Coopération'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <Input
                    value={formData.titre}
                    onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <Select 
                    value={formData.type_cooperation} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type_cooperation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nationale">Nationale</SelectItem>
                      <SelectItem value="Internationale">Internationale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Domaine de recherche</label>
                  <Input
                    value={formData.domaine_recherche}
                    onChange={(e) => setFormData(prev => ({ ...prev, domaine_recherche: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coordinateur</label>
                  <Input
                    value={formData.coordinateur}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordinateur: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email coordinateur</label>
                  <Input
                    type="email"
                    value={formData.email_coordinateur}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_coordinateur: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Appel d'offre</label>
                  <Input
                    value={formData.appel_offre}
                    onChange={(e) => setFormData(prev => ({ ...prev, appel_offre: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Année début</label>
                  <Input
                    type="number"
                    value={formData.annee_debut}
                    onChange={(e) => setFormData(prev => ({ ...prev, annee_debut: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Année fin (optionnel)</label>
                  <Input
                    type="number"
                    value={formData.annee_fin}
                    onChange={(e) => setFormData(prev => ({ ...prev, annee_fin: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              {formData.type_cooperation === 'Internationale' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Pays</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newPays}
                      onChange={(e) => setNewPays(e.target.value)}
                      placeholder="Ajouter un pays"
                    />
                    <Button type="button" onClick={addPays}>Ajouter</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.pays.map((pays, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{pays}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removePays(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Partenaires</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newPartenaire}
                    onChange={(e) => setNewPartenaire(e.target.value)}
                    placeholder="Ajouter un partenaire"
                  />
                  <Button type="button" onClick={addPartenaire}>Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.partenaires.map((partenaire, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{partenaire}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removePartenaire(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Modifier' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {cooperations?.map((cooperation) => (
          <Card key={cooperation.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{cooperation.titre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cooperation.type_cooperation} - {cooperation.domaine_recherche}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {cooperation.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {cooperation.annee_debut} {cooperation.annee_fin && `- ${cooperation.annee_fin}`}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cooperation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteMutation.mutate(cooperation.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCooperations;
