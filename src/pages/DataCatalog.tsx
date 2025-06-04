
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Wand2, Save, Trash2 } from "lucide-react";

interface DataCatalogEntry {
  id: string;
  tableName: string;
  tableDescription: string;
  columnName: string;
  dataType: string;
  description: string;
  tags: string;
  categories: string;
  relationshipTableName: string;
  relationshipColumnName: string;
  defaultCondition: string;
}

const DataCatalog: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [entries, setEntries] = useState<DataCatalogEntry[]>([
    {
      id: '1',
      tableName: 'Users',
      tableDescription: 'User account information',
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
      id: '2',
      tableName: 'Orders',
      tableDescription: 'Customer order data',
      columnName: 'order_id',
      dataType: 'INTEGER',
      description: 'Unique identifier for orders',
      tags: 'primary_key, business_key',
      categories: 'Sales',
      relationshipTableName: '',
      relationshipColumnName: '',
      defaultCondition: 'NOT NULL'
    }
  ]);

  const handleAddEntry = () => {
    const newEntry: DataCatalogEntry = {
      id: Date.now().toString(),
      tableName: '',
      tableDescription: '',
      columnName: '',
      dataType: '',
      description: '',
      tags: '',
      categories: '',
      relationshipTableName: '',
      relationshipColumnName: '',
      defaultCondition: ''
    };
    setEntries([...entries, newEntry]);
    setEditingId(newEntry.id);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Data catalog entry has been deleted",
    });
  };

  const handleUpdateEntry = (id: string, field: keyof DataCatalogEntry, value: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSave = () => {
    setEditingId(null);
    toast({
      title: "Changes Saved",
      description: "Data catalog has been updated successfully",
    });
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      // Simulate OpenAI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update entries with generated descriptions and tags
      const updatedEntries = entries.map(entry => ({
        ...entry,
        description: entry.description || `Auto-generated description for ${entry.columnName}`,
        tags: entry.tags || 'auto_generated, data_element',
        categories: entry.categories || 'General'
      }));
      
      setEntries(updatedEntries);
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Catalog</h1>
        <p className="text-muted-foreground">Manage your data dictionary and table relationships</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Data Dictionary</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                variant="outline"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
              <Button onClick={handleAddEntry}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
              <Button onClick={handleSave} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Table Description</TableHead>
                  <TableHead>Column Name</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Relationship Table</TableHead>
                  <TableHead>Relationship Column</TableHead>
                  <TableHead>Default Condition</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Input
                        value={entry.tableName}
                        onChange={(e) => handleUpdateEntry(entry.id, 'tableName', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.tableDescription}
                        onChange={(e) => handleUpdateEntry(entry.id, 'tableDescription', e.target.value)}
                        className="min-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.columnName}
                        onChange={(e) => handleUpdateEntry(entry.id, 'columnName', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.dataType}
                        onChange={(e) => handleUpdateEntry(entry.id, 'dataType', e.target.value)}
                        className="min-w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.description}
                        onChange={(e) => handleUpdateEntry(entry.id, 'description', e.target.value)}
                        className="min-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.tags}
                        onChange={(e) => handleUpdateEntry(entry.id, 'tags', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.categories}
                        onChange={(e) => handleUpdateEntry(entry.id, 'categories', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.relationshipTableName}
                        onChange={(e) => handleUpdateEntry(entry.id, 'relationshipTableName', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.relationshipColumnName}
                        onChange={(e) => handleUpdateEntry(entry.id, 'relationshipColumnName', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.defaultCondition}
                        onChange={(e) => handleUpdateEntry(entry.id, 'defaultCondition', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCatalog;
