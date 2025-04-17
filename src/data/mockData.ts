
import { Alert, AlertHistory, AlertMetrics } from '@/types/alerts';
import { User } from '@/types/users';

// Sample Power BI reports
export const reports = [
  { id: "r1", name: "Sales Performance" },
  { id: "r2", name: "Marketing Campaign ROI" },
  { id: "r3", name: "Customer Acquisition Costs" },
  { id: "r4", name: "Inventory Management" },
  { id: "r5", name: "Financial Dashboard" }
];

// Sample alerts
export const alerts: Alert[] = [
  {
    id: "a1",
    name: "Daily Sales Below Target",
    description: "Alerts when daily sales fall below 80% of monthly target",
    reportId: "r1",
    reportName: "Sales Performance",
    active: true,
    status: "success",
    triggerCount: 12,
    lastTriggered: "2023-04-14T16:45:00Z",
    cost: 3.24,
    successRate: 95,
    failureCount: 1,
    recipients: {
      email: ["user1@example.com", "user2@example.com"]
    },
    createdAt: "2023-01-05T10:00:00Z",
    updatedAt: "2023-04-14T16:45:00Z"
  },
  {
    id: "a2",
    name: "Marketing Budget Exceeding",
    description: "Alerts when marketing spend exceeds 110% of allocated budget",
    reportId: "r2",
    reportName: "Marketing Campaign ROI",
    active: true,
    status: "warning",
    triggerCount: 3,
    lastTriggered: "2023-04-13T11:20:00Z",
    cost: 0.81,
    successRate: 100,
    failureCount: 0,
    recipients: {
      email: ["user3@example.com"]
    },
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-04-13T11:20:00Z"
  },
  {
    id: "a3",
    name: "Customer Churn Rate Spike",
    description: "Alerts when customer churn increases by 5% or more in a week",
    reportId: "r3",
    reportName: "Customer Acquisition Costs",
    active: false,
    status: "failed",
    triggerCount: 5,
    lastTriggered: "2023-04-10T15:15:00Z",
    cost: 1.35,
    successRate: 60,
    failureCount: 2,
    recipients: {
      email: ["user1@example.com", "user4@example.com"]
    },
    createdAt: "2023-01-20T14:15:00Z",
    updatedAt: "2023-04-10T15:15:00Z"
  },
  {
    id: "a4",
    name: "Inventory Low Stock",
    description: "Alerts when inventory items fall below minimum threshold",
    reportId: "r4",
    reportName: "Inventory Management",
    active: true,
    status: "success",
    triggerCount: 8,
    lastTriggered: "2023-04-14T09:10:00Z",
    cost: 2.16,
    successRate: 87.5,
    failureCount: 1,
    recipients: {
      email: ["user2@example.com", "user5@example.com"]
    },
    createdAt: "2023-03-01T11:00:00Z",
    updatedAt: "2023-04-14T09:10:00Z"
  },
  {
    id: "a5",
    name: "Cash Flow Negative",
    description: "Alerts when projected cash flow turns negative in next 30 days",
    reportId: "r5",
    reportName: "Financial Dashboard",
    active: true,
    status: "pending",
    triggerCount: 1,
    lastTriggered: null,
    cost: 0.27,
    successRate: 100,
    failureCount: 0,
    recipients: {
      email: ["user1@example.com", "user6@example.com"]
    },
    createdAt: "2023-04-01T16:45:00Z",
    updatedAt: "2023-04-01T16:45:00Z"
  },
  {
    id: "a6",
    name: "Website Traffic Drop",
    description: "Alerts when website traffic drops by 20% compared to previous week",
    reportId: "r2",
    reportName: "Marketing Campaign ROI",
    active: false,
    status: "inactive",
    triggerCount: 0,
    lastTriggered: null,
    cost: 0,
    successRate: 0,
    failureCount: 0,
    recipients: {
      email: ["user3@example.com"]
    },
    createdAt: "2023-04-05T10:20:00Z",
    updatedAt: "2023-04-05T10:20:00Z"
  }
];

