
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  File, 
  Trash2, 
  Download, 
  Image, 
  FileText,
  Search,
  Grid,
  List,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  id: string;
  name: string;
  original_name: string;
  description?: string;
  category?: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}

const AdminUploadFiles = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [uploadForm, setUploadForm] = useState({
    description: '',
    category: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['uploaded-files'],
    queryFn: async () => {
      console.log('Fetching uploaded files');
      
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }
      
      console.log('Fetched files:', data);
      return data as UploadedFile[] || [];
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, description, category }: { file: File; description: string; category: string }) => {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      try {
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
          .from('files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('files')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('files')
          .insert([{
            name: fileName,
            original_name: file.name,
            description,
            category,
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
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadForm({ description: '', category: '' });
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

  const deleteFileMutation = useMutation({
    mutationFn: async (file: UploadedFile) => {
      const fileName = file.file_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('files')
          .remove([fileName]);
        
        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été supprimé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
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
      uploadFileMutation.mutate({
        file,
        description: uploadForm.description,
        category: uploadForm.category
      });
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

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(files.map(f => f.category).filter(Boolean)));

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
      <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                Upload de Fichiers
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Téléchargez et gérez vos fichiers publics
              </p>
            </div>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-green-600 hover:bg-green-700 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isUploading ? "Upload..." : "Ajouter un fichier"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Upload Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Configuration de l'upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Catégorie
              </label>
              <Input
                placeholder="Ex: Documents, Images, Présentation..."
                value={uploadForm.category}
                onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Description
              </label>
              <Input
                placeholder="Description du fichier..."
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="border-green-200 bg-green-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-green-800">Upload en cours...</span>
              <span className="text-sm text-green-600">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des fichiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </CardContent>
      </Card>

      {/* Files Display */}
      {filteredFiles.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardContent className={viewMode === 'grid' ? "p-6 text-center" : "p-4"}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getFileIcon(file.mime_type)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">
                      {file.original_name}
                    </h3>
                    {file.category && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                        {file.category}
                      </span>
                    )}
                    {file.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mb-4">
                      {file.file_size && <div>{formatFileSize(file.file_size)}</div>}
                      <div>{new Date(file.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline" asChild className="shadow-sm">
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Voir
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => deleteFileMutation.mutate(file)}
                        disabled={deleteFileMutation.isPending}
                        className="shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.mime_type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{file.original_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {file.category && (
                            <>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {file.category}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          {file.file_size && <span>{formatFileSize(file.file_size)}</span>}
                          <span>•</span>
                          <span>{new Date(file.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {file.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" asChild className="shadow-sm">
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => deleteFileMutation.mutate(file)}
                        disabled={deleteFileMutation.isPending}
                        className="shadow-sm"
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
        <Card className="border-dashed border-2 border-gray-300 shadow-sm">
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
              {searchQuery || selectedCategory ? 'Aucun résultat' : 'Aucun fichier'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory
                ? 'Aucun fichier ne correspond à vos critères de recherche'
                : 'Commencez par télécharger vos premiers fichiers'
              }
            </p>
            {!searchQuery && !selectedCategory && (
              <Button onClick={() => fileInputRef.current?.click()} className="shadow-sm">
                <Upload className="h-4 w-4 mr-2" />
                Télécharger un fichier
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUploadFiles;
