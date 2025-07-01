import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Activity, Users, Lock } from 'lucide-react';
import { useSecurityLogger } from '@/hooks/useSecurityLogger';

interface SecurityEvent {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
  severity?: string;
  category?: string;
  metadata?: any;
}

const SecurityDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const { logSecurityEvent } = useSecurityLogger();

  // Fetch recent security events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['security-events', timeFilter],
    queryFn: async () => {
      const hoursBack = timeFilter === '24h' ? 24 : timeFilter === '7d' ? 168 : 720;
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - hoursBack);

      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          user_id,
          action,
          details,
          created_at,
          severity,
          category,
          metadata
        `)
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SecurityEvent[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Security metrics
  const metrics = {
    totalEvents: events.length,
    criticalEvents: events.filter(e => e.severity === 'critical').length,
    highSeverityEvents: events.filter(e => e.severity === 'high').length,
    authFailures: events.filter(e => e.action.includes('login_failure')).length,
    suspiciousActivity: events.filter(e => e.action === 'suspicious_activity').length,
    uniqueUsers: new Set(events.map(e => e.user_id)).size,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Lock className="h-4 w-4" />;
      case 'authorization': return <Shield className="h-4 w-4" />;
      case 'data_access': return <Eye className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      case 'network': return <Activity className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatEventDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      return parsed.description || details;
    } catch {
      return details;
    }
  };

  useEffect(() => {
    // Log security dashboard access
    logSecurityEvent({
      action: 'security_dashboard_accessed',
      severity: 'info',
      category: 'system',
      details: 'Security dashboard was accessed by admin'
    });
  }, [logSecurityEvent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord Sécurité
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Surveillance et analyse des événements de sécurité
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d'].map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      {metrics.criticalEvents > 0 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>{metrics.criticalEvents}</strong> événement(s) critique(s) détecté(s) 
            dans les dernières {timeFilter}. Intervention immédiate requise.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Événements
                </p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Événements Critiques
                </p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Haute Sévérité
                </p>
                <p className="text-2xl font-bold text-orange-600">{metrics.highSeverityEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Échecs Connexion
                </p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.authFailures}</p>
              </div>
              <Lock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Activité Suspecte
                </p>
                <p className="text-2xl font-bold text-purple-600">{metrics.suspiciousActivity}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Utilisateurs Uniques
                </p>
                <p className="text-2xl font-bold">{metrics.uniqueUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Événements Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(event.category || 'user_activity')}
                    <Badge 
                      className={`${getSeverityColor(event.severity || 'info')} text-white text-xs`}
                    >
                      {event.severity || 'info'}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {event.action}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {formatEventDetails(event.details)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun événement de sécurité dans la période sélectionnée
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;