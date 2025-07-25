"use client";

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types"

type Sorting = {
  key: keyof Transaction | string;
  direction: 'asc' | 'desc';
} | null;

export function DataTable({ columns, data }: { columns: any[], data: Transaction[] }) {
  const [sorting, setSorting] = React.useState<Sorting>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  const sortedData = React.useMemo(() => {
    if (!sorting || !sorting.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sorting.key as keyof Transaction];
      const bValue = b[sorting.key as keyof Transaction];
      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sorting]);
  
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const toggleSorting = (key: keyof Transaction | string) => {
    const currentDirection = sorting?.key === key ? sorting.direction : 'desc';
    const nextDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    setSorting({ key, direction: nextDirection });
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className={column.accessorKey === 'amount' ? 'text-right' : ''}>
                  {typeof column.header === 'function' 
                    ? column.header({ column: {
                        toggleSorting: () => toggleSorting(column.accessorKey)
                      }})
                    : column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <TableRow key={row.transactionId}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : String(row[column.accessorKey as keyof Transaction])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {data.length} transactions total.
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
        </div>
      </div>
    </div>
  )
}
