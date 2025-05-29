
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
  Plus, 
  Image,
  FileText,
  Search
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fileDescription, setFileDescription] = useState('');
  const [fileCategory, setFileCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['uploaded-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UploadedFile[];
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
      setFileDescription('');
      setFileCategory('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès",
      });
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
      // Delete from storage
      const fileName = file.name;
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([fileName]);
      
      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
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

  const handleFileUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      uploadFileMutation.mutate({
        file,
        description: fileDescription,
        category: fileCategory
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

  const categories = ['Documents', 'Images', 'Vidéos', 'Présentations', 'Autres'];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
            <Upload className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          Upload Files
        </h1>

        {/* Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fichier
              </label>
              <input
                ref={fileInputRef}
                type="file"
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <Select value={fileCategory} onValueChange={setFileCategory}>
                <SelectTrigger className="bg-white dark:bg-gray-700">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Description du fichier..."
                className="bg-white dark:bg-gray-700"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleFileUpload}
              disabled={isUploading || !fileInputRef.current?.files?.[0]}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Upload en cours..." : "Télécharger"}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Upload en cours...</span>
              <span className="text-sm text-green-600 dark:text-green-400">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-700">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Files List */}
      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    {getFileIcon(file.mime_type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {file.original_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {file.file_size && <span>{formatFileSize(file.file_size)}</span>}
                      {file.category && <span>• {file.category}</span>}
                      <span>• {new Date(file.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {file.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
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
            </CardContent>
          </Card>
        ))}
        
        {filteredFiles.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-3">
                {searchQuery || selectedCategory !== 'all' ? 'Aucun résultat' : 'Aucun fichier'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Aucun fichier ne correspond à vos critères'
                  : 'Téléchargez votre premier fichier pour commencer'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <Button onClick={() => fileInputRef.current?.click()} className="shadow-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger un fichier
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUploadFiles;
