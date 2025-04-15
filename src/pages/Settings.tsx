
import React from 'react';
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
import { 
  Bell,
  ShieldAlert,
  Mail,
  Heading1,
  Save,
  Sliders,
  FileKey
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  
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
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Template
              </CardTitle>
              <CardDescription>
                Customize the email templates used for notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input 
                  id="email-subject" 
                  defaultValue="[Alert] {{alert_name}} has been triggered"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-template">Email Template</Label>
                <Textarea 
                  id="email-template" 
                  className="min-h-[150px]" 
                  defaultValue={`Dear {{recipient_name}},

An alert has been triggered for the following report:
Name: {{alert_name}}
Report: {{report_name}}
Time: {{trigger_time}}

LLM Insights:
{{llm_insights}}

Click the link below to view the report:
{{report_url}}

Regards,
Alert Insights Team`}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Available variables: &#123;&#123;alert_name&#125;&#125;, &#123;&#123;report_name&#125;&#125;, &#123;&#123;trigger_time&#125;&#125;, &#123;&#123;recipient_name&#125;&#125;, &#123;&#123;llm_insights&#125;&#125;, &#123;&#123;report_url&#125;&#125;
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileKey className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure Power BI and LLM API settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="power-bi-api-key">Power BI API Key</Label>
                <Input 
                  id="power-bi-api-key" 
                  type="password" 
                  defaultValue="••••••••••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-provider">LLM Provider</Label>
                <Select defaultValue="openai">
                  <SelectTrigger id="llm-provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="azure">Azure OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-api-key">LLM API Key</Label>
                <Input 
                  id="llm-api-key" 
                  type="password" 
                  defaultValue="••••••••••••••••"
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
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-2">Claude 2</SelectItem>
                  </SelectContent>
                </Select>
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
