
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  Search,
  MoreHorizontal,
  Users,
  FileText,
  Plus,
  Clock
} from 'lucide-react';
import { mockWorkspaces } from '@/data/mockPowerBIData';
import { Workspace } from '@/types/powerbi';
import { format } from 'date-fns';

const Workspaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredWorkspaces = mockWorkspaces.filter(workspace => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      workspace.name.toLowerCase().includes(searchLower) ||
      workspace.description.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Power BI Workspaces</h1>
          <p className="text-muted-foreground">
            Manage Power BI workspaces, reports, and access permissions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </div>
      
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search workspaces..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Workspaces</CardTitle>
            <CardDescription>Active and deleted workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockWorkspaces.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockWorkspaces.filter(w => w.state === 'active').length} active, {mockWorkspaces.filter(w => w.state !== 'active').length} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Reports</CardTitle>
            <CardDescription>Across all workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockWorkspaces.reduce((total, workspace) => total + workspace.reports.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In {mockWorkspaces.length} workspaces
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Premium Capacity</CardTitle>
            <CardDescription>Workspaces on dedicated capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockWorkspaces.filter(w => w.isOnDedicatedCapacity).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((mockWorkspaces.filter(w => w.isOnDedicatedCapacity).length / mockWorkspaces.length) * 100)}% of total workspaces
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkspaces.map((workspace) => (
              <TableRow key={workspace.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <Link to={`/workspaces/${workspace.id}`} className="font-medium hover:underline">
                      {workspace.name}
                    </Link>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                    {workspace.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={workspace.type === 'personal' ? 'outline' : workspace.type === 'team' ? 'secondary' : 'default'}>
                    {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    {workspace.reports.length}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    {workspace.users.length}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={workspace.state === 'active' ? 'success' : 'destructive'}>
                    {workspace.state}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {format(new Date(workspace.modifiedDateTime), 'MMM d, yyyy')}
                    </span>
                  </div>
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
                      <DropdownMenuItem asChild>
                        <Link to={`/workspaces/${workspace.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Manage Users</DropdownMenuItem>
                      <DropdownMenuItem>Manage Reports</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Delete Workspace</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Workspaces;
