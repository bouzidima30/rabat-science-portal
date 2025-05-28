
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Folder, File, Plus, Trash2, Upload, Download, FolderOpen, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminFichiers = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([]);

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-files', currentFolderId] });
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès",
      });
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('file_manager')
        .delete()
        .eq('id', id);
      
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
    // Reset input
    e.target.value = '';
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

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestionnaire de Fichiers
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <Button variant="ghost" size="sm" onClick={navigateToRoot}>
              Racine
            </Button>
            {folderPath.map((folder, index) => (
              <span key={folder.id} className="flex items-center gap-2">
                <span>/</span>
                <span>{folder.name}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {folderPath.length > 0 && (
            <Button variant="outline" onClick={navigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}
          <Button onClick={() => setIsCreatingFolder(true)}>
            <Folder className="h-4 w-4 mr-2" />
            Nouveau Dossier
          </Button>
          <Button asChild>
            <label>
              <Upload className="h-4 w-4 mr-2" />
              Télécharger Fichier
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
        </div>
      </div>

      {isCreatingFolder && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nouveau Dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nom du dossier"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && folderName.trim()) {
                    createFolderMutation.mutate(folderName.trim());
                  }
                }}
              />
              <Button 
                onClick={() => createFolderMutation.mutate(folderName.trim())}
                disabled={!folderName.trim() || createFolderMutation.isPending}
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

      <div className="grid gap-4">
        {files && files.length > 0 ? files.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.type === 'folder' ? (
                    <FolderOpen className="h-8 w-8 text-blue-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    {item.type === 'file' && (
                      <p className="text-sm text-gray-500">
                        {item.file_size && formatFileSize(item.file_size)} • {item.mime_type}
                      </p>
                    )}
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
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </a>
                      </Button>
                    )
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteItemMutation.mutate(item.id)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Dossier vide
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Ajoutez des dossiers ou téléchargez des fichiers pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFichiers;
