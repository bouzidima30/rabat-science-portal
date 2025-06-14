
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

export const useFileManagement = () => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [existingFiles, setExistingFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
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

  return {
    files,
    setFiles,
    existingFiles,
    uploading,
    loading,
    fileInputRef,
    categories,
    handleFileSelect,
    updateFile,
    removeFile,
    uploadFiles,
    downloadFile,
    deleteExistingFile,
    fetchExistingFiles
  };
};
