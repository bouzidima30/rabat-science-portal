
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Activity, Server, Clock, Filter, Download } from 'lucide-react';
import { useToastNotifications } from '@/hooks/useToastNotifications';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'authorization' | 'data_access' | 'system' | 'network';
  event_type: string;
  source_ip: string;
  user_id?: string;
  user_agent?: string;
  details: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
}

interface SecurityMetrics {
  total_events: number;
  critical_events: number;
  failed_logins: number;
  suspicious_activities: number;
  blocked_ips: number;
  active_sessions: number;
}

const SIEMDashboard = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    total_events: 0,
    critical_events: 0,
    failed_logins: 0,
    suspicious_activities: 0,
    blocked_ips: 0,
    active_sessions: 15
  });
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { showInfo, showWarning, showError } = useToastNotifications();

  // Simuler des événements de sécurité en temps réel
  useEffect(() => {
    const generateMockEvents = (): SecurityEvent[] => {
      return [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          severity: 'medium',
          category: 'authentication',
          event_type: 'Multiple failed login attempts',
          source_ip: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          details: '5 tentatives de connexion échouées en 2 minutes pour l\'utilisateur admin@example.com',
          status: 'investigating'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          severity: 'high',
          category: 'authorization',
          event_type: 'Privilege escalation attempt',
          source_ip: '10.0.0.50',
          user_id: 'user123',
          user_agent: 'curl/7.68.0',
          details: 'Tentative d\'accès à des ressources admin sans autorisation appropriée',
          status: 'new'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          severity: 'critical',
          category: 'data_access',
          event_type: 'Suspicious data export',
          source_ip: '203.0.113.45',
          user_id: 'user456',
          user_agent: 'Python-requests/2.25.1',
          details: 'Exportation massive de données utilisateur (>10 000 enregistrements) en dehors des heures normales',
          status: 'new'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          severity: 'low',
          category: 'system',
          event_type: 'Configuration change',
          source_ip: '192.168.1.10',
          user_id: 'admin',
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
          details: 'Modification des paramètres de sécurité par l\'administrateur',
          status: 'resolved'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          severity: 'high',
          category: 'network',
          event_type: 'Port scan detected',
          source_ip: '198.51.100.25',
          user_agent: 'nmap',
          details: 'Scan de ports détecté depuis une adresse IP externe suspecte',
          status: 'investigating'
        }
      ];
    };

    const mockEvents = generateMockEvents();
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);

    // Calculer les métriques
    setMetrics({
      total_events: mockEvents.length,
      critical_events: mockEvents.filter(e => e.severity === 'critical').length,
      failed_logins: mockEvents.filter(e => e.event_type.includes('failed login')).length,
      suspicious_activities: mockEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length,
      blocked_ips: 3,
      active_sessions: 15
    });

    // Simuler des alertes en temps réel
    const interval = setInterval(() => {
      const criticalEvents = mockEvents.filter(e => e.severity === 'critical' && e.status === 'new');
      if (criticalEvents.length > 0) {
        showError('Alerte Critique SIEM', `${criticalEvents.length} événement(s) critique(s) détecté(s)`);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [showError]);

  // Filtrer les événements
  useEffect(() => {
    let filtered = events;
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }
    
    setFilteredEvents(filtered);
  }, [events, severityFilter, categoryFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'investigating': return 'default';
      case 'resolved': return 'secondary';
      case 'false_positive': return 'outline';
      default: return 'secondary';
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      'Timestamp,Severity,Category,Event Type,Source IP,User ID,Details,Status',
      ...filteredEvents.map(event => 
        `${event.timestamp.toISOString()},${event.severity},${event.category},${event.event_type},${event.source_ip},${event.user_id || ''},${event.details.replace(/,/g, ';')},${event.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siem_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showInfo('Export réussi', 'Les logs ont été exportés en CSV');
  };

  return (
    <div className="space-y-6">
      {/* Métriques de sécurité */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Événements</p>
                <p className="text-2xl font-bold">{metrics.total_events}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{metrics.critical_events}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Échecs Connexion</p>
                <p className="text-2xl font-bold">{metrics.failed_logins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Activités Suspectes</p>
                <p className="text-2xl font-bold">{metrics.suspicious_activities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">IPs Bloquées</p>
                <p className="text-2xl font-bold">{metrics.blocked_ips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sessions Actives</p>
                <p className="text-2xl font-bold text-green-600">{metrics.active_sessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes critiques */}
      {metrics.critical_events > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention :</strong> {metrics.critical_events} événement(s) critique(s) nécessite(nt) une attention immédiate.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtres et contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Événements de Sécurité
            </span>
            <Button onClick={handleExportLogs} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardTitle>
          <div className="flex space-x-4">
            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">Toutes les sévérités</option>
              <option value="critical">Critique</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
            
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">Toutes les catégories</option>
              <option value="authentication">Authentification</option>
              <option value="authorization">Autorisation</option>
              <option value="data_access">Accès aux données</option>
              <option value="system">Système</option>
              <option value="network">Réseau</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {event.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <Badge variant={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg">{event.event_type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Catégorie:</span>
                    <span className="ml-1 capitalize">{event.category.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium">IP Source:</span>
                    <span className="ml-1 font-mono">{event.source_ip}</span>
                  </div>
                  {event.user_id && (
                    <div>
                      <span className="font-medium">Utilisateur:</span>
                      <span className="ml-1">{event.user_id}</span>
                    </div>
                  )}
                  {event.user_agent && (
                    <div>
                      <span className="font-medium">User Agent:</span>
                      <span className="ml-1 truncate">{event.user_agent}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIEMDashboard;
