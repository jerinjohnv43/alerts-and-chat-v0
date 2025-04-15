
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCard } from '@/components/alerts/AlertCard';
import { AlertFilters } from '@/components/alerts/AlertFilters';
import { Alert, AlertFiltersType } from '@/types/alerts';
import { alerts as mockAlerts } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

const Alerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filters, setFilters] = useState<AlertFiltersType>({
    search: "",
    statuses: [],
    active: null,
    sortBy: "name",
    sortOrder: "asc"
  });
  
  const handleToggleActive = (id: string, active: boolean) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === id) {
        return { ...alert, active };
      }
      return alert;
    });
    
    setAlerts(updatedAlerts);
    
    toast({
      title: `Alert ${active ? 'activated' : 'deactivated'}`,
      description: `Alert ID: ${id} has been ${active ? 'activated' : 'deactivated'}.`,
    });
  };
  
  const handleFilterChange = (newFilters: AlertFiltersType) => {
    setFilters(newFilters);
  };
  
  // Apply filters to alerts
  const filteredAlerts = alerts.filter(alert => {
    // Search filter
    if (filters.search && !alert.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !alert.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(alert.status)) {
      return false;
    }
    
    // Active filter
    if (filters.active !== null && alert.active !== filters.active) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected field
    const sortBy = filters.sortBy || 'name';
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name) * order;
    } else {
      return ((a[sortBy as keyof Alert] as number) - (b[sortBy as keyof Alert] as number)) * order;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alerts</h1>
          <p className="text-muted-foreground">
            Manage and monitor your Power BI alerts.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </div>
      
      <AlertFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {filteredAlerts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAlerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">No alerts found</h3>
          <p className="text-muted-foreground mb-4">
            There are no alerts matching your current filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setFilters({
              search: "",
              statuses: [],
              active: null,
              sortBy: "name",
              sortOrder: "asc"
            })}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Alerts;
