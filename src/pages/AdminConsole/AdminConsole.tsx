
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  companyName: string;
  timezone: string;
  industry: string;
  companySize: string;
  adminName: string;
  adminEmail: string;
}

interface AdminConsoleProps {
  onLogout: () => void;
}

const AdminConsole: React.FC<AdminConsoleProps> = ({ onLogout }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      companyName: 'Tech Corp Inc.',
      timezone: 'EST',
      industry: 'Technology',
      companySize: '51-200',
      adminName: 'John Doe',
      adminEmail: 'john@techcorp.com'
    },
    {
      id: '2',
      companyName: 'Finance Solutions Ltd.',
      timezone: 'PST',
      industry: 'Finance',
      companySize: '201-1000',
      adminName: 'Jane Smith',
      adminEmail: 'jane@financesolutions.com'
    }
  ]);

  const handleAddNewClient = () => {
    navigate('/admin-console/client-onboarding/new');
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/admin-console/client-onboarding/edit/${clientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              BI
            </div>
            <h1 className="text-xl font-semibold">Admin Console</h1>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Client Management</h2>
              <p className="text-muted-foreground">Manage all your clients and their onboarding</p>
            </div>
            <Button onClick={handleAddNewClient}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{client.companyName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{client.industry}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClient(client.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Company Size</p>
                  <p className="text-sm">{client.companySize} employees</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Timezone</p>
                  <p className="text-sm">{client.timezone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin Contact</p>
                  <p className="text-sm">{client.adminName}</p>
                  <p className="text-sm text-muted-foreground">{client.adminEmail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first client.</p>
            <Button onClick={handleAddNewClient}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsole;
