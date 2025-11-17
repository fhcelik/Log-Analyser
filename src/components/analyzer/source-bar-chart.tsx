"use client";
import {useMemo} from 'react';
import {Bar, BarChart as RechartsBarChart, XAxis, YAxis} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type {LogEntry} from './dashboard';

interface SourceBarChartProps {
  data: LogEntry[];
}

const chartConfig = {
  count: {
    label: 'Count',
  },
  success: {
    label: 'Success',
    color: 'hsl(var(--chart-2))',
  },
  failed: {
    label: 'Failed',
    color: 'hsl(var(--chart-1))',
  },
  warning: {
    label: 'Warning',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function SourceBarChart({data}: SourceBarChartProps) {
  const chartData = useMemo(() => {
    const sourceCounts = data.reduce(
      (acc, entry) => {
        if (!acc[entry.source]) {
          acc[entry.source] = {
            source: entry.source,
            success: 0,
            failed: 0,
            warning: 0,
          };
        }
        if (entry.status === 'success') acc[entry.source].success++;
        else if (entry.status === 'failed') acc[entry.source].failed++;
        else if (entry.status === 'warning') acc[entry.source].warning++;
        return acc;
      },
      {} as Record<
        string,
        {source: string; success: number; failed: number; warning: number}
      >
    );

    return Object.values(sourceCounts);
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Count by Source System</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] pb-0">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full h-full">
            <RechartsBarChart
              data={chartData}
              layout="vertical"
              stackOffset="expand"
              margin={{left: 10, right: 10}}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="source"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={80}
                tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="success"
                stackId="a"
                fill="var(--color-success)"
                radius={[0, 4, 4, 0]}
              />
              <Bar dataKey="warning" stackId="a" fill="var(--color-warning)" />
              <Bar
                dataKey="failed"
                stackId="a"
                fill="var(--color-failed)"
                radius={[4, 0, 0, 4]}
              />
            </RechartsBarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No data to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}
