
import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Server, 
  FileText, 
  Filter,
  Plus
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockDataSources, mockReports } from '@/data/mockPowerBIData';

const DataCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Combine data sources with their report usage
  const enrichedDataSources = mockDataSources.map(dataSource => {
    const reportsUsingSource = dataSource.reports.map(reportId => 
      mockReports.find(report => report.id === reportId)
    ).filter(Boolean);
    
    return {
      ...dataSource,
      reportsDetail: reportsUsingSource
    };
  });
  
  const filteredDataSources = enrichedDataSources.filter(ds => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      ds.name.toLowerCase().includes(searchLower) ||
      ds.type.toLowerCase().includes(searchLower) ||
      ds.server.toLowerCase().includes(searchLower) ||
      ds.database.toLowerCase().includes(searchLower)
    );
  });
  
  const serverTypes = Array.from(new Set(mockDataSources.map(ds => ds.type)));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Catalog</h1>
          <p className="text-muted-foreground">
            Manage and discover data sources across all Power BI workspaces
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Data Source
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search data sources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Data Sources</CardTitle>
            <CardDescription>Across all workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockDataSources.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Source Types</CardTitle>
            <CardDescription>Data source categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{serverTypes.length}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {serverTypes.map(type => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Connected Reports</CardTitle>
            <CardDescription>Reports using these data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockReports.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Server</TableHead>
              <TableHead>Database</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Reports</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDataSources.map((dataSource) => (
              <TableRow key={dataSource.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{dataSource.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{dataSource.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    {dataSource.server}
                  </div>
                </TableCell>
                <TableCell>{dataSource.database}</TableCell>
                <TableCell>{dataSource.gateway || 'None'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{dataSource.reports.length}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dataSource.reportsDetail.slice(0, 2).map((report, index) => (
                      <span key={index}>
                        {report?.name}
                        {index < Math.min(1, dataSource.reportsDetail.length - 1) ? ', ' : ''}
                      </span>
                    ))}
                    {dataSource.reportsDetail.length > 2 && ` +${dataSource.reportsDetail.length - 2} more`}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredDataSources.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No data sources found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataCatalog;
