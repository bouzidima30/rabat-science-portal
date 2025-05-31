import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, Plus, X, FileText, Image, Video, Music, Download, Trash2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface FileWithMetadata {
  file: File;
  id: string;
  description: string;
  category: string;
}

interface FileItem {
  id: string;
  name: string;
  original_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const AdminUploadFiles = () => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [existingFiles, setExistingFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  const categoryFilters = [
    { id: 'all', label: 'Toutes les catégories' },
    ...categories.map(cat => ({ id: cat, label: cat }))
  ];

  useEffect(() => {
    fetchExistingFiles();
  }, []);

  const fetchExistingFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingFiles(data || []);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des fichiers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredExistingFiles = existingFiles.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

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

        await logActivity('upload_file', `Fichier téléchargé: ${fileItem.file.name} (${fileItem.category})`);
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
      fetchExistingFiles();
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

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du fichier",
        variant: "destructive",
      });
    }
  };

  const deleteExistingFile = async (fileId: string, fileUrl: string, fileName: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) return;

    try {
      // Extract file path from URL for storage deletion
      const urlParts = fileUrl.split('/');
      const fileNameFromUrl = urlParts[urlParts.length - 1];
      const filePath = `files/${fileNameFromUrl}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      await logActivity('delete_file', `Fichier supprimé: ${fileName}`);

      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès",
      });

      fetchExistingFiles();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du fichier",
        variant: "destructive",
      });
    }
  };

  const totalFiles = existingFiles.length;
  const totalSize = existingFiles.reduce((acc, file) => acc + (file.file_size || 0), 0);

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
              Gestion des Fichiers
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Téléchargez et gérez vos fichiers
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {new Set(existingFiles.map(f => f.category).filter(Boolean)).size}
                </p>
              </div>
              <Filter className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Télécharger de nouveaux fichiers
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

      {/* Files to Upload */}
      {files.length > 0 && (
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Fichiers à télécharger ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
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
            
            <div className="flex justify-end gap-4">
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

      {/* Filters Section */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="rounded-full"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un fichier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Files List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Fichiers existants ({filteredExistingFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : filteredExistingFiles.length > 0 ? (
            <div className="space-y-4">
              {filteredExistingFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {file.mime_type?.startsWith('image/') ? '🖼️' : 
                       file.mime_type?.includes('pdf') ? '📄' : 
                       file.mime_type?.includes('word') ? '📝' : 
                       file.mime_type?.includes('excel') ? '📊' : '📎'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {file.original_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {file.category && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            {file.category}
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {formatFileSize(file.file_size || 0)}
                        </Badge>
                        {file.mime_type && (
                          <Badge variant="outline">
                            {file.mime_type}
                          </Badge>
                        )}
                      </div>
                      {file.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {file.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(file.file_url, file.original_name)}
                      className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteExistingFile(file.id, file.file_url, file.original_name)}
                      className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun fichier trouvé
              </h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory !== 'all' 
                  ? "Aucun résultat pour les filtres sélectionnés" 
                  : "Téléchargez votre premier fichier pour commencer."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUploadFiles;
