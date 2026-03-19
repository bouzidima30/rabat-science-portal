import { useState, useRef } from "react";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, Plus, Upload, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { validateFile } from "@/utils/fileValidation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";

const SECTIONS = [
  {
    key: "cedoc_soutenance",
    titre: "Soutenance de Thèse Doctorale",
    description: "Formulaires nécessaires pour la préparation et organisation de la soutenance",
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

const CeDoc = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin } = useUserRole();
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

      const { error: storageError } = await supabase.storage
        .from("files")
        .upload(filePath, file);
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
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: "Type non autorisé", description: "PDF, Word, Excel, images et TXT uniquement.", variant: "destructive" });
      return;
    }

    try {
      validateFile(file);
    } catch (err: any) {
      toast({ title: "Fichier rejeté", description: err.message, variant: "destructive" });
      return;
    }

    setUploadingSection(sectionKey);
    uploadMutation.mutate({ file, category: sectionKey });

    if (fileInputRefs.current[sectionKey]) {
      fileInputRefs.current[sectionKey]!.value = "";
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Erreur", description: "Impossible de télécharger le fichier.", variant: "destructive" });
    }
  };

  const getExtension = (name: string) => {
    const ext = name.split(".").pop()?.toUpperCase();
    return ext || "FICHIER";
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            CeDoc - Centre de Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Téléchargez tous les formulaires nécessaires pour la soutenance de thèse doctorale
            et les procédures d'inscription/réinscription.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {SECTIONS.map((section) => {
            const sectionFiles = files.filter((f) => f.category === section.key);

            return (
              <Card key={section.key} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-primary flex items-center">
                      <FileText className="h-6 w-6 mr-2" />
                      {section.titre}
                    </CardTitle>
                    {isAdmin && (
                      <>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                          ref={(el) => (fileInputRefs.current[section.key] = el)}
                          onChange={(e) => handleFileSelect(section.key, e)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileInputRefs.current[section.key]?.click()}
                          disabled={uploadingSection === section.key}
                        >
                          {uploadingSection === section.key ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}
                          Ajouter
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-muted-foreground">{section.description}</p>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : sectionFiles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">
                      Aucun document disponible.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {sectionFiles.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center min-w-0">
                            <FileText className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {doc.original_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {getExtension(doc.original_name)} • {formatFileSize(doc.file_size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => handleDownload(doc.file_url, doc.original_name)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() =>
                                  setDeleteTarget({ id: doc.id, name: doc.original_name })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Information importante
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200">
                  Tous les formulaires doivent être dûment remplis et signés avant soumission.
                  Pour toute question, contactez le secrétariat du CeDoc.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={() => setDeleteTarget(null)}
          title="Supprimer le document"
          description={`Voulez-vous vraiment supprimer "${deleteTarget.name}" ?`}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        />
      )}

      <Footer />
    </div>
  );
};

export default CeDoc;
