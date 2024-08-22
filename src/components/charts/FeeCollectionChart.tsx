'use client';

import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const feeData = [
  { month: 'January', collected: 15000, target: 18000 },
  { month: 'February', collected: 18000, target: 19000 },
  { month: 'March', collected: 17000, target: 18000 },
  { month: 'April', collected: 22000, target: 25000 },
  { month: 'May', collected: 19000, target: 20000 },
  { month: 'June', collected: 21000, target: 22000 }
];

const chartConfig = {
  target: {
    label: 'Target',
    color: 'hsl(var(--chart-1))'
  },
  collected: {
    label: 'Collected',
    color: 'hsl(var(--chart-2))'
  }
};

export function FeeCollectionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Fee Collection Progress</CardTitle>
        <CardDescription>Tracking monthly fee collections against the target</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={feeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="target"
              stroke={chartConfig.target.color}
              strokeWidth={2}
              dot={false}
              fill={chartConfig.target.color}
              fillOpacity={0.4}
            />
            <Line
              type="monotone"
              dataKey="collected"
              stroke={chartConfig.collected.color}
              strokeWidth={2}
              dot={true}
              fill={chartConfig.collected.color}
              fillOpacity={0.4}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
