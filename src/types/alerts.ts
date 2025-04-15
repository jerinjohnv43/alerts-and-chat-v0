
export interface Alert {
  id: string;
  name: string;
  description: string;
  reportId: string;
  reportName: string;
  active: boolean;
  status: string;
  triggerCount: number;
  lastTriggered: string | null;
  cost: number;
  successRate: number;
  failureCount: number;
  recipients: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AlertHistory {
  id: string;
  alertId: string;
  timestamp: string;
  status: string;
  processingTime: number;
  cost: number;
  errorMessage?: string;
}

export interface AlertFiltersType {
  search?: string;
  statuses?: string[];
  active: boolean | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AlertMetrics {
  totalAlerts: number;
  activeAlerts: number;
  totalTriggers: number;
  totalCost: number;
  averageSuccessRate: number;
}
