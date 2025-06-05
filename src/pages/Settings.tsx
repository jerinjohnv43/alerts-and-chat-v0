
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [showSecrets, setShowSecrets] = useState({
    clientSecret: false,
    apiKey: false
  });

  const [settings, setSettings] = useState({
    // API Configuration
    apiKey: '',
    apiEndpoint: 'https://api.aitell.com/v1',
    
    // Power BI Connection Settings
    powerBiAppId: '',
    powerBiClientId: '',
    powerBiClientSecret: '',
    
    // Teams Integration
    teamsEnabled: false,
    teamsWebhookUrl: '',
    
    // WhatsApp Integration
    whatsappEnabled: false,
    whatsappApiKey: '',
    whatsappPhoneNumber: '',
    
    // Email Templates
    alertEmailTemplate: 'Dear {{user}},\n\nAn alert has been triggered: {{alertName}}\n\nDetails: {{alertDetails}}\n\nBest regards,\nAI Tell Team',
    notificationEmailTemplate: 'Hello {{user}},\n\nYou have a new notification: {{message}}\n\nBest regards,\nAI Tell Team',
    
    // Global Settings
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    maxAlertsPerUser: 50,
    alertRetentionDays: 90
  });

  const handleSave = () => {
    localStorage.setItem('aiTellSettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully saved."
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your AI Tell application settings</p>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={settings.apiEndpoint}
                  onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                  placeholder="https://api.aitell.com/v1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showSecrets.apiKey ? "text" : "password"}
                    value={settings.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => toggleSecretVisibility('apiKey')}
                  >
                    {showSecrets.apiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Power BI Connection Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Power BI Connection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="powerBiAppId">App ID</Label>
                <Input
                  id="powerBiAppId"
                  value={settings.powerBiAppId}
                  onChange={(e) => handleInputChange('powerBiAppId', e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="powerBiClientId">Client ID</Label>
                <Input
                  id="powerBiClientId"
                  value={settings.powerBiClientId}
                  onChange={(e) => handleInputChange('powerBiClientId', e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="powerBiClientSecret">Client Secret</Label>
                <div className="relative">
                  <Input
                    id="powerBiClientSecret"
                    type={showSecrets.clientSecret ? "text" : "password"}
                    value={settings.powerBiClientSecret}
                    onChange={(e) => handleInputChange('powerBiClientSecret', e.target.value)}
                    placeholder="Enter client secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => toggleSecretVisibility('clientSecret')}
                  >
                    {showSecrets.clientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Teams Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="teamsEnabled"
                checked={settings.teamsEnabled}
                onCheckedChange={(checked) => handleInputChange('teamsEnabled', checked)}
              />
              <Label htmlFor="teamsEnabled">Enable Teams Integration</Label>
            </div>
            {settings.teamsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="teamsWebhookUrl">Teams Webhook URL</Label>
                <Input
                  id="teamsWebhookUrl"
                  value={settings.teamsWebhookUrl}
                  onChange={(e) => handleInputChange('teamsWebhookUrl', e.target.value)}
                  placeholder="https://your-teams-webhook-url"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Integration */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="whatsappEnabled"
                checked={settings.whatsappEnabled}
                onCheckedChange={(checked) => handleInputChange('whatsappEnabled', checked)}
              />
              <Label htmlFor="whatsappEnabled">Enable WhatsApp Integration</Label>
            </div>
            {settings.whatsappEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappApiKey">WhatsApp API Key</Label>
                  <Input
                    id="whatsappApiKey"
                    type="password"
                    value={settings.whatsappApiKey}
                    onChange={(e) => handleInputChange('whatsappApiKey', e.target.value)}
                    placeholder="Enter WhatsApp API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappPhoneNumber">Phone Number</Label>
                  <Input
                    id="whatsappPhoneNumber"
                    value={settings.whatsappPhoneNumber}
                    onChange={(e) => handleInputChange('whatsappPhoneNumber', e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alertEmailTemplate">Alert Email Template</Label>
              <Textarea
                id="alertEmailTemplate"
                value={settings.alertEmailTemplate}
                onChange={(e) => handleInputChange('alertEmailTemplate', e.target.value)}
                placeholder="Enter alert email template"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Available variables: {'{'}{'}'}{'{'}user{'}'}, {'{'}alertName{'}'}, {'{'}alertDetails{'}'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationEmailTemplate">Notification Email Template</Label>
              <Textarea
                id="notificationEmailTemplate"
                value={settings.notificationEmailTemplate}
                onChange={(e) => handleInputChange('notificationEmailTemplate', e.target.value)}
                placeholder="Enter notification email template"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Available variables: {'{'}user{'}'}, {'{'}message{'}'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  placeholder="UTC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Input
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAlertsPerUser">Max Alerts Per User</Label>
                <Input
                  id="maxAlertsPerUser"
                  type="number"
                  value={settings.maxAlertsPerUser}
                  onChange={(e) => handleInputChange('maxAlertsPerUser', parseInt(e.target.value))}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alertRetentionDays">Alert Retention (Days)</Label>
                <Input
                  id="alertRetentionDays"
                  type="number"
                  value={settings.alertRetentionDays}
                  onChange={(e) => handleInputChange('alertRetentionDays', parseInt(e.target.value))}
                  placeholder="90"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
