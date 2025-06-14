
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, FileText } from "lucide-react";

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: 'news' | 'event';
  contentTitle: string;
}

const VersionHistoryDialog = ({ 
  isOpen, 
  onClose, 
  contentId, 
  contentType, 
  contentTitle 
}: VersionHistoryDialogProps) => {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && contentId) {
      fetchVersions();
    }
  }, [isOpen, contentId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const table = contentType === 'news' ? 'news_versions' : 'events_versions';
      const idField = contentType === 'news' ? 'news_id' : 'event_id';
      
      const { data, error } = await supabase
        .from(table)
        .select(`
          *,
          created_by_profile:profiles!created_by(full_name, email)
        `)
        .eq(idField, contentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error: any) {
      console.error('Error fetching versions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des versions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVersionTitle = (version: any) => {
    return version.title || version.titre || '';
  };

  const getVersionContent = (version: any) => {
    return version.content || version.description || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des versions - {contentTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : versions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune version trouvée</p>
              </CardContent>
            </Card>
          ) : (
            versions.map((version) => (
              <Card key={version.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        v{version.version_number}
                      </Badge>
                      <Badge variant={version.status === 'published' ? 'default' : 'secondary'}>
                        {version.status === 'draft' && 'Brouillon'}
                        {version.status === 'pending_review' && 'En attente'}
                        {version.status === 'approved' && 'Approuvé'}
                        {version.status === 'rejected' && 'Rejeté'}
                        {version.status === 'published' && 'Publié'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(version.created_at)}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {getVersionTitle(version)}
                  </h4>
                  
                  {version.change_summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 italic">
                      "{version.change_summary}"
                    </p>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {getVersionContent(version) && (
                      <p className="mb-2">
                        {getVersionContent(version).length > 200 
                          ? getVersionContent(version).substring(0, 200) + "..." 
                          : getVersionContent(version)
                        }
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                    <User className="h-3 w-3" />
                    Modifié par {version.created_by_profile?.full_name || version.created_by_profile?.email || 'Utilisateur inconnu'}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryDialog;
