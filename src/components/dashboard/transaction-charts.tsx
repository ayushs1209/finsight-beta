"use client";

import type { Transaction } from '@/types';
import { useMemo } from 'react';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

type TransactionChartsProps = {
  data: Transaction[];
  type: 'line' | 'bar';
};

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function TransactionCharts({ data, type }: TransactionChartsProps) {
  const lineChartData = useMemo(() => {
    if (!data.length) return [];
    const dailyTotals: { [key: string]: number } = {};
    data.forEach(t => {
      const date = new Date(t.date).toISOString().split('T')[0];
      if (!dailyTotals[date]) {
        dailyTotals[date] = 0;
      }
      dailyTotals[date] += t.amount;
    });
    return Object.entries(dailyTotals)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const barChartData = useMemo(() => {
    if (!data.length) return [];
    const statusCounts = data.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<Transaction['status'], number>);

    return [
      { status: 'Completed', count: statusCounts.Completed || 0 },
      { status: 'Pending', count: statusCounts.Pending || 0 },
      { status: 'Failed', count: statusCounts.Failed || 0 },
    ];
  }, [data]);

  if (type === 'line') {
    return (
      <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig}>
          <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
            />
            <Tooltip 
              cursor={false}
              content={<ChartTooltipContent
                indicator='dot'
                formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
              />}
            />
            <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart data={barChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="status" 
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={80}
              fontSize={12}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    );
  }

  return null;
}
