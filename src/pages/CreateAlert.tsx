
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertTriangle, ArrowLeft, Bell, Database, Mail, Layers, Bot, Gauge } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

// Form schema
const createAlertSchema = z.object({
  name: z.string().min(3, { message: "Alert name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  datasets: z.array(z.string()).min(1, { message: "Select at least one dataset." }),
  kpi: z.string({ required_error: "Please select a KPI." }),
  dimensions: z.array(z.string()).min(1, { message: "Select at least one dimension." }),
  emailTemplate: z.string({ required_error: "Please select an email template." }),
  systemPrompt: z.string().optional(),
  recipients: z.string().min(5, { message: "Add at least one recipient email." }),
  active: z.boolean().default(true),
});

type CreateAlertValues = z.infer<typeof createAlertSchema>;

// Dataset definitions with their associated KPIs and dimensions
const datasetsConfig = {
  sales_data: {
    name: "Sales Data",
    kpis: ["revenue", "conversion_rate"],
    dimensions: ["time", "product", "customer_segment", "channel"]
  },
  marketing_data: {
    name: "Marketing Data",
    kpis: ["conversion_rate", "customer_acquisition"],
    dimensions: ["time", "geography", "channel"]
  },
  finance_data: {
    name: "Financial Data",
    kpis: ["revenue", "churn_rate"],
    dimensions: ["time", "product"]
  },
  operations_data: {
    name: "Operations Data",
    kpis: ["churn_rate"],
    dimensions: ["time", "geography", "customer_segment"]
  }
};

// Dataset array for rendering
const datasets = Object.entries(datasetsConfig).map(([id, config]) => ({
  id,
  name: config.name
}));

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

const CreateAlert = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [availableKpis, setAvailableKpis] = useState<{id: string, name: string}[]>([]);
  const [availableDimensions, setAvailableDimensions] = useState<{id: string, name: string}[]>([]);
  
  const form = useForm<CreateAlertValues>({
    resolver: zodResolver(createAlertSchema),
    defaultValues: {
      name: "",
      description: "",
      datasets: [],
      kpi: "",
      dimensions: [],
      emailTemplate: "",
      systemPrompt: "",
      recipients: "",
      active: true,
    },
  });

  // Watch for changes in datasets selection
  const selectedDatasets = form.watch("datasets");

  // Update available KPIs and dimensions based on selected datasets
  useEffect(() => {
    if (selectedDatasets.length === 0) {
      setAvailableKpis([]);
      setAvailableDimensions([]);
      return;
    }

    // Get all KPIs from selected datasets
    const kpisSet = new Set<string>();
    selectedDatasets.forEach(datasetId => {
      const dataset = datasetsConfig[datasetId as keyof typeof datasetsConfig];
      if (dataset) {
        dataset.kpis.forEach(kpi => kpisSet.add(kpi));
      }
    });
    
    // Get all dimensions from selected datasets
    const dimensionsSet = new Set<string>();
    selectedDatasets.forEach(datasetId => {
      const dataset = datasetsConfig[datasetId as keyof typeof datasetsConfig];
      if (dataset) {
        dataset.dimensions.forEach(dimension => dimensionsSet.add(dimension));
      }
    });
    
    // Convert sets to arrays of objects with id and name
    setAvailableKpis(Array.from(kpisSet).map(id => ({
      id,
      name: kpiConfig[id as keyof typeof kpiConfig].name
    })));
    
    setAvailableDimensions(Array.from(dimensionsSet).map(id => ({
      id,
      name: dimensionsConfig[id as keyof typeof dimensionsConfig].name
    })));

    // Clear KPI selection if current selection is not available in the new list
    const currentKpi = form.getValues("kpi");
    if (currentKpi && !kpisSet.has(currentKpi)) {
      form.setValue("kpi", "");
    }

    // Filter dimensions selection to only include available dimensions
    const currentDimensions = form.getValues("dimensions");
    const filteredDimensions = currentDimensions.filter(dim => dimensionsSet.has(dim));
    if (filteredDimensions.length !== currentDimensions.length) {
      form.setValue("dimensions", filteredDimensions);
    }
  }, [selectedDatasets, form]);

  const onSubmit = (data: CreateAlertValues) => {
    console.log("Form submitted:", data);
    
    // In a real application, this would send the data to your API
    // For now, we'll just show a success toast and navigate back
    
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
              
              {/* Merged Data Sources and Dimensions Section */}
              <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Data Sources & Dimensions</h2>
                </div>
                <Separator />
                
                {/* Datasets Selection */}
                <FormField
                  control={form.control}
                  name="datasets"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Datasets</FormLabel>
                        <FormDescription>
                          Select one or more datasets for this alert to monitor.
                        </FormDescription>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {datasets.map((dataset) => (
                          <FormField
                            key={dataset.id}
                            control={form.control}
                            name="datasets"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={dataset.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-slate-50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(dataset.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, dataset.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== dataset.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-base">{dataset.name}</FormLabel>
                                    <FormDescription>
                                      Contains metrics related to {dataset.name.toLowerCase()}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* KPI Selection - Show only if datasets are selected */}
                {availableKpis.length > 0 && (
                  <FormField
                    control={form.control}
                    name="kpi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KPI</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a KPI" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableKpis.map((kpi) => (
                              <SelectItem key={kpi.id} value={kpi.id}>
                                <div className="flex items-center gap-2">
                                  <Gauge className="h-4 w-4" />
                                  <span>{kpi.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the key performance indicator to track.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Dimensions Selection - Show only if datasets are selected */}
                {availableDimensions.length > 0 && (
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Analysis Dimensions</FormLabel>
                          <FormDescription>
                            Select the dimensions to analyze for this alert.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {availableDimensions.map((dimension) => (
                            <FormField
                              key={dimension.id}
                              control={form.control}
                              name="dimensions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={dimension.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(dimension.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, dimension.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== dimension.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {dimension.name}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                
                <FormField
                  control={form.control}
                  name="recipients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipients</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com, another@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of email addresses to receive the alerts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