// Sample alert history entries
export const alertHistory: AlertHistory[] = [
  {
    id: "h1",
    alertId: "a1",
    timestamp: "2023-04-14T16:45:00Z",
    status: "success",
    processingTime: 1.2,
    cost: 0.27
  },
  {
    id: "h2",
    alertId: "a1",
    timestamp: "2023-04-13T16:42:00Z",
    status: "success",
    processingTime: 1.4,
    cost: 0.27
  },
  {
    id: "h3",
    alertId: "a1",
    timestamp: "2023-04-12T16:44:00Z",
    status: "failed",
    processingTime: 0.5,
    cost: 0.27,
    errorMessage: "LLM service unavailable"
  },
  {
    id: "h4",
    alertId: "a2",
    timestamp: "2023-04-13T11:20:00Z",
    status: "success",
    processingTime: 1.3,
    cost: 0.27
  },
  {
    id: "h5",
    alertId: "a3",
    timestamp: "2023-04-10T15:15:00Z",
    status: "failed",
    processingTime: 0.7,
    cost: 0.27,
    errorMessage: "Failed to capture screenshot: report unavailable"
  },
  {
    id: "h6",
    alertId: "a4",
    timestamp: "2023-04-14T09:10:00Z",
    status: "success",
    processingTime: 1.5,
    cost: 0.27
  }
];

// Sample users
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    active: true,
    permissions: ["manage_alerts", "manage_users", "receive_alerts"],
    createdAt: "2023-01-01T10:00:00Z",
    alerts: [
      { alertId: "a1", alertName: "Daily Sales Below Target", notificationType: "email" },
      { alertId: "a3", alertName: "Customer Churn Rate Spike", notificationType: "email" },
      { alertId: "a5", alertName: "Cash Flow Negative", notificationType: "email" }
    ]
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    active: true,
    permissions: ["manage_alerts", "receive_alerts"],
    createdAt: "2023-01-02T11:30:00Z",
    alerts: [
      { alertId: "a1", alertName: "Daily Sales Below Target", notificationType: "email" },
      { alertId: "a4", alertName: "Inventory Low Stock", notificationType: "email" }
    ]
  },
  {
    id: "user3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Analyst",
    active: true,
    permissions: ["receive_alerts"],
    createdAt: "2023-02-01T09:45:00Z",
    alerts: [
      { alertId: "a2", alertName: "Marketing Budget Exceeding", notificationType: "email" },
      { alertId: "a6", alertName: "Website Traffic Drop", notificationType: "email" }
    ]
  },
  {
    id: "user4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "Analyst",
    active: false,
    permissions: ["receive_alerts"],
    createdAt: "2023-02-15T14:20:00Z",
    alerts: [
      { alertId: "a3", alertName: "Customer Churn Rate Spike", notificationType: "email" }
    ]
  },
  {
    id: "user5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Manager",
    active: true,
    permissions: ["manage_alerts", "receive_alerts"],
    createdAt: "2023-03-01T08:15:00Z",
    alerts: [
      { alertId: "a4", alertName: "Inventory Low Stock", notificationType: "email" }
    ]
  },
  {
    id: "user6",
    name: "Diana Miller",
    email: "diana.miller@example.com",
    role: "Executive",
    active: true,
    permissions: ["receive_alerts"],
    createdAt: "2023-03-10T16:30:00Z",
    alerts: [
      { alertId: "a5", alertName: "Cash Flow Negative", notificationType: "email" }
    ]
  }
];

// Calculated metrics
export const alertMetrics: AlertMetrics = {
  totalAlerts: alerts.length,
  activeAlerts: alerts.filter(alert => alert.active).length,
  totalTriggers: alerts.reduce((sum, alert) => sum + alert.triggerCount, 0),
  totalCost: alerts.reduce((sum, alert) => sum + alert.cost, 0),
  averageSuccessRate: alerts.filter(a => a.triggerCount > 0).reduce((sum, alert) => sum + alert.successRate, 0) / 
                     alerts.filter(a => a.triggerCount > 0).length
};
