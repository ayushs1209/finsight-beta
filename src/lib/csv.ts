import type { Transaction } from '@/types';

export function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Trim and handle potential quotes in headers
  const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    // Improved regex to handle various CSV quoting and spacing scenarios
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    if (values.length !== header.length) {
      // Skip malformed rows
      return null;
    }

    const rowObject: Record<string, string> = {};
    header.forEach((key, index) => {
      // Remove quotes and trim whitespace from values
      rowObject[key] = (values[index] || '').trim().replace(/^"|"$/g, '');
    });
    return rowObject;
  }).filter(row => row !== null) as Record<string, string>[];
  return rows;
}

const headerMappings: { [key in keyof Transaction]?: string[] } = {
  transactionId: ['transaction_id', 'transactionid', 'id'],
  payoutId: ['payout_id', 'payoutid'],
  amount: ['amount', 'value', 'total', 'transaction_amount'],
  status: ['status', 'state'],
  recipient: ['recipient', 'to', 'receiver', 'recipient_name'],
  paymentMethod: ['payment_method', 'paymentmethod', 'method', 'payment_type'],
  date: ['date', 'timestamp', 'created_at', 'created'],
};

function findHeader(header: string[], possibleNames: string[]): string | undefined {
  const lowerCaseHeader = header.map(h => h.toLowerCase().replace(/ /g, '_'));
  for (const name of possibleNames) {
    const index = lowerCaseHeader.indexOf(name.toLowerCase());
    if (index !== -1) {
      return header[index];
    }
  }
  return undefined;
}


export function transformDataToTransactions(data: Record<string, string>[]): Transaction[] {
  if (data.length === 0) return [];
  
  const header = Object.keys(data[0]);

  const fieldToHeaderMap: { [key in keyof Transaction]?: string } = {};

  for (const field in headerMappings) {
    const key = field as keyof Transaction;
    const foundHeader = findHeader(header, headerMappings[key]!);
    if (foundHeader) {
      fieldToHeaderMap[key] = foundHeader;
    }
  }

  // Amount is required. If we can't find it, we can't process the file.
  if (!fieldToHeaderMap.amount) {
    return [];
  }

  const generatedIdCounter = new Map<string, number>();

  return data.map((item, index) => {
    const amount = parseFloat(item[fieldToHeaderMap.amount!] || '0');
    
    // Generate a unique ID if one isn't found in the data
    let transactionId = item[fieldToHeaderMap.transactionId!] || '';
    if (!transactionId) {
        const dateStr = item[fieldToHeaderMap.date!] || new Date().toISOString();
        const recipient = item[fieldToHeaderMap.recipient!] || `recipient_${index}`;
        const key = `${dateStr}-${recipient}-${amount}`;
        const count = (generatedIdCounter.get(key) || 0) + 1;
        generatedIdCounter.set(key, count);
        transactionId = `generated_${index + 1}_${count}`;
    }

    const dateValue = item[fieldToHeaderMap.date!];
    const date = dateValue ? new Date(dateValue) : new Date();

    const statusRaw = (item[fieldToHeaderMap.status!] || 'Pending').toLowerCase();
    let status: Transaction['status'] = 'Pending';
    if (statusRaw === 'completed' || statusRaw === 'success') {
      status = 'Completed';
    } else if (statusRaw === 'failed' || statusRaw === 'error') {
      status = 'Failed';
    }

    return {
      transactionId,
      payoutId: item[fieldToHeaderMap.payoutId!] || '',
      amount,
      status,
      recipient: item[fieldToHeaderMap.recipient!] || 'N/A',
      paymentMethod: item[fieldToHeaderMap.paymentMethod!] || 'N/A',
      date,
    };
  }).filter(t => !isNaN(t.amount) && t.date.toString() !== 'Invalid Date');
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
