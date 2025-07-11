import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Secure admin operations hook
export const useAdminSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user is admin
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  const isAdmin = userProfile?.role === 'admin';

  // Secure role update mutation with logging
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole, reason }: { 
      userId: string; 
      newRole: string; 
      reason?: string; 
    }) => {
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }

      // Log the privilege change attempt
      await supabase.rpc('log_security_event', {
        p_user_id: user?.id,
        p_action: 'privilege_escalation_attempt',
        p_severity: 'high',
        p_category: 'authorization',
        p_details: `Admin ${user?.email} attempting to change user ${userId} role to ${newRole}`,
        p_metadata: { 
          target_user_id: userId, 
          old_role: 'user', 
          new_role: newRole, 
          reason: reason || 'No reason provided' 
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Log successful change
      await supabase.rpc('log_security_event', {
        p_user_id: user?.id,
        p_action: 'privilege_change_success',
        p_severity: 'high',
        p_category: 'authorization',
        p_details: `Successfully changed user ${userId} role to ${newRole}`,
        p_metadata: { 
          target_user_id: userId, 
          new_role: newRole, 
          reason: reason || 'No reason provided' 
        }
      });

      return { userId, newRole };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      // Log the failed attempt
      supabase.rpc('log_security_event', {
        p_user_id: user?.id,
        p_action: 'privilege_escalation_failed',
        p_severity: 'critical',
        p_category: 'authorization',
        p_details: `Failed privilege escalation attempt: ${error.message}`,
        p_metadata: { error: error.message }
      });

      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le rôle.",
        variant: "destructive",
      });
    },
  });

  // Fetch users for admin management
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, updated_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Monitor suspicious activity
  const logSuspiciousActivity = async (activityType: string, details: string, metadata?: any) => {
    try {
      await supabase.rpc('log_security_event', {
        p_user_id: user?.id,
        p_action: activityType,
        p_severity: 'medium',
        p_category: 'user_activity',
        p_details: details,
        p_metadata: metadata || {}
      });
    } catch (error) {
      console.error('Failed to log suspicious activity:', error);
    }
  };

  return {
    userProfile,
    isAdmin,
    isLoading: profileLoading || usersLoading,
    users: users || [],
    updateUserRoleMutation,
    logSuspiciousActivity,
  };
};