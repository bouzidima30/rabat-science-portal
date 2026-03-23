import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, FileText, Download, Copy, Award, Users, GraduationCap, PenLine, Mic, CheckCircle } from "lucide-react";
import { validateFile } from "@/utils/fileValidation";
import ConfirmDialog from "@/components/ConfirmDialog";

const SUB_SECTIONS = [
  { suffix: "ecrit", label: "Candidats convoqués – Examen écrit", icon: PenLine },
  { suffix: "oral", label: "Candidats admis – Examen oral", icon: Mic },
  { suffix: "retenus", label: "Candidats retenus", icon: CheckCircle },
];

const CYCLES = [
  { key: "preselection_licence", label: "Cycle Licence d'Excellence", icon: Award, color: "text-yellow-600" },
  { key: "preselection_master", label: "Cycle Master", icon: Users, color: "text-blue-600" },
  { key: "preselection_doctorat", label: "Cycle Doctorat", icon: GraduationCap, color: "text-purple-600" },
];

const ALL_CATEGORIES = CYCLES.flatMap(c => SUB_SECTIONS.map(s => `${c.key}_${s.suffix}`));

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png";

const AdminPreselection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCycle, setActiveCycle] = useState(CYCLES[0].key);
  const [activeSub, setActiveSub] = useState(SUB_SECTIONS[0].suffix);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; url: string } | null>(null);

  const activeCategory = `${activeCycle}_${activeSub}`;

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["preselection-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .in("category", ALL_CATEGORIES)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }: { file: File; category: string }) => {
      validateFile(file);
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `files/${fileName}`;

      const { error: storageError } = await supabase.storage.from("files").upload(filePath, file);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from("files").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("files").insert({
        name: fileName,
        original_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        category,
      });
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preselection-files"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      const parts = url.split("/");
      const fileNameFromUrl = parts[parts.length - 1];
      await supabase.storage.from("files").remove([`files/${fileNameFromUrl}`]);
      const { error } = await supabase.from("files").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preselection-files"] });
      toast({ title: "Succès", description: "Fichier supprimé" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setUploading(true);
    let count = 0;
    for (const file of selectedFiles) {
      try {
        await uploadMutation.mutateAsync({ file, category: activeCategory });
        count++;
      } catch (err: any) {
        toast({ title: "Fichier rejeté", description: `${file.name}: ${err.message}`, variant: "destructive" });
      }
    }
    if (count > 0) {
      toast({ title: "Succès", description: `${count} fichier(s) ajouté(s)` });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (size: number | null) => {
    if (!size) return "—";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const catFiles = files.filter(f => f.category === activeCategory);
  const currentCycleLabel = CYCLES.find(c => c.key === activeCycle)?.label;
  const currentSubLabel = SUB_SECTIONS.find(s => s.suffix === activeSub)?.label;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
          <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Listes de Présélection</h1>
          <p className="text-muted-foreground">Gérez les documents de présélection par cycle et par étape</p>
        </div>
      </div>

      {/* Cycle tabs */}
      <Tabs value={activeCycle} onValueChange={setActiveCycle}>
        <TabsList className="grid w-full grid-cols-3">
          {CYCLES.map(c => {
            const Icon = c.icon;
            return (
              <TabsTrigger key={c.key} value={c.key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{c.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Sub-section selector */}
      <Select value={activeSub} onValueChange={setActiveSub}>
        <SelectTrigger className="w-full sm:w-96">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUB_SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <SelectItem key={s.suffix} value={s.suffix}>
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {s.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* File list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg">
            {currentCycleLabel} — {currentSubLabel} ({catFiles.length} fichiers)
          </CardTitle>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[#006be5] hover:bg-[#0056b3]"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Upload..." : "Ajouter des fichiers"}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Chargement...</p>
          ) : catFiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun fichier dans cette catégorie</p>
          ) : (
            <div className="space-y-2">
              {catFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-[#006be5] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{file.original_name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(file.file_url);
                        toast({ title: "URL copiée" });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(file.file_url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget({ id: file.id, name: file.original_name, url: file.file_url })}
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

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        onChange={handleUpload}
        className="hidden"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ id: deleteTarget.id, url: deleteTarget.url });
            setDeleteTarget(null);
          }
        }}
        title="Supprimer le fichier"
        description={`Voulez-vous vraiment supprimer "${deleteTarget?.name}" ?`}
      />
    </div>
  );
};

export default AdminPreselection;
