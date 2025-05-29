
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Folder, 
  File, 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  FolderOpen, 
  ArrowLeft, 
  Image, 
  FileText,
  Search,
  Grid,
  List
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parent_id: string | null;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}

const AdminFichiers = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['admin-files', currentFolderId],
    queryFn: async () => {
      console.log('Fetching files for folder:', currentFolderId);
      
      const { data, error } = await supabase
        .from('file_manager')
        .select('*')
        .eq('parent_id', currentFolderId)
        .order('type', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }
      
      console.log('Fetched files:', data);
      return data as FileItem[] || [];
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('file_manager')
        .insert([{
          name,
          type: 'folder',
          parent_id: currentFolderId
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-files'] });
      setFolderName('');
      setIsCreatingFolder(false);
      toast({
        title: "Dossier créé",
        description: "Le dossier a été créé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
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
      
      try {
        // Create storage bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'file-manager');
        
        if (!bucketExists) {
          await supabase.storage.createBucket('file-manager', {
            public: true,
            allowedMimeTypes: null,
            fileSizeLimit: null
          });
        }

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

        const { error: uploadError } = await supabase.storage
          .from('file-manager')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('file-manager')
          .getPublicUrl(fileName);

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
        setIsUploading(false);
        setUploadProgress(0);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-files'] });
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du fichier",
        variant: "destructive",
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (item: FileItem) => {
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
      queryClient.invalidateQueries({ queryKey: ['admin-files'] });
      toast({
        title: "Élément supprimé",
        description: "L'élément a été supprimé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  });

  const navigateToFolder = (folder: FileItem) => {
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-500" />;
    } else if (mimeType?.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800">Erreur lors du chargement des fichiers: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des fichiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestionnaire de Fichiers
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {setCurrentFolderId(null); setFolderPath([])}} 
                className="text-blue-600 hover:text-blue-800 px-2"
              >
                📁 Racine
              </Button>
              {folderPath.map((folder, index) => (
                <span key={folder.id} className="flex items-center gap-2">
                  <span className="text-gray-400">/</span>
                  <span className="font-medium">{folder.name}</span>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {folderPath.length > 0 && (
              <Button variant="outline" onClick={navigateBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            <Button onClick={() => setIsCreatingFolder(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Dossier
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Upload..." : "Fichier"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFileMutation.mutate(file);
              }}
            />
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-800">Upload en cours...</span>
              <span className="text-sm text-blue-600">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Create Folder */}
      {isCreatingFolder && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
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
                className="bg-green-600 hover:bg-green-700"
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

      {/* Files Display */}
      {filteredFiles.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
          {filteredFiles.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className={viewMode === 'grid' ? "p-6 text-center" : "p-4"}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="mb-4">
                      {item.type === 'folder' ? (
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Folder className="h-8 w-8 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getFileIcon(item.mime_type)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">
                      {item.name}
                    </h3>
                    {item.type === 'file' && (
                      <div className="text-xs text-gray-500 mb-4">
                        {item.file_size && <div>{formatFileSize(item.file_size)}</div>}
                        <div>{new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    )}
                    <div className="flex gap-2 justify-center">
                      {item.type === 'folder' ? (
                        <Button size="sm" onClick={() => navigateToFolder(item)}>
                          <FolderOpen className="h-4 w-4 mr-1" />
                          Ouvrir
                        </Button>
                      ) : (
                        item.file_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-1" />
                              Voir
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
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.type === 'folder' ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Folder className="h-5 w-5 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(item.mime_type)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="text-sm text-gray-500">
                          {item.type === 'file' && item.file_size && `${formatFileSize(item.file_size)} • `}
                          {new Date(item.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {item.type === 'folder' ? (
                        <Button size="sm" onClick={() => navigateToFolder(item)}>
                          Ouvrir
                        </Button>
                      ) : (
                        item.file_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
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
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Folder className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
              {searchQuery ? 'Aucun résultat' : 'Dossier vide'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Aucun fichier ne correspond à votre recherche'
                : 'Ajoutez des dossiers ou téléchargez des fichiers pour commencer'
              }
            </p>
            {!searchQuery && (
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFichiers;
