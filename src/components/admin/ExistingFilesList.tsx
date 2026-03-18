
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  original_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ExistingFilesListProps {
  files: FileItem[];
  loading: boolean;
  searchQuery: string;
  selectedCategory: string;
  onDownload: (fileUrl: string, fileName: string) => void;
  onDelete: (fileId: string, fileUrl: string, fileName: string) => void;
}

const ExistingFilesList = ({
  files,
  loading,
  searchQuery,
  selectedCategory,
  onDownload,
  onDelete
}: ExistingFilesListProps) => {
  const { toast } = useToast();

  const copyFileUrl = async (fileUrl: string) => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      toast({ title: "URL copiée", description: "L'URL du fichier a été copiée dans le presse-papiers." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier l'URL", variant: "destructive" });
    }
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Fichiers existants ({filteredFiles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {file.mime_type?.startsWith('image/') ? '🖼️' : 
                     file.mime_type?.includes('pdf') ? '📄' : 
                     file.mime_type?.includes('word') ? '📝' : 
                     file.mime_type?.includes('excel') ? '📊' : '📎'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {file.original_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {file.category && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                          {file.category}
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {formatFileSize(file.file_size || 0)}
                      </Badge>
                      {file.mime_type && (
                        <Badge variant="outline">
                          {file.mime_type}
                        </Badge>
                      )}
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {file.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(file.file_url, file.original_name)}
                    className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(file.id, file.file_url, file.original_name)}
                    className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Aucun fichier trouvé
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all' 
                ? "Aucun résultat pour les filtres sélectionnés" 
                : "Téléchargez votre premier fichier pour commencer."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExistingFilesList;
