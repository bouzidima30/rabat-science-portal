
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Send } from "lucide-react";
import ContentStatusBadge from "./ContentStatusBadge";

interface ContentModerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: 'news' | 'formation' | 'cooperation' | 'page' | 'event';
  contentTitle: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

const ContentModerationDialog = ({ 
  isOpen, 
  onClose, 
  contentId, 
  contentType, 
  contentTitle,
  currentStatus,
  onStatusUpdate
}: ContentModerationDialogProps) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const updates: any = {
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewer_id: (await supabase.auth.getUser()).data.user?.id
      };

      if (reviewNotes.trim()) {
        updates.review_notes = reviewNotes.trim();
      }

      const { error } = await supabase
        .from(getTableName(contentType))
        .update(updates)
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Le contenu a été ${getStatusLabel(newStatus)}.`,
      });

      onStatusUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTableName = (type: string) => {
    switch (type) {
      case 'news': return 'news';
      case 'formation': return 'formations';
      case 'cooperation': return 'cooperations';
      case 'page': return 'pages';
      case 'event': return 'events';
      default: return 'formations';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_review': return 'soumis pour révision';
      case 'approved': return 'approuvé';
      case 'rejected': return 'rejeté';
      case 'published': return 'publié';
      default: return status;
    }
  };

  const canSubmitForReview = currentStatus === 'draft';
  const canApprove = currentStatus === 'pending_review';
  const canReject = currentStatus === 'pending_review';
  const canPublish = currentStatus === 'approved';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Modération du contenu - {contentTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-medium">Statut actuel:</span>
            <ContentStatusBadge status={currentStatus} />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Notes de révision (optionnel)
            </label>
            <Textarea
              placeholder="Ajoutez des commentaires sur cette révision..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {canSubmitForReview && (
              <Button
                onClick={() => handleStatusUpdate('pending_review')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Soumettre pour révision
              </Button>
            )}

            {canApprove && (
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            )}

            {canReject && (
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            )}

            {canPublish && (
              <Button
                onClick={() => handleStatusUpdate('published')}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Publier
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentModerationDialog;
