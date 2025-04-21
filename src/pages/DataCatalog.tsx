
import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Server, 
  FileText, 
  Filter,
  Plus,
  Table as TableIcon,
  ListFilter,
  View,
  Columns,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const DataCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState<'data-sources' | 'tables' | 'table-detail'>('data-sources');
  const [selectedDataSource, setSelectedDataSource] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false);
  
  // Mock data for tables and views
  const mockTables = [
    {
      id: "table1",
      name: "Customer",
      type: "Table",
      schema: "dbo",
      description: "Contains customer information including demographics and contact details",
      columns: [
        { name: "CustomerID", type: "int", description: "Unique identifier for each customer" },
        { name: "FirstName", type: "varchar(50)", description: "Customer's first name" },
        { name: "LastName", type: "varchar(50)", description: "Customer's last name" },
        { name: "Email", type: "varchar(100)", description: "Customer's email address" },
        { name: "Phone", type: "varchar(20)", description: "Customer's contact phone number" },
        { name: "Address", type: "varchar(200)", description: "Customer's physical address" },
        { name: "City", type: "varchar(50)", description: "City where the customer resides" },
        { name: "PostalCode", type: "varchar(20)", description: "Customer's postal code" },
        { name: "CustomerSegment", type: "varchar(20)", description: "Market segment the customer belongs to" },
      ]
    },
    {
      id: "table2",
      name: "Order",
      type: "Table",
      schema: "sales",
      description: "Tracks customer orders including dates and status information",
      columns: [
        { name: "OrderID", type: "int", description: "Unique identifier for each order" },
        { name: "CustomerID", type: "int", description: "Foreign key reference to the Customer table" },
        { name: "OrderDate", type: "datetime", description: "Date and time when the order was placed" },
        { name: "ShipDate", type: "datetime", description: "Date and time when the order was shipped" },
        { name: "Status", type: "varchar(20)", description: "Current status of the order" },
        { name: "TotalAmount", type: "decimal(10,2)", description: "Total monetary amount of the order" },
      ]
    },
    {
      id: "table3",
      name: "Product",
      type: "Table",
      schema: "inventory",
      description: "Contains product catalog information",
      columns: [
        { name: "ProductID", type: "int", description: "Unique identifier for each product" },
        { name: "ProductName", type: "varchar(100)", description: "Name of the product" },
        { name: "Category", type: "varchar(50)", description: "Product category" },
        { name: "UnitPrice", type: "decimal(10,2)", description: "Price per unit of the product" },
        { name: "StockQuantity", type: "int", description: "Current quantity in stock" },
      ]
    },
    {
      id: "view1",
      name: "CustomerOrders",
      type: "View",
      schema: "reporting",
      description: "Joins customer data with their orders for reporting",
      columns: [
        { name: "CustomerID", type: "int", description: "Customer identifier from Customer table" },
        { name: "CustomerName", type: "varchar(101)", description: "Concatenated first and last name" },
        { name: "OrderCount", type: "int", description: "Count of orders placed by the customer" },
        { name: "TotalSpent", type: "decimal(12,2)", description: "Total amount spent by the customer" },
        { name: "LastOrderDate", type: "datetime", description: "Date of the customer's most recent order" },
      ]
    },
  ];
  
  // Combine data sources with their report usage
  const enrichedDataSources = mockDataSources.map(dataSource => {
    const reportsUsingSource = dataSource.reports.map(reportId => 
      mockReports.find(report => report.id === reportId)
    ).filter(Boolean);
    
    return {
      ...dataSource,
      reportsDetail: reportsUsingSource,
      tables: mockTables, // Add mock tables to each data source
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
  
  // Function to handle table selection
  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    setActiveView('table-detail');
  };
  
  // Function to handle data source selection
  const handleDataSourceSelect = (dataSource: any) => {
    setSelectedDataSource(dataSource);
    setActiveView('tables');
  };
  
  // Function to handle back navigation
  const handleBack = () => {
    if (activeView === 'table-detail') {
      setActiveView('tables');
    } else if (activeView === 'tables') {
      setActiveView('data-sources');
      setSelectedDataSource(null);
    }
  };
  
  // Function to update table description
  const handleTableDescriptionUpdate = (description: string) => {
    if (selectedTable) {
      setSelectedTable({
        ...selectedTable,
        description
      });
    }
  };
  
  // Function to update column description
  const handleColumnDescriptionUpdate = (columnName: string, description: string) => {
    if (selectedTable) {
      const updatedColumns = selectedTable.columns.map((column: any) => {
        if (column.name === columnName) {
          return { ...column, description };
        }
        return column;
      });
      
      setSelectedTable({
        ...selectedTable,
        columns: updatedColumns
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Catalog</h1>
          <p className="text-muted-foreground">
            Discover, document, and manage data assets for AI and analytics use cases
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddConnectionOpen(true)}>
          <Plus className="h-4 w-4" />
          Connect Data Source
        </Button>
      </div>
      
      {/* Breadcrumb Navigation */}
      {activeView !== 'data-sources' && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto" onClick={handleBack}>
            <Database className="h-4 w-4" />
            <span>Data Sources</span>
          </Button>
          <ChevronRight className="h-4 w-4 mx-2" />
          
          {activeView === 'tables' && selectedDataSource && (
            <span className="font-medium text-foreground">{selectedDataSource.name}</span>
          )}
          
          {activeView === 'table-detail' && selectedDataSource && (
            <>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto" onClick={() => setActiveView('tables')}>
                <span>{selectedDataSource.name}</span>
              </Button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="font-medium text-foreground">
                {selectedTable?.type === 'Table' ? <TableIcon className="h-4 w-4 inline mr-1" /> : <View className="h-4 w-4 inline mr-1" />}
                {selectedTable?.name}
              </span>
            </>
          )}
        </div>
      )}
      
      {/* Search and Filter Bar */}
      {activeView === 'data-sources' && (
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
      )}
      
      {/* Summary Cards for Data Sources View */}
      {activeView === 'data-sources' && (
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
      )}
      
      {/* Data Sources List View */}
      {activeView === 'data-sources' && (
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
                <TableRow 
                  key={dataSource.id}
                  className="cursor-pointer hover:bg-muted/80"
                  onClick={() => handleDataSourceSelect(dataSource)}
                >
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
      )}
      
      {/* Tables & Views List */}
      {activeView === 'tables' && selectedDataSource && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{selectedDataSource.name}</h2>
              <p className="text-muted-foreground mt-1">
                {selectedDataSource.type} • {selectedDataSource.server} • {selectedDataSource.database}
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in Fabric
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tables and views..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="documented">Documented</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="rounded-md border mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Columns</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDataSource.tables.map((table) => (
                    <TableRow 
                      key={table.id}
                      className="cursor-pointer hover:bg-muted/80"
                      onClick={() => handleTableSelect(table)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {table.type === 'Table' ? 
                            <TableIcon className="h-4 w-4 text-blue-500" /> : 
                            <View className="h-4 w-4 text-purple-500" />
                          }
                          <span className="font-medium">{table.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={table.type === 'Table' ? 'default' : 'secondary'}>
                          {table.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{table.schema}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {table.description || <span className="text-muted-foreground italic">No description</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Columns className="h-4 w-4 text-gray-500" />
                          <span>{table.columns.length}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="tables">
              {/* Tables only view - similar to above but filtered for tables */}
            </TabsContent>
            <TabsContent value="views">
              {/* Views only - similar to above but filtered for views */}
            </TabsContent>
            <TabsContent value="documented">
              {/* Documented items - similar to above but filtered for items with descriptions */}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Table/View Detail View */}
      {activeView === 'table-detail' && selectedTable && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {selectedTable.type === 'Table' ? 
                  <TableIcon className="h-5 w-5 text-blue-500" /> : 
                  <View className="h-5 w-5 text-purple-500" />
                }
                {selectedTable.schema}.{selectedTable.name}
              </h2>
              <p className="text-muted-foreground mt-1">
                {selectedTable.type} • {selectedTable.columns.length} columns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View in Fabric
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Business Description
              </CardTitle>
              <CardDescription>
                Document this {selectedTable.type.toLowerCase()} for AI and analytics use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder={`Add a business description for the ${selectedTable.name} ${selectedTable.type.toLowerCase()}...`}
                className="min-h-[100px]"
                defaultValue={selectedTable.description}
                onChange={(e) => handleTableDescriptionUpdate(e.target.value)}
              />
            </CardContent>
          </Card>
          
          <div className="rounded-md border">
            <div className="p-4 bg-muted/50 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Columns className="h-4 w-4" />
                Columns ({selectedTable.columns.length})
              </h3>
            </div>
            <ScrollArea className="h-[500px]">
              {selectedTable.columns.map((column, index) => (
                <Collapsible key={column.name} className="border-b last:border-b-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="font-medium">{column.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {column.type}
                        </Badge>
                        <span className="truncate max-w-[400px]">
                          {column.description ? 
                            column.description : 
                            <span className="italic text-muted-foreground">No description</span>}
                        </span>
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Edit description</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 pb-4 border-t border-dashed">
                      <Label htmlFor={`column-${index}`} className="mb-2 block">
                        Business Description
                      </Label>
                      <Textarea
                        id={`column-${index}`}
                        placeholder={`Add a business description for the ${column.name} column...`}
                        className="min-h-[80px]"
                        defaultValue={column.description}
                        onChange={(e) => handleColumnDescriptionUpdate(column.name, e.target.value)}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
      
      {/* Add Connection Dialog */}
      <Dialog open={isAddConnectionOpen} onOpenChange={setIsAddConnectionOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Connect to a Data Source</DialogTitle>
            <DialogDescription>
              Connect to your Microsoft Fabric data warehouse or other data sources to catalog them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="connection-type">Connection Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center border-2 border-blue-200">
                  <Database className="h-10 w-10 text-blue-500 mb-2" />
                  <span className="font-medium">Microsoft Fabric</span>
                  <span className="text-xs text-muted-foreground">Connect to Fabric warehouses</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                  <Server className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="font-medium">Other Source</span>
                  <span className="text-xs text-muted-foreground">SQL Server, Synapse, etc.</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workspace">Fabric Workspace</Label>
              <Input id="workspace" placeholder="Select workspace" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warehouse">Data Warehouse</Label>
              <Input id="warehouse" placeholder="Select warehouse" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddConnectionOpen(false)}>Cancel</Button>
            <Button type="submit">Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataCatalog;
