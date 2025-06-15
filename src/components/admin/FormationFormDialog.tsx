import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, FileText } from "lucide-react";
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
  status?: string;
  created_at: string;
  updated_at: string;
}

interface FormationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formation?: Formation | null;
  onSuccess: () => void;
}

const FormationFormDialog = ({ isOpen, onClose, formation, onSuccess }: FormationFormDialogProps) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_formation: 'Licence',
    departement: '',
    image_url: '',
    document_url: '',
    document_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const typeFormationLabels = {
    'Licence': "Licence",
    'Master': "Master", 
    'Doctorat': "Doctorat",
    'Formation Continue': "Formation Continue"
  };

  const departements = [
    'Biologie',
    'Chimie',
    'Géologie',
    'Informatique',
    'Mathématiques',
    'Physique'
  ];

  // Reset form data when dialog opens/closes or formation changes
  useEffect(() => {
    if (isOpen) {
      if (formation) {
        console.log('Formation data loaded:', formation);
        setFormData({
          titre: formation.titre || '',
          description: formation.description || '',
          type_formation: formation.type_formation || 'Licence',
          departement: formation.departement || '',
          image_url: formation.image_url || '',
          document_url: formation.document_url || '',
          document_name: formation.document_name || ''
        });
      } else {
        setFormData({
          titre: '',
          description: '',
          type_formation: 'Licence',
          departement: '',
          image_url: '',
          document_url: '',
          document_name: ''
        });
      }
    }
  }, [isOpen, formation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2)}.${fileExt}`;
      const filePath = `formations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('formation-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('formation-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast({
        title: "Succès",
        description: "Image uploadée avec succès.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "Le document ne doit pas dépasser 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingDocument(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('formation-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('formation-documents')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        document_url: publicUrl,
        document_name: file.name
      }));

      toast({
        title: "Succès",
        description: "Document uploadé avec succès.",
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le document.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formationData = {
        titre: formData.titre.trim(),
        description: formData.description.trim() || null,
        type_formation: formData.type_formation,
        departement: formData.departement.trim() || null,
        image_url: formData.image_url || null,
        document_url: formData.document_url || null,
        document_name: formData.document_name || null,
        status: formation?.status || 'draft',
        updated_at: new Date().toISOString(),
      };

      console.log('Formation data being sent:', formationData);
      console.log('Type formation value:', formData.type_formation);

      let result;
      if (formation) {
        result = await supabase
          .from('formations')
          .update(formationData)
          .eq('id', formation.id);
      } else {
        result = await supabase
          .from('formations')
          .insert([formationData]);
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error details:', result.error);
        throw result.error;
      }

      await logActivity(
        formation ? 'update_formation' : 'create_formation',
        `Formation ${formation ? 'modifiée' : 'créée'}: ${formData.titre} (${typeFormationLabels[formData.type_formation as keyof typeof typeFormationLabels]})`
      );

      toast({
        title: "Succès",
        description: formation ? "Formation mise à jour avec succès." : "Formation créée avec succès.",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving formation:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {formation ? "Modifier la formation" : "Nouvelle formation"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                placeholder="Titre de la formation"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la formation"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type_formation">Type de formation *</Label>
                <Select 
                  value={formData.type_formation} 
                  onValueChange={(value) => handleSelectChange('type_formation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Licence">Licence</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Doctorat">Doctorat</SelectItem>
                    <SelectItem value="Formation Continue">Formation Continue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="departement">Département</Label>
                <Select 
                  value={formData.departement} 
                  onValueChange={(value) => handleSelectChange('departement', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departements.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Image de la formation</Label>
              <div className="mt-2 space-y-4">
                {formData.image_url && (
                  <div className="relative inline-block">
                    <img
                      src={formData.image_url}
                      alt="Aperçu"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    disabled={uploadingImage}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploadingImage ? "Upload en cours..." : "Choisir une image"}</span>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="document">Document de la formation</Label>
              <div className="mt-2 space-y-4">
                {formData.document_url && (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span className="flex-1 text-sm">{formData.document_name}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, document_url: "", document_name: "" }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocumentUpload}
                    disabled={uploadingDocument}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('document')?.click()}
                    disabled={uploadingDocument}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploadingDocument ? "Upload en cours..." : "Choisir un document"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || uploadingImage || uploadingDocument}>
              {loading ? "Enregistrement..." : formation ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormationFormDialog;
