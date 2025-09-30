import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Phone, Calendar, Eye, MessageSquare, Check, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from "@/hooks/useToastNotifications";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { usePagination, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/utils/adminPagination";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  // Filter messages
  const filteredMessages = (messages || []).filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedMessages,
    totalItems
  } = usePagination(filteredMessages, 10);

  const getStatusCounts = () => {
    const all = messages || [];
    return {
      total: all.length,
      unread: all.filter(msg => msg.status === 'unread').length,
      read: all.filter(msg => msg.status === 'read').length,
      responded: all.filter(msg => msg.status === 'responded').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Messages de Contact
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez les messages reçus via le formulaire de contact
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{statusCounts.total}</p>
              </div>
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Non lus</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">{statusCounts.unread}</p>
              </div>
              <Eye className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Lus</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{statusCounts.read}</p>
              </div>
              <MessageSquare className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Répondus</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">{statusCounts.responded}</p>
              </div>
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-3 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 rounded-md transition-colors"
              >
                <option value="all">Tous les statuts</option>
                <option value="unread">Non lus</option>
                <option value="read">Lus</option>
                <option value="responded">Répondus</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-6">
        {paginatedMessages.map((message) => (
          <Card key={message.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {message.name}
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                        {message.subject}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {message.status === 'unread' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(message)}
                          className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                          title="Marquer comme lu"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMessage(message);
                              setResponse(message.response || "");
                            }}
                            className="hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20"
                            title="Répondre"
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
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(message.id)}
                        className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusLabel(message.status)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-1" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-1" />
                        {message.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(message.created_at), 'PPp', { locale: fr })}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMessages.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun message trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Aucun message de contact n'a été reçu pour le moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AdminContact;