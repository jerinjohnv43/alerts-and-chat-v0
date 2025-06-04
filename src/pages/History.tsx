
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

interface HistoryEntry {
  id: string;
  alertName: string;
  executionTime: Date;
  status: 'success' | 'failed' | 'warning';
  recordsProcessed: number;
  issuesFound: number;
  duration: string;
}

// Mock data
const historyData: HistoryEntry[] = [
  {
    id: '1',
    alertName: 'Daily Sales Validation',
    executionTime: new Date('2024-01-15T08:30:00'),
    status: 'success',
    recordsProcessed: 1250,
    issuesFound: 0,
    duration: '2m 15s'
  },
  {
    id: '2',
    alertName: 'Customer Data Quality Check',
    executionTime: new Date('2024-01-15T07:45:00'),
    status: 'warning',
    recordsProcessed: 3400,
    issuesFound: 12,
    duration: '4m 32s'
  },
  {
    id: '3',
    alertName: 'Inventory Count Verification',
    executionTime: new Date('2024-01-15T06:00:00'),
    status: 'failed',
    recordsProcessed: 0,
    issuesFound: 1,
    duration: '30s'
  }
];

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>(historyData);
  const { toast } = useToast();

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = historyData.filter(entry =>
        entry.alertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(historyData);
    }
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredHistory.map(entry => ({
        'Alert Name': entry.alertName,
        'Execution Time': format(entry.executionTime, 'yyyy-MM-dd HH:mm:ss'),
        'Status': entry.status,
        'Records Processed': entry.recordsProcessed,
        'Issues Found': entry.issuesFound,
        'Duration': entry.duration
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Alert History');

      // Generate file name with current date
      const fileName = `alert_history_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Export Successful",
        description: `History data exported to ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export history data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Alert History</h1>
        <p className="text-muted-foreground">View the execution history of your alerts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Execution History</CardTitle>
            <div className="flex gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search history..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Export Button */}
              <Button onClick={exportToExcel} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert Name</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records Processed</TableHead>
                <TableHead>Issues Found</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.alertName}</TableCell>
                    <TableCell>{format(entry.executionTime, 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.recordsProcessed.toLocaleString()}</TableCell>
                    <TableCell>{entry.issuesFound}</TableCell>
                    <TableCell>{entry.duration}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No history entries found matching your search.' : 'No history entries found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
