
import React, { useState } from 'react';
import { AlertCard } from '@/components/alerts/AlertCard';
import { AlertFilters } from '@/components/alerts/AlertFilters';
import { mockAlerts } from '@/data/mockData';
import { Alert } from '@/types/alerts';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filters: {
    status: string;
    severity: string;
    dateRange: string;
  }) => {
    let filtered = alerts;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.metric.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    // Apply severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(alert => new Date(alert.createdAt) >= filterDate);
    }

    setFilteredAlerts(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Filter alerts based on search term
    let filtered = alerts;
    
    if (value.trim()) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(value.toLowerCase()) ||
        alert.description.toLowerCase().includes(value.toLowerCase()) ||
        alert.metric.toLowerCase().includes(value.toLowerCase())
      );
    }
    
    setFilteredAlerts(filtered);
  };

  const handleResolveAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    );
    setAlerts(updatedAlerts);
    
    // Re-apply current filters
    const currentFilters = {
      status: 'all',
      severity: 'all', 
      dateRange: 'all'
    };
    handleFilterChange(currentFilters);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Alerts</h1>
        <p className="text-muted-foreground">Monitor and manage your data quality alerts</p>
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
          />
        </div>
      </div>
      
      <AlertFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onResolve={handleResolveAlert}
            />
          ))
        ) : (
          <div className="text-center py-8">
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
