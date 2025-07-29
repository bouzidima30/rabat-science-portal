import { SecuritySeverity, SecurityStatus } from '@/types/security';

export const TIME_FILTER_OPTIONS = [
  { value: '24h', label: '24h', hours: 24 },
  { value: '7d', label: '7d', hours: 168 },
  { value: '30d', label: '30d', hours: 720 }
];

export const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
  default: 'bg-gray-500'
};

export const CATEGORY_ICON_MAP = {
  authentication: 'Lock',
  authorization: 'Shield',
  data_access: 'Eye',
  system: 'Activity',
  network: 'Activity',
  default: 'Users'
} as const;

export const SECURITY_DASHBOARD_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  eventLimit: 100,
  alertThreshold: {
    critical: 1,
    high: 3,
    medium: 10
  }
};

export const METRIC_LABELS = {
  totalEvents: 'Total Événements',
  criticalEvents: 'Événements Critiques',
  highSeverityEvents: 'Haute Sévérité',
  authFailures: 'Échecs Connexion',
  suspiciousActivity: 'Activité Suspecte',
  uniqueUsers: 'Utilisateurs Uniques'
} as const;

export const SECURITY_EVENT_ACTIONS = {
  LOGIN_FAILURE: 'login_failure',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  DASHBOARD_ACCESS: 'security_dashboard_accessed'
} as const;