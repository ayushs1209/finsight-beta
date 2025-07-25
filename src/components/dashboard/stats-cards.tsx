import type { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ListChecks, Hourglass, CheckCircle2, XCircle } from 'lucide-react';

type StatsCardsProps = {
  transactions: Transaction[];
};

export default function StatsCards({ transactions }: StatsCardsProps) {
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = transactions.length;
  const completed = transactions.filter(t => t.status === 'Completed').length;
  const pending = transactions.filter(t => t.status === 'Pending').length;
  const failed = transactions.filter(t => t.status === 'Failed').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  const stats = [
    { title: "Total Volume", value: formatCurrency(totalVolume), description: "Total value of all payouts", Icon: DollarSign, iconColor: "text-primary" },
    { title: "Total Payouts", value: totalPayouts.toLocaleString(), description: "Total number of payouts", Icon: ListChecks, iconColor: "text-muted-foreground" },
    { title: "Completed", value: completed.toLocaleString(), description: "Successfully processed", Icon: CheckCircle2, iconColor: "text-green-500" },
    { title: "Pending", value: pending.toLocaleString(), description: "Currently in progress", Icon: Hourglass, iconColor: "text-yellow-500" },
    { title: "Failed", value: failed.toLocaleString(), description: "Could not be processed", Icon: XCircle, iconColor: "text-destructive" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map(({ title, value, description, Icon, iconColor }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
