
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, Phone, Mail, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { key: "scolarite_inscription", label: "Inscription", icon: FileText },
  { key: "scolarite_examens", label: "Examens", icon: FileText },
  { key: "scolarite_diplomes", label: "Diplômes", icon: FileText },
];

const ServiceScolarite = () => {
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["scolarite-public-files"],
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

  const formatSize = (size: number | null) => {
    if (!size) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Service de Scolarité
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Téléchargez tous les formulaires et documents administratifs nécessaires 
            pour vos démarches académiques.
          </p>
        </div>

        {/* Horaires et contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Horaires</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Lun - Ven: 8h - 16h<br />
                Sam: 8h - 12h
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Téléphone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                +212 5 37 77 18 34
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-[#006be5] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                scolarite@fsr.ac.ma
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documents par catégorie */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#006be5]" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat) => {
              const catFiles = files.filter((f) => f.category === cat.key);
              return (
                <Card key={cat.key} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#006be5] flex items-center">
                      <FileText className="h-6 w-6 mr-2" />
                      {cat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {catFiles.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun document disponible
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {catFiles.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center min-w-0">
                              <FileText className="h-4 w-4 text-[#006be5] mr-2 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {doc.original_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {doc.mime_type?.split("/").pop()?.toUpperCase()} • {formatSize(doc.file_size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3" />
                              </a>
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
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceScolarite;
