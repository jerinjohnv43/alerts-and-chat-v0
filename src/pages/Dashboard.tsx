
import React from 'react';
import { 
  AlertCircle,
  Activity,
  DollarSign,
  Clock,
  BarChart2,
  Bell,
} from 'lucide-react';
import { MetricsCard } from '@/components/charts/MetricsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCard } from '@/components/alerts/AlertCard';
import { alerts, alertMetrics } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const triggerData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 6 },
  { name: 'Wed', value: 8 },
  { name: 'Thu', value: 12 },
  { name: 'Fri', value: 5 },
  { name: 'Sat', value: 2 },
  { name: 'Sun', value: 3 }
];

const costData = [
  { name: 'Mon', value: 0.54 },
  { name: 'Tue', value: 1.08 },
  { name: 'Wed', value: 1.62 },
  { name: 'Thu', value: 2.43 },
  { name: 'Fri', value: 1.35 },
  { name: 'Sat', value: 0.54 },
  { name: 'Sun', value: 0.27 }
];

const Dashboard = () => {
  const { toast } = useToast();
  
  const handleToggleActive = (id: string, active: boolean) => {
    toast({
      title: `Alert ${active ? 'activated' : 'deactivated'}`,
      description: `Alert ID: ${id} has been ${active ? 'activated' : 'deactivated'}.`,
    });
  };
  
  const recentAlerts = alerts
    .filter(alert => alert.lastTriggered !== null)
    .sort((a, b) => {
      const dateA = a.lastTriggered ? new Date(a.lastTriggered).getTime() : 0;
      const dateB = b.lastTriggered ? new Date(b.lastTriggered).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Power BI alerts activity and metrics.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Alerts"
          value={alertMetrics.totalAlerts}
          icon={<Bell />}
          change={15}
          trend="up"
        />
        <MetricsCard
          title="Active Alerts"
          value={alertMetrics.activeAlerts}
          icon={<AlertCircle />}
          change={5}
          trend="up"
        />
        <MetricsCard
          title="Triggers This Month"
          value={alertMetrics.totalTriggers}
          icon={<Activity />}
          change={22}
          trend="up"
        />
        <MetricsCard
          title="Total Cost"
          value={`$${alertMetrics.totalCost.toFixed(2)}`}
          icon={<DollarSign />}
          change={12}
          trend="up"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Alert Triggers (Last 7 Days)</CardTitle>
            <CardDescription>Number of alert triggers per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={triggerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Processing Costs (Last 7 Days)</CardTitle>
            <CardDescription>Daily LLM processing costs in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Alert Success Rate</CardTitle>
            <CardDescription>Overall success rate of alert processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Success rate</p>
                  <p className="text-sm text-muted-foreground">
                    {alertMetrics.averageSuccessRate.toFixed(0)}% successful alert processing
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {alertMetrics.averageSuccessRate.toFixed(0)}%
                </div>
              </div>
              <Progress value={alertMetrics.averageSuccessRate} className="h-2" />
              
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Screenshot Capture</div>
                  <div className="text-sm text-muted-foreground">98%</div>
                </div>
                <Progress value={98} className="h-1.5" />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">LLM Analysis</div>
                  <div className="text-sm text-muted-foreground">92%</div>
                </div>
                <Progress value={92} className="h-1.5" />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">Notification Delivery</div>
                  <div className="text-sm text-muted-foreground">99%</div>
                </div>
                <Progress value={99} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Alert Activity</CardTitle>
            <CardDescription>Recently triggered alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.length > 0 ? (
                recentAlerts.map(alert => (
                  <div key={alert.id} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.lastTriggered!).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === 'success' ? 'bg-green-100 text-green-800' : 
                      alert.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      alert.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Alerts</h2>
          <a href="/alerts" className="text-blue-600 hover:underline text-sm">
            View all alerts
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.slice(0, 3).map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
