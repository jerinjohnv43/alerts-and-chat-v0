
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  permissions: string[];
  createdAt: string;
  alerts: UserAlertSubscription[];
}

export interface UserAlertSubscription {
  alertId: string;
  alertName: string;
  notificationType: 'email' | 'sms' | 'app';
}
