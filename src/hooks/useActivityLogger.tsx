
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSecurityLogger } from '@/hooks/useSecurityLogger';

export const useActivityLogger = () => {
  const { user } = useAuth();
  const { logSecurityEvent } = useSecurityLogger();

  const logActivity = useCallback(async (action: string, details?: string) => {
    if (!user) return;

    try {
      // Log d'activité standard enrichi
      const enrichedDetails = {
        original_details: details,
        timestamp: new Date().toISOString(),
        session_id: sessionStorage.getItem('session_id') || 'anonymous',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };

      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          details: JSON.stringify(enrichedDetails),
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging activity:', error);
      }

      // Log de sécurité pour certaines actions sensibles
      if (isSensitiveAction(action)) {
        const severity = getSeverityForAction(action);
        const category = getCategoryForAction(action);
        
        await logSecurityEvent({
          action,
          severity,
          category,
          details: details || `Action utilisateur: ${action}`,
          metadata: { action_type: 'user_activity' }
        });
      }

    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user, logSecurityEvent]);

  // Détermine si une action est sensible du point de vue sécurité
  const isSensitiveAction = (action: string): boolean => {
    const sensitiveActions = [
      'login', 'logout', 'password_change', 'profile_update',
      'admin_access', 'data_export', 'user_creation', 'user_deletion',
      'role_change', 'permission_change', 'configuration_change'
    ];
    return sensitiveActions.some(sensitive => action.toLowerCase().includes(sensitive));
  };

  // Détermine la sévérité d'une action
  const getSeverityForAction = (action: string): 'critical' | 'high' | 'medium' | 'low' | 'info' => {
    if (action.includes('delete') || action.includes('admin') || action.includes('role_change')) {
      return 'high';
    }
    if (action.includes('password') || action.includes('permission')) {
      return 'medium';
    }
    if (action.includes('login') || action.includes('logout')) {
      return 'low';
    }
    return 'info';
  };

  // Détermine la catégorie d'une action
  const getCategoryForAction = (action: string): 'authentication' | 'authorization' | 'data_access' | 'system' | 'network' | 'user_activity' => {
    if (action.includes('login') || action.includes('logout') || action.includes('password')) {
      return 'authentication';
    }
    if (action.includes('role') || action.includes('permission') || action.includes('admin')) {
      return 'authorization';
    }
    if (action.includes('export') || action.includes('data') || action.includes('download')) {
      return 'data_access';
    }
    if (action.includes('config') || action.includes('system')) {
      return 'system';
    }
    return 'user_activity';
  };

  return { logActivity };
};
