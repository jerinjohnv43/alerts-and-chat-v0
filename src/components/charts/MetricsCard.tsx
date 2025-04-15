
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down';
  className?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  icon, 
  change, 
  trend, 
  className 
}: MetricsCardProps) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={cn(
            "text-xs mt-1 flex items-center",
            trend === 'up' ? "text-success" : trend === 'down' ? "text-destructive" : ""
          )}>
            {trend === 'up' ? <ArrowUp className="mr-1 h-3 w-3" /> : null}
            {trend === 'down' ? <ArrowDown className="mr-1 h-3 w-3" /> : null}
            <span>{Math.abs(change)}% from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
