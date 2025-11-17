import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LogEntry } from "@/components/analyzer/dashboard";
import Papa from "papaparse";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCsv(data: LogEntry[], fileName: string) {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
