
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  AlertTriangle, 
  ArrowLeft, 
  Bell, 
  Database, 
  Mail, 
  Bot, 
  MessageSquare,
  Users,
  Check 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationType } from '@/types/alerts';

// Dataset definitions with their associated KPIs and dimensions
const datasetsConfig = {
  sales_data: {
    id: "sales_data",
    name: "Sales Data",
    kpis: ["revenue", "conversion_rate"],
    dimensions: ["time", "product", "customer_segment", "channel"]
  },
  marketing_data: {
    id: "marketing_data",
    name: "Marketing Data",
    kpis: ["conversion_rate", "customer_acquisition"],
    dimensions: ["time", "geography", "channel"]
  },
  finance_data: {
    id: "finance_data",
    name: "Financial Data",
    kpis: ["revenue", "churn_rate"],
    dimensions: ["time", "product"]
  },
  operations_data: {
    id: "operations_data",
    name: "Operations Data",
    kpis: ["churn_rate"],
    dimensions: ["time", "geography", "customer_segment"]
  }
};

// Dataset array for rendering
const datasets = Object.values(datasetsConfig);

// KPI definitions
const kpiConfig = {
  revenue: { name: "Revenue" },
  conversion_rate: { name: "Conversion Rate" },
  customer_acquisition: { name: "Customer Acquisition" },
  churn_rate: { name: "Churn Rate" }
};

// Dimension definitions
const dimensionsConfig = {
  time: { name: "Time" },
  geography: { name: "Geography" },
  product: { name: "Product" },
  customer_segment: { name: "Customer Segment" },
  channel: { name: "Channel" }
};

const emailTemplates = [
  { id: "standard", name: "Standard Alert" },
  { id: "detailed", name: "Detailed Report" },
  { id: "executive", name: "Executive Summary" },
];

// Mock MS Teams users for selection
const mockTeamsUsers = [
  { id: "user1", email: "user1@example.com", name: "John Doe" },
  { id: "user2", email: "user2@example.com", name: "Jane Smith" },
  { id: "user3", email: "user3@example.com", name: "Robert Johnson" },
  { id: "user4", email: "user4@example.com", name: "Emily Davis" },
];

