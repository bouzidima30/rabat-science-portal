
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSecureCooperationData } from "@/hooks/useSecureCooperationData";
import { Clock, User, FileText } from "lucide-react";

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: 'news' | 'event' | 'formation' | 'cooperation' | 'page';
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
  const { filterCooperationVersionsList } = useSecureCooperationData();

  useEffect(() => {
    if (isOpen && contentId) {
      fetchVersions();
    }
  }, [isOpen, contentId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      
      if (contentType === 'news') {
        const { data: newsData, error } = await supabase
          .from('news_versions')
          .select(`
            id, news_id, version_number, title, content, excerpt, category,
            image_url, document_url, document_name, status, author_id,
            created_at, created_by, change_summary
          `)
          .eq('news_id', contentId)
          .order('version_number', { ascending: false });

        if (error) throw error;
        data = newsData || [];
      } else if (contentType === 'event') {
        const { data: eventData, error } = await supabase
          .from('events_versions')
          .select(`
            id, event_id, version_number, titre, description, date_debut, date_fin,
            heure_debut, heure_fin, lieu, image_url, status,
            created_at, created_by, change_summary
          `)
          .eq('event_id', contentId)
          .order('version_number', { ascending: false });

        if (error) throw error;
        data = eventData || [];
      } else if (contentType === 'formation') {
        const { data: formationData, error } = await supabase
          .from('formations_versions')
          .select(`
            id, formation_id, version_number, titre, description, type_formation,
            departement, image_url, document_url, document_name, status,
            created_at, created_by, change_summary
          `)
          .eq('formation_id', contentId)
          .order('version_number', { ascending: false });

        if (error) throw error;
        data = formationData || [];
      } else if (contentType === 'cooperation') {
        const { data: cooperationData, error } = await supabase
          .from('cooperations_versions')
          .select(`
            id, cooperation_id, version_number, titre, description, type_cooperation,
            domaine_recherche, pays, annee_debut, annee_fin, coordinateur,
            email_coordinateur, appel_offre, partenaires, image_url, status,
            created_at, created_by, change_summary
          `)
          .eq('cooperation_id', contentId)
          .order('version_number', { ascending: false });

        if (error) throw error;
        // Apply security filtering to prevent email exposure to anonymous users
        data = filterCooperationVersionsList(cooperationData || []);
      } else if (contentType === 'page') {
        const { data: pageData, error } = await supabase
          .from('pages_versions')
          .select(`
            id, page_id, version_number, titre, contenu, slug,
            image_url, fichiers, status,
            created_at, created_by, change_summary
          `)
          .eq('page_id', contentId)
          .order('version_number', { ascending: false });

        if (error) throw error;
        data = pageData || [];
      }

      // Fetch profile info separately for each version
      if (data.length > 0) {
        const createdByIds = [...new Set(data.map(v => v.created_by))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', createdByIds);

        // Add profile info to versions
        const versionsWithProfiles = data.map(version => ({
          ...version,
          created_by_profile: profiles?.find(p => p.id === version.created_by)
        }));
        
        setVersions(versionsWithProfiles);
      } else {
        setVersions([]);
      }
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
    return version.content || version.description || version.contenu || '';
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
