
import { Workspace, Report, DataSource } from '@/types/powerbi';

export const mockWorkspaces: Workspace[] = [
  {
    id: "w1",
    name: "Finance Analytics",
    description: "Workspace for all finance department reports",
    type: "team",
    state: "active",
    isOnDedicatedCapacity: true,
    capacityId: "cap-01",
    users: [
      {
        id: "u1",
        displayName: "John Smith",
        emailAddress: "john.smith@example.com",
        principalType: "User",
        accessRight: "Admin"
      },
      {
        id: "u2",
        displayName: "Maria Rodriguez",
        emailAddress: "maria.rodriguez@example.com",
        principalType: "User",
        accessRight: "Member"
      },
      {
        id: "u3",
        displayName: "Finance Team",
        emailAddress: "finance-group@example.com",
        principalType: "Group",
        accessRight: "Viewer"
      }
    ],
    reports: [
      {
        id: "r1",
        name: "Financial Dashboard 2023",
        description: "Quarterly financial performance dashboard",
        webUrl: "https://app.powerbi.com/reports/financial-2023",
        embedUrl: "https://app.powerbi.com/embed?reportId=r1",
        datasetId: "ds1",
        workspaceId: "w1",
        createdBy: "John Smith",
        createdDateTime: "2023-01-15T08:30:00Z",
        modifiedBy: "Maria Rodriguez",
        modifiedDateTime: "2023-04-10T14:45:00Z",
        lastRefreshedDateTime: "2023-04-15T06:00:00Z"
      },
      {
        id: "r2",
        name: "Budget Planning 2024",
        description: "Budget planning and forecast tool",
        webUrl: "https://app.powerbi.com/reports/budget-2024",
        embedUrl: "https://app.powerbi.com/embed?reportId=r2",
        datasetId: "ds2",
        workspaceId: "w1",
        createdBy: "John Smith",
        createdDateTime: "2023-11-05T10:20:00Z",
        modifiedBy: "John Smith",
        modifiedDateTime: "2023-11-05T10:20:00Z",
        lastRefreshedDateTime: "2023-04-12T06:00:00Z"
      }
    ],
    createdBy: "John Smith",
    createdDateTime: "2022-12-01T09:00:00Z",
    modifiedBy: "John Smith",
    modifiedDateTime: "2023-03-15T11:30:00Z"
  },
  {
    id: "w2",
    name: "Sales Reports",
    description: "All sales-related reports and dashboards",
    type: "team",
    state: "active",
    isOnDedicatedCapacity: false,
    users: [
      {
        id: "u4",
        displayName: "David Lee",
        emailAddress: "david.lee@example.com",
        principalType: "User",
        accessRight: "Admin"
      },
      {
        id: "u5",
        displayName: "Sarah Johnson",
        emailAddress: "sarah.johnson@example.com",
        principalType: "User",
        accessRight: "Contributor"
      }
    ],
    reports: [
      {
        id: "r3",
        name: "Global Sales Performance",
        description: "Global sales metrics and KPIs",
        webUrl: "https://app.powerbi.com/reports/global-sales",
        embedUrl: "https://app.powerbi.com/embed?reportId=r3",
        datasetId: "ds3",
        workspaceId: "w2",
        createdBy: "David Lee",
        createdDateTime: "2023-02-18T13:20:00Z",
        modifiedBy: "Sarah Johnson",
        modifiedDateTime: "2023-04-14T16:45:00Z",
        lastRefreshedDateTime: "2023-04-16T06:00:00Z"
      }
    ],
    createdBy: "David Lee",
    createdDateTime: "2023-01-10T14:00:00Z",
    modifiedBy: "David Lee",
    modifiedDateTime: "2023-02-20T09:15:00Z"
  },
  {
    id: "w3",
    name: "Marketing Analytics",
    description: "Marketing campaign performance tracking",
    type: "organizational",
    state: "active",
    isOnDedicatedCapacity: true,
    capacityId: "cap-02",
    users: [
      {
        id: "u6",
        displayName: "Alex Turner",
        emailAddress: "alex.turner@example.com",
        principalType: "User",
        accessRight: "Admin"
      },
      {
        id: "u7",
        displayName: "Marketing Team",
        emailAddress: "marketing-group@example.com",
        principalType: "Group",
        accessRight: "Member"
      }
    ],
    reports: [
      {
        id: "r4",
        name: "Campaign Performance Q1 2023",
        description: "Q1 marketing campaign performance metrics",
        webUrl: "https://app.powerbi.com/reports/campaign-q1-2023",
        embedUrl: "https://app.powerbi.com/embed?reportId=r4",
        datasetId: "ds4",
        workspaceId: "w3",
        createdBy: "Alex Turner",
        createdDateTime: "2023-01-20T10:10:00Z",
        modifiedBy: "Alex Turner",
        modifiedDateTime: "2023-03-31T16:30:00Z",
        lastRefreshedDateTime: "2023-04-01T06:00:00Z"
      },
      {
        id: "r5",
        name: "Customer Acquisition Metrics",
        description: "Customer acquisition cost and channel performance",
        webUrl: "https://app.powerbi.com/reports/customer-acquisition",
        embedUrl: "https://app.powerbi.com/embed?reportId=r5",
        datasetId: "ds5",
        workspaceId: "w3",
        createdBy: "Alex Turner",
        createdDateTime: "2023-02-10T11:15:00Z",
        modifiedBy: "Alex Turner",
        modifiedDateTime: "2023-04-05T13:20:00Z",
        lastRefreshedDateTime: "2023-04-10T06:00:00Z"
      }
    ],
    createdBy: "Alex Turner",
    createdDateTime: "2022-11-15T15:30:00Z",
    modifiedBy: "Alex Turner",
    modifiedDateTime: "2023-03-01T09:45:00Z"
  },
  {
    id: "w4",
    name: "HR Analytics",
    description: "Human Resources analytics and reporting",
    type: "team",
    state: "active",
    isOnDedicatedCapacity: false,
    users: [
      {
        id: "u8",
        displayName: "Emma Wilson",
        emailAddress: "emma.wilson@example.com",
        principalType: "User",
        accessRight: "Admin"
      },
      {
        id: "u9",
        displayName: "HR Team",
        emailAddress: "hr-group@example.com",
        principalType: "Group",
        accessRight: "Member"
      }
    ],
    reports: [
      {
        id: "r6",
        name: "Employee Satisfaction Survey",
        description: "Results from quarterly employee satisfaction survey",
        webUrl: "https://app.powerbi.com/reports/employee-satisfaction",
        embedUrl: "https://app.powerbi.com/embed?reportId=r6",
        datasetId: "ds6",
        workspaceId: "w4",
        createdBy: "Emma Wilson",
        createdDateTime: "2023-03-01T09:40:00Z",
        modifiedBy: "Emma Wilson",
        modifiedDateTime: "2023-04-03T14:20:00Z",
        lastRefreshedDateTime: "2023-04-05T06:00:00Z"
      }
    ],
    createdBy: "Emma Wilson",
    createdDateTime: "2023-01-05T11:00:00Z",
    modifiedBy: "Emma Wilson",
    modifiedDateTime: "2023-03-10T16:15:00Z"
  }
];

