
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus } from "lucide-react";
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

const DataCatalogView: React.FC = () => {
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
          tableDescription: 'User account information',
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
            }
          ]
        }
      ]);
    }
  }, []);

  const handleEditTable = (tableId: string) => {
    // For now, redirect to manage page - in a real app, you'd pass the table ID
    navigate('/data-catalog');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">View Data Catalog</h1>
          <p className="text-muted-foreground">Review all your data tables and columns</p>
        </div>
        <Button onClick={() => navigate('/data-catalog')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Table
        </Button>
      </div>

      <div className="space-y-6">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{table.tableName}</CardTitle>
                  <p className="text-muted-foreground mt-1">{table.tableDescription}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTable(table.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Columns ({table.columns.length})</h4>
                
                {table.columns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Column Name</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Data Type</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Tags</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Categories</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Relationship</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Default Condition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((column) => (
                          <tr key={column.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2 font-medium">{column.columnName}</td>
                            <td className="border border-gray-200 px-4 py-2">{column.dataType}</td>
                            <td className="border border-gray-200 px-4 py-2">{column.description}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              <span className="text-sm text-blue-600">{column.tags}</span>
                            </td>
                            <td className="border border-gray-200 px-4 py-2">{column.categories}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              {column.relationshipTableName && column.relationshipColumnName 
                                ? `${column.relationshipTableName}.${column.relationshipColumnName}`
                                : '-'
                              }
                            </td>
                            <td className="border border-gray-200 px-4 py-2">{column.defaultCondition || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No columns defined for this table.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tables.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No tables found</h3>
            <p className="text-muted-foreground mb-4">Start by adding tables in the Manage Data Catalog section.</p>
            <Button onClick={() => navigate('/data-catalog')}>
              Go to Manage Data Catalog
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCatalogView;
