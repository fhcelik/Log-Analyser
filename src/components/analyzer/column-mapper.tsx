"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, X } from 'lucide-react';

export interface ColumnMapping {
  timestamp: string;
  source: string;
  status: string;
  message: string;
}

interface ColumnMapperProps {
  headers: string[];
  onMappingComplete: (mapping: ColumnMapping) => void;
  onCancel: () => void;
}

export function ColumnMapper({ headers, onMappingComplete, onCancel }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({
    message: ''
  });
  const { toast } = useToast();

  const handleSelectChange = (field: keyof ColumnMapping, value: string) => {
    // Treat the special '__none__' value as an empty string for the mapping.
    const finalValue = value === '__none__' ? '' : value;
    setMapping(prev => ({ ...prev, [field]: finalValue }));
  };

  const handleSubmit = () => {
    if (!mapping.timestamp || !mapping.source || !mapping.status) {
      toast({
        variant: 'destructive',
        title: 'Mapping Incomplete',
        description: 'Please map Timestamp, Source, and Status fields to continue.',
      });
      return;
    }
    onMappingComplete(mapping as ColumnMapping);
  };
  
  const requiredFields: Array<{ id: keyof ColumnMapping; label: string }> = [
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'source', label: 'Source System' },
    { id: 'status', label: 'Status' },
  ];

  const optionalFields: Array<{ id: keyof ColumnMapping; label: string }> = [
     { id: 'message', label: 'Message (Optional)' },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Map Your Columns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Match the required fields to the columns from your uploaded file.
        </p>
        <div className="space-y-4">
          {requiredFields.map(field => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor={field.id} className="font-semibold">
                {field.label} <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => handleSelectChange(field.id, value)}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder="Select a column..." />
                </SelectTrigger>
                <SelectContent>
                  {headers.map(header => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
           {optionalFields.map(field => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor={field.id} className="font-semibold">
                {field.label}
              </Label>
              <Select onValueChange={(value) => handleSelectChange(field.id, value)}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder="Select a column..." />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="__none__">None</SelectItem>
                  {headers.map(header => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
         <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Analyze Data
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