// Form schema with nested structure for datasets and recipients
const createAlertSchema = z.object({
  name: z.string().min(3, { message: "Alert name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  datasetSelections: z.array(z.object({
    datasetId: z.string(),
    selectedKpi: z.string().optional(),
    selectedDimensions: z.array(z.string()).min(1, { message: "Select at least one dimension." }).optional(),
  })).min(1, { message: "Select at least one dataset with KPI and dimensions." }),
  emailTemplate: z.string({ required_error: "Please select an email template." }),
  systemPrompt: z.string().optional(),
  notificationChannels: z.object({
    email: z.boolean(),
    whatsapp: z.boolean(),
    teams: z.boolean(),
  }),
  recipients: z.object({
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    teams: z.array(z.string()).optional(),
  }),
  active: z.boolean().default(true),
}).refine(data => {
  // Check if at least one dataset has both KPI and dimensions
  return data.datasetSelections.some(
    ds => ds.selectedKpi && ds.selectedDimensions && ds.selectedDimensions.length > 0
  );
}, {
  message: "At least one dataset must have both KPI and dimensions selected",
  path: ["datasetSelections"],
}).refine(data => {
  // Check if at least one notification channel is selected
  return data.notificationChannels.email || 
         data.notificationChannels.whatsapp || 
         data.notificationChannels.teams;
}, {
  message: "At least one notification channel must be selected",
  path: ["notificationChannels"],
}).refine(data => {
  // Check that email recipients are provided if email channel is selected
  if (data.notificationChannels.email && (!data.recipients.email || data.recipients.email.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Email recipients are required when email notifications are enabled",
  path: ["recipients", "email"]
}).refine(data => {
  // Check that WhatsApp recipients are provided if WhatsApp channel is selected
  if (data.notificationChannels.whatsapp && (!data.recipients.whatsapp || data.recipients.whatsapp.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "WhatsApp recipients are required when WhatsApp notifications are enabled",
  path: ["recipients", "whatsapp"]
}).refine(data => {
  // Check that MS Teams recipients are provided if Teams channel is selected
  if (data.notificationChannels.teams && (!data.recipients.teams || data.recipients.teams.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "MS Teams recipients are required when MS Teams notifications are enabled",
  path: ["recipients", "teams"]
});

type CreateAlertValues = z.infer<typeof createAlertSchema>;

const CreateAlert = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeNotificationTab, setActiveNotificationTab] = useState<NotificationType>('email');

  const form = useForm<CreateAlertValues>({
    resolver: zodResolver(createAlertSchema),
    defaultValues: {
      name: "",
      description: "",
      datasetSelections: [],
      emailTemplate: "",
      systemPrompt: "",
      notificationChannels: {
        email: true,
        whatsapp: false,
        teams: false,
      },
      recipients: {
        email: "",
        whatsapp: "",
        teams: [],
      },
      active: true,
    },
  });

  // Selected datasets state
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>([]);
  
  // Add or remove dataset from selections
  const handleDatasetToggle = (datasetId: string, checked: boolean) => {
    const currentSelections = form.getValues("datasetSelections");
    
    if (checked) {
      // Add the dataset if it doesn't already exist
      if (!currentSelections.find(ds => ds.datasetId === datasetId)) {
        form.setValue("datasetSelections", [
          ...currentSelections,
          { datasetId, selectedKpi: undefined, selectedDimensions: [] }
        ]);
        setSelectedDatasetIds(prev => [...prev, datasetId]);
      }
    } else {
      // Remove the dataset if it exists
      form.setValue("datasetSelections", 
        currentSelections.filter(ds => ds.datasetId !== datasetId)
      );
      setSelectedDatasetIds(prev => prev.filter(id => id !== datasetId));
    }
  };

  // Check if a dataset is selected
  const isDatasetSelected = (datasetId: string) => {
    return selectedDatasetIds.includes(datasetId);
  }
  
  // Update KPI for a dataset
  const handleKpiChange = (datasetId: string, kpi: string) => {
    const currentSelections = form.getValues("datasetSelections");
    const updatedSelections = currentSelections.map(ds => 
      ds.datasetId === datasetId 
        ? { ...ds, selectedKpi: kpi } 
        : ds
    );
    form.setValue("datasetSelections", updatedSelections);
  };

  // Update dimensions for a dataset
  const handleDimensionToggle = (datasetId: string, dimension: string, checked: boolean) => {
    const currentSelections = form.getValues("datasetSelections");
    const datasetIndex = currentSelections.findIndex(ds => ds.datasetId === datasetId);
    
    if (datasetIndex !== -1) {
      const currentDimensions = currentSelections[datasetIndex].selectedDimensions || [];
      let newDimensions;
      
      if (checked) {
        // Add dimension
        newDimensions = [...currentDimensions, dimension];
      } else {
        // Remove dimension
        newDimensions = currentDimensions.filter(dim => dim !== dimension);
      }
      
      const updatedSelections = [...currentSelections];
      updatedSelections[datasetIndex] = {
        ...updatedSelections[datasetIndex],
        selectedDimensions: newDimensions
      };
      
      form.setValue("datasetSelections", updatedSelections);
    }
  };

  // Handle Teams user selection
  const handleTeamsUserToggle = (userId: string, checked: boolean) => {
    const currentTeamsUsers = form.getValues("recipients.teams") || [];
    
    if (checked) {
      if (!currentTeamsUsers.includes(userId)) {
        const updatedTeamsUsers = [...currentTeamsUsers, userId];
        form.setValue("recipients.teams", updatedTeamsUsers);
      }
    } else {
      const updatedTeamsUsers = currentTeamsUsers.filter(id => id !== userId);
      form.setValue("recipients.teams", updatedTeamsUsers);
    }
  };

  // Check if Teams user is selected
  const isTeamsUserSelected = (userId: string) => {
    const selectedTeamsUsers = form.getValues("recipients.teams") || [];
    return selectedTeamsUsers.includes(userId);
  };

  // Check if a dimension is selected for a dataset
  const isDimensionSelected = (datasetId: string, dimension: string) => {
    const datasetSelections = form.getValues("datasetSelections");
    const datasetSelection = datasetSelections.find(ds => ds.datasetId === datasetId);
    return datasetSelection?.selectedDimensions?.includes(dimension) || false;
  };

  // Get selected KPI for a dataset
  const getSelectedKpi = (datasetId: string) => {
    const datasetSelections = form.getValues("datasetSelections");
    return datasetSelections.find(ds => ds.datasetId === datasetId)?.selectedKpi || "";
  };

  // Handle notification channel toggle
  const handleNotificationToggle = (channel: NotificationType, checked: boolean) => {
    form.setValue(`notificationChannels.${channel}`, checked);
    
    // If enabling a channel, switch to its tab
    if (checked) {
      setActiveNotificationTab(channel);
    } else {
      // If disabling the active tab, switch to first enabled channel
      if (activeNotificationTab === channel) {
        const channels: NotificationType[] = ['email', 'whatsapp', 'teams'];
        const enabledChannels = channels.filter(c => {
          if (c === channel) return false; // Skip the one being disabled
          return form.getValues(`notificationChannels.${c}`);
        });
        
        if (enabledChannels.length > 0) {
          setActiveNotificationTab(enabledChannels[0]);
        }
      }
    }
  };

  const onSubmit = (data: CreateAlertValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: "Alert created",
      description: `Alert "${data.name}" has been created successfully.`,
    });
    
    setTimeout(() => navigate("/alerts"), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/alerts")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Alert</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alert Details */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Alert Details</h2>
                </div>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter alert name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this alert.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose of this alert" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide context about what this alert monitors.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Activate this alert immediately after creation.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Data Sources & Dimensions Section */}
              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Data Sources & Dimensions</h2>
                </div>
                <Separator />
                
                {/* Datasets with nested KPIs and Dimensions */}
                <FormField
                  control={form.control}
                  name="datasetSelections"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Datasets</FormLabel>
                        <FormDescription>
                          Select one or more datasets and configure their KPIs and dimensions.
                        </FormDescription>
                      </div>
                      
                      <div className="space-y-4">
                        {datasets.map((dataset) => (
                          <Card key={dataset.id} className="overflow-hidden border-2 transition-all duration-200 hover:border-blue-200">
                            <CardHeader className="bg-slate-50 p-4 flex flex-row items-center space-y-0 gap-3">
                              <Checkbox
                                id={`dataset-${dataset.id}`}
                                checked={isDatasetSelected(dataset.id)}
                                onCheckedChange={(checked) => 
                                  handleDatasetToggle(dataset.id, checked === true)
                                }
                              />
                              <CardTitle className="text-base font-medium">{dataset.name}</CardTitle>
                            </CardHeader>
                            
                            {isDatasetSelected(dataset.id) && (
                              <CardContent className="p-4 pt-6 bg-white">
                                {/* KPI Selection */}
                                <div className="mb-6">
                                  <FormLabel className="mb-2 block">KPI for {dataset.name}</FormLabel>
                                  <Select 
                                    value={getSelectedKpi(dataset.id)}
                                    onValueChange={(value) => handleKpiChange(dataset.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a KPI" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dataset.kpis.map((kpiId) => (
                                        <SelectItem key={kpiId} value={kpiId}>
                                          {kpiConfig[kpiId as keyof typeof kpiConfig]?.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {/* Dimensions Selection */}
                                <div>
                                  <FormLabel className="mb-2 block">Dimensions for {dataset.name}</FormLabel>
                                  <div className="grid grid-cols-2 gap-2">
                                    {dataset.dimensions.map((dimensionId) => (
                                      <div key={dimensionId} className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`${dataset.id}-${dimensionId}`}
                                          checked={isDimensionSelected(dataset.id, dimensionId)}
                                          onCheckedChange={(checked) => 
                                            handleDimensionToggle(dataset.id, dimensionId, checked === true)
                                          }
                                        />
                                        <label 
                                          htmlFor={`${dataset.id}-${dimensionId}`}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {dimensionsConfig[dimensionId as keyof typeof dimensionsConfig]?.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* System Prompt */}
              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">System Prompt</h2>
                </div>
                <Separator />
                
                <Collapsible className="w-full" defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="flex w-full justify-between">
                      <span>Advanced AI Configuration</span>
                      <span>+</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <FormField
                      control={form.control}
                      name="systemPrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom System Prompt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter instructions for the AI when analyzing this data"
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Customize how the AI interprets and analyzes your data. 
                            Leave empty to use the default system prompt.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Notification Settings */}
              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                </div>
                <Separator />
                
                {/* Notification Channel Selection */}
                <div className="space-y-4">
                  <p className="text-sm font-medium">Notification Channels</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="notificationChannels.email"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handleNotificationToggle('email', checked === true);
                              }}
                            />
                          </FormControl>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Email</span>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notificationChannels.whatsapp"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handleNotificationToggle('whatsapp', checked === true);
                              }}
                            />
                          </FormControl>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">WhatsApp</span>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notificationChannels.teams"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handleNotificationToggle('teams', checked === true);
                              }}
                            />
                          </FormControl>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Teams</span>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="emailTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Template</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {emailTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{template.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how your alert notifications will appear.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Recipients Configuration with Tabs for Different Channels */}
                <div className="space-y-4">
                  <p className="text-sm font-medium">Alert Recipients</p>
                  
                  <Tabs 
                    value={activeNotificationTab} 
                    onValueChange={(value) => setActiveNotificationTab(value as NotificationType)}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger 
                        value="email" 
                        disabled={!form.getValues("notificationChannels.email")}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger 
                        value="whatsapp" 
                        disabled={!form.getValues("notificationChannels.whatsapp")}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </TabsTrigger>
                      <TabsTrigger 
                        value="teams" 
                        disabled={!form.getValues("notificationChannels.teams")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        MS Teams
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="email" className="pt-4">
                      <FormField
                        control={form.control}
                        name="recipients.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="email@example.com, another@example.com" 
                                {...field} 
                                disabled={!form.getValues("notificationChannels.email")}
                              />
                            </FormControl>
                            <FormDescription>
                              Comma-separated list of email addresses to receive the alerts.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="whatsapp" className="pt-4">
                      <FormField
                        control={form.control}
                        name="recipients.whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="+1234567890, +0987654321" 
                                {...field} 
                                disabled={!form.getValues("notificationChannels.whatsapp")}
                              />
                            </FormControl>
                            <FormDescription>
                              Comma-separated list of WhatsApp phone numbers with country code (+) to receive alerts.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="teams" className="pt-4">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="recipients.teams"
                          render={() => (
                            <FormItem>
                              <FormDescription className="mb-2">
                                Select Microsoft Teams users to receive the alerts.
                              </FormDescription>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {mockTeamsUsers.map((user) => (
                                  <div key={user.id} className="flex items-center space-x-2 rounded-md border p-2">
                                    <Checkbox 
                                      id={`teams-user-${user.id}`} 
                                      checked={isTeamsUserSelected(user.id)}
                                      onCheckedChange={(checked) => 
                                        handleTeamsUserToggle(user.id, checked === true)
                                      }
                                      disabled={!form.getValues("notificationChannels.teams")}
                                    />
                                    <label 
                                      htmlFor={`teams-user-${user.id}`}
                                      className="flex flex-col cursor-pointer"
                                    >
                                      <span className="text-sm font-medium">{user.name}</span>
                                      <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/alerts")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Alert</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAlert;
