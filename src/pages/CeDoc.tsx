import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const CeDoc = () => {
  const { toast } = useToast();

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

  const getExtension = (name: string) => name.split(".").pop()?.toUpperCase() || "FICHIER";

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
                  <CardTitle className="text-xl text-primary flex items-center">
                    <FileText className="h-6 w-6 mr-2" />
                    {section.titre}
                  </CardTitle>
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
                              <p className="font-medium text-foreground truncate">{doc.original_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {getExtension(doc.original_name)} • {formatFileSize(doc.file_size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 flex-shrink-0 ml-2"
                            onClick={() => handleDownload(doc.file_url, doc.original_name)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
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

      <Footer />
    </div>
  );
};

export default CeDoc;
