
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";

interface FileWithMetadata {
  file: File;
  id: string;
  description: string;
  category: string;
}

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileWithMetadata[];
  setFiles: (files: FileWithMetadata[]) => void;
  onUpload: () => Promise<void>;
  uploading: boolean;
  categories: string[];
}

const FileUploadDialog = ({
  isOpen,
  onClose,
  files,
  setFiles,
  onUpload,
  uploading,
  categories
}: FileUploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      description: '',
      category: categories[0]
    }));
    setFiles([...files, ...newFiles]);
  };

  const updateFile = (id: string, field: 'description' | 'category', value: string) => {
    setFiles(files.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Télécharger des fichiers
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Cliquez pour sélectionner des fichiers
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ou glissez-déposez vos fichiers ici
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fichiers à télécharger ({files.length})</h3>
              <div className="space-y-4">
                {files.map((fileItem) => (
                  <div key={fileItem.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {fileItem.file.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {formatFileSize(fileItem.file.size)}
                            </Badge>
                            <Badge variant="secondary">
                              {fileItem.file.type}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(fileItem.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Catégorie</label>
                          <select
                            value={fileItem.category}
                            onChange={(e) => updateFile(fileItem.id, 'category', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description (optionnelle)</label>
                          <Input
                            value={fileItem.description}
                            onChange={(e) => updateFile(fileItem.id, 'description', e.target.value)}
                            placeholder="Description du fichier..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                >
                  Tout supprimer
                </Button>
                <Button
                  onClick={onUpload}
                  disabled={uploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {uploading ? "Téléchargement..." : `Télécharger ${files.length} fichier(s)`}
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
