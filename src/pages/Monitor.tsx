
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { alerts, alertHistory } from '@/data/mockData';
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Count alerts by status
const alertsByStatus = {
  success: alerts.filter(a => a.status === 'success').length,
  failed: alerts.filter(a => a.status === 'failed').length,
  warning: alerts.filter(a => a.status === 'warning').length,
  pending: alerts.filter(a => a.status === 'pending').length,
};

const alertStatusData = [
  { name: 'Success', value: alertsByStatus.success, color: '#10B981' },
  { name: 'Failed', value: alertsByStatus.failed, color: '#EF4444' },
  { name: 'Warning', value: alertsByStatus.warning, color: '#F59E0B' },
  { name: 'Pending', value: alertsByStatus.pending, color: '#3B82F6' },
];

// Response time data
const responseTimeData = [
  { time: '09:00', value: 1.2 },
  { time: '10:00', value: 1.3 },
  { time: '11:00', value: 1.5 },
  { time: '12:00', value: 1.7 },
  { time: '13:00', value: 1.4 },
  { time: '14:00', value: 1.2 },
  { time: '15:00', value: 1.3 },
  { time: '16:00', value: 1.4 },
  { time: '17:00', value: 1.2 },
];

// System health data
const systemHealth = {
  powerBiConnection: { status: 'healthy', latency: 120 },
  llmService: { status: 'healthy', latency: 450 },
  notificationService: { status: 'healthy', latency: 80 }
};

const Monitor = () => {
  const lastUpdated = new Date().toLocaleString();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Monitor</h1>
          <p className="text-muted-foreground">
            Monitor the health and performance of your alert system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: {lastUpdated}</span>
          <Button size="sm" variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">System Status</CardTitle>
            <CardDescription>Overall system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-28 h-28 rounded-full border-8 border-green-500 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">All Systems Operational</div>
              <div className="text-sm text-muted-foreground">No issues detected</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alert Processing Status</CardTitle>
            <CardDescription>Status distribution of alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {alertStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Status of integrated services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">Power BI API</div>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">{systemHealth.powerBiConnection.latency}ms latency</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">LLM Service</div>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">{systemHealth.llmService.latency}ms latency</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">Notification Service</div>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">{systemHealth.notificationService.latency}ms latency</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
          <CardDescription>Average alert processing time throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis 
                  label={{ 
                    value: 'Processing Time (seconds)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="errors">Error Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Alert Processing Success Rate</Label>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Average Processing Time</Label>
                    <span className="text-sm font-medium">1.4s</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>LLM Response Time</Label>
                    <span className="text-sm font-medium">450ms</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>API Request Success Rate</Label>
                    <span className="text-sm font-medium">99.8%</span>
                  </div>
                  <Progress value={99.8} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>System Resources</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">CPU Usage</div>
                    <div className="text-2xl font-bold">24%</div>
                    <Progress value={24} className="h-1.5 mt-2" />
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Memory Usage</div>
                    <div className="text-2xl font-bold">42%</div>
                    <Progress value={42} className="h-1.5 mt-2" />
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Storage Usage</div>
                    <div className="text-2xl font-bold">18%</div>
                    <Progress value={18} className="h-1.5 mt-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Summary</CardTitle>
              <CardDescription>Recent system errors and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md border border-red-100">
                  <div className="mt-0.5">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-red-800">Screenshot Capture Failed</div>
                    <div className="text-sm text-red-600 mt-1">
                      Unable to capture screenshot for alert "Customer Churn Rate Spike" due to report unavailable.
                      <span className="block mt-1 text-xs text-muted-foreground">2023-04-10 15:15:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                  <div className="mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium text-yellow-800">Slow LLM Response</div>
                    <div className="text-sm text-yellow-600 mt-1">
                      LLM processing time exceeded threshold (1.5s) for alert "Daily Sales Below Target".
                      <span className="block mt-1 text-xs text-muted-foreground">2023-04-12 16:44:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md border border-red-100">
                  <div className="mt-0.5">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-red-800">LLM Service Unavailable</div>
                    <div className="text-sm text-red-600 mt-1">
                      Unable to process alert "Daily Sales Below Target" due to LLM service unavailable.
                      <span className="block mt-1 text-xs text-muted-foreground">2023-04-10 08:22:15</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">View All Errors</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for consistent labeling
const Label = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm font-medium">{children}</div>
};

export default Monitor;
