
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { CheckCircle, XCircle, Send, Clock } from "lucide-react";

interface ContentModerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    status: string;
    type: 'news' | 'event';
  };
  onStatusUpdate: () => void;
}

const ContentModerationDialog = ({ 
  isOpen, 
  onClose, 
  content, 
  onStatusUpdate 
}: ContentModerationDialogProps) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const handleStatusChange = async (newStatus: string) => {
    setSubmitting(true);
    
    try {
      const table = content.type === 'news' ? 'news' : 'events';
      const updateData = {
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      };

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', content.id);

      if (error) throw error;

      await logActivity(
        `${content.type}_moderation`,
        `${content.type === 'news' ? 'Actualité' : 'Événement'} "${content.title}" ${newStatus === 'approved' ? 'approuvé' : newStatus === 'rejected' ? 'rejeté' : 'mis à jour'}`
      );

      toast({
        title: "Succès",
        description: `Le contenu a été ${newStatus === 'approved' ? 'approuvé' : newStatus === 'rejected' ? 'rejeté' : 'mis à jour'}.`,
      });

      onStatusUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating content status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setSubmitting(true);
    
    try {
      const table = content.type === 'news' ? 'news' : 'events';
      const updateData = {
        status: 'published',
        published: true,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      };

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', content.id);

      if (error) throw error;

      await logActivity(
        `${content.type}_publish`,
        `${content.type === 'news' ? 'Actualité' : 'Événement'} "${content.title}" publié`
      );

      toast({
        title: "Succès",
        description: "Le contenu a été publié avec succès.",
      });

      onStatusUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error publishing content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier le contenu.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Modération du contenu
            <Badge variant="outline">{content.type === 'news' ? 'Actualité' : 'Événement'}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {content.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Statut actuel:</span>
              <Badge variant={content.status === 'approved' ? 'default' : 'secondary'}>
                {content.status === 'draft' && 'Brouillon'}
                {content.status === 'pending_review' && 'En attente'}
                {content.status === 'approved' && 'Approuvé'}
                {content.status === 'rejected' && 'Rejeté'}
                {content.status === 'published' && 'Publié'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Notes de révision (optionnel)
            </label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Ajoutez des commentaires sur cette révision..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            {content.status !== 'approved' && (
              <Button
                onClick={() => handleStatusChange('approved')}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approuver
              </Button>
            )}

            {content.status !== 'rejected' && (
              <Button
                onClick={() => handleStatusChange('rejected')}
                disabled={submitting}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </Button>
            )}

            {content.status === 'approved' && (
              <Button
                onClick={handlePublish}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Publier
              </Button>
            )}

            {content.status !== 'pending_review' && content.status !== 'published' && (
              <Button
                onClick={() => handleStatusChange('pending_review')}
                disabled={submitting}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Soumettre pour révision
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentModerationDialog;
