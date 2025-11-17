"use client";
import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {UploadCloud} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface FileUploadProps {
  onFileParse: (file: File) => void;
}

export function FileUpload({onFileParse}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragging(false);
      if (acceptedFiles.length > 0) {
        onFileParse(acceptedFiles[0]);
      }
    },
    [onFileParse]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Upload Your Log File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${
              isDragActive || isDragging
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-16 h-16 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Drag & drop a file here</p>
          <p className="text-muted-foreground">or click to select a file</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Supported formats: .csv, .json, .xls, .xlsx
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
