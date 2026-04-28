import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import OptimizedImage from "@/components/OptimizedImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, Upload } from "lucide-react";
import { z } from "zod";

interface Club {
  id: string;
  titre: string;
  image_url: string | null;
  display_order: number;
}

const clubSchema = z.object({
  titre: z
    .string()
    .trim()
    .nonempty({ message: "Le titre est requis" })
    .max(150, { message: "Le titre doit faire moins de 150 caractères" }),
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const AdminClubs = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Club | null>(null);
  const [titre, setTitre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Club | null>(null);

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["admin-clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as Club[];
    },
  });

  const resetForm = () => {
    setEditing(null);
    setTitre("");
    setFile(null);
    setExistingImage(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (club: Club) => {
    setEditing(club);
    setTitre(club.titre);
    setExistingImage(club.image_url);
    setFile(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      toast({
        title: "Format non supporté",
        description: "Utilisez JPG, PNG, WEBP ou GIF",
        variant: "destructive",
      });
      return;
    }
    if (f.size > MAX_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "Taille maximale : 5 Mo",
        variant: "destructive",
      });
      return;
    }
    setFile(f);
  };

  const uploadImage = async (f: File): Promise<string> => {
    const ext = f.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("club-images")
      .upload(filename, f, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("club-images").getPublicUrl(filename);
    return data.publicUrl;
  };

  const removeStoredImage = async (url: string | null) => {
    if (!url) return;
    const marker = "/club-images/";
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    await supabase.storage.from("club-images").remove([path]);
  };

  const handleSubmit = async () => {
    const parsed = clubSchema.safeParse({ titre });
    if (!parsed.success) {
      toast({
        title: "Erreur de validation",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = existingImage;
      if (file) {
        imageUrl = await uploadImage(file);
        // Remove old image when replacing during edit
        if (editing?.image_url) {
          await removeStoredImage(editing.image_url);
        }
      }

      if (editing) {
        const { error } = await supabase
          .from("clubs")
          .update({ titre: parsed.data.titre, image_url: imageUrl })
          .eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Club modifié avec succès" });
      } else {
        const nextOrder = clubs.length
          ? Math.max(...clubs.map((c) => c.display_order)) + 1
          : 0;
        const { error } = await supabase.from("clubs").insert({
          titre: parsed.data.titre,
          image_url: imageUrl,
          display_order: nextOrder,
        });
        if (error) throw error;
        toast({ title: "Club ajouté avec succès" });
      }

      setDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      queryClient.invalidateQueries({ queryKey: ["public-clubs"] });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const { error } = await supabase.from("clubs").delete().eq("id", toDelete.id);
      if (error) throw error;
      await removeStoredImage(toDelete.image_url);
      toast({ title: "Club supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      queryClient.invalidateQueries({ queryKey: ["public-clubs"] });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Suppression impossible",
        variant: "destructive",
      });
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Clubs para-universitaires
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gérez les clubs affichés sur la page des activités para-universitaires
            </p>
          </div>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter un club
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : clubs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Aucun club pour le moment. Cliquez sur « Ajouter un club » pour commencer.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={club.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                {club.image_url ? (
                  <OptimizedImage
                    src={club.image_url}
                    alt={club.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Users className="h-12 w-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {club.titre}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(club)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => setToDelete(club)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier le club" : "Ajouter un club"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="club-titre">Titre</Label>
              <Input
                id="club-titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex. Club Scientifique"
                maxLength={150}
              />
            </div>
            <div>
              <Label htmlFor="club-image">Photo du club</Label>
              <Input
                id="club-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, WEBP ou GIF — 5 Mo maximum
              </p>
              {(file || existingImage) && (
                <div className="mt-3 aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                  <img
                    src={file ? URL.createObjectURL(file) : existingImage!}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                "Enregistrement..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {editing ? "Mettre à jour" : "Ajouter"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer ce club ?"
        description={`Le club "${toDelete?.titre}" sera supprimé définitivement.`}
        confirmLabel="Supprimer"
        variant="destructive"
      />
    </div>
  );
};

export default AdminClubs;