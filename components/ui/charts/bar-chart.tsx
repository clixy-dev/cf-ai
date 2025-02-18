'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface BarChartProps {
  data: { name: string; value: number }[];
  className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
  return (
    <Card className={className}>
      <div className="h-[300px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 