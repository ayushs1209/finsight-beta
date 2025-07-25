"use client";

import { exportToCsv } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarIcon, Download, SlidersHorizontal } from 'lucide-react';
import type { Transaction } from '@/types';
import type { Filters } from './dashboard';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type FilterToolbarProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  data: Transaction[];
};

export default function FilterToolbar({ filters, setFilters, data }: FilterToolbarProps) {
  const { toast } = useToast();

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status) 
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };
  
  const statuses = ['Completed', 'Pending', 'Failed'];

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        variant: 'destructive',
        title: "Export Error",
        description: "No data to export.",
      });
      return;
    }
    exportToCsv(data, 'filtered-payouts.csv');
    toast({
      title: "Export successful",
      description: `${data.length} rows exported to filtered-payouts.csv`,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Input
        placeholder="Filter by recipient..."
        value={filters.recipient}
        onChange={(e) => setFilters(prev => ({...prev, recipient: e.target.value}))}
        className="h-9 max-w-sm"
      />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-[240px] justify-start text-left font-normal text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateRange.from ? 
              (filters.dateRange.to ? 
                `${format(filters.dateRange.from, 'LLL dd, y')} - ${format(filters.dateRange.to, 'LLL dd, y')}`
                : format(filters.dateRange.from, 'LLL dd, y')) 
              : <span>Pick a date range</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
            onSelect={(range) => setFilters(prev => ({...prev, dateRange: { from: range?.from, to: range?.to }}))}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
             Status ({filters.status.length > 0 ? filters.status.length : 'All'})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map(status => (
             <DropdownMenuCheckboxItem
               key={status}
               checked={filters.status.includes(status)}
               onCheckedChange={() => handleStatusChange(status)}
             >
               {status}
             </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleExport} className="h-9 ml-auto">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
