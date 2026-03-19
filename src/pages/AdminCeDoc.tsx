import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Trash2, Plus, Upload, Loader2, Copy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateFile } from "@/utils/fileValidation";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SECTIONS = [
  {
    key: "cedoc_soutenance",
    titre: "Soutenance de Thèse Doctorale",
    description: "Formulaires pour la préparation et organisation de la soutenance",
  },
  {
    key: "cedoc_inscription",
    titre: "Inscription / Réinscription",
    description: "Documents pour l'inscription et la réinscription en doctorat",
  },
];

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "text/plain",
];

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AdminCeDoc = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["cedoc-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .in("category", ["cedoc_soutenance", "cedoc_inscription"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }: { file: File; category: string }) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
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
      queryClient.invalidateQueries({ queryKey: ["cedoc-files"] });
      toast({ title: "Succès", description: "Document ajouté avec succès." });
      setUploadingSection(null);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      setUploadingSection(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (!file) throw new Error("Fichier introuvable");

      const urlParts = file.file_url.split("/");
      const fileNameFromUrl = urlParts[urlParts.length - 1];
      await supabase.storage.from("files").remove([`files/${fileNameFromUrl}`]);

      const { error } = await supabase.from("files").delete().eq("id", fileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cedoc-files"] });
      toast({ title: "Succès", description: "Document supprimé." });
      setDeleteTarget(null);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleFileSelect = (sectionKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({ title: "Type non autorisé", description: `${file.name}: PDF, Word, Excel, images et TXT uniquement.`, variant: "destructive" });
        continue;
      }
      try {
        validateFile(file);
      } catch (err: any) {
        toast({ title: "Fichier rejeté", description: `${file.name}: ${err.message}`, variant: "destructive" });
        continue;
      }
      setUploadingSection(sectionKey);
      uploadMutation.mutate({ file, category: sectionKey });
    }

    if (fileInputRefs.current[sectionKey]) {
      fileInputRefs.current[sectionKey]!.value = "";
    }
  };

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copié", description: "URL copiée dans le presse-papiers." });
  };

  const getExtension = (name: string) => name.split(".").pop()?.toUpperCase() || "FICHIER";

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion CeDoc
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gérez les documents de soutenance et d'inscription/réinscription
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="cedoc_soutenance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>{s.titre}</TabsTrigger>
          ))}
        </TabsList>

        {SECTIONS.map((section) => {
          const sectionFiles = files.filter((f) => f.category === section.key);

          return (
            <TabsContent key={section.key} value={section.key}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{section.titre}</CardTitle>
                      <p className="text-muted-foreground mt-1">{section.description}</p>
                    </div>
                    <>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                        ref={(el) => (fileInputRefs.current[section.key] = el)}
                        onChange={(e) => handleFileSelect(section.key, e)}
                      />
                      <Button
                        onClick={() => fileInputRefs.current[section.key]?.click()}
                        disabled={uploadingSection === section.key}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {uploadingSection === section.key ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Ajouter des documents
                      </Button>
                    </>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : sectionFiles.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun document. Cliquez sur "Ajouter des documents" pour commencer.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sectionFiles.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                        >
                          <div className="flex items-center min-w-0">
                            <FileText className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{doc.original_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {getExtension(doc.original_name)} • {formatFileSize(doc.file_size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyFileUrl(doc.file_url)}
                              title="Copier l'URL"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteTarget({ id: doc.id, name: doc.original_name })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <p className="text-sm text-muted-foreground pt-2">
                        {sectionFiles.length} document(s)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Supprimer le document"
          description={`Voulez-vous vraiment supprimer "${deleteTarget.name}" ?`}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          variant="destructive"
        />
      )}
    </div>
  );
};

export default AdminCeDoc;