export const mockReports: Report[] = [
  ...mockWorkspaces.flatMap(workspace => workspace.reports)
];

export const mockDataSources: DataSource[] = [
  {
    id: "ds1",
    name: "Finance SQL Database",
    type: "SQL Server",
    connectionString: "Server=finance-sql.example.com;Database=FinanceDB;",
    server: "finance-sql.example.com",
    database: "FinanceDB",
    gateway: "Main Data Gateway",
    reports: ["r1", "r2"]
  },
  {
    id: "ds3",
    name: "Sales Data Warehouse",
    type: "Azure SQL",
    connectionString: "Server=sales-dw.database.windows.net;Database=SalesDW;",
    server: "sales-dw.database.windows.net",
    database: "SalesDW",
    gateway: "Cloud Gateway",
    reports: ["r3"]
  },
  {
    id: "ds4",
    name: "Marketing Analytics",
    type: "SQL Server",
    connectionString: "Server=marketing-sql.example.com;Database=MarketingDB;",
    server: "marketing-sql.example.com",
    database: "MarketingDB",
    gateway: "Main Data Gateway",
    reports: ["r4", "r5"]
  },
  {
    id: "ds6",
    name: "HR Database",
    type: "SQL Server",
    connectionString: "Server=hr-sql.example.com;Database=HRDB;",
    server: "hr-sql.example.com",
    database: "HRDB",
    gateway: "Main Data Gateway",
    reports: ["r6"]
  }
];
