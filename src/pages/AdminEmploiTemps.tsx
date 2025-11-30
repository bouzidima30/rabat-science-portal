import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Folder, File, Plus, Trash2, Upload, FolderPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FileManagerItem {
  id: string;
  name: string;
  type: "folder" | "file";
  file_url?: string | null;
  file_size?: number | null;
  parent_id?: string | null;
}

const AdminEmploiTemps = () => {
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>("root");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadParentId, setUploadParentId] = useState<string>("root");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-file-manager'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_manager')
        .select('*')
        .order('type', { ascending: false })
        .order('name');
      
      if (error) throw error;
      return data as FileManagerItem[];
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating folder:', newFolderName, 'Parent:', selectedParentId);
      
      const { data, error } = await supabase
        .from('file_manager')
        .insert({
          name: newFolderName,
          type: 'folder',
          parent_id: !selectedParentId || selectedParentId === 'root' ? null : selectedParentId
        })
        .select();
      
      if (error) {
        console.error('Folder creation error:', error);
        throw error;
      }
      
      console.log('Folder created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-file-manager'] });
      toast({
        title: "Dossier créé",
        description: "Le dossier a été créé avec succès"
      });
      setNewFolderName("");
      setSelectedParentId("root");
      setCreateFolderOpen(false);
    },
    onError: (error: any) => {
      console.error('Full error:', error);
      toast({
        title: "Erreur lors de la création du dossier",
        description: error?.message || "Impossible de créer le dossier",
        variant: "destructive"
      });
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile) throw new Error("No file selected");

      console.log('Uploading file:', uploadFile.name, 'to parent:', uploadParentId);

      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `emploi-temps/${fileName}`;

      console.log('Upload path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, uploadFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded to storage:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      const { data: dbData, error: dbError } = await supabase
        .from('file_manager')
        .insert({
          name: uploadFile.name,
          type: 'file',
          file_url: publicUrl,
          file_size: uploadFile.size,
          mime_type: uploadFile.type,
          parent_id: !uploadParentId || uploadParentId === 'root' ? null : uploadParentId
        })
        .select();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('File record created in database:', dbData);
      return dbData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-file-manager'] });
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès"
      });
      setUploadFile(null);
      setUploadParentId("root");
      setUploadFileOpen(false);
    },
    onError: (error: any) => {
      console.error('Full upload error:', error);
      toast({
        title: "Erreur lors du téléchargement",
        description: error?.message || "Impossible de télécharger le fichier",
        variant: "destructive"
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const item = items?.find(i => i.id === itemId);
      
      if (item?.type === 'file' && item.file_url) {
        const filePath = item.file_url.split('/').slice(-2).join('/');
        await supabase.storage.from('files').remove([filePath]);
      }

      const { error } = await supabase
        .from('file_manager')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-file-manager'] });
      toast({
        title: "Élément supprimé",
        description: "L'élément a été supprimé avec succès"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément",
        variant: "destructive"
      });
      console.error(error);
    }
  });

  const folders = items?.filter(item => item.type === 'folder') || [];
  const rootItems = items?.filter(item => !item.parent_id) || [];

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderItem = (item: FileManagerItem, level: number = 0) => {
    const children = items?.filter(i => i.parent_id === item.id) || [];

    return (
      <div key={item.id} className="space-y-2">
        <div
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          <div className="flex items-center space-x-3 flex-1">
            {item.type === "folder" ? (
              <Folder className="h-5 w-5 text-primary" />
            ) : (
              <File className="h-5 w-5 text-muted-foreground" />
            )}
            
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {item.type === "file" && item.file_size && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file_size)}
                </p>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteItemMutation.mutate(item.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {item.type === "folder" && children.map(child => renderItem(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Emplois du Temps</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les dossiers et fichiers des emplois du temps
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau dossier</DialogTitle>
                <DialogDescription>
                  Créez un dossier pour organiser vos emplois du temps
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="folderName">Nom du dossier</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ex: Licence S1"
                  />
                </div>
                <div>
                  <Label htmlFor="parentFolder">Dossier parent (optionnel)</Label>
                  <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Racine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Racine</SelectItem>
                      {folders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => createFolderMutation.mutate()}
                disabled={!newFolderName || createFolderMutation.isPending}
              >
                {createFolderMutation.isPending ? "Création..." : "Créer"}
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={uploadFileOpen} onOpenChange={setUploadFileOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Télécharger un fichier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Télécharger un fichier</DialogTitle>
                <DialogDescription>
                  Ajoutez un emploi du temps ou un document
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="fileUpload">Fichier</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>
                <div>
                  <Label htmlFor="uploadParent">Dossier de destination</Label>
                  <Select value={uploadParentId} onValueChange={setUploadParentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Racine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Racine</SelectItem>
                      {folders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => uploadFileMutation.mutate()}
                disabled={!uploadFile || uploadFileMutation.isPending}
              >
                {uploadFileMutation.isPending ? "Téléchargement..." : "Télécharger"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Structure des fichiers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rootItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun fichier ou dossier. Commencez par créer un dossier.
            </p>
          ) : (
            <div className="space-y-2">
              {rootItems.map(item => renderItem(item))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmploiTemps;
