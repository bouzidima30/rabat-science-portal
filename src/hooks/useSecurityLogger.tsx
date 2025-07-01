
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityLogEntry {
  action: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'authentication' | 'authorization' | 'data_access' | 'system' | 'network' | 'user_activity';
  details: string;
  source_ip?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export const useSecurityLogger = (userId?: string | null) => {

  const logSecurityEvent = useCallback(async (entry: SecurityLogEntry) => {
    try {
      // Enrichissement automatique des logs
      const enrichedEntry = {
        user_id: userId || null,
        action: entry.action,
        details: JSON.stringify({
          severity: entry.severity,
          category: entry.category,
          description: entry.details,
          timestamp: new Date().toISOString(),
          source_ip: entry.source_ip || 'unknown',
          user_agent: entry.user_agent || navigator.userAgent,
          session_id: sessionStorage.getItem('session_id') || 'anonymous',
          page_url: window.location.href,
          referrer: document.referrer || 'direct',
          metadata: entry.metadata || {}
        }),
        ip_address: entry.source_ip || null,
        user_agent: entry.user_agent || navigator.userAgent
      };

      const { error } = await supabase
        .from('activity_logs')
        .insert(enrichedEntry);

      if (error) {
        console.error('Erreur lors de l\'enregistrement du log de sécurité:', error);
      } else {
        console.log('Événement de sécurité enregistré:', entry.action);
      }

      // Déclenchement d'alertes pour les événements critiques
      if (entry.severity === 'critical' || entry.severity === 'high') {
        await triggerSecurityAlert(enrichedEntry);
      }

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log de sécurité:', error);
    }
  }, [userId]);

  const triggerSecurityAlert = async (entry: any) => {
    try {
      // Simulation d'un système d'alerte (pourrait être remplacé par une vraie intégration)
      console.warn('🚨 ALERTE SÉCURITÉ:', entry);
      
      // Ici on pourrait intégrer avec des services d'alerte comme:
      // - Slack/Teams webhook
      // - Email notifications
      // - SMS alerts
      // - PagerDuty
      
    } catch (error) {
      console.error('Erreur lors du déclenchement de l\'alerte:', error);
    }
  };

  // Fonctions utilitaires pour des types d'événements spécifiques
  const logAuthenticationEvent = useCallback((success: boolean, email?: string, details?: string) => {
    logSecurityEvent({
      action: success ? 'login_success' : 'login_failure',
      severity: success ? 'info' : 'medium',
      category: 'authentication',
      details: `Tentative de connexion ${success ? 'réussie' : 'échouée'}${email ? ` pour ${email}` : ''}${details ? `: ${details}` : ''}`,
      metadata: { email, success }
    });
  }, [logSecurityEvent]);

  const logDataAccess = useCallback((resource: string, action: string, recordCount?: number) => {
    const severity = recordCount && recordCount > 1000 ? 'high' : 
                    recordCount && recordCount > 100 ? 'medium' : 'low';
    
    logSecurityEvent({
      action: `data_${action}`,
      severity,
      category: 'data_access',
      details: `Accès aux données: ${action} sur ${resource}${recordCount ? ` (${recordCount} enregistrements)` : ''}`,
      metadata: { resource, action, recordCount }
    });
  }, [logSecurityEvent]);

  const logPrivilegeChange = useCallback((targetUser: string, oldRole: string, newRole: string) => {
    logSecurityEvent({
      action: 'privilege_change',
      severity: 'high',
      category: 'authorization',
      details: `Changement de privilèges: ${targetUser} de ${oldRole} vers ${newRole}`,
      metadata: { targetUser, oldRole, newRole }
    });
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback((activityType: string, details: string, metadata?: any) => {
    logSecurityEvent({
      action: 'suspicious_activity',
      severity: 'high',
      category: 'system',
      details: `Activité suspecte détectée: ${activityType} - ${details}`,
      metadata: { activityType, ...metadata }
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logAuthenticationEvent,
    logDataAccess,
    logPrivilegeChange,
    logSuspiciousActivity
  };
};
