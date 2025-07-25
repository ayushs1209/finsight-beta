import type { Transaction } from '@/types';

export function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const rowObject: Record<string, string> = {};
    header.forEach((key, index) => {
      rowObject[key] = values[index];
    });
    return rowObject;
  });
  return rows;
}

export function transformDataToTransactions(data: Record<string, string>[]): Transaction[] {
  return data.map(item => ({
    transactionId: item.transaction_id || item.transactionId || '',
    payoutId: item.payout_id || item.payoutId || '',
    amount: parseFloat(item.amount || '0'),
    status: (item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending') as Transaction['status'],
    recipient: item.recipient || '',
    paymentMethod: item.payment_method || item.paymentMethod || '',
    date: new Date(item.date || ''),
  })).filter(t => t.transactionId && !isNaN(t.amount) && t.date.toString() !== 'Invalid Date' && ['Completed', 'Pending', 'Failed'].includes(t.status));
}

export function exportToCsv(data: Transaction[], filename: string = 'payouts.csv') {
  if (!data.length) return;

  const header = ['transactionId', 'payoutId', 'amount', 'status', 'recipient', 'paymentMethod', 'date'];
  const csvRows = [
    header.join(','),
    ...data.map(row =>
      header.map(fieldName => {
        const value = row[fieldName as keyof Transaction];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        if (fieldName === 'date' && value instanceof Date) {
            return value.toISOString();
        }
        return value;
      }).join(',')
    )
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
