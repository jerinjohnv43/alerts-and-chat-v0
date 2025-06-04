
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CreateAlert: React.FC = () => {
  const navigate = useNavigate();
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

    // Create alert logic here
    console.log('Creating alert with data:', {
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
      title: "Alert Created",
      description: "Your alert has been created successfully"
    });

    navigate('/alerts');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Alert</h1>
        <p className="text-muted-foreground">Set up a new data quality alert</p>
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
          <Button type="submit">Create Alert</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/alerts')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlert;
