import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  File,
  UploadCloud,
} from 'lucide-react';
import type {Summary} from './dashboard';

interface SummaryCardsProps {
  summary: Summary;
  fileName: string | null;
  onReset: () => void;
}

export function SummaryCards({summary, fileName, onReset}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Success',
      value: summary.success,
      icon: <CheckCircle2 className="h-6 w-6 text-chart-2" />,
      color: 'text-chart-2',
    },
    {
      title: 'Warning',
      value: summary.warning,
      icon: <AlertTriangle className="h-6 w-6 text-chart-4" />,
      color: 'text-chart-4',
    },
    {
      title: 'Failed',
      value: summary.failed,
      icon: <XCircle className="h-6 w-6 text-chart-1" />,
      color: 'text-chart-1',
    },
    {
      title: 'Total',
      value: summary.total,
      icon: <File className="h-6 w-6 text-muted-foreground" />,
      color: 'text-foreground',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium mb-2 w-full sm:w-auto">
          Log Summary
        </CardTitle>
        <div className="flex items-center gap-4">
          {fileName && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <File className="h-4 w-4" /> {fileName}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={onReset}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload New File
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(card => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${card.color}`}>
                  {card.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
