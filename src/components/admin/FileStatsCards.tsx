
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, Filter } from "lucide-react";

interface FileItem {
  id: string;
  file_size: number | null;
  category: string | null;
}

interface FileStatsCardsProps {
  files: FileItem[];
}

const FileStatsCards = ({ files }: FileStatsCardsProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + (file.file_size || 0), 0);
  const categoriesCount = new Set(files.map(f => f.category).filter(Boolean)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Fichiers</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{totalFiles}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Espace Utilisé</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatFileSize(totalSize)}</p>
            </div>
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Catégories</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{categoriesCount}</p>
            </div>
            <Filter className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileStatsCards;
