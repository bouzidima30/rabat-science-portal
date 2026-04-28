import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Folder, File, Trash2, Archive, Loader2, CalendarClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";

interface FileManagerItem {
  id: string;
  name: string;
  type: "folder" | "file";
  file_url?: string | null;
  file_size?: number | null;
  parent_id?: string | null;
  category?: string | null;
}

const CATEGORIES = [
  { key: "planning_evaluations", label: "Planning des Évaluations" },
  { key: "calendrier_evaluations", label: "Calendrier des Évaluations de Fin de Semestre" },
];

const AdminPlanningEvaluations = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].key);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-planning-evaluations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("file_manager")
        .select("*")
        .in("category", CATEGORIES.map(c => c.key))
        .order("type", { ascending: false })
        .order("name");
      if (error) throw error;
      return data as FileManagerItem[];
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const allItems = items || [];
      const item = allItems.find((i) => i.id === itemId);
      if (item?.type === "file" && item.file_url) {
        const filePath = item.file_url.split("/").slice(-2).join("/");
        await supabase.storage.from("files").remove([filePath]);
      }
      if (item?.type === "folder") {
        const children = allItems.filter((i) => i.parent_id === itemId);
        for (const child of children) {
          await deleteItemMutation.mutateAsync(child.id);
        }
      }
      const { error } = await supabase.from("file_manager").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-planning-evaluations"] });
      toast({ title: "Supprimé", description: "L'élément a été supprimé" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    },
  });

  const deleteAllForCategory = useMutation({
    mutationFn: async (category: string) => {
      const catItems = items?.filter((i) => i.category === category) || [];
      const files = catItems.filter((i) => i.type === "file" && i.file_url);
      for (const file of files) {
        const filePath = file.file_url!.split("/").slice(-2).join("/");
        await supabase.storage.from("files").remove([filePath]);
      }
      const ids = catItems.map((i) => i.id);
      if (ids.length > 0) {
        const { error } = await supabase.from("file_manager").delete().in("id", ids);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-planning-evaluations"] });
      toast({ title: "Tout supprimé", description: "Tous les fichiers de cette catégorie ont été supprimés" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de tout supprimer", variant: "destructive" });
    },
  });

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
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
      const folderMap = new Map<string, string>();

      const sorted = entries.sort(([a], [b]) => {
        const aIsDir = a.endsWith("/");
        const bIsDir = b.endsWith("/");
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

      let processed = 0;

      for (const [relativePath, zipEntry] of sorted) {
        if (relativePath.startsWith("__MACOSX") || relativePath.includes("/._") || relativePath.startsWith(".")) {
          processed++;
          continue;
        }

        const parts = relativePath.replace(/\/$/, "").split("/");
        const name = parts[parts.length - 1];
        if (!name) { processed++; continue; }

        const parentPath = parts.slice(0, -1).join("/");
        const parentId = parentPath ? folderMap.get(parentPath) || null : null;

        if (zipEntry.dir) {
          setProgressLabel(`Création du dossier: ${name}`);
          const { data, error } = await supabase
            .from("file_manager")
            .insert({ name, type: "folder", parent_id: parentId, category })
            .select()
            .single();
          if (error) throw error;
          folderMap.set(relativePath.replace(/\/$/, ""), data.id);
        } else {
          setProgressLabel(`Téléchargement: ${name}`);
          const blob = await zipEntry.async("blob");
          const ext = name.split(".").pop() || "bin";
          const storageName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
          const storagePath = `planning-evaluations/${storageName}`;

          const { error: uploadError } = await supabase.storage.from("files").upload(storagePath, blob);
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage.from("files").getPublicUrl(storagePath);

          const mimeGuess = ext === "pdf" ? "application/pdf"
            : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : ext === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : ext === "png" ? "image/png"
            : ext === "jpg" || ext === "jpeg" ? "image/jpeg"
            : "application/octet-stream";

          const { error: dbError } = await supabase
            .from("file_manager")
            .insert({ name, type: "file", file_url: publicUrl, file_size: blob.size, mime_type: mimeGuess, parent_id: parentId, category });
          if (dbError) throw dbError;
        }

        processed++;
        setProgress(Math.round((processed / totalEntries) * 100));
      }

      queryClient.invalidateQueries({ queryKey: ["admin-planning-evaluations"] });
      toast({ title: "Import terminé", description: "Les fichiers ont été importés avec succès" });
    } catch (err: any) {
      console.error("ZIP upload error:", err);
      toast({ title: "Erreur d'import", description: err?.message || "Impossible d'importer le fichier ZIP", variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
      setProgressLabel("");
      e.target.value = "";
    }
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderItem = (item: FileManagerItem, allItems: FileManagerItem[], level: number = 0) => {
    const children = allItems.filter((i) => i.parent_id === item.id);
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
        {item.type === "folder" && children.map((child) => renderItem(child, allItems, level + 1))}
      </div>
    );
  };

  const renderCategoryContent = (categoryKey: string) => {
    const catItems = items?.filter((i) => i.category === categoryKey) || [];
    const rootItems = catItems.filter((i) => !i.parent_id);
    const folders = catItems.filter((i) => i.type === "folder");

    return (
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          {catItems.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Supprimer tous les fichiers de cette catégorie ?")) {
                  deleteAllForCategory.mutate(categoryKey);
                }
              }}
              disabled={deleteAllForCategory.isPending || uploading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Tout supprimer
            </Button>
          )}
          <Button size="sm" asChild disabled={uploading} className="bg-purple-600 hover:bg-purple-700 shadow-lg">
            <label className="cursor-pointer">
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Archive className="h-4 w-4 mr-2" />}
              {uploading ? "Import en cours..." : "Importer un .zip"}
              <input type="file" accept=".zip" onChange={(e) => handleZipUpload(e, categoryKey)} className="hidden" disabled={uploading} />
            </label>
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>Structure des fichiers</span>
              {catItems.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {folders.length} dossier(s), {catItems.length - folders.length} fichier(s)
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
                <p className="text-muted-foreground">Aucun fichier. Importez un fichier .zip pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {rootItems.map((item) => renderItem(item, catItems))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
            <CalendarClock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Planning & Calendrier des Évaluations
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Importez des fichiers .zip pour le planning des évaluations et le calendrier de fin de semestre
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {CATEGORIES.map((cat, idx) => {
          const count = items?.filter(i => i.category === cat.key).length || 0;
          const gradients = [
            "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-purple-600 dark:text-purple-400",
            "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 text-pink-600 dark:text-pink-400",
          ];
          const [grad, color] = [gradients[idx].split(" ").slice(0, 4).join(" "), gradients[idx].split(" ").slice(4).join(" ")];
          return (
            <Card key={cat.key} className={`border-0 shadow-lg bg-gradient-to-r ${grad}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${color} text-sm font-medium`}>{cat.label}</p>
                    <p className={`text-xl font-bold ${color.replace('600', '700').replace('400', '300')}`}>{count}</p>
                  </div>
                  <Archive className={`h-6 w-6 ${color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {uploading && (
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{progressLabel}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.key} value={cat.key}>{cat.label}</TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.key} value={cat.key}>
            {renderCategoryContent(cat.key)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminPlanningEvaluations;
