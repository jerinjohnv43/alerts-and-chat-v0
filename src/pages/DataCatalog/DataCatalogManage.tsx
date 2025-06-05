import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Upload, Wand2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [currentTable, setCurrentTable] = useState<DataTable>({
    id: '',
    tableName: '',
    tableDescription: '',
    columns: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const savedTables = JSON.parse(localStorage.getItem('dataCatalogTables') || '[]');
      const tableToEdit = savedTables.find((table: DataTable) => table.id === editId);
      if (tableToEdit) {
        setCurrentTable(tableToEdit);
        setIsEditing(true);
      }
    }
  }, [searchParams]);

  const addNewColumn = () => {
    const newColumn: TableColumn = {
      id: Date.now().toString(),
      columnName: '',
      dataType: '',
      description: '',
      tags: '',
      categories: '',
      relationshipTableName: '',
      relationshipColumnName: '',
      defaultCondition: ''
    };
    setCurrentTable(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  };

  const removeColumn = (columnId: string) => {
    setCurrentTable(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== columnId)
    }));
  };

  const updateColumn = (columnId: string, field: keyof TableColumn, value: string) => {
    setCurrentTable(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, [field]: value } : col
      )
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

        if (jsonData.length > 0) {
          const headers = jsonData[0];
          const expectedHeaders = [
            'TableName', 'TableDescription', 'ColumnName', 'DataType', 
            'Description', 'Tags', 'Categories', 'Relationship_TableName', 
            'Relationship_ColumnName', 'DefaultCondition'
          ];

          const headerMatch = expectedHeaders.every(header => headers.includes(header));
          
          if (headerMatch) {
            const rows = jsonData.slice(1);
            if (rows.length > 0) {
              const firstRow = rows[0];
              const tableNameIndex = headers.indexOf('TableName');
              const tableDescIndex = headers.indexOf('TableDescription');
              
              setCurrentTable({
                id: isEditing ? currentTable.id : Date.now().toString(),
                tableName: firstRow[tableNameIndex] || '',
                tableDescription: firstRow[tableDescIndex] || '',
                columns: rows.map((row, index) => ({
                  id: (Date.now() + index).toString(),
                  columnName: row[headers.indexOf('ColumnName')] || '',
                  dataType: row[headers.indexOf('DataType')] || '',
                  description: row[headers.indexOf('Description')] || '',
                  tags: row[headers.indexOf('Tags')] || '',
                  categories: row[headers.indexOf('Categories')] || '',
                  relationshipTableName: row[headers.indexOf('Relationship_TableName')] || '',
                  relationshipColumnName: row[headers.indexOf('Relationship_ColumnName')] || '',
                  defaultCondition: row[headers.indexOf('DefaultCondition')] || ''
                }))
              });

              toast({
                title: "File imported successfully",
                description: `Imported ${rows.length} columns`
              });
            }
          } else {
            toast({
              title: "Invalid file format",
              description: "Please ensure your file has the correct column headers",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        toast({
          title: "Error reading file",
          description: "Please check your file format and try again",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const generateAIDescriptions = async () => {
    const updatedColumns = currentTable.columns.map(column => ({
      ...column,
      description: column.description || `AI-generated description for ${column.columnName}`,
      tags: column.tags || `${column.dataType.toLowerCase()}, auto-generated`,
      categories: column.categories || 'Data Management'
    }));

    setCurrentTable(prev => ({
      ...prev,
      columns: updatedColumns
    }));

    toast({
      title: "AI descriptions generated",
      description: "Descriptions, tags, and categories have been auto-filled"
    });
  };

  const saveTable = () => {
    if (!currentTable.tableName.trim()) {
      toast({
        title: "Table name required",
        description: "Please enter a table name",
        variant: "destructive"
      });
      return;
    }

    if (currentTable.columns.length === 0) {
      toast({
        title: "Columns required",
        description: "Please add at least one column",
        variant: "destructive"
      });
      return;
    }

    const existingTables = JSON.parse(localStorage.getItem('dataCatalogTables') || '[]');
    const updatedTables = isEditing 
      ? existingTables.map((table: DataTable) => table.id === currentTable.id ? currentTable : table)
      : [...existingTables, { ...currentTable, id: currentTable.id || Date.now().toString() }];

    localStorage.setItem('dataCatalogTables', JSON.stringify(updatedTables));

    toast({
      title: "Table saved successfully",
      description: `${currentTable.tableName} has been saved`
    });

    navigate('/data-catalog');
  };

  const resetForm = () => {
    setCurrentTable({
      id: '',
      tableName: '',
      tableDescription: '',
      columns: []
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/data-catalog')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Data Catalog
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Table' : 'Add New Table'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Edit your data table and columns' : 'Add and manage your data tables and columns'}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Upload and AI Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Import & Generate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import from Excel/CSV
              </Button>
              <Button
                variant="outline"
                onClick={generateAIDescriptions}
                disabled={currentTable.columns.length === 0}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Descriptions
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Table Information */}
        <Card>
          <CardHeader>
            <CardTitle>Table Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tableName">Table Name</Label>
                <Input
                  id="tableName"
                  value={currentTable.tableName}
                  onChange={(e) => setCurrentTable(prev => ({ ...prev, tableName: e.target.value }))}
                  placeholder="Enter table name"
                />
              </div>
              <div>
                <Label htmlFor="tableDescription">Table Description</Label>
                <Textarea
                  id="tableDescription"
                  value={currentTable.tableDescription}
                  onChange={(e) => setCurrentTable(prev => ({ ...prev, tableDescription: e.target.value }))}
                  placeholder="Enter table description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columns */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Columns ({currentTable.columns.length})</CardTitle>
              <Button onClick={addNewColumn}>
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentTable.columns.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Column Name</TableHead>
                      <TableHead className="min-w-[100px]">Data Type</TableHead>
                      <TableHead className="min-w-[200px]">Description</TableHead>
                      <TableHead className="min-w-[120px]">Tags</TableHead>
                      <TableHead className="min-w-[120px]">Categories</TableHead>
                      <TableHead className="min-w-[150px]">Relationship</TableHead>
                      <TableHead className="min-w-[150px]">Default Condition</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTable.columns.map((column) => (
                      <TableRow key={column.id}>
                        <TableCell className="p-2">
                          <Textarea
                            value={column.columnName}
                            onChange={(e) => updateColumn(column.id, 'columnName', e.target.value)}
                            placeholder="Column name"
                            className="min-h-[60px] resize-y"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Textarea
                            value={column.dataType}
                            onChange={(e) => updateColumn(column.id, 'dataType', e.target.value)}
                            placeholder="Data type"
                            className="min-h-[60px] resize-y"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Textarea
                            value={column.description}
                            onChange={(e) => updateColumn(column.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="min-h-[60px] resize-y"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Textarea
                            value={column.tags}
                            onChange={(e) => updateColumn(column.id, 'tags', e.target.value)}
                            placeholder="Tags"
                            className="min-h-[60px] resize-y"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Textarea
                            value={column.categories}
                            onChange={(e) => updateColumn(column.id, 'categories', e.target.value)}
                            placeholder="Categories"
                            className="min-h-[60px] resize-y"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="space-y-2">
                            <Textarea
                              value={column.relationshipTableName}
                              onChange={(e) => updateColumn(column.id, 'relationshipTableName', e.target.value)}
                              placeholder="Table name"
                              className="min-h-[40px]"
                            />
                            <Textarea
                              value={column.relationshipColumnName}
                              onChange={(e) => updateColumn(column.id, 'relationshipColumnName', e.target.value)}
                              placeholder="Column name"
                              className="min-h-[40px]"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Textarea
                            value={column.defaultCondition}
                            onChange={(e) => updateColumn(column.id, 'defaultCondition', e.target.value)}
                            placeholder="Default condition"
                            className="min-h-[60px] resize-y"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColumn(column.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No columns added yet. Click "Add Column" to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={saveTable} disabled={!currentTable.tableName.trim()}>
            {isEditing ? 'Update Table' : 'Save Table'}
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataCatalogManage;
