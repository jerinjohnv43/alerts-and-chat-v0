
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar as CalendarIcon,
  Filter,
  Download,
  Search,
  AlertCircle,
  Clock,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alertHistory, alerts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertHistory } from '@/types/alerts';

type SortField = 'timestamp' | 'status' | 'processingTime' | 'cost';
type SortDirection = 'asc' | 'desc';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Combine alert history with alert names
  const historyWithAlertNames = alertHistory.map(history => {
    const alert = alerts.find(a => a.id === history.alertId);
    return {
      ...history,
      alertName: alert?.name || 'Unknown Alert'
    };
  });
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Apply filters
  const filteredHistory = historyWithAlertNames.filter(history => {
    // Search filter
    if (searchTerm && !history.alertName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(history.status)) {
      return false;
    }
    
    // Date filter
    if (date) {
      const historyDate = new Date(history.timestamp);
      const filterDate = new Date(date);
      
      if (historyDate.getDate() !== filterDate.getDate() ||
          historyDate.getMonth() !== filterDate.getMonth() ||
          historyDate.getFullYear() !== filterDate.getFullYear()) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === 'timestamp') {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alert History</h1>
          <p className="text-muted-foreground">
            View the complete history of alert triggers and processing.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alerts..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter Status
                {statusFilter.length > 0 && (
                  <Badge className="ml-1 h-5 px-1 bg-primary/20 text-primary hover:bg-primary/20" variant="secondary">
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('success')}
                onCheckedChange={(checked) => {
                  setStatusFilter(
                    checked
                      ? [...statusFilter, 'success']
                      : statusFilter.filter(s => s !== 'success')
                  );
                }}
              >
                Success
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('failed')}
                onCheckedChange={(checked) => {
                  setStatusFilter(
                    checked
                      ? [...statusFilter, 'failed']
                      : statusFilter.filter(s => s !== 'failed')
                  );
                }}
              >
                Failed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('warning')}
                onCheckedChange={(checked) => {
                  setStatusFilter(
                    checked
                      ? [...statusFilter, 'warning']
                      : statusFilter.filter(s => s !== 'warning')
                  );
                }}
              >
                Warning
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('pending')}
                onCheckedChange={(checked) => {
                  setStatusFilter(
                    checked
                      ? [...statusFilter, 'pending']
                      : statusFilter.filter(s => s !== 'pending')
                  );
                }}
              >
                Pending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "gap-2",
                  date && "bg-primary/5 text-primary"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "MMM d, yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date && date.getTime() === new Date(date?.toString() || "").setHours(0, 0, 0, 0)) {
                    setDate(undefined);
                  } else {
                    setDate(date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {(searchTerm || statusFilter.length > 0 || date) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter([]);
                setDate(undefined);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Alert Trigger History</CardTitle>
          <CardDescription>
            Complete historical record of all alert triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Name</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Timestamp</span>
                        {sortField === 'timestamp' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3" /> 
                            : <ArrowDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Status</span>
                        {sortField === 'status' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3" /> 
                            : <ArrowDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('processingTime')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Processing Time</span>
                        {sortField === 'processingTime' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3" /> 
                            : <ArrowDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none text-right"
                      onClick={() => handleSort('cost')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <span>Cost</span>
                        {sortField === 'cost' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3" /> 
                            : <ArrowDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((history) => (
                    <TableRow key={history.id} className="group">
                      <TableCell className="font-medium">{history.alertName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {new Date(history.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "text-white",
                            history.status === 'success' && "bg-green-500",
                            history.status === 'failed' && "bg-red-500",
                            history.status === 'warning' && "bg-yellow-500",
                            history.status === 'pending' && "bg-blue-500"
                          )}
                        >
                          {history.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{history.processingTime}s</TableCell>
                      <TableCell className="text-right">${history.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        {history.errorMessage ? (
                          <div className="flex items-center gap-1 text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            <span>{history.errorMessage}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">No history records found</h3>
              <p className="text-muted-foreground">
                No alert history records match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
