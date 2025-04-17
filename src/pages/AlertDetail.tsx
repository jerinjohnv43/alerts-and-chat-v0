
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign,
  AlertTriangle, 
  BarChart2, 
  Mail,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Plus,
  AlertCircle,
  MessageSquare,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { alerts, alertHistory, users } from '@/data/mockData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { Alert, NotificationType } from '@/types/alerts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AlertDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const alert = alerts.find(a => a.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlert, setEditedAlert] = useState<Alert | null>(alert || null);
  const [activeNotificationTab, setActiveNotificationTab] = useState<NotificationType>('email');
  
  if (!alert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Alert Not Found</h2>
          <p className="mb-4 text-muted-foreground">The alert you're looking for doesn't exist.</p>
          <Link to="/alerts" className="text-blue-600 hover:underline">
            Back to Alerts
          </Link>
        </div>
      </div>
    );
  }
  
  const history = alertHistory.filter(h => h.alertId === alert.id);
  
  // Get recipient emails from the new structure
  const emailRecipients = alert.recipients.email || [];
  
  // Find users that match the email recipients
  const alertRecipientUsers = users.filter(user => 
    emailRecipients.includes(user.email)
  );
  
  const handleToggleActive = () => {
    toast({
      title: `Alert ${!alert.active ? 'activated' : 'deactivated'}`,
      description: `"${alert.name}" has been ${!alert.active ? 'activated' : 'deactivated'}.`,
    });
  };
  
  const handleSaveEdit = () => {
    if (editedAlert) {
      setIsEditing(false);
      toast({
        title: "Alert updated",
        description: "The alert has been successfully updated.",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setEditedAlert(alert);
    setIsEditing(false);
  };
  
  const handleDeleteConfirm = () => {
    toast({
      title: "Alert deleted",
      description: `"${alert.name}" has been deleted.`,
      variant: "destructive"
    });
  };
  
  // Sample data for charts
  const triggerHistoryData = [
    { date: '2023-04-08', triggers: 0, cost: 0 },
    { date: '2023-04-09', triggers: 1, cost: 0.27 },
    { date: '2023-04-10', triggers: 0, cost: 0 },
    { date: '2023-04-11', triggers: 0, cost: 0 },
    { date: '2023-04-12', triggers: 2, cost: 0.54 },
    { date: '2023-04-13', triggers: 1, cost: 0.27 },
    { date: '2023-04-14', triggers: 1, cost: 0.27 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/alerts" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
            {alert.name}
            <Badge 
              className={cn(
                alert.active 
                  ? "bg-alert-active text-white" 
                  : "bg-alert-inactive text-white"
              )}
            >
              {alert.active ? "Active" : "Inactive"}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            {alert.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Card className="w-full md:w-[calc(67%-0.5rem)]">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Alert Details</span>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Alert</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this alert? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteConfirm}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-name">Alert Name</Label>
                    <Input 
                      id="alert-name"
                      defaultValue={editedAlert?.name}
                      onChange={(e) => {
                        if (editedAlert) {
                          setEditedAlert({...editedAlert, name: e.target.value})
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report">Power BI Report</Label>
                    <Input 
                      id="report" 
                      value={editedAlert?.reportName} 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      defaultValue={editedAlert?.description}
                      onChange={(e) => {
                        if (editedAlert) {
                          setEditedAlert({...editedAlert, description: e.target.value})
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active-toggle">Alert Status</Label>
                      <Switch 
                        id="active-toggle"
                        checked={editedAlert?.active}
                        onCheckedChange={(checked) => {
                          if (editedAlert) {
                            setEditedAlert({...editedAlert, active: checked})
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {editedAlert?.active ? 'Alert is active and will trigger based on conditions.' : 'Alert is inactive and will not trigger.'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Tabs value={activeNotificationTab} onValueChange={(value) => setActiveNotificationTab(value as NotificationType)}>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Recipients</Label>
                      <TabsList>
                        <TabsTrigger value="email" className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </TabsTrigger>
                        <TabsTrigger value="whatsapp" className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          WhatsApp
                        </TabsTrigger>
                        <TabsTrigger value="teams" className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Teams
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="email">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editedAlert?.recipients.email?.map((email, i) => (
                          <Badge key={i} variant="secondary" className="flex gap-1 items-center">
                            {email}
                            <button className="ml-1 rounded-full w-4 h-4 bg-gray-300 flex items-center justify-center"
                              onClick={() => {
                                if (editedAlert && editedAlert.recipients.email) {
                                  const newEmails = [...editedAlert.recipients.email];
                                  newEmails.splice(i, 1);
                                  setEditedAlert({
                                    ...editedAlert, 
                                    recipients: {
                                      ...editedAlert.recipients,
                                      email: newEmails
                                    }
                                  });
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add new recipient email" 
                          className="max-w-xs"
                          id="new-email-recipient"
                        />
                        <Button variant="outline" size="sm" type="button">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="whatsapp">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editedAlert?.recipients.whatsapp?.map((number, i) => (
                          <Badge key={i} variant="secondary" className="flex gap-1 items-center">
                            {number}
                            <button className="ml-1 rounded-full w-4 h-4 bg-gray-300 flex items-center justify-center"
                              onClick={() => {
                                if (editedAlert && editedAlert.recipients.whatsapp) {
                                  const newNumbers = [...editedAlert.recipients.whatsapp];
                                  newNumbers.splice(i, 1);
                                  setEditedAlert({
                                    ...editedAlert, 
                                    recipients: {
                                      ...editedAlert.recipients,
                                      whatsapp: newNumbers
                                    }
                                  });
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add WhatsApp number (with country code)" 
                          className="max-w-xs"
                          id="new-whatsapp-recipient"
                        />
                        <Button variant="outline" size="sm" type="button">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="teams">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editedAlert?.recipients.teams?.map((userId, i) => (
                          <Badge key={i} variant="secondary" className="flex gap-1 items-center">
                            {users.find(u => u.id === userId)?.name || userId}
                            <button className="ml-1 rounded-full w-4 h-4 bg-gray-300 flex items-center justify-center"
                              onClick={() => {
                                if (editedAlert && editedAlert.recipients.teams) {
                                  const newTeamsUsers = [...editedAlert.recipients.teams];
                                  newTeamsUsers.splice(i, 1);
                                  setEditedAlert({
                                    ...editedAlert, 
                                    recipients: {
                                      ...editedAlert.recipients,
                                      teams: newTeamsUsers
                                    }
                                  });
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add Teams user" 
                          className="max-w-xs"
                          id="new-teams-recipient"
                        />
                        <Button variant="outline" size="sm" type="button">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Report</div>
                    <div>{alert.reportName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-white ${
                        alert.status === 'success' ? 'bg-green-500' : 
                        alert.status === 'failed' ? 'bg-red-500' : 
                        alert.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {alert.status}
                      </Badge>
                      <Switch 
                        checked={alert.active}
                        onCheckedChange={handleToggleActive}
                        aria-label={alert.active ? "Deactivate alert" : "Activate alert"}
                      />
                      <span className="text-sm text-muted-foreground">
                        {alert.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Created At</div>
                    <div>{new Date(alert.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Last Updated</div>
                    <div>{new Date(alert.updatedAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Last Triggered</div>
                    <div>
                      {alert.lastTriggered ? new Date(alert.lastTriggered).toLocaleString() : 'Never triggered'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Notification Channels</div>
                    <div className="flex gap-2">
                      {alert.recipients.email && alert.recipients.email.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email ({alert.recipients.email.length})
                        </Badge>
                      )}
                      {alert.recipients.whatsapp && alert.recipients.whatsapp.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          WhatsApp ({alert.recipients.whatsapp.length})
                        </Badge>
                      )}
                      {alert.recipients.teams && alert.recipients.teams.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Teams ({alert.recipients.teams.length})
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Alert Metrics</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-center mb-1">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">{alert.triggerCount}</div>
                      <div className="text-xs text-muted-foreground">Total Triggers</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-center mb-1">
                        <DollarSign className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">${alert.cost.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-center mb-1">
                        <BarChart2 className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold">{alert.successRate}%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-center mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="text-2xl font-bold">{alert.failureCount}</div>
                      <div className="text-xs text-muted-foreground">Failures</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-[calc(33%-0.5rem)]">
          <CardHeader>
            <CardTitle>Alert Recipients</CardTitle>
            <CardDescription>Users receiving this alert</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {alertRecipientUsers.length > 0 ? (
              <div className="space-y-4">
                {alertRecipientUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Recipient
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-70" />
                <p className="text-muted-foreground">No recipients assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historical Performance</CardTitle>
          <CardDescription>Alert trigger history and costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={triggerHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="triggers"
                  stroke="#3B82F6"
                  activeDot={{ r: 8 }}
                  name="Triggers"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cost"
                  stroke="#10B981"
                  name="Cost ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
          <CardDescription>Recent trigger events and their outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length > 0 ? (
                  history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`text-white ${
                            entry.status === 'success' ? 'bg-green-500' : 
                            entry.status === 'failed' ? 'bg-red-500' : 
                            entry.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.processingTime}s</TableCell>
                      <TableCell>${entry.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        {entry.errorMessage || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No history available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm">
            Export History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlertDetail;
