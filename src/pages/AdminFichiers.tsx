
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Folder, File, Plus, Trash2, Upload, Download, FolderOpen, ArrowLeft, Image, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const AdminFichiers = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ['admin-files', currentFolderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_manager')
        .select('*')
        .eq('parent_id', currentFolderId)
        .order('type', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from('file_manager')
        .insert([{
          name,
          type: 'folder',
          parent_id: currentFolderId
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-files', currentFolderId] });
      setFolderName('');
      setIsCreatingFolder(false);
      toast({
        title: "Dossier créé",
        description: "Le dossier a été créé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du dossier",
        variant: "destructive",
      });
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const { error: uploadError } = await supabase.storage
          .from('file-manager')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('file-manager')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('file_manager')
          .insert([{
            name: file.name,
            type: 'file',
            parent_id: currentFolderId,
            file_url: data.publicUrl,
            file_size: file.size,
            mime_type: file.type
          }]);

        if (dbError) throw dbError;

        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);

      } catch (error) {
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-files', currentFolderId] });
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du fichier",
        variant: "destructive",
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (item: any) => {
      // If it's a file, delete from storage first
      if (item.type === 'file' && item.file_url) {
        const fileName = item.file_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('file-manager')
            .remove([fileName]);
          
          if (storageError) {
            console.error('Storage deletion error:', storageError);
          }
        }
      }

      const { error } = await supabase
        .from('file_manager')
        .delete()
        .eq('id', item.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-files', currentFolderId] });
      toast({
        title: "Élément supprimé",
        description: "L'élément a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileMutation.mutate(file);
    }
  };

  const navigateToFolder = (folder: any) => {
    setCurrentFolderId(folder.id);
    setFolderPath([...folderPath, { id: folder.id, name: folder.name }]);
  };

  const navigateBack = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
    }
  };

  const navigateToRoot = () => {
    setCurrentFolderId(null);
    setFolderPath([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-500" />;
    } else if (mimeType?.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestionnaire de Fichiers
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Button variant="ghost" size="sm" onClick={navigateToRoot} className="text-blue-600 hover:text-blue-800">
              📁 Racine
            </Button>
            {folderPath.map((folder, index) => (
              <span key={folder.id} className="flex items-center gap-2">
                <span>/</span>
                <span className="font-medium">{folder.name}</span>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          {folderPath.length > 0 && (
            <Button variant="outline" onClick={navigateBack} className="bg-white hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}
          <Button onClick={() => setIsCreatingFolder(true)} className="bg-blue-600 hover:bg-blue-700">
            <Folder className="h-4 w-4 mr-2" />
            Nouveau Dossier
          </Button>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Upload..." : "Télécharger"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            multiple={false}
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Upload en cours...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Create Folder */}
      {isCreatingFolder && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Nouveau Dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nom du dossier"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && folderName.trim()) {
                    createFolderMutation.mutate(folderName.trim());
                  }
                }}
              />
              <Button 
                onClick={() => createFolderMutation.mutate(folderName.trim())}
                disabled={!folderName.trim() || createFolderMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreatingFolder(false);
                  setFolderName('');
                }}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files Grid */}
      <div className="grid gap-4">
        {files && files.length > 0 ? files.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {item.type === 'folder' ? (
                    <FolderOpen className="h-10 w-10 text-blue-500" />
                  ) : (
                    getFileIcon(item.mime_type || '')
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.name}
                    </h3>
                    {item.type === 'file' && (
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        {item.file_size && (
                          <span>📊 {formatFileSize(item.file_size)}</span>
                        )}
                        {item.mime_type && (
                          <span>📋 {item.mime_type}</span>
                        )}
                        <span>📅 {new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {item.type === 'folder' ? (
                    <Button 
                      size="sm" 
                      onClick={() => navigateToFolder(item)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FolderOpen className="h-4 w-4 mr-1" />
                      Ouvrir
                    </Button>
                  ) : (
                    item.file_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </a>
                      </Button>
                    )
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteItemMutation.mutate(item)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Folder className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Dossier vide
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Ajoutez des dossiers ou téléchargez des fichiers pour commencer.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setIsCreatingFolder(true)} variant="outline">
                <Folder className="h-4 w-4 mr-2" />
                Créer un dossier
              </Button>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Télécharger un fichier
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFichiers;
