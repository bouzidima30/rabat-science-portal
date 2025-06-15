
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

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

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventForm = ({ event, onSuccess, onCancel }: EventFormProps) => {
  const [formData, setFormData] = useState({
    titre: event?.titre || "",
    description: event?.description || "",
    date_debut: event?.date_debut || "",
    date_fin: event?.date_fin || "",
    heure_debut: event?.heure_debut || "",
    heure_fin: event?.heure_fin || "",
    lieu: event?.lieu || "",
    image_url: event?.image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
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
      setUploading(false);
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

    if (!formData.date_debut) {
      toast({
        title: "Erreur",
        description: "La date de début est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        titre: formData.titre.trim(),
        description: formData.description.trim() || null,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin || null,
        heure_debut: formData.heure_debut || null,
        heure_fin: formData.heure_fin || null,
        lieu: formData.lieu.trim() || null,
        image_url: formData.image_url || null,
        status: event?.status || 'draft',
        updated_at: new Date().toISOString(),
      };

      let result;
      if (event) {
        result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);
      } else {
        result = await supabase
          .from('events')
          .insert([eventData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Succès",
        description: event ? "Événement mis à jour avec succès." : "Événement créé avec succès.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'événement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="titre">Titre *</Label>
          <Input
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleInputChange}
            placeholder="Titre de l'événement"
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
            placeholder="Description de l'événement"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date_debut">Date de début *</Label>
            <Input
              id="date_debut"
              name="date_debut"
              type="date"
              value={formData.date_debut}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="date_fin">Date de fin</Label>
            <Input
              id="date_fin"
              name="date_fin"
              type="date"
              value={formData.date_fin}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="heure_debut">Heure de début</Label>
            <Input
              id="heure_debut"
              name="heure_debut"
              type="time"
              value={formData.heure_debut}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="heure_fin">Heure de fin</Label>
            <Input
              id="heure_fin"
              name="heure_fin"
              type="time"
              value={formData.heure_fin}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="lieu">Lieu</Label>
          <Input
            id="lieu"
            name="lieu"
            value={formData.lieu}
            onChange={handleInputChange}
            placeholder="Lieu de l'événement"
          />
        </div>

        <div>
          <Label htmlFor="image">Image de l'événement</Label>
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
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={uploading}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{uploading ? "Upload en cours..." : "Choisir une image"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? "Enregistrement..." : event ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
