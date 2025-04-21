
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Folder,
  MoveHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { mockReports, mockWorkspaces } from '@/data/mockPowerBIData';
import { format } from 'date-fns';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Combine report data with workspace information
  const reportData = mockReports.map(report => {
    const workspace = mockWorkspaces.find(w => w.id === report.workspaceId);
    return {
      ...report,
      workspaceName: workspace?.name || 'Unknown'
    };
  });
  
  const filteredReports = reportData.filter(report => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      report.name.toLowerCase().includes(searchLower) ||
      report.description?.toLowerCase().includes(searchLower) ||
      report.workspaceName.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Power BI Reports</h1>
          <p className="text-muted-foreground">
            View and manage all reports across workspaces
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button className="flex items-center gap-2">
          <MoveHorizontal className="h-4 w-4" />
          Move Reports
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Workspace</TableHead>
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
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <a href={report.webUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                      {report.name}
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                    {report.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <Link to={`/workspaces/${report.workspaceId}`} className="flex items-center gap-2 hover:underline">
                    <Folder className="h-4 w-4 text-blue-500" />
                    {report.workspaceName}
                  </Link>
                </TableCell>
                <TableCell>{report.createdBy}</TableCell>
                <TableCell>{format(new Date(report.modifiedDateTime), 'MMM d, yyyy')}</TableCell>
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
                      <DropdownMenuItem>
                        <a href={report.webUrl} target="_blank" rel="noopener noreferrer" className="flex w-full">
                          View Report
                        </a>
                      </DropdownMenuItem>
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
                <TableCell colSpan={6} className="text-center py-6">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Reports;
