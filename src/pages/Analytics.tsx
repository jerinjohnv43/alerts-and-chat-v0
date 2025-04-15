import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  AlertTriangle,
  BarChart2,
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MetricsCard } from '@/components/charts/MetricsCard';

// Sample data for charts
const triggersByReport = [
  { name: 'Sales Performance', value: 12 },
  { name: 'Marketing ROI', value: 3 },
  { name: 'Customer Acquisition', value: 5 },
  { name: 'Inventory Management', value: 8 },
  { name: 'Financial Dashboard', value: 1 },
];

const costByReport = [
  { name: 'Sales Performance', value: 3.24 },
  { name: 'Marketing ROI', value: 0.81 },
  { name: 'Customer Acquisition', value: 1.35 },
  { name: 'Inventory Management', value: 2.16 },
  { name: 'Financial Dashboard', value: 0.27 },
];

const alertTrendsData = [
  { date: '2023-04-01', triggers: 0, cost: 0 },
  { date: '2023-04-02', triggers: 1, cost: 0.27 },
  { date: '2023-04-03', triggers: 2, cost: 0.54 },
  { date: '2023-04-04', triggers: 1, cost: 0.27 },
  { date: '2023-04-05', triggers: 0, cost: 0 },
  { date: '2023-04-06', triggers: 3, cost: 0.81 },
  { date: '2023-04-07', triggers: 2, cost: 0.54 },
  { date: '2023-04-08', triggers: 4, cost: 1.08 },
  { date: '2023-04-09', triggers: 3, cost: 0.81 },
  { date: '2023-04-10', triggers: 2, cost: 0.54 },
  { date: '2023-04-11', triggers: 1, cost: 0.27 },
  { date: '2023-04-12', triggers: 4, cost: 1.08 },
  { date: '2023-04-13', triggers: 2, cost: 0.54 },
  { date: '2023-04-14', triggers: 4, cost: 1.08 },
];

