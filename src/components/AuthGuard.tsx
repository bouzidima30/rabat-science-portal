
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // Fetch user role from user_roles table
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Check IP whitelist via edge function when admin access is required
  const isAdmin = profile?.role === 'admin';
  const { data: ipCheck, isLoading: ipLoading } = useQuery({
    queryKey: ['admin-ip-check'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-admin-ip');
      if (error) throw error;
      return data as { allowed: boolean; ip: string | null; whitelistEmpty: boolean };
    },
    enabled: requireAdmin && !!user?.id && isAdmin,
    staleTime: 60_000,
    retry: false,
  });

  if (loading || profileLoading || (requireAdmin && isAdmin && ipLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For admin requirement, check the role from the profile
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // IP whitelist enforcement for admin
  if (requireAdmin && isAdmin && ipCheck && !ipCheck.allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-lg shadow p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Accès refusé</h1>
          <p className="text-sm text-muted-foreground">
            L'accès à l'espace administration est restreint aux adresses IP autorisées.
          </p>
          {ipCheck.ip && (
            <p className="text-xs text-muted-foreground">
              Votre adresse IP&nbsp;: <code className="font-mono">{ipCheck.ip}</code>
            </p>
          )}
          {ipCheck.whitelistEmpty && (
            <p className="text-xs text-destructive">
              Aucune adresse IP n'est actuellement autorisée. Contactez un super-administrateur.
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
