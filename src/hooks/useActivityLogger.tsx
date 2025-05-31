
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = useCallback(async (action: string, details?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          details,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  return { logActivity };
};
