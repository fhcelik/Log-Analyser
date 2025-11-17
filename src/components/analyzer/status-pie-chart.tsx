"use client";

import {Pie, PieChart as RechartsPieChart} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type {Summary} from './dashboard';

interface StatusPieChartProps {
  summary: Summary;
}

const chartConfig = {
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

export function StatusPieChart({summary}: StatusPieChartProps) {
  const chartData = [
    {name: 'success', value: summary.success, fill: 'var(--color-success)'},
    {name: 'failed', value: summary.failed, fill: 'var(--color-failed)'},
    {name: 'warning', value: summary.warning, fill: 'var(--color-warning)'},
  ].filter(d => d.value > 0);

  const total = summary.success + summary.failed + summary.warning;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] pb-0">
        {total > 0 ? (
          <ChartContainer config={chartConfig} className="w-full h-full">
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                startAngle={90}
                endAngle={-270}
                paddingAngle={chartData.length > 1 ? 5 : 0}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5 + 15;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-muted-foreground text-xs"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {chartData[index].name} (
                      {((value / total) * 100).toFixed(0)}%)
                    </text>
                  );
                }}
              />
            </RechartsPieChart>
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
