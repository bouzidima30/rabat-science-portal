import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Shield,
  CheckCircle2,
  XCircle,
  Network,
  Search,
} from "lucide-react";

type IpEntry = {
  id: string;
  ip_address: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
};

const AdminAccesIP = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: myIpData } = useQuery({
    queryKey: ["my-current-ip"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("check-admin-ip");
      if (error) throw error;
      return data as { ip: string | null; allowed: boolean };
    },
  });

  const { data: entries, isLoading } = useQuery({
    queryKey: ["admin-ip-whitelist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_ip_whitelist")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as IpEntry[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const trimmed = ip.trim();
      if (!trimmed) throw new Error("Adresse IP requise");
      const { error } = await supabase.from("admin_ip_whitelist").insert({
        ip_address: trimmed,
        label: label.trim() || null,
        created_by: user?.id ?? null,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Adresse IP ajoutée" });
      setIp("");
      setLabel("");
      qc.invalidateQueries({ queryKey: ["admin-ip-whitelist"] });
    },
    onError: (e: Error) =>
      toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("admin_ip_whitelist")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-ip-whitelist"] }),
    onError: (e: Error) =>
      toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("admin_ip_whitelist")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Adresse IP supprimée" });
      qc.invalidateQueries({ queryKey: ["admin-ip-whitelist"] });
    },
    onError: (e: Error) =>
      toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const totalCount = entries?.length || 0;
  const activeCount = entries?.filter((e) => e.is_active).length || 0;
  const inactiveCount = totalCount - activeCount;

  const filteredEntries = entries?.filter(
    (e) =>
      e.ip_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.label || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Contrôle d'accès par adresse IP
              </h1>
              <p className="text-muted-foreground mt-1">
                Seules les adresses IP listées et actives peuvent accéder à l'espace administration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{totalCount}</p>
              </div>
              <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Actives</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">{activeCount}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Inactives</p>
                <p className="text-xl font-bold text-muted-foreground">{inactiveCount}</p>
              </div>
              <XCircle className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {myIpData?.ip && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 mb-8">
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-sm">
                <span className="text-muted-foreground">Votre adresse IP actuelle : </span>
                <code className="font-mono font-semibold text-foreground">{myIpData.ip}</code>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIp(myIpData.ip!);
                setLabel("Mon IP");
              }}
              className="border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              Pré-remplir
            </Button>
          </CardContent>
        </Card>
      )}

      {entries && activeCount === 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 mb-8">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Aucune IP active</p>
              <p className="text-muted-foreground">
                Ajoutez au moins votre adresse IP actuelle avant de vous déconnecter, sinon vous risquez de perdre l'accès admin.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add IP Form */}
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Ajouter une adresse IP</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              addMutation.mutate();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="ip">Adresse IP</Label>
              <Input
                id="ip"
                placeholder="ex. 196.200.10.42"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
                className="h-12 border-0 bg-muted/30 focus:bg-card dark:focus:bg-gray-700 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="label">Libellé (optionnel)</Label>
              <Input
                id="label"
                placeholder="ex. Bureau FSR"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-12 border-0 bg-muted/30 focus:bg-card dark:focus:bg-gray-700 transition-colors"
              />
            </div>
            <Button
              type="submit"
              disabled={addMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg h-12"
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search & Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Adresses IP autorisées</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher une IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-0 bg-muted/30 focus:bg-card dark:focus:bg-gray-700 transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !filteredEntries || filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                Aucune adresse IP trouvée
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Ajoutez une adresse IP pour commencer."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adresse IP</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((e) => (
                    <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4 text-muted-foreground" />
                          {e.ip_address}
                          {myIpData?.ip === e.ip_address && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                              vous
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {e.label || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={e.is_active}
                            onCheckedChange={(v) =>
                              toggleMutation.mutate({ id: e.id, is_active: v })
                            }
                          />
                          <span className={`text-xs font-medium ${e.is_active ? "text-green-600" : "text-muted-foreground"}`}>
                            {e.is_active ? "Active" : "Désactivée"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Supprimer l'adresse ${e.ip_address} ?`)) {
                              deleteMutation.mutate(e.id);
                            }
                          }}
                          className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccesIP;
