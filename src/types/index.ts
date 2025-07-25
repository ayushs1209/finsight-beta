export interface Transaction {
  transactionId: string;
  payoutId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  recipient: string;
  paymentMethod: string;
  date: Date;
}
