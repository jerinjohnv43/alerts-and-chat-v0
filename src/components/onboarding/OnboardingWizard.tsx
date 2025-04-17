
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  Database, 
  Zap, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Fingerprint
} from 'lucide-react';

export interface OnboardingWizardProps {
  onComplete?: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    domain: '',
    industry: '',
    size: '',
  });
  
  const [fabricConnection, setFabricConnection] = useState({
    workspaceName: '',
    apiKey: '',
    endpoint: '',
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Onboarding Complete",
      description: "Your Alert Insights platform is now set up and ready to use.",
    });
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };

  const handleFabricConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFabricConnection({
      ...fabricConnection,
      [name]: value,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-heading mb-2">Welcome to Alert Insights</h1>
        <p className="text-muted-foreground">Let's get your company set up with our Microsoft Fabric integration.</p>
      </div>
      
      <div className="mb-8">
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Getting Started</span>
          <span>Complete</span>
        </div>
      </div>
      
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            {currentStep === 1 && <Building2 className="h-5 w-5" />}
            {currentStep === 2 && <Users className="h-5 w-5" />}
            {currentStep === 3 && <Database className="h-5 w-5" />}
            {currentStep === 4 && <Zap className="h-5 w-5" />}
            {currentStep === 5 && <CheckCircle2 className="h-5 w-5" />}
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          </div>
          <CardTitle>
            {currentStep === 1 && "Company Information"}
            {currentStep === 2 && "Admin Account Setup"}
            {currentStep === 3 && "Microsoft Fabric Connection"}
            {currentStep === 4 && "Notification Preferences"}
            {currentStep === 5 && "Review & Complete"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your company to customize your experience"}
            {currentStep === 2 && "Create the main administrator account"}
            {currentStep === 3 && "Connect to your Microsoft Fabric workspace"}
            {currentStep === 4 && "Configure how you want to receive alert notifications"}
            {currentStep === 5 && "Review your information and complete the setup"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    name="name"
                    placeholder="Acme Corporation" 
                    value={companyInfo.name}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-domain">Company Domain</Label>
                  <Input 
                    id="company-domain" 
                    name="domain"
                    placeholder="acme.com" 
                    value={companyInfo.domain}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-industry">Industry</Label>
                  <Input 
                    id="company-industry" 
                    name="industry"
                    placeholder="Technology" 
                    value={companyInfo.industry}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Input 
                    id="company-size" 
                    name="size"
                    placeholder="100-500 employees" 
                    value={companyInfo.size}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Admin Name</Label>
                  <Input id="admin-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@acme.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Create Password</Label>
                <Input id="admin-password" type="password" />
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 10 characters with uppercase, lowercase, number and special character.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password-confirm">Confirm Password</Label>
                <Input id="admin-password-confirm" type="password" />
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Fingerprint className="text-muted-foreground h-5 w-5" />
                <p className="text-sm text-muted-foreground">
                  You'll be able to enable Single Sign-On with Microsoft Entra ID after setup.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="fabric-workspace">Microsoft Fabric Workspace Name</Label>
                <Input 
                  id="fabric-workspace" 
                  name="workspaceName"
                  placeholder="My Analytics Workspace" 
                  value={fabricConnection.workspaceName}
                  onChange={handleFabricConnectionChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric-api-key">Fabric API Key</Label>
                <Input 
                  id="fabric-api-key" 
                  name="apiKey"
                  type="password" 
                  placeholder="Enter your Fabric API key"
                  value={fabricConnection.apiKey}
                  onChange={handleFabricConnectionChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can find this in your Microsoft Fabric workspace settings.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabric-endpoint">API Endpoint</Label>
                <Input 
                  id="fabric-endpoint" 
                  name="endpoint"
                  placeholder="https://api.fabric.microsoft.com/v1" 
                  value={fabricConnection.endpoint}
                  onChange={handleFabricConnectionChange}
                />
              </div>
              <div className="rounded-md bg-primary-50 p-4 border border-primary-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Database className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-primary-800">Connection Information</h3>
                    <div className="mt-2 text-sm text-primary-700">
                      <p>
                        Your connection details are encrypted and securely stored. We'll validate this connection before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-4 animate-slide-up">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="email">Email Alerts</TabsTrigger>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                  <TabsTrigger value="teams">MS Teams</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-email">Default Alert Email</Label>
                    <Input id="alert-email" type="email" placeholder="alerts@acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-frequency">Default Frequency</Label>
                    <Input id="email-frequency" placeholder="Immediate" />
                  </div>
                </TabsContent>
                <TabsContent value="webhooks" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://acme.com/api/alerts" />
                  </div>
                </TabsContent>
                <TabsContent value="teams" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teams-webhook">MS Teams Webhook</Label>
                    <Input id="teams-webhook" placeholder="https://outlook.office.com/webhook/..." />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {currentStep === 5 && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="font-semibold">Company Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Company Name</p>
                  <p className="font-medium">{companyInfo.name || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Company Domain</p>
                  <p className="font-medium">{companyInfo.domain || "Not provided"}</p>
                </div>
              </div>
              
              <h3 className="font-semibold">Microsoft Fabric Connection</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Workspace</p>
                  <p className="font-medium">{fabricConnection.workspaceName || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">API Endpoint</p>
                  <p className="font-medium">{fabricConnection.endpoint || "Not provided"}</p>
                </div>
              </div>
              
              <div className="rounded-md bg-success-50 p-4 border border-success-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-success-800">Ready to complete setup</h3>
                    <div className="mt-2 text-sm text-success-700">
                      <p>
                        Your Alert Insights platform is ready to be provisioned. Click Complete Setup to continue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className={currentStep === totalSteps ? "bg-success hover:bg-success-600" : ""}
          >
            {currentStep === totalSteps ? "Complete Setup" : "Continue"}
            {currentStep !== totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
