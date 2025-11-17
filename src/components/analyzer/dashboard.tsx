"use client";

import {useState, useMemo} from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {FileUpload} from './file-upload';
import {SummaryCards} from './summary-cards';
import {StatusPieChart} from './status-pie-chart';
import {SourceBarChart} from './source-bar-chart';
import {LogDataTable} from './log-data-table';
import {ColumnMapper, type ColumnMapping} from './column-mapper';
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

type RawEntry = Record<string, any>;

enum AppState {
  Uploading,
  Mapping,
  Analyzing,
}

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>(AppState.Uploading);
  const [rawData, setRawData] = useState<RawEntry[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
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
        const data = event.target?.result;
        let parsedData: RawEntry[];
        let fileHeaders: string[];

        if (fileExtension === 'json') {
          const text = new TextDecoder().decode(data as ArrayBuffer);
          const jsonData = JSON.parse(text);
          if (!Array.isArray(jsonData)) {
            throw new Error(
              'Invalid JSON format. Expected an array of log entries.'
            );
          }
          parsedData = jsonData;
          fileHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
        } else if (fileExtension === 'csv') {
          const text = new TextDecoder().decode(data as ArrayBuffer);
          const result = Papa.parse<RawEntry>(text, {
            header: true,
            skipEmptyLines: true,
          });
          if (result.errors.length > 0) {
            throw new Error(`CSV parsing error: ${result.errors[0].message}`);
          }
          parsedData = result.data;
          fileHeaders = result.meta.fields || [];
        } else if (
          fileExtension === 'xls' ||
          fileExtension === 'xlsx' ||
          fileExtension === 'numbers'
        ) {
          const workbook = XLSX.read(data, {type: 'array'});
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json<RawEntry>(worksheet);
          fileHeaders = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
        } else {
          throw new Error(
            'Unsupported file type. Please upload a CSV, JSON, XLS, XLSX or Numbers file.'
          );
        }

        if (parsedData.length === 0 && fileHeaders.length === 0) {
          toast({
            variant: 'destructive',
            title: 'Empty File',
            description:
              'The uploaded file is empty or contains no valid data.',
          });
          return;
        }

        setRawData(parsedData);
        setHeaders(fileHeaders);
        setFileName(file.name);
        setAppState(AppState.Mapping);
        toast({
          title: 'File uploaded successfully!',
          description: `Please map the columns for ${file.name}.`,
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
        resetState();
      }
    };

    if (
      fileExtension === 'xls' ||
      fileExtension === 'xlsx' ||
      fileExtension === 'numbers'
    ) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsArrayBuffer(file); // Reading as array buffer for all to unify logic
    }
  };

  const handleMappingComplete = (mapping: ColumnMapping) => {
    const transformedData = rawData.map(rawEntry => {
      return {
        timestamp: rawEntry[mapping.timestamp],
        source: rawEntry[mapping.source],
        status: rawEntry[mapping.status],
        message: rawEntry[mapping.message] || '',
      } as LogEntry;
    });
    setLogData(transformedData);
    setAppState(AppState.Analyzing);
    toast({
      title: 'Analysis ready!',
      description: `Your log data has been processed.`,
    });
  };

  const resetState = () => {
    setAppState(AppState.Uploading);
    setRawData([]);
    setHeaders([]);
    setLogData([]);
    setFileName(null);
    setSourceFilter('all');
    setStatusFilter('all');
    setDateFilter(undefined);
    setMessageFilter('');
  };

  const filteredData = useMemo(() => {
    return logData.filter(entry => {
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
        (dateFilter.from && !isNaN(entryDate.getTime())
          ? entryDate >= dateFilter.from
          : true) &&
        (dateFilter.to && !isNaN(entryDate.getTime())
          ? entryDate <= dateFilter.to
          : true);
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
    () => [
      'all',
      ...Array.from(new Set(logData.map(entry => entry.source).filter(Boolean))),
    ],
    [logData]
  );
  const statusOptions = ['all', 'success', 'failed', 'warning'];

  if (appState === AppState.Uploading) {
    return <FileUpload onFileParse={handleFileParse} />;
  }

  if (appState === AppState.Mapping) {
    return (
      <ColumnMapper
        headers={headers}
        onMappingComplete={handleMappingComplete}
        onCancel={resetState}
      />
    );
  }

  if (appState === AppState.Analyzing) {
    return (
      <div className="space-y-6">
        <SummaryCards
          summary={summary}
          fileName={fileName}
          onReset={resetState}
        />
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

  return null;
}
