"use client";

import {useState, useMemo} from 'react';
import Papa from 'papaparse';
import {FileUpload} from './file-upload';
import {SummaryCards} from './summary-cards';
import {StatusPieChart} from './status-pie-chart';
import {SourceBarChart} from './source-bar-chart';
import {LogDataTable} from './log-data-table';
import {useToast} from '@/hooks/use-toast';
import type {DateRange} from 'react-day-picker';

export interface LogEntry {
  timestamp: string;
  source: string;
  status: 'success' | 'failed' | 'warning' | string;
  message: string;
  [key: string]: any;
}

export interface Summary {
  total: number;
  success: number;
  failed: number;
  warning: number;
}

export default function Dashboard() {
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const {toast} = useToast();

  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );
  const [messageFilter, setMessageFilter] = useState<string>('');

  const handleFileParse = (file: File) => {
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        let parsedData: LogEntry[];
        const requiredColumns = ['timestamp', 'source', 'status'];

        if (fileExtension === 'json') {
          const data = JSON.parse(text);
          if (!Array.isArray(data)) {
            throw new Error('Invalid JSON format. Expected an array of log entries.');
          }
          parsedData = data;
          if (parsedData.length > 0) {
            const firstEntryKeys = Object.keys(parsedData[0]);
            if (!requiredColumns.every(col => firstEntryKeys.includes(col))) {
               throw new Error(
                `Invalid JSON format. Required properties: ${requiredColumns.join(', ')}.`
              );
            }
          }

        } else if (fileExtension === 'csv') {
          const result = Papa.parse<LogEntry>(text, {
            header: true,
            skipEmptyLines: true,
          });
          if (result.errors.length > 0) {
            throw new Error(`CSV parsing error: ${result.errors[0].message}`);
          }
          if (result.meta.fields && result.meta.fields.length > 0) {
            const headers = result.meta.fields.map(h => h.trim().toLowerCase());
            if (!requiredColumns.every(col => headers.includes(col))) {
              throw new Error(
                `Invalid CSV format. Required columns: ${requiredColumns.join(', ')}.`
              );
            }
          } else {
             throw new Error(
                `Invalid CSV format. Required columns: ${requiredColumns.join(', ')}.`
              );
          }
          parsedData = result.data;
        } else {
          throw new Error(
            'Unsupported file type. Please upload a CSV or JSON file.'
          );
        }

        if (parsedData.length === 0) {
          toast({
            variant: 'destructive',
            title: 'Empty File',
            description:
              'The uploaded file is empty or contains no valid data.',
          });
          return;
        }

        setLogData(parsedData);
        setFileName(file.name);
        toast({
          title: 'File processed successfully!',
          description: `${file.name} has been loaded and analyzed.`,
        });
      } catch (error: any) {
        console.error('Parsing Error:', error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description:
            error.message ||
            'Failed to parse the file. Please check the file format and content.',
        });
        setLogData([]);
        setFileName(null);
      }
    };

    reader.readAsText(file);
  };

  const resetState = () => {
    setLogData([]);
    setFileName(null);
    setSourceFilter('all');
    setStatusFilter('all');
    setDateFilter(undefined);
    setMessageFilter('');
  };

  const filteredData = useMemo(() => {
    return logData.filter(entry => {
      if (!entry.timestamp || !entry.source || !entry.status) {
        return false;
      }
      const entryDate = new Date(entry.timestamp);
      const sourceMatch =
        sourceFilter === 'all' || entry.source === sourceFilter;
      const statusMatch =
        statusFilter === 'all' || entry.status === statusFilter;
      const messageMatch =
        messageFilter === '' ||
        (entry.message &&
          entry.message.toLowerCase().includes(messageFilter.toLowerCase()));
      const dateMatch =
        !dateFilter ||
        (dateFilter.from && !isNaN(entryDate.getTime()) ? entryDate >= dateFilter.from : true) &&
        (dateFilter.to && !isNaN(entryDate.getTime()) ? entryDate <= dateFilter.to : true);
      return sourceMatch && statusMatch && messageMatch && dateMatch;
    });
  }, [logData, sourceFilter, statusFilter, dateFilter, messageFilter]);

  const summary = useMemo<Summary>(() => {
    return filteredData.reduce(
      (acc, entry) => {
        acc.total++;
        if (entry.status === 'success') acc.success++;
        else if (entry.status === 'failed') acc.failed++;
        else if (entry.status === 'warning') acc.warning++;
        return acc;
      },
      {total: 0, success: 0, failed: 0, warning: 0}
    );
  }, [filteredData]);

  const sourceOptions = useMemo(
    () => ['all', ...Array.from(new Set(logData.map(entry => entry.source).filter(Boolean)))],
    [logData]
  );
  const statusOptions = ['all', 'success', 'failed', 'warning'];

  if (logData.length === 0) {
    return <FileUpload onFileParse={handleFileParse} />;
  }

  return (
    <div className="space-y-6">
      <SummaryCards summary={summary} fileName={fileName} onReset={resetState} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <StatusPieChart summary={summary} />
        </div>
        <div className="lg:col-span-3">
          <SourceBarChart data={filteredData} />
        </div>
      </div>
      <LogDataTable
        data={filteredData}
        filters={{sourceFilter, statusFilter, dateFilter, messageFilter}}
        setFilters={{
          setSourceFilter,
          setStatusFilter,
          setDateFilter,
          setMessageFilter,
        }}
        sourceOptions={sourceOptions}
        statusOptions={statusOptions}
      />
    </div>
  );
}
