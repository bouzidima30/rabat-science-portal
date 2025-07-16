import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  details?: string;
  metadata?: Record<string, any>;
}

export const useSecurityMonitoring = () => {
  const { toast } = useToast();

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get client info for enhanced logging
      const clientInfo = {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        ...event.metadata
      };

      const { error } = await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_action: event.action,
        p_severity: event.severity,
        p_category: event.category,
        p_details: event.details || '',
        p_metadata: clientInfo
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }

      // Show user notification for high/critical events
      if (event.severity === 'high' || event.severity === 'critical') {
        toast({
          title: 'Activité de sécurité détectée',
          description: event.details || 'Une activité suspecte a été enregistrée.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  };

  // Monitor for suspicious activities
  useEffect(() => {
    const monitorConsoleAccess = () => {
      const originalConsole = { ...console };
      
      // Detect console manipulation attempts
      Object.keys(console).forEach(key => {
        if (typeof console[key as keyof Console] === 'function') {
          const original = console[key as keyof Console] as Function;
          (console as any)[key] = function(...args: any[]) {
            // Log potential console injection attempts
            if (args.some(arg => 
              typeof arg === 'string' && 
              (arg.includes('<script') || arg.includes('javascript:'))
            )) {
              logSecurityEvent({
                action: 'console_injection_attempt',
                severity: 'high',
                category: 'xss_attempt',
                details: 'Potential XSS attempt via console manipulation',
                metadata: { args: args.slice(0, 3) } // Limit logged data
              });
            }
            return original.apply(this, args);
          };
        }
      });
    };

    // Monitor for devtools opening (basic detection)
    const detectDevTools = () => {
      let devtools = { open: false };
      const threshold = 160;

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            logSecurityEvent({
              action: 'devtools_opened',
              severity: 'low',
              category: 'monitoring',
              details: 'Developer tools may have been opened'
            });
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    };

    // Monitor for multiple rapid failed attempts
    let failedAttempts = 0;
    const resetFailedAttempts = () => {
      setTimeout(() => { failedAttempts = 0; }, 60000); // Reset after 1 minute
    };

    const monitorFailedAttempts = () => {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' && !session) {
          failedAttempts++;
          if (failedAttempts >= 3) {
            logSecurityEvent({
              action: 'multiple_failed_auth_attempts',
              severity: 'medium',
              category: 'authentication',
              details: `${failedAttempts} failed authentication attempts detected`,
              metadata: { attemptCount: failedAttempts }
            });
          }
          resetFailedAttempts();
        } else if (event === 'SIGNED_IN') {
          failedAttempts = 0; // Reset on successful login
        }
      });
    };

    monitorConsoleAccess();
    detectDevTools();
    monitorFailedAttempts();

    // Cleanup function
    return () => {
      // Reset console to original state
      Object.keys(console).forEach(key => {
        if (typeof console[key as keyof Console] === 'function') {
          // This would restore original console methods if needed
        }
      });
    };
  }, []);

  return {
    logSecurityEvent
  };
};