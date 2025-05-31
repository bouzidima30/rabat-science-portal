
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, Plus, X, FileText, Image, Video, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface FileWithMetadata {
  file: File;
  id: string;
  description: string;
  category: string;
}

const AdminUploadFiles = () => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const categories = [
    "Documents administratifs",
    "Cours et supports",
    "Examens",
    "Recherche",
    "Événements",
    "Autres"
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-green-500" />;
    if (type.startsWith('audio/')) return <Music className="h-8 w-8 text-purple-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      description: '',
      category: categories[0]
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const updateFile = (id: string, field: 'description' | 'category', value: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner au moins un fichier.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    let uploadedCount = 0;

    try {
      for (const fileItem of files) {
        const fileExt = fileItem.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `files/${fileName}`;

        // Upload to storage
        const { error: storageError, data } = await supabase.storage
          .from('files')
          .upload(filePath, fileItem.file);

        if (storageError) throw storageError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('files')
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase
          .from('files')
          .insert({
            name: fileName,
            original_name: fileItem.file.name,
            file_url: urlData.publicUrl,
            file_size: fileItem.file.size,
            mime_type: fileItem.file.type,
            category: fileItem.category,
            description: fileItem.description || null
          });

        if (dbError) throw dbError;

        await logActivity('upload_file', `Fichier téléchargé: ${fileItem.file.name}`);
        uploadedCount++;
      }

      toast({
        title: "Succès",
        description: `${uploadedCount} fichier(s) téléchargé(s) avec succès.`,
      });

      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement des fichiers.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
            <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Télécharger des Fichiers
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Ajoutez des documents et fichiers au système
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Sélectionner des fichiers
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Fichiers sélectionnés ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileItem) => (
                <div key={fileItem.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(fileItem.file.type)}
                  </div>
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
            
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={uploading}
              >
                Tout supprimer
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploading ? "Téléchargement..." : `Télécharger ${files.length} fichier(s)`}
                <Upload className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUploadFiles;
