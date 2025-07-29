export interface SecurityTestResult {
  test: string;
  status: 'passed' | 'failed' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  details?: string;
  recommendation?: string;
  score: number;
}

export interface PerformanceMetric {
  value: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  description: string;
}

export interface SecurityEvent {
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

export interface SecurityMetrics {
  total_events: number;
  critical_events: number;
  failed_logins: number;
  suspicious_activities: number;
  blocked_ips: number;
  active_sessions: number;
}

export type SecurityStatus = 'passed' | 'failed' | 'warning' | 'info';
export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';