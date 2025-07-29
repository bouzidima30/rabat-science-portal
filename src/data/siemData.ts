import { SecurityEvent } from '@/types/security';

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
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

export const INITIAL_METRICS = {
  total_events: 0,
  critical_events: 0,
  failed_logins: 0,
  suspicious_activities: 0,
  blocked_ips: 3,
  active_sessions: 15
};

export const FILTER_OPTIONS = {
  severity: [
    { value: 'all', label: 'Toutes les sévérités' },
    { value: 'critical', label: 'Critique' },
    { value: 'high', label: 'Élevée' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'low', label: 'Faible' }
  ],
  category: [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'authentication', label: 'Authentification' },
    { value: 'authorization', label: 'Autorisation' },
    { value: 'data_access', label: 'Accès aux données' },
    { value: 'system', label: 'Système' },
    { value: 'network', label: 'Réseau' }
  ]
};

export const SEVERITY_STYLES = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200'
};

export const STATUS_VARIANTS = {
  new: 'destructive',
  investigating: 'default',
  resolved: 'secondary',
  false_positive: 'outline',
  default: 'secondary'
} as const;

export const ALERT_INTERVAL = 30000; // 30 seconds
export const CSV_HEADERS = 'Timestamp,Severity,Category,Event Type,Source IP,User ID,Details,Status';