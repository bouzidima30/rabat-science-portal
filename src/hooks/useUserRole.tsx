
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
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

  const isAdmin = profile?.role === 'admin';
  const isUser = profile?.role === 'user';

  return {
    profile,
    isLoading,
    isAdmin,
    isUser,
    role: profile?.role || null
  };
};
