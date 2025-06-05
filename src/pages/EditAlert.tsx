
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { alerts } from '@/data/mockData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditAlert: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Form state
  const [alertName, setAlertName] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isActive, setIsActive] = useState('active');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [frequencyType, setFrequencyType] = useState('');
  const [frequencyValue, setFrequencyValue] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [workspaceId, setWorkspaceId] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [daxQuery, setDaxQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find the alert by ID
      const alert = alerts.find(a => a.id === id);
      if (alert) {
        setAlertName(alert.name);
        setAlertDescription(alert.description);
        setIsActive(alert.active ? 'active' : 'inactive');
        // Set other fields with default or mock data
        setSystemPrompt('');
        setFrequencyType('daily');
        setFrequencyValue('1');
        setWorkspaceId('workspace-123');
        setDatasetId('dataset-456');
        setDaxQuery('EVALUATE VALUES(Table[Column])');
      } else {
        toast({
          title: "Alert not found",
          description: "The alert you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/alerts');
        return;
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!alertName.trim()) {
      toast({
        title: "Validation Error",
        description: "Alert name is required",
        variant: "destructive"
      });
      return;
    }

    // Update alert logic here
    console.log('Updating alert with data:', {
      id,
      alertName,
      alertDescription,
      isActive: isActive === 'active',
      systemPrompt,
      frequencyType,
      frequencyValue,
      startDate,
      endDate,
      workspaceId,
      datasetId,
      daxQuery
    });

    toast({
      title: "Alert Updated",
      description: "Your alert has been updated successfully"
    });

    navigate('/alerts');
  };

  const handleDelete = () => {
    // Delete alert logic here
    console.log('Deleting alert:', id);
    
    toast({
      title: "Alert Deleted",
      description: "The alert has been deleted successfully"
    });

    navigate('/alerts');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/alerts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Alerts
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Alert</h1>
            <p className="text-muted-foreground">Update your data quality alert</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Alert
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Alert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{alertName}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alert Details */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="alertName">Alert Name</Label>
              <Input
                id="alertName"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="Enter alert name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="alertDescription">Alert Description</Label>
              <Textarea
                id="alertDescription"
                value={alertDescription}
                onChange={(e) => setAlertDescription(e.target.value)}
                placeholder="Enter alert description"
              />
            </div>

            <div>
              <Label>Status</Label>
              <RadioGroup value={isActive} onValueChange={setIsActive} className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive">Inactive</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* System Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customize how the AI interprets and analyzes your data. Leave empty to use the default system prompt.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter custom system prompt..."
              className="min-h-[120px] resize-y"
            />
          </CardContent>
        </Card>

        {/* Frequency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Frequency Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Frequency Type</Label>
                <Select value={frequencyType} onValueChange={setFrequencyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Every</Label>
                <Input
                  type="number"
                  value={frequencyValue}
                  onChange={(e) => setFrequencyValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DAX Query */}
        <Card>
          <CardHeader>
            <CardTitle>DAX Query</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workspaceId">Workspace ID</Label>
              <Input
                id="workspaceId"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                placeholder="Enter workspace ID"
              />
            </div>

            <div>
              <Label htmlFor="datasetId">Dataset ID</Label>
              <Input
                id="datasetId"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="Enter dataset ID"
              />
            </div>

            <div>
              <Label htmlFor="daxQuery">DAX Query</Label>
              <Textarea
                id="daxQuery"
                value={daxQuery}
                onChange={(e) => setDaxQuery(e.target.value)}
                placeholder="Enter your DAX query..."
                className="min-h-[120px] font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex gap-4">
          <Button type="submit">Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/alerts')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAlert;
