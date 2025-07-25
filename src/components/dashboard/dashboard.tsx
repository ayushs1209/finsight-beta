"use client";

import { useState, useMemo, useRef } from 'react';
import type { Transaction } from '@/types';
import { parseCsv, transformDataToTransactions } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud, FileText } from 'lucide-react';

import StatsCards from './stats-cards';
import TransactionCharts from './transaction-charts';
import { DataTable } from './data-table';
import { columns } from './columns';
import FilterToolbar from './filter-toolbar';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '../theme-toggle';

export type Filters = {
  status: string[];
  recipient: string;
  dateRange: { from?: Date; to?: Date };
};

const initialFilters: Filters = {
  status: [],
  recipient: '',
  dateRange: {},
};


export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a valid CSV file.' });
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const parsedData = parseCsv(text);
          if (parsedData.length === 0) {
            toast({ variant: 'destructive', title: 'Empty or Invalid CSV', description: 'The CSV file is empty or could not be parsed.' });
            return;
          }
          const transformedData = transformDataToTransactions(parsedData);
          if (transformedData.length === 0) {
            toast({ variant: 'destructive', title: 'No Transactions Found', description: 'Could not find any valid transactions. Please check the CSV file for required columns (like amount) and valid data.' });
            return;
          }
          setTransactions(transformedData);
          setFilters(initialFilters); // Reset filters on new file upload
          toast({ title: 'Success', description: `${transformedData.length} transactions loaded.` });
        } catch (err: any) {
          toast({ variant: 'destructive', title: 'Parsing Failed', description: err.message || 'Could not parse the CSV file. Please check its format.' });
          console.error(err);
        }
      };
      reader.readAsText(file);
    }
     // Reset file input to allow re-uploading the same file
    if(event.target) {
      event.target.value = '';
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const statusMatch = filters.status.length > 0 ? filters.status.includes(t.status) : true;
      const recipientMatch = t.recipient.toLowerCase().includes(filters.recipient.toLowerCase());
      const date = new Date(t.date);
      const fromMatch = filters.dateRange.from ? new Date(date.toDateString()) >= new Date(filters.dateRange.from.toDateString()) : true;
      const toMatch = filters.dateRange.to ? new Date(date.toDateString()) <= new Date(filters.dateRange.to.toDateString()) : true;
      return statusMatch && recipientMatch && fromMatch && toMatch;
    });
  }, [transactions, filters]);


  if (transactions.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">FinSight Dashboard</CardTitle>
            <CardDescription>Upload your CSV to visualize payout data</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 space-y-4 transition-colors hover:border-primary hover:bg-accent/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground">
                Click or drag & drop to upload
              </p>
              <Input
                ref={fileInputRef} 
                id="csv-upload" 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
            {fileName && (
              <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                <FileText className="w-4 h-4 mr-2" />
                <span>Last attempt: {fileName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-background">
      <header className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">FinSight Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload New CSV
          </Button>
          <ThemeToggle />
          <Input
            ref={fileInputRef} 
            id="csv-upload-main" 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </div>
      </header>

      <StatsCards transactions={filteredTransactions} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 overflow-hidden">
          <CardHeader>
            <CardTitle>Payouts Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionCharts data={filteredTransactions} type="line" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader>
            <CardTitle>Payouts by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionCharts data={filteredTransactions} type="bar" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payouts</CardTitle>
          <CardDescription>
            {filteredTransactions.length} of {transactions.length} transactions shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterToolbar filters={filters} setFilters={setFilters} data={filteredTransactions} initialFilters={initialFilters} />
          <DataTable columns={columns} data={filteredTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
