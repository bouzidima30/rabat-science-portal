import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Phone, Calendar, Eye, MessageSquare, Check, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from "@/hooks/useToastNotifications";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  responded_at?: string;
  response?: string;
  responded_by?: string;
}

const AdminContact = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [response, setResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showSuccess, showError } = useToastNotifications();
  const queryClient = useQueryClient();

  // Fetch contact messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    }
  });

  // Update message status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, response }: { id: string; status: string; response?: string }) => {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (response) {
        updateData.response = response;
        updateData.responded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('contact_messages')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      showSuccess("Statut mis à jour", "Le message a été mis à jour avec succès.");
      setIsDialogOpen(false);
      setResponse("");
    },
    onError: () => {
      showError("Erreur", "Une erreur s'est produite lors de la mise à jour.");
    }
  });

  // Delete message
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      showSuccess("Message supprimé", "Le message a été supprimé avec succès.");
    },
    onError: () => {
      showError("Erreur", "Une erreur s'est produite lors de la suppression.");
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'Non lu';
      case 'read': return 'Lu';
      case 'responded': return 'Répondu';
      default: return status;
    }
  };

  const handleMarkAsRead = (message: ContactMessage) => {
    updateStatusMutation.mutate({
      id: message.id,
      status: 'read'
    });
  };

  const handleRespond = () => {
    if (!selectedMessage || !response.trim()) return;
    
    updateStatusMutation.mutate({
      id: selectedMessage.id,
      status: 'responded',
      response: response.trim()
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#006be5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages de Contact</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez les messages reçus via le formulaire de contact
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {messages?.length || 0} message(s)
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {messages?.map((message) => (
          <Card key={message.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-lg">{message.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{message.subject}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(message.status)}>
                    {getStatusLabel(message.status)}
                  </Badge>
                  <div className="flex space-x-1">
                    {message.status === 'unread' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMessage(message);
                            setResponse(message.response || "");
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails du message</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-semibold">Nom:</label>
                              <p>{selectedMessage?.name}</p>
                            </div>
                            <div>
                              <label className="font-semibold">Email:</label>
                              <p>{selectedMessage?.email}</p>
                            </div>
                            {selectedMessage?.phone && (
                              <div>
                                <label className="font-semibold">Téléphone:</label>
                                <p>{selectedMessage.phone}</p>
                              </div>
                            )}
                            <div>
                              <label className="font-semibold">Date:</label>
                              <p>{selectedMessage && format(new Date(selectedMessage.created_at), 'PPPp', { locale: fr })}</p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="font-semibold">Sujet:</label>
                            <p>{selectedMessage?.subject}</p>
                          </div>
                          
                          <div>
                            <label className="font-semibold">Message:</label>
                            <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
                          </div>

                          {selectedMessage?.response && (
                            <div>
                              <label className="font-semibold">Réponse précédente:</label>
                              <p className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                {selectedMessage.response}
                              </p>
                            </div>
                          )}
                          
                          <div>
                            <label className="font-semibold">Réponse:</label>
                            <Textarea
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              placeholder="Tapez votre réponse ici..."
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={handleRespond}
                              disabled={!response.trim()}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Marquer comme répondu
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(message.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {message.email}
                  </div>
                  {message.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {message.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(message.created_at), 'PPp', { locale: fr })}
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 line-clamp-3">
                  {message.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!messages || messages.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Mail className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Aucun message
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Aucun message de contact n'a été reçu pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminContact;