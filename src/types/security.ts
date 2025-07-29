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

export type SecurityStatus = 'passed' | 'failed' | 'warning' | 'info';
export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';