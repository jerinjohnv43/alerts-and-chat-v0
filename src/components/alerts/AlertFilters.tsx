
import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  SlidersHorizontal, 
  X 
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertFiltersType } from '@/types/alerts';

interface AlertFiltersProps {
  filters: AlertFiltersType;
  onFilterChange: (filters: AlertFiltersType) => void;
}

export function AlertFilters({ filters, onFilterChange }: AlertFiltersProps) {
  const handleStatusChange = (status: string, checked: boolean) => {
    const statuses = [...(filters.statuses || [])];
    
    if (checked && !statuses.includes(status)) {
      statuses.push(status);
    } else if (!checked) {
      const index = statuses.indexOf(status);
      if (index !== -1) statuses.splice(index, 1);
    }
    
    onFilterChange({ ...filters, statuses });
  };
  
  const handleActiveChange = (value: string) => {
    let activeFilter: boolean | null = null;
    
    if (value === 'active') activeFilter = true;
    else if (value === 'inactive') activeFilter = false;
    
    onFilterChange({ ...filters, active: activeFilter });
  };
  
  const clearFilters = () => {
    onFilterChange({
      search: "",
      statuses: [],
      active: null,
      sortBy: "name",
      sortOrder: "asc"
    });
  };
  
  const hasActiveFilters = filters.search || 
                           (filters.statuses && filters.statuses.length > 0) ||
                           filters.active !== null;
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-end">
      <div className="flex gap-2">
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm" className="gap-1">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.statuses?.includes('success')}
              onCheckedChange={(checked) => handleStatusChange('success', checked)}
            >
              Success
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.statuses?.includes('failed')}
              onCheckedChange={(checked) => handleStatusChange('failed', checked)}
            >
              Failed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.statuses?.includes('warning')}
              onCheckedChange={(checked) => handleStatusChange('warning', checked)}
            >
              Warning
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.statuses?.includes('pending')}
              onCheckedChange={(checked) => handleStatusChange('pending', checked)}
            >
              Pending
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Alert Status</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={filters.active === true ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleActiveChange('active')}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filters.active === false ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleActiveChange('inactive')}
                  >
                    Inactive
                  </Button>
                  <Button
                    variant={filters.active === null ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleActiveChange('all')}
                  >
                    All
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sort By</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      {getSortLabel(filters.sortBy || 'name')}
                      <SlidersHorizontal className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuCheckboxItem
                      checked={filters.sortBy === 'name'}
                      onCheckedChange={() => onFilterChange({ ...filters, sortBy: 'name' })}
                    >
                      Alert Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.sortBy === 'triggerCount'}
                      onCheckedChange={() => onFilterChange({ ...filters, sortBy: 'triggerCount' })}
                    >
                      Trigger Count
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.sortBy === 'cost'}
                      onCheckedChange={() => onFilterChange({ ...filters, sortBy: 'cost' })}
                    >
                      Cost
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.sortBy === 'successRate'}
                      onCheckedChange={() => onFilterChange({ ...filters, sortBy: 'successRate' })}
                    >
                      Success Rate
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant={filters.sortOrder === 'asc' ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onFilterChange({ ...filters, sortOrder: 'asc' })}
                  >
                    Ascending
                  </Button>
                  <Button
                    variant={filters.sortOrder === 'desc' ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onFilterChange({ ...filters, sortOrder: 'desc' })}
                  >
                    Descending
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function getSortLabel(sortBy: string): string {
  const labels: Record<string, string> = {
    name: 'Alert Name',
    triggerCount: 'Trigger Count',
    cost: 'Cost',
    successRate: 'Success Rate',
  };
  
  return labels[sortBy] || 'Alert Name';
}
