
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell,
  ShieldAlert,
  Mail,
  Heading1,
  Save,
  Sliders,
  FileKey,
  Database,
  Boxes
} from 'lucide-react';

// Email templates defined here to match those in the CreateAlert component
const emailTemplates = [
  { id: "standard", name: "Standard Alert", label: "Standard Alert Template" },
  { id: "detailed", name: "Detailed Report", label: "Detailed Report Template" },
  { id: "executive", name: "Executive Summary", label: "Executive Summary Template" },
];

const Settings = () => {
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState("standard");
  
  // Default template content
  const defaultTemplates = {
    standard: `Dear {{recipient_name}},

An alert has been triggered for the following report:
Name: {{alert_name}}
Report: {{report_name}}
Time: {{trigger_time}}

LLM Insights:
{{llm_insights}}

Click the link below to view the report:
{{report_url}}

Regards,
Alert Insights Team`,
    
    detailed: `Dear {{recipient_name}},

We've detected significant changes in your monitored metrics:

Alert: {{alert_name}}
Report: {{report_name}}
Triggered: {{trigger_time}}

DETAILED ANALYSIS:
{{llm_insights}}

KEY METRICS:
- Current Value: {{current_value}}
- Previous Value: {{previous_value}}
- Change: {{change_percentage}}%

DIMENSIONS AFFECTED:
{{affected_dimensions}}

For a comprehensive breakdown, please review the full report:
{{report_url}}

If you have any questions about this alert, please contact the data team.

Best regards,
Alert Insights Analytics Team`,
    
    executive: `EXECUTIVE SUMMARY

ALERT: {{alert_name}}
TIME: {{trigger_time}}

BUSINESS IMPACT:
{{llm_insights}}

KEY TAKEAWAY:
{{key_takeaway}}

RECOMMENDED ACTION:
{{recommended_action}}

View full report: {{report_url}}

Alert Insights Team`
  };
  
  const [templates, setTemplates] = useState(defaultTemplates);
  
  const handleTemplateChange = (value: string) => {
    setActiveTemplate(value);
  };
  
  const handleTemplateContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplates({
      ...templates,
      [activeTemplate]: e.target.value
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your alert system settings and preferences.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how alert notifications are delivered.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications when alerts are triggered.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of all alert activity.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alert Aggregation</Label>
                    <p className="text-sm text-muted-foreground">
                      Group similar alerts into a single notification.
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Failure Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send admin notifications when alerts fail to process.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security settings for your alert system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin users.
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Policy</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password requirements.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow API access to alert data.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Fabric Connection Settings
              </CardTitle>
              <CardDescription>
                Configure Microsoft Fabric data warehouse connection details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fabric-workspace">Fabric Workspace</Label>
                <Input 
                  id="fabric-workspace" 
                  placeholder="Enter your Fabric workspace name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric-warehouse">Warehouse Name</Label>
                <Input 
                  id="fabric-warehouse" 
                  placeholder="Enter your warehouse name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric-endpoint">API Endpoint</Label>
                <Input 
                  id="fabric-endpoint" 
                  placeholder="https://api.fabric.microsoft.com/v1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric-api-key">Fabric API Key</Label>
                <Input 
                  id="fabric-api-key" 
                  type="password" 
                  placeholder="Enter your Fabric API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric-connection-type">Connection Type</Label>
                <Select defaultValue="direct">
                  <SelectTrigger id="fabric-connection-type">
                    <SelectValue placeholder="Select a connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Connection</SelectItem>
                    <SelectItem value="gateway">Gateway Connection</SelectItem>
                    <SelectItem value="oauth">OAuth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Connection on Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Verify connectivity when saving settings.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Customize the email templates used for notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="standard" value={activeTemplate} onValueChange={handleTemplateChange}>
                <TabsList className="grid w-full grid-cols-3">
                  {emailTemplates.map(template => (
                    <TabsTrigger key={template.id} value={template.id}>
                      {template.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {emailTemplates.map(template => (
                  <TabsContent key={template.id} value={template.id}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`email-subject-${template.id}`}>Email Subject</Label>
                        <Input 
                          id={`email-subject-${template.id}`} 
                          defaultValue={`[Alert] {{alert_name}} - ${template.name}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`email-template-${template.id}`}>{template.label}</Label>
                        <Textarea 
                          id={`email-template-${template.id}`} 
                          className="min-h-[250px] font-mono text-sm" 
                          value={templates[template.id as keyof typeof templates]}
                          onChange={handleTemplateContentChange}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p className="font-semibold mb-1">Available variables:</p>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                    <span>&#123;&#123;alert_name&#125;&#125;</span>
                    <span>&#123;&#123;report_name&#125;&#125;</span>
                    <span>&#123;&#123;trigger_time&#125;&#125;</span>
                    <span>&#123;&#123;recipient_name&#125;&#125;</span>
                    <span>&#123;&#123;llm_insights&#125;&#125;</span>
                    <span>&#123;&#123;report_url&#125;&#125;</span>
                    <span>&#123;&#123;current_value&#125;&#125;</span>
                    <span>&#123;&#123;previous_value&#125;&#125;</span>
                    <span>&#123;&#123;change_percentage&#125;&#125;</span>
                    <span>&#123;&#123;affected_dimensions&#125;&#125;</span>
                    <span>&#123;&#123;key_takeaway&#125;&#125;</span>
                    <span>&#123;&#123;recommended_action&#125;&#125;</span>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileKey className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API settings for your alert system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="azure-endpoint">Azure OpenAI Endpoint</Label>
                <Input 
                  id="azure-endpoint" 
                  placeholder="https://your-resource.openai.azure.com/"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="azure-api-key">Azure OpenAI API Key</Label>
                <Input 
                  id="azure-api-key" 
                  type="password"
                  placeholder="Enter your Azure OpenAI API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-model">LLM Model</Label>
                <Select defaultValue="gpt-4">
                  <SelectTrigger id="llm-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-2">Claude 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-temperature">Temperature</Label>
                <Input 
                  id="llm-temperature" 
                  type="number" 
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Values between 0-1. Lower values produce more consistent outputs, higher values produce more creative outputs.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-max-tokens">Max Output Tokens</Label>
                <Input 
                  id="llm-max-tokens" 
                  type="number" 
                  min="100"
                  defaultValue="2000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum number of tokens the model should generate in its response.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Global Settings
          </CardTitle>
          <CardDescription>
            Configure global settings for the alert system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost-threshold">Cost Alert Threshold ($)</Label>
              <Input 
                id="cost-threshold" 
                type="number" 
                defaultValue="50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention-period">Data Retention Period (days)</Label>
              <Input 
                id="retention-period" 
                type="number" 
                defaultValue="90"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-alerts">Maximum Active Alerts</Label>
              <Input 
                id="max-alerts" 
                type="number" 
                defaultValue="100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="system-name">System Name</Label>
            <Input 
              id="system-name" 
              defaultValue="Alert Insights Dashboard"
            />
          </div>
          
          <div className="flex justify-end">
            <Button className="flex items-center gap-2" onClick={handleSaveSettings}>
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
