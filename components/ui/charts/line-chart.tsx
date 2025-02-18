'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface LineChartProps {
  data: { name: string; value: number }[];
  className?: string;
}

export function LineChart({ data, className }: LineChartProps) {
  return (
    <Card className={className}>
      <div className="h-[300px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 