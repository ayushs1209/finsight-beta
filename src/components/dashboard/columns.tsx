"use client"

import type { Transaction } from "@/types"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ColumnProps = {
  column: {
    toggleSorting: () => void;
  }
}

type CellProps = {
  row: {
    original: Transaction
  }
}

export const columns = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "date",
    header: ({ column }: ColumnProps) => (
      <Button variant="ghost" onClick={column.toggleSorting} className="-ml-4">
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: CellProps) => new Date(row.original.date).toLocaleDateString(),
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
  },
  {
    accessorKey: "amount",
    header: ({ column }: ColumnProps) => (
      <div className="text-right w-full">
        <Button variant="ghost" onClick={column.toggleSorting} className="">
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }: CellProps) => {
      const amount = parseFloat(row.original.amount.toString());
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: CellProps) => {
      const status = row.original.status;
      const variant = status === 'Completed' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive';
      
      const statusClass = 
        status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800' :
        status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800' :
        status === 'Failed' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800'
        : 'bg-secondary text-secondary-foreground border-border hover:bg-muted';

      if (variant === 'default') {
        return <Badge variant={'outline'} className={statusClass}>{status}</Badge>;
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];
