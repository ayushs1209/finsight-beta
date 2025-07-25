import type { Transaction } from '@/types';
import Papa from 'papaparse';


export function parseCsv(csvText: string): Record<string, string>[] {
  let data: Record<string, string>[] = [];
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => header.trim().toLowerCase().replace(/ /g, '_'),
    complete: (results) => {
      // It's possible for results.data to contain non-object values if there are issues, filter them out.
      data = results.data.filter(row => typeof row === 'object' && row !== null && Object.keys(row).length > 0) as Record<string, string>[];
    },
    error: (error: any) => {
      console.error('PapaParse Error:', error);
      throw new Error('Failed to parse CSV: ' + error.message);
    }
  });

  return data;
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

  // If no amount column is found, we can't process transactions effectively.
  if (!fieldToHeaderMap.amount) {
    console.warn("Could not find a valid 'amount' column in the CSV.");
  }

  const generatedIdCounter = new Map<string, number>();

  return data.map((item, index) => {
    const amountStr = fieldToHeaderMap.amount ? item[fieldToHeaderMap.amount] : '0';
    // Remove currency symbols, commas, and whitespace before parsing
    const cleanedAmountStr = (amountStr || '0').replace(/[^0-9.-]+/g,"");
    const amount = parseFloat(cleanedAmountStr);
    
    // Skip row if amount is not a valid number
    if (isNaN(amount)) {
      return null;
    }

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

    // Skip row if date is invalid
    if (date.toString() === 'Invalid Date') {
        return null;
    }

    const statusRaw = (item[fieldToHeaderMap.status!] || 'Completed').toLowerCase();
    let status: Transaction['status'] = 'Completed';
    if (statusRaw === 'pending') {
      status = 'Pending';
    } else if (statusRaw === 'failed' || statusRaw === 'error' || statusRaw === 'declined') {
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
  }).filter((t): t is Transaction => t !== null);
}


export function exportToCsv(data: Transaction[], filename: string = 'payouts.csv') {
  if (!data.length) return;

  const csvString = Papa.unparse(data, {
    header: true,
  });
  
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
