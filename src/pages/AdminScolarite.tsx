
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Trash2, FileText, Copy, Loader2, GraduationCap } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

const CATEGORIES = [
  { key: "scolarite_inscription", label: "Inscription" },
  { key: "scolarite_examens", label: "Examens" },
  { key: "scolarite_diplomes", label: "Diplômes" },
];

const AdminScolarite = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].key);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["scolarite-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .like("category", "scolarite_%")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }: { file: File; category: string }) => {
      const ext = file.name.split(".").pop();
      const storageName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const path = `scolarite/${storageName}`;

      const { error: storageError } = await supabase.storage
        .from("files")
        .upload(path, file);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from("files").getPublicUrl(path);

      const { error: dbError } = await supabase.from("files").insert({
        name: storageName,
        original_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        category,
      });
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scolarite-files"] });
      toast({ title: "Succès", description: "Document ajouté avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de l'upload", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("files").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scolarite-files"] });
      toast({ title: "Succès", description: "Document supprimé" });
      setDeleteTarget(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      uploadMutation.mutate({ file, category: activeTab });
    });
    e.target.value = "";
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copié", description: "URL copiée dans le presse-papiers" });
  };

  const formatSize = (size: number | null) => {
    if (!size) return "—";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-xl">
            <GraduationCap className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Service de Scolarité - Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gérez les documents téléchargeables par catégorie
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CATEGORIES.map((cat, idx) => {
          const count = files.filter(f => f.category === cat.key).length;
          const themes = [
            { grad: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20", color: "text-blue-600 dark:text-blue-400", bold: "text-blue-700 dark:text-blue-300" },
            { grad: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20", color: "text-orange-600 dark:text-orange-400", bold: "text-orange-700 dark:text-orange-300" },
            { grad: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20", color: "text-green-600 dark:text-green-400", bold: "text-green-700 dark:text-green-300" },
          ];
          const theme = themes[idx];
          return (
            <Card key={cat.key} className={`border-0 shadow-lg bg-gradient-to-r ${theme.grad}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${theme.color} text-sm font-medium`}>{cat.label}</p>
                    <p className={`text-xl font-bold ${theme.bold}`}>{count}</p>
                  </div>
                  <FileText className={`h-6 w-6 ${theme.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.key} value={cat.key}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          const catFiles = files.filter((f) => f.category === cat.key);
          return (
            <TabsContent key={cat.key} value={cat.key} className="space-y-4">
              {/* Upload */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Ajouter un document — {cat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor={`file-${cat.key}`}>Sélectionner un fichier (.pdf, .docx, etc.)</Label>
                  <Input
                    id={`file-${cat.key}`}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploadMutation.isPending}
                    className="mt-2"
                  />
                  {uploadMutation.isPending && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Upload en cours...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* File list */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Documents ({catFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : catFiles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun document dans cette catégorie
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {catFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {file.original_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatSize(file.file_size)} •{" "}
                                {new Date(file.created_at).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyUrl(file.file_url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                setDeleteTarget({ id: file.id, name: file.original_name })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Supprimer le document"
        description={`Voulez-vous vraiment supprimer "${deleteTarget?.name}" ?`}
        confirmLabel="Supprimer"
        variant="destructive"
      />
    </div>
  );
};

export default AdminScolarite;
