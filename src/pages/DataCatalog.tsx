
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface TableColumn {
  id: string;
  columnName: string;
  dataType: string;
  description: string;
  tags: string;
  categories: string;
  relationshipTableName: string;
  relationshipColumnName: string;
  defaultCondition: string;
}

interface DataTable {
  id: string;
  tableName: string;
  tableDescription: string;
  columns: TableColumn[];
}

const DataCatalog: React.FC = () => {
  const [tables, setTables] = useState<DataTable[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load tables from localStorage
    const savedTables = localStorage.getItem('dataCatalogTables');
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    } else {
      // Default data if nothing saved
      setTables([
        {
          id: '1',
          tableName: 'Users',
          tableDescription: 'User account information and profile data',
          columns: [
            {
              id: '1-1',
              columnName: 'user_id',
              dataType: 'INTEGER',
              description: 'Unique identifier for users',
              tags: 'primary_key, identity',
              categories: 'User Management',
              relationshipTableName: '',
              relationshipColumnName: '',
              defaultCondition: 'NOT NULL'
            },
            {
              id: '1-2',
              columnName: 'email',
              dataType: 'VARCHAR(255)',
              description: 'User email address',
              tags: 'unique, contact',
              categories: 'User Management',
              relationshipTableName: '',
              relationshipColumnName: '',
              defaultCondition: 'NOT NULL'
            }
          ]
        },
        {
          id: '2',
          tableName: 'Orders',
          tableDescription: 'Customer order transactions and details',
          columns: [
            {
              id: '2-1',
              columnName: 'order_id',
              dataType: 'INTEGER',
              description: 'Unique identifier for orders',
              tags: 'primary_key, business_key',
              categories: 'Sales',
              relationshipTableName: '',
              relationshipColumnName: '',
              defaultCondition: 'NOT NULL'
            }
          ]
        }
      ]);
    }
  }, []);

  const handleEditTable = (tableId: string) => {
    navigate(`/data-catalog/manage?edit=${tableId}`);
  };

  const handleViewTable = (tableId: string) => {
    navigate(`/data-catalog/view/${tableId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Data Catalog</h1>
          <p className="text-muted-foreground">Manage and view your data tables and schemas</p>
        </div>
        <Button onClick={() => navigate('/data-catalog/manage')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Table
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{table.tableName}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">{table.tableDescription}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {table.columns.length} column{table.columns.length !== 1 ? 's' : ''}
                    </Badge>
                    {table.columns.some(col => col.tags.includes('primary_key')) && (
                      <Badge variant="outline">Has Primary Key</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Sample Columns:</h4>
                  <div className="space-y-1">
                    {table.columns.slice(0, 3).map((column) => (
                      <div key={column.id} className="flex justify-between items-center text-xs">
                        <span className="font-medium">{column.columnName}</span>
                        <span className="text-muted-foreground">{column.dataType}</span>
                      </div>
                    ))}
                    {table.columns.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{table.columns.length - 3} more columns
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTable(table.id)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTable(table.id)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tables.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No tables found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first table to the data catalog.</p>
            <Button onClick={() => navigate('/data-catalog/manage')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Table
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCatalog;
