
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = useCallback(async (action: string, details?: string) => {
    if (!user) return;

    try {
      // Vérifier d'abord si l'utilisateur est authentifié
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.warn('No active session for logging activity');
        return;
      }

      // Log d'activité simple sans enrichissement excessif
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          details: details || action,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging activity:', error);
        return;
      }

      console.log('Activity logged:', action);

    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  return { logActivity };
};
