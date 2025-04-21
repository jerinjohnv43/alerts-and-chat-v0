
import React, { useState } from 'react';
import { 
  MoveHorizontal, 
  ArrowRight, 
  Folder, 
  FileText, 
  Search,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockWorkspaces, mockReports } from '@/data/mockPowerBIData';

const ReportMigration = () => {
  const [sourceWorkspace, setSourceWorkspace] = useState<string>("");
  const [targetWorkspace, setTargetWorkspace] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  
  // Get reports from source workspace
  const sourceReports = sourceWorkspace
    ? mockReports.filter(report => report.workspaceId === sourceWorkspace)
    : [];
  
  // Filter reports based on search term
  const filteredReports = sourceReports.filter(report => {
    if (!searchTerm) return true;
    return report.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleReportToggle = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };
  
  const handleMigrateReports = () => {
    // This would actually handle the migration in a real implementation
    alert(`Migrating ${selectedReports.length} reports to ${targetWorkspace}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Report Migration</h1>
        <p className="text-muted-foreground">
          Move Power BI reports between workspaces
        </p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Source Workspace
            </CardTitle>
            <CardDescription>
              Select the workspace containing the reports you want to move
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSourceWorkspace} value={sourceWorkspace}>
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Workspaces</SelectLabel>
                  {mockWorkspaces.map(workspace => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {sourceWorkspace && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Selected Workspace:</div>
                <div className="text-sm rounded bg-muted p-2">
                  {mockWorkspaces.find(w => w.id === sourceWorkspace)?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredReports.length} reports available
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-center">
          <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-muted">
            <ArrowRight className="h-6 w-6" />
          </div>
          <div className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-muted rotate-90">
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Target Workspace
            </CardTitle>
            <CardDescription>
              Select the destination workspace for the reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              onValueChange={setTargetWorkspace} 
              value={targetWorkspace}
              disabled={!sourceWorkspace}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Workspaces</SelectLabel>
                  {mockWorkspaces
                    .filter(workspace => workspace.id !== sourceWorkspace)
                    .map(workspace => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {targetWorkspace && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Selected Workspace:</div>
                <div className="text-sm rounded bg-muted p-2">
                  {mockWorkspaces.find(w => w.id === targetWorkspace)?.name}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {sourceWorkspace && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select Reports to Migrate
            </CardTitle>
            <CardDescription>
              Choose which reports you want to move to the target workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative max-w-md flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="select-all" 
                  checked={filteredReports.length > 0 && selectedReports.length === filteredReports.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm">Select All</label>
              </div>
            </div>
            
            {filteredReports.length > 0 ? (
              <div className="grid gap-2 max-h-[400px] overflow-auto p-1">
                {filteredReports.map(report => (
                  <div 
                    key={report.id} 
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted"
                  >
                    <Checkbox 
                      id={`report-${report.id}`} 
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => handleReportToggle(report.id)}
                    />
                    <label 
                      htmlFor={`report-${report.id}`} 
                      className="flex-grow cursor-pointer flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{report.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reports found in this workspace.
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button 
                className="flex items-center gap-2"
                disabled={selectedReports.length === 0 || !targetWorkspace}
                onClick={handleMigrateReports}
              >
                <MoveHorizontal className="h-4 w-4" />
                Migrate {selectedReports.length} Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportMigration;
