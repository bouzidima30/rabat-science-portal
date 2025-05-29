
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface UploadFile {
  file: File;
  name: string;
  description?: string;
  category: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const AdminUploadFiles = () => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { value: 'document', label: 'Document' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Vidéo' },
    { value: 'audio', label: 'Audio' },
    { value: 'archive', label: 'Archive' },
    { value: 'other', label: 'Autre' }
  ];

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: UploadFile) => {
      const fileExt = uploadFile.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Create files bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'files');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('files', {
          public: true,
          allowedMimeTypes: null,
          fileSizeLimit: null
        });
      }

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, uploadFile.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      // Save file info to database
      const { error: dbError } = await supabase
        .from('files')
        .insert([{
          name: uploadFile.name,
          description: uploadFile.description,
          category: uploadFile.category,
          file_url: data.publicUrl,
          file_size: uploadFile.file.size,
          mime_type: uploadFile.file.type,
          original_name: uploadFile.file.name
        }]);

      if (dbError) throw dbError;

      return data.publicUrl;
    },
    onSuccess: (_, uploadFile) => {
      updateFileStatus(uploadFile.file.name, 'success', 100);
      toast({
        title: "Fichier uploadé",
        description: `${uploadFile.name} a été uploadé avec succès`,
      });
    },
    onError: (error, uploadFile) => {
      updateFileStatus(uploadFile.file.name, 'error', 0, error.message);
      toast({
        title: "Erreur d'upload",
        description: `Erreur lors de l'upload de ${uploadFile.name}`,
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploadFiles: UploadFile[] = fileArray.map(file => ({
      file,
      name: file.name.split('.')[0],
      category: getDefaultCategory(file.type),
      progress: 0,
      status: 'pending'
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
  };

  const getDefaultCategory = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'archive';
    return 'other';
  };

  const updateFileStatus = (fileName: string, status: UploadFile['status'], progress: number, error?: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.file.name === fileName 
        ? { ...file, status, progress, error }
        : file
    ));
  };

  const updateFileData = (fileName: string, field: string, value: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.file.name === fileName 
        ? { ...file, [field]: value }
        : file
    ));
  };

  const removeFile = (fileName: string) => {
    setUploadFiles(prev => prev.filter(file => file.file.name !== fileName));
  };

  const uploadAllFiles = async () => {
    const pendingFiles = uploadFiles.filter(file => file.status === 'pending');
    
    for (const file of pendingFiles) {
      updateFileStatus(file.file.name, 'uploading', 0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        updateFileStatus(file.file.name, 'uploading', Math.min(90, Math.random() * 80 + 10));
      }, 200);

      try {
        await uploadMutation.mutateAsync(file);
        clearInterval(progressInterval);
      } catch (error) {
        clearInterval(progressInterval);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />;
    if (mimeType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload de Fichiers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Téléchargez des fichiers vers la base de données et le stockage
            </p>
          </div>
          
          {uploadFiles.some(file => file.status === 'pending') && (
            <Button 
              onClick={uploadAllFiles}
              disabled={uploadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload tous les fichiers
            </Button>
          )}
        </div>
      </div>

      {/* Drop Zone */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}>
        <CardContent 
          className="p-12 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Glissez vos fichiers ici
          </h3>
          <p className="text-gray-500 mb-6">
            ou cliquez pour sélectionner des fichiers
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Sélectionner des fichiers
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileSelect(e.target.files);
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Fichiers à uploader ({uploadFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(uploadFile.file.type)}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Nom du fichier"
                          value={uploadFile.name}
                          onChange={(e) => updateFileData(uploadFile.file.name, 'name', e.target.value)}
                          disabled={uploadFile.status === 'uploading'}
                        />
                        <Select
                          value={uploadFile.category}
                          onValueChange={(value) => updateFileData(uploadFile.file.name, 'category', value)}
                          disabled={uploadFile.status === 'uploading'}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Textarea
                        placeholder="Description (optionnelle)"
                        value={uploadFile.description || ''}
                        onChange={(e) => updateFileData(uploadFile.file.name, 'description', e.target.value)}
                        disabled={uploadFile.status === 'uploading'}
                        rows={2}
                      />
                      
                      {uploadFile.status === 'uploading' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Upload en cours...</span>
                            <span>{uploadFile.progress}%</span>
                          </div>
                          <Progress value={uploadFile.progress} className="w-full" />
                        </div>
                      )}
                      
                      {uploadFile.error && (
                        <div className="text-red-600 text-sm">
                          Erreur: {uploadFile.error}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(uploadFile.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(uploadFile.file.name)}
                        disabled={uploadFile.status === 'uploading'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Taille: {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB • 
                    Type: {uploadFile.file.type || 'Inconnu'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUploadFiles;
