
export interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'team' | 'organizational';
  state: 'active' | 'deleted' | 'removed';
  isOnDedicatedCapacity: boolean;
  capacityId?: string;
  users: WorkspaceUser[];
  reports: Report[];
  createdBy: string;
  createdDateTime: string;
  modifiedBy: string;
  modifiedDateTime: string;
}

export interface WorkspaceUser {
  id: string;
  displayName: string;
  emailAddress: string;
  principalType: 'User' | 'App' | 'Group';
  accessRight: 'Admin' | 'Contributor' | 'Member' | 'Viewer' | 'None';
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  webUrl: string;
  embedUrl: string;
  datasetId: string;
  workspaceId: string;
  createdBy: string;
  createdDateTime: string;
  modifiedBy: string;
  modifiedDateTime: string;
  lastRefreshedDateTime?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  connectionString: string;
  server: string;
  database: string;
  gateway?: string;
  reports: string[]; // Array of report IDs that use this data source
}

// New interfaces for data catalog functionality
export interface TableColumn {
  name: string;
  type: string;
  description?: string;
  isNullable?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencesTable?: string;
  referencesColumn?: string;
}

export interface DatabaseTable {
  id: string;
  name: string;
  type: 'Table' | 'View';
  schema: string;
  description?: string;
  columns: TableColumn[];
  rowCount?: number;
  lastUpdated?: string;
  tags?: string[];
}