const statusDistributionData = [
  { name: 'Success', value: 22, color: '#10B981' },
  { name: 'Failed', value: 3, color: '#EF4444' },
  { name: 'Warning', value: 2, color: '#F59E0B' },
  { name: 'Pending', value: 2, color: '#3B82F6' },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(2023, 3, 1), // April 1, 2023
    to: new Date(2023, 3, 14), // April 14, 2023
  });
  const [timeFrame, setTimeFrame] = useState('14days');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Analyze alert performance and cost metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange(range);
                    setTimeFrame('custom');
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Select
            value={timeFrame}
            onValueChange={(value) => {
              setTimeFrame(value);
              
              const today = new Date();
              let from: Date;
              
              switch(value) {
                case '7days':
                  from = new Date(today);
                  from.setDate(from.getDate() - 7);
                  setDateRange({ from, to: today });
                  break;
                case '14days':
                  from = new Date(today);
                  from.setDate(from.getDate() - 14);
                  setDateRange({ from, to: today });
                  break;
                case '30days':
                  from = new Date(today);
                  from.setDate(from.getDate() - 30);
                  setDateRange({ from, to: today });
                  break;
                case '90days':
                  from = new Date(today);
                  from.setDate(from.getDate() - 90);
                  setDateRange({ from, to: today });
                  break;
                default:
                  // Keep current range for 'custom'
              }
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="14days">Last 14 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Schedule Reports
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Alerts Triggered"
          value="29"
          icon={<AlertTriangle className="h-4 w-4" />}
          change={12}
          trend="up"
        />
        <MetricsCard
          title="Average Triggers Per Day"
          value="2.1"
          icon={<BarChart2 className="h-4 w-4" />}
          change={8}
          trend="up"
        />
        <MetricsCard
          title="Total Cost"
          value="$7.83"
          icon={<DollarSign className="h-4 w-4" />}
          change={15}
          trend="up"
        />
        <MetricsCard
          title="Average Cost Per Alert"
          value="$0.27"
          icon={<DollarSign className="h-4 w-4" />}
          change={2}
          trend="up"
        />
      </div>
      
      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Alert Trends</TabsTrigger>
          <TabsTrigger value="reports">Report Analysis</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Trigger Trends</CardTitle>
              <CardDescription>Alert triggers and costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alertTrendsData}>
                    <defs>
                      <linearGradient id="colorTriggers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => format(new Date(value), "MMM dd")}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'triggers') return [`${value} triggers`, 'Triggers'];
                        if (name === 'cost') return [`$${Number(value).toFixed(2)}`, 'Cost'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => format(new Date(label), "MMM dd, yyyy")}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="triggers"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorTriggers)"
                      name="Triggers"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      stroke="#10B981"
                      fillOpacity={0}
                      name="Cost ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>Peak: 4 triggers on April 8, 12, 14</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-orange-500" />
                  <span>Low: 0 triggers on April 1, 5</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Trigger Distribution</CardTitle>
                <CardDescription>Alert triggers by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { hour: '9am', count: 2 },
                        { hour: '10am', count: 1 },
                        { hour: '11am', count: 3 },
                        { hour: '12pm', count: 0 },
                        { hour: '1pm', count: 1 },
                        { hour: '2pm', count: 2 },
                        { hour: '3pm', count: 3 },
                        { hour: '4pm', count: 8 },
                        { hour: '5pm', count: 5 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Triggers" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Peak trigger activity at 4pm (27.6% of all triggers)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Day of Week Analysis</CardTitle>
                <CardDescription>Alert frequency by weekday</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { day: 'Mon', count: 4 },
                        { day: 'Tue', count: 6 },
                        { day: 'Wed', count: 5 },
                        { day: 'Thu', count: 8 },
                        { day: 'Fri', count: 5 },
                        { day: 'Sat', count: 1 },
                        { day: 'Sun', count: 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Triggers" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Thursday has the highest alert activity (27.6%)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Triggers by Report</CardTitle>
                <CardDescription>Number of alert triggers per Power BI report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={triggersByReport} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        name="Triggers" 
                        fill="#3B82F6" 
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost by Report</CardTitle>
                <CardDescription>Total processing cost per Power BI report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costByReport} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Cost" 
                        fill="#10B981" 
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Report Performance Analysis</CardTitle>
                <CardDescription>Success rate and processing time by report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Sales Performance', successRate: 95, avgProcessingTime: 1.3, cost: 3.24, triggers: 12 },
                        { name: 'Marketing ROI', successRate: 100, avgProcessingTime: 1.2, cost: 0.81, triggers: 3 },
                        { name: 'Customer Acquisition', successRate: 60, avgProcessingTime: 1.6, cost: 1.35, triggers: 5 },
                        { name: 'Inventory Management', successRate: 87.5, avgProcessingTime: 1.4, cost: 2.16, triggers: 8 },
                        { name: 'Financial Dashboard', successRate: 100, avgProcessingTime: 1.1, cost: 0.27, triggers: 1 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value}
                      />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey="successRate" 
                        name="Success Rate (%)" 
                        fill="#10B981" 
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="avgProcessingTime" 
                        name="Avg. Processing Time (s)" 
                        fill="#3B82F6" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="status">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alert Status Distribution</CardTitle>
                <CardDescription>Distribution of alert processing outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
                <CardDescription>Breakdown of alert processing errors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { error: 'LLM Service Unavailable', count: 2 },
                        { error: 'Report Unavailable', count: 1 },
                        { error: 'Timeout', count: 1 },
                        { error: 'API Key Invalid', count: 1 },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="error" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="count" name="Occurrences" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <h4 className="text-sm font-medium">Most Common Errors</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <span className="font-medium">LLM Service Unavailable</span>
                        <p className="text-muted-foreground text-xs">
                          Unable to connect to the language model API for insights generation.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Report Unavailable</span>
                        <p className="text-muted-foreground text-xs">
                          The Power BI report could not be accessed at the time of alert processing.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User-Based Alert Performance</CardTitle>
                <CardDescription>Success rates for alerts by user role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { role: 'Admin', success: 97, warning: 2, failure: 1 },
                        { role: 'Manager', success: 90, warning: 5, failure: 5 },
                        { role: 'Analyst', success: 85, warning: 10, failure: 5 },
                        { role: 'Executive', success: 92, warning: 8, failure: 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="success" name="Success" stackId="a" fill="#10B981" />
                      <Bar dataKey="warning" name="Warning" stackId="a" fill="#F59E0B" />
                      <Bar dataKey="failure" name="Failure" stackId="a" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-center mt-2">
                  Admin users have the highest alert success rate at 97%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
