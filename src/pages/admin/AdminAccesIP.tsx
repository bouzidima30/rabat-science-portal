import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-6 w-6 text-primary mt-1" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contrôle d'accès par adresse IP</h1>
          <p className="text-sm text-muted-foreground">
            Seules les adresses IP listées et actives ci-dessous peuvent accéder à l'espace administration.
          </p>
        </div>
      </div>

      {myIpData?.ip && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Votre adresse IP actuelle&nbsp;: </span>
              <code className="font-mono font-semibold">{myIpData.ip}</code>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIp(myIpData.ip!);
                setLabel("Mon IP");
              }}
            >
              Pré-remplir
            </Button>
          </CardContent>
        </Card>
      )}

      {entries && entries.filter((e) => e.is_active).length === 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Aucune IP active</p>
              <p className="text-muted-foreground">
                Ajoutez au moins votre adresse IP actuelle avant de vous déconnecter, sinon vous risquez de perdre l'accès admin.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une adresse IP</CardTitle>
          <CardDescription>Format IPv4 ou IPv6 exact, sans masque CIDR.</CardDescription>
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
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="label">Libellé (optionnel)</Label>
              <Input
                id="label"
                placeholder="ex. Bureau FSR"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={addMutation.isPending}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adresses IP autorisées</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : !entries || entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune adresse IP enregistrée.</p>
          ) : (
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
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono">
                      {e.ip_address}
                      {myIpData?.ip === e.ip_address && (
                        <Badge variant="secondary" className="ml-2">vous</Badge>
                      )}
                    </TableCell>
                    <TableCell>{e.label || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={e.is_active}
                          onCheckedChange={(v) =>
                            toggleMutation.mutate({ id: e.id, is_active: v })
                          }
                        />
                        <span className="text-xs text-muted-foreground">
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
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccesIP;