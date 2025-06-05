
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCard } from '@/components/alerts/AlertCard';
import { AlertFilters } from '@/components/alerts/AlertFilters';
import { alerts } from '@/data/mockData';
import { Alert, AlertFiltersType } from '@/types/alerts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Alerts: React.FC = () => {
  const [allAlerts, setAllAlerts] = useState<Alert[]>(alerts);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(alerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AlertFiltersType>({
    search: '',
    statuses: [],
    active: null,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const { toast } = useToast();

  // Real-time search functionality
  useEffect(() => {
    let filtered = allAlerts;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(alert => 
        alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.reportName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filters
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(alert => filters.statuses!.includes(alert.status));
    }

    // Apply active filter
    if (filters.active !== null) {
      filtered = filtered.filter(alert => alert.active === filters.active);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[filters.sortBy as keyof Alert];
        let bValue: any = b[filters.sortBy as keyof Alert];
        
        if (filters.sortOrder === 'desc') {
          [aValue, bValue] = [bValue, aValue];
        }
        
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        
        return aValue - bValue;
      });
    }

    setFilteredAlerts(filtered);
  }, [searchTerm, filters, allAlerts]);

  const handleFilterChange = (newFilters: AlertFiltersType) => {
    setFilters(newFilters);
    if (newFilters.search !== undefined) {
      setSearchTerm(newFilters.search);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleToggleActive = (alertId: string, active: boolean) => {
    const updatedAlerts = allAlerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, active }
        : alert
    );
    setAllAlerts(updatedAlerts);
  };

  const handleDeleteAlert = (alertId: string) => {
    const updatedAlerts = allAlerts.filter(alert => alert.id !== alertId);
    setAllAlerts(updatedAlerts);
    toast({
      title: "Alert deleted",
      description: "The alert has been successfully deleted."
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage your data quality alerts</p>
        </div>
        <Link to="/alerts/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alerts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            data-lov-id="src/pages/Alerts.tsx:108:10"
          />
        </div>
      </div>
      
      <AlertFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteAlert}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'No alerts found matching your search.' : 'No alerts found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
