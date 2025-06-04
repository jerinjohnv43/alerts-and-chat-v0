
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Wand2, Save, Trash2, Upload } from "lucide-react";

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

const DataCatalogManage: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [tables, setTables] = useState<DataTable[]>([
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

  const handleAddTable = () => {
    const newTable: DataTable = {
      id: Date.now().toString(),
      tableName: '',
      tableDescription: '',
      columns: []
    };
    setTables([...tables, newTable]);
  };

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
    toast({
      title: "Table Deleted",
      description: "Table has been deleted from the catalog",
    });
  };

  const handleUpdateTable = (tableId: string, field: keyof DataTable, value: string) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, [field]: value } : table
    ));
  };

  const handleAddColumn = (tableId: string) => {
    const newColumn: TableColumn = {
      id: `${tableId}-${Date.now()}`,
      columnName: '',
      dataType: '',
      description: '',
      tags: '',
      categories: '',
      relationshipTableName: '',
      relationshipColumnName: '',
      defaultCondition: ''
    };
    
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, columns: [...table.columns, newColumn] }
        : table
    ));
  };

  const handleDeleteColumn = (tableId: string, columnId: string) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, columns: table.columns.filter(col => col.id !== columnId) }
        : table
    ));
  };

  const handleUpdateColumn = (tableId: string, columnId: string, field: keyof TableColumn, value: string) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? {
            ...table,
            columns: table.columns.map(col => 
              col.id === columnId ? { ...col, [field]: value } : col
            )
          }
        : table
    ));
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file import
      toast({
        title: "File Import",
        description: `Importing data from ${file.name}...`,
      });
      // Here you would implement actual CSV/Excel parsing
    }
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedTables = tables.map(table => ({
        ...table,
        columns: table.columns.map(column => ({
          ...column,
          description: column.description || `Auto-generated description for ${column.columnName}`,
          tags: column.tags || 'auto_generated, data_element',
          categories: column.categories || 'General'
        }))
      }));
      
      setTables(updatedTables);
      toast({
        title: "AI Generation Complete",
        description: "Descriptions and tags have been automatically generated",
      });
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: "Failed to generate descriptions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('dataCatalogTables', JSON.stringify(tables));
    toast({
      title: "Changes Saved",
      description: "Data catalog has been updated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Data Catalog</h1>
        <p className="text-muted-foreground">Add and manage your data tables and columns</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={handleAddTable}>
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
        <Button 
          onClick={handleGenerateWithAI}
          disabled={isGenerating}
          variant="outline"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
        <Button onClick={handleSave} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImportFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV/Excel
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor={`table-name-${table.id}`}>Table Name</Label>
                    <Input
                      id={`table-name-${table.id}`}
                      value={table.tableName}
                      onChange={(e) => handleUpdateTable(table.id, 'tableName', e.target.value)}
                      placeholder="Enter table name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`table-desc-${table.id}`}>Table Description</Label>
                    <Input
                      id={`table-desc-${table.id}`}
                      value={table.tableDescription}
                      onChange={(e) => handleUpdateTable(table.id, 'tableDescription', e.target.value)}
                      placeholder="Enter table description"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTable(table.id)}
                  className="text-destructive hover:text-destructive ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Columns</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddColumn(table.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                </div>
                
                {table.columns.map((column) => (
                  <div key={column.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteColumn(table.id, column.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Column Name</Label>
                        <Input
                          value={column.columnName}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'columnName', e.target.value)}
                          placeholder="Column name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data Type</Label>
                        <Input
                          value={column.dataType}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'dataType', e.target.value)}
                          placeholder="Data type"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={column.description}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'description', e.target.value)}
                          placeholder="Description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                          value={column.tags}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'tags', e.target.value)}
                          placeholder="Tags"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categories</Label>
                        <Input
                          value={column.categories}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'categories', e.target.value)}
                          placeholder="Categories"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship Table</Label>
                        <Input
                          value={column.relationshipTableName}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'relationshipTableName', e.target.value)}
                          placeholder="Related table"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship Column</Label>
                        <Input
                          value={column.relationshipColumnName}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'relationshipColumnName', e.target.value)}
                          placeholder="Related column"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Default Condition</Label>
                        <Input
                          value={column.defaultCondition}
                          onChange={(e) => handleUpdateColumn(table.id, column.id, 'defaultCondition', e.target.value)}
                          placeholder="Default condition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {table.columns.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No columns added yet. Click "Add Column" to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tables.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tables added yet. Click "Add Table" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCatalogManage;
