import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogOut, ArrowLeft, Brain } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';

interface ClientOnboardingProps {
  onLogout: () => void;
}

const ClientOnboarding: React.FC<ClientOnboardingProps> = ({ onLogout }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clientId } = useParams();
  const isEdit = Boolean(clientId);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  
  const [formData, setFormData] = useState({
    // Company Information
    companyName: isEdit ? 'Tech Corp Inc.' : '',
    timezone: isEdit ? 'EST' : '',
    industry: isEdit ? 'technology' : '',
    companySize: isEdit ? '51-200' : '',
    
    // Admin Account
    adminName: isEdit ? 'John Doe' : '',
    adminEmail: isEdit ? 'john@techcorp.com' : '',
    password: '',
    confirmPassword: '',
    
    // Power BI Access
    tenantId: isEdit ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : '',
    clientId: isEdit ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : '',
    clientSecret: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Save to localStorage for client management
    const existingClients = JSON.parse(localStorage.getItem('adminConsoleClients') || '[]');
    const clientData = {
      id: isEdit ? clientId : Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };
    
    const updatedClients = isEdit 
      ? existingClients.map((client: any) => client.id === clientId ? clientData : client)
      : [...existingClients, clientData];
    
    localStorage.setItem('adminConsoleClients', JSON.stringify(updatedClients));
    
    toast({
      title: isEdit ? "Client Updated" : "Client Onboarding Complete",
      description: isEdit ? "Client has been successfully updated" : "Client has been successfully onboarded and can now login",
    });
    
    navigate('/admin-console');
  };

  const handleBack = () => {
    navigate('/admin-console');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <Brain className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold">
                {isEdit ? 'Edit Client' : 'Client Onboarding'}
              </h1>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone *</Label>
                  <Select onValueChange={(value) => handleInputChange('timezone', value)} value={formData.timezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="CST">Central Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={(value) => handleInputChange('industry', value)} value={formData.industry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select onValueChange={(value) => handleInputChange('companySize', value)} value={formData.companySize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name *</Label>
                  <Input
                    id="adminName"
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Power BI Access */}
          <Card>
            <CardHeader>
              <CardTitle>Power BI Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant ID *</Label>
                  <Input
                    id="tenantId"
                    value={formData.tenantId}
                    onChange={(e) => handleInputChange('tenantId', e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID *</Label>
                  <Input
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret *</Label>
                  <div className="relative">
                    <Input
                      id="clientSecret"
                      type={showClientSecret ? "text" : "password"}
                      value={formData.clientSecret}
                      onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                      placeholder="Enter client secret"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowClientSecret(!showClientSecret)}
                    >
                      {showClientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              {isEdit ? 'Update Client' : 'Complete Client Onboarding'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientOnboarding;
