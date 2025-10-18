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
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      // Fetch user roles from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
      }
      
      return {
        ...profileData,
        role: roleData?.role || 'user'
      };
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

      // Delete old role and insert new role in user_roles table
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole as 'admin' | 'user' });

      if (insertError) throw insertError;

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
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at, updated_at')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles = profilesData?.map(profile => {
        const userRole = rolesData?.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || 'user'
        };
      });
      
      return usersWithRoles;
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