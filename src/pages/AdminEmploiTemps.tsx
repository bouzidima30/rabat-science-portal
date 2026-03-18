import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Folder, File, Trash2, Upload, Archive, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";

interface FileManagerItem {
  id: string;
  name: string;
  type: "folder" | "file";
  file_url?: string | null;
  file_size?: number | null;
  parent_id?: string | null;
}

const AdminEmploiTemps = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-file-manager"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("file_manager")
        .select("*")
        .order("type", { ascending: false })
        .order("name");
      if (error) throw error;
      return data as FileManagerItem[];
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const item = items?.find((i) => i.id === itemId);
      if (item?.type === "file" && item.file_url) {
        const filePath = item.file_url.split("/").slice(-2).join("/");
        await supabase.storage.from("files").remove([filePath]);
      }
      // Also delete children if it's a folder
      if (item?.type === "folder") {
        const children = items?.filter((i) => i.parent_id === itemId) || [];
        for (const child of children) {
          await deleteItemMutation.mutateAsync(child.id);
        }
      }
      const { error } = await supabase
        .from("file_manager")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-file-manager"] });
      toast({ title: "Élément supprimé", description: "L'élément a été supprimé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de supprimer l'élément", variant: "destructive" });
      console.error(error);
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      // Delete all files from storage
      const files = items?.filter((i) => i.type === "file" && i.file_url) || [];
      for (const file of files) {
        const filePath = file.file_url!.split("/").slice(-2).join("/");
        await supabase.storage.from("files").remove([filePath]);
      }
      // Delete all records
      const { error } = await supabase
        .from("file_manager")
        .delete()
        .not("id", "is", null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-file-manager"] });
      toast({ title: "Tout supprimé", description: "Tous les emplois du temps ont été supprimés" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de tout supprimer", variant: "destructive" });
      console.error(error);
    },
  });

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast({ title: "Fichier invalide", description: "Veuillez sélectionner un fichier .zip", variant: "destructive" });
      return;
    }

    setUploading(true);
    setProgress(0);
    setProgressLabel("Extraction du fichier ZIP...");

    try {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.entries(zip.files);
      const totalEntries = entries.length;

      // Map folder paths to their DB ids
      const folderMap = new Map<string, string>();

      // Sort entries so folders come before files
      const sorted = entries.sort(([a], [b]) => {
        const aIsDir = a.endsWith("/");
        const bIsDir = b.endsWith("/");
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

      let processed = 0;

      for (const [relativePath, zipEntry] of sorted) {
        // Skip __MACOSX and hidden files
        if (relativePath.startsWith("__MACOSX") || relativePath.includes("/._") || relativePath.startsWith(".")) {
          processed++;
          continue;
        }

        const parts = relativePath.replace(/\/$/, "").split("/");
        const name = parts[parts.length - 1];
        if (!name) { processed++; continue; }

        // Determine parent folder path
        const parentPath = parts.slice(0, -1).join("/");
        const parentId = parentPath ? folderMap.get(parentPath) || null : null;

        if (zipEntry.dir) {
          // Create folder in DB
          setProgressLabel(`Création du dossier: ${name}`);
          const { data, error } = await supabase
            .from("file_manager")
            .insert({ name, type: "folder", parent_id: parentId, category: "emploi_temps" })
            .select()
            .single();
          if (error) throw error;
          folderMap.set(relativePath.replace(/\/$/, ""), data.id);
        } else {
          // Upload file to storage then record in DB
          setProgressLabel(`Téléchargement: ${name}`);
          const blob = await zipEntry.async("blob");
          const ext = name.split(".").pop() || "bin";
          const storageName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
          const storagePath = `emploi-temps/${storageName}`;

          const { error: uploadError } = await supabase.storage
            .from("files")
            .upload(storagePath, blob);
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("files")
            .getPublicUrl(storagePath);

          const mimeGuess = ext === "pdf" ? "application/pdf"
            : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : ext === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : ext === "png" ? "image/png"
            : ext === "jpg" || ext === "jpeg" ? "image/jpeg"
            : "application/octet-stream";

          const { error: dbError } = await supabase
            .from("file_manager")
            .insert({
              name,
              type: "file",
              file_url: publicUrl,
              file_size: blob.size,
              mime_type: mimeGuess,
              parent_id: parentId,
            });
          if (dbError) throw dbError;
        }

        processed++;
        setProgress(Math.round((processed / totalEntries) * 100));
      }

      queryClient.invalidateQueries({ queryKey: ["admin-file-manager"] });
      toast({ title: "Import terminé", description: "Les emplois du temps ont été importés avec succès" });
    } catch (err: any) {
      console.error("ZIP upload error:", err);
      toast({ title: "Erreur d'import", description: err?.message || "Impossible d'importer le fichier ZIP", variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
      setProgressLabel("");
      // Reset input
      e.target.value = "";
    }
  };

  const folders = items?.filter((item) => item.type === "folder") || [];
  const rootItems = items?.filter((item) => !item.parent_id) || [];

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderItem = (item: FileManagerItem, level: number = 0) => {
    const children = items?.filter((i) => i.parent_id === item.id) || [];
    return (
      <div key={item.id} className="space-y-1">
        <div
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {item.type === "folder" ? (
              <Folder className="h-5 w-5 text-primary shrink-0" />
            ) : (
              <File className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              {item.type === "file" && item.file_size && (
                <p className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteItemMutation.mutate(item.id)}
            className="text-destructive hover:text-destructive shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {item.type === "folder" && children.map((child) => renderItem(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Emplois du Temps</h1>
          <p className="text-muted-foreground mt-2">
            Importez un fichier .zip contenant les dossiers et fichiers des emplois du temps
          </p>
        </div>

        <div className="flex gap-2">
          {items && items.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir supprimer tous les emplois du temps ?")) {
                  deleteAllMutation.mutate();
                }
              }}
              disabled={deleteAllMutation.isPending || uploading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Tout supprimer
            </Button>
          )}

          <Button asChild disabled={uploading}>
            <label className="cursor-pointer">
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              {uploading ? "Import en cours..." : "Importer un .zip"}
              <input
                type="file"
                accept=".zip"
                onChange={handleZipUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </Button>
        </div>
      </div>

      {uploading && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{progressLabel}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Structure des fichiers</span>
            {items && items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {folders.length} dossier(s), {(items.length - folders.length)} fichier(s)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rootItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Archive className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Aucun emploi du temps. Importez un fichier .zip pour commencer.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {rootItems.map((item) => renderItem(item))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmploiTemps;
