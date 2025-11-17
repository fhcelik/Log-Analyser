"use client";

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar} from '@/components/ui/calendar';
import {Calendar as CalendarIcon, FileDown, X} from 'lucide-react';
import {format} from 'date-fns';
import {cn, exportToCsv} from '@/lib/utils';
import type {LogEntry} from './dashboard';
import type {DateRange} from 'react-day-picker';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogDataTableProps {
  data: LogEntry[];
  filters: {
    sourceFilter: string;
    statusFilter: string;
    dateFilter: DateRange | undefined;
    messageFilter: string;
  };
  setFilters: {
    setSourceFilter: (value: string) => void;
    setStatusFilter: (value: string) => void;
    setDateFilter: (range: DateRange | undefined) => void;
    setMessageFilter: (value: string) => void;
  };
  sourceOptions: string[];
  statusOptions: string[];
}

export function LogDataTable({
  data,
  filters,
  setFilters,
  sourceOptions,
  statusOptions,
}: LogDataTableProps) {
  const {sourceFilter, statusFilter, dateFilter, messageFilter} = filters;
  const {setSourceFilter, setStatusFilter, setDateFilter, setMessageFilter} =
    setFilters;
  const isMobile = useIsMobile();
  const numberOfMonths = isMobile ? 1 : 2;

  const handleExport = () => {
    exportToCsv(data, 'etl_log_export.csv');
  };

  const resetFilters = () => {
    setSourceFilter('all');
    setStatusFilter('all');
    setDateFilter(undefined);
    setMessageFilter('');
  };

  const isFiltered =
    sourceFilter !== 'all' ||
    statusFilter !== 'all' ||
    dateFilter !== undefined ||
    messageFilter !== '';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "LLL dd, yyyy h:mm a");
    } catch (error) {
      return timestamp;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-card rounded-lg border">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
          <Input
            placeholder="Search messages..."
            value={messageFilter}
            onChange={e => setMessageFilter(e.target.value)}
            className="w-full"
          />
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateFilter && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter?.from ? (
                  dateFilter.to ? (
                    <>
                      {format(dateFilter.from, 'LLL dd, y')} -{' '}
                      {format(dateFilter.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateFilter.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateFilter?.from}
                selected={dateFilter}
                onSelect={setDateFilter}
                numberOfMonths={numberOfMonths}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-2">
          {isFiltered && (
            <Button variant="ghost" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          <Button onClick={handleExport} disabled={data.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[120px]">Source</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-xs">
                    {formatTimestamp(entry.timestamp)}
                  </TableCell>
                  <TableCell>{entry.source}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getStatusBadge(entry.status)
                      )}
                    >
                      {entry.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-code text-sm">
                    {entry.message}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
