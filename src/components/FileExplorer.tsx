import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, File, Download, ChevronRight, ChevronDown } from "lucide-react";

interface FileManagerItem {
  id: string;
  name: string;
  type: "folder" | "file";
  file_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  parent_id?: string | null;
}

interface FileExplorerProps {
  categoryFilter?: string;
  showDownload?: boolean;
}

const FileExplorer = ({ categoryFilter = "emploi_temps", showDownload = true }: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const { data: items, isLoading } = useQuery({
    queryKey: ['file-manager-items', categoryFilter],
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

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const renderItem = (item: FileManagerItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const children = items?.filter(i => i.parent_id === item.id) || [];

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors`}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          <div className="flex items-center flex-1 min-w-0">
            {item.type === "folder" ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 mr-2"
                onClick={() => toggleFolder(item.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            ) : (
              <div className="w-9" />
            )}
            
            {item.type === "folder" ? (
              <Folder className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
            ) : (
              <File className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              {item.type === "file" && item.file_size && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file_size)}
                </p>
              )}
            </div>
          </div>
          
          {item.type === "file" && item.file_url && showDownload && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(item.file_url!, item.name)}
              className="ml-2"
            >
              <Download className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {item.type === "folder" && isExpanded && children.length > 0 && (
          <div>
            {children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rootItems = items?.filter(item => !item.parent_id) || [];

  if (rootItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Aucun fichier disponible pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-1">
          {rootItems.map(item => renderItem(item))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileExplorer;
