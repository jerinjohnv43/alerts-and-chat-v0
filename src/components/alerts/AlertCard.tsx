
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Clock, 
  DollarSign, 
  BarChart2, 
  PowerOff,
  Trash2
} from 'lucide-react';
import { Alert } from '@/types/alerts';
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlertCardProps {
  alert: Alert;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete?: (id: string) => void;
}

export function AlertCard({ alert, onToggleActive, onDelete }: AlertCardProps) {
  const handleToggle = () => {
    onToggleActive(alert.id, !alert.active);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(alert.id);
    }
  };
  
  return (
    <Card className={cn(
      "h-full transition-all hover:shadow-lg backdrop-blur-sm",
      "bg-white/30 dark:bg-black/20",
      "border-white/20 dark:border-white/10",
      "shadow-lg hover:shadow-xl",
      "glass-card"
    )}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{alert.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Switch 
              checked={alert.active} 
              onCheckedChange={handleToggle}
              aria-label={alert.active ? "Deactivate alert" : "Activate alert"}
            />
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Alert</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{alert.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <CardDescription>{alert.description}</CardDescription>
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center gap-1",
              alert.active 
                ? "border-alert-active text-alert-active bg-blue-50" 
                : "border-alert-inactive text-alert-inactive"
            )}
          >
            {alert.active ? <AlertCircle className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
            {alert.active ? "Active" : "Inactive"}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center gap-1",
              getStatusClass(alert.status)
            )}
          >
            {alert.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={cn(
        "space-y-4",
        "backdrop-blur-sm"
      )}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Triggers: {alert.triggerCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Cost: ${alert.cost.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <span>Success: {alert.successRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span>Failures: {alert.failureCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="backdrop-blur-sm">
        <Link to={`/alerts/edit/${alert.id}`} className="w-full">
          <Button variant="default" className="w-full">
            Edit Alert
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function getStatusClass(status: string) {
  switch(status.toLowerCase()) {
    case 'success':
      return 'border-green-500 text-green-500 bg-green-50';
    case 'failed':
      return 'border-red-500 text-red-500 bg-red-50';
    case 'warning':
      return 'border-yellow-500 text-yellow-500 bg-yellow-50';
    case 'pending':
      return 'border-orange-500 text-orange-500 bg-orange-50';
    default:
      return 'border-gray-500 text-gray-500';
  }
}
