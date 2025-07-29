import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Activity, Users, Lock } from 'lucide-react';
import { useSecurityLogger } from '@/hooks/useSecurityLogger';
import { 
  TIME_FILTER_OPTIONS, 
  SEVERITY_COLORS, 
  CATEGORY_ICON_MAP, 
  SECURITY_DASHBOARD_CONFIG,
  METRIC_LABELS,
  SECURITY_EVENT_ACTIONS
} from '@/data/securityDashboardData';

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
      const filterOption = TIME_FILTER_OPTIONS.find(option => option.value === timeFilter);
      const hoursBack = filterOption?.hours || 24;
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
        .limit(SECURITY_DASHBOARD_CONFIG.eventLimit);

      if (error) throw error;
      return data as SecurityEvent[];
    },
    refetchInterval: SECURITY_DASHBOARD_CONFIG.refreshInterval,
  });

  // Security metrics
  const metrics = {
    totalEvents: events.length,
    criticalEvents: events.filter(e => e.severity === 'critical').length,
    highSeverityEvents: events.filter(e => e.severity === 'high').length,
    authFailures: events.filter(e => e.action.includes(SECURITY_EVENT_ACTIONS.LOGIN_FAILURE)).length,
    suspiciousActivity: events.filter(e => e.action === SECURITY_EVENT_ACTIONS.SUSPICIOUS_ACTIVITY).length,
    uniqueUsers: new Set(events.map(e => e.user_id)).size,
  };

  const getSeverityColor = (severity: string) => 
    SEVERITY_COLORS[severity] || SEVERITY_COLORS.default;

  const getCategoryIcon = (category: string) => {
    const iconName = CATEGORY_ICON_MAP[category as keyof typeof CATEGORY_ICON_MAP] || CATEGORY_ICON_MAP.default;
    const iconProps = { className: "h-4 w-4" };
    
    switch (iconName) {
      case 'Lock': return <Lock {...iconProps} />;
      case 'Shield': return <Shield {...iconProps} />;
      case 'Eye': return <Eye {...iconProps} />;
      case 'Activity': return <Activity {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      default: return <Users {...iconProps} />;
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
      action: SECURITY_EVENT_ACTIONS.DASHBOARD_ACCESS,
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
          {TIME_FILTER_OPTIONS.map((filter) => (
            <Button
              key={filter.value}
              variant={timeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter.value)}
            >
              {filter.label}
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
                  {METRIC_LABELS.totalEvents}
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
                  {METRIC_LABELS.criticalEvents}
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
                  {METRIC_LABELS.highSeverityEvents}
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
                  {METRIC_LABELS.authFailures}
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
                  {METRIC_LABELS.suspiciousActivity}
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
                  {METRIC_LABELS.uniqueUsers}
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