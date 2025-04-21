
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Database, 
  FileText, 
  Folder, 
  MoreHorizontal, 
  Search, 
  Server, 
  Shield, 
  Users 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockWorkspaces, mockDataSources } from '@/data/mockPowerBIData';
import { format } from 'date-fns';

const WorkspaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const workspace = mockWorkspaces.find(w => w.id === id);
  
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  
  if (!workspace) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Workspace Not Found</h2>
        <p className="mb-6">The workspace you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/workspaces">Back to Workspaces</Link>
        </Button>
      </div>
    );
  }
  
  const filteredReports = workspace.reports.filter(report => {
    if (!reportSearchTerm) return true;
    return report.name.toLowerCase().includes(reportSearchTerm.toLowerCase());
  });
  
  const filteredUsers = workspace.users.filter(user => {
    if (!userSearchTerm) return true;
    return (
      user.displayName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.emailAddress.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  });
  
  // Get data sources used by this workspace's reports
  const workspaceDataSources = mockDataSources.filter(ds => 
    workspace.reports.some(report => ds.reports.includes(report.id))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/workspaces">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground">{workspace.description}</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reports</CardTitle>
            <CardDescription>Total reports in this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workspace.reports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Users with access to this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workspace.users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Capacity</CardTitle>
            <CardDescription>Dedicated capacity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workspace.isOnDedicatedCapacity ? 'Premium' : 'Shared'}
            </div>
            {workspace.capacityId && (
              <p className="text-xs text-muted-foreground mt-1">
                Capacity ID: {workspace.capacityId}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="datasources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8"
                  value={reportSearchTerm}
                  onChange={(e) => setReportSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button>
              Add Report
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Last Refreshed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {report.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>{report.createdBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{format(new Date(report.modifiedDateTime), 'MMM d, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.lastRefreshedDateTime ? 
                        format(new Date(report.lastRefreshedDateTime), 'MMM d, yyyy') : 
                        'Never'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Report</DropdownMenuItem>
                          <DropdownMenuItem>Manage Access</DropdownMenuItem>
                          <DropdownMenuItem>Move Report</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button>
              Add User
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.emailAddress}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.principalType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          user.accessRight === 'Admin' ? 'default' :
                          user.accessRight === 'Contributor' || user.accessRight === 'Member' ? 'secondary' :
                          'outline'
                        }
                      >
                        {user.accessRight}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Change Access Level</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="datasources" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Data Sources</h3>
            <Button>
              Add Data Source
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Database</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaceDataSources.map((dataSource) => (
                  <TableRow key={dataSource.id}>
                    <TableCell>{dataSource.name}</TableCell>
                    <TableCell>{dataSource.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-gray-500" />
                        {dataSource.server}
                      </div>
                    </TableCell>
                    <TableCell>{dataSource.database}</TableCell>
                    <TableCell>
                      {dataSource.reports.length} report(s)
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Credentials</DropdownMenuItem>
                          <DropdownMenuItem>Refresh</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {workspaceDataSources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No data sources found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>
                Manage workspace configuration and properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium">Workspace ID</div>
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">{workspace.id}</div>
              </div>
              
              <div className="grid gap-2">
                <div className="text-sm font-medium">Created By</div>
                <div className="text-sm">{workspace.createdBy} on {format(new Date(workspace.createdDateTime), 'MMM d, yyyy')}</div>
              </div>
              
              <div className="grid gap-2">
                <div className="text-sm font-medium">Last Modified</div>
                <div className="text-sm">By {workspace.modifiedBy} on {format(new Date(workspace.modifiedDateTime), 'MMM d, yyyy')}</div>
              </div>
              
              <div className="grid gap-2">
                <div className="text-sm font-medium">Workspace Type</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid gap-6 pt-4">
                <Button variant="destructive">Delete Workspace</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceDetail;
