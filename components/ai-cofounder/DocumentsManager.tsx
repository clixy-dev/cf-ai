'use client';

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { Upload, File, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DocumentsManagerProps {
  user: User;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'processing' | 'processed' | 'error';
  uploadedAt: Date;
  summary?: string;
}

export function DocumentsManager({ user }: DocumentsManagerProps) {
  const { t } = useTranslations();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'business-plan.pdf',
      type: 'application/pdf',
      size: 2500000,
      status: 'processed',
      uploadedAt: new Date(),
      summary: 'A comprehensive business plan for startup growth'
    },
    {
      id: '2',
      name: 'financial-projections.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1500000,
      status: 'processing',
      uploadedAt: new Date()
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // TODO: Implement file upload
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    // TODO: Implement file upload
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {t('ai_cofounder.documents.status.processed')}
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" />
            {t('ai_cofounder.documents.status.processing')}
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {t('ai_cofounder.documents.status.error')}
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 space-y-4">
      <Card
        className={`
          flex flex-col items-center justify-center p-8 border-2 border-dashed
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
          transition-colors
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {t('ai_cofounder.documents.drop_title')}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('ai_cofounder.documents.drop_description')}
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileSelect}
            multiple
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {t('ai_cofounder.documents.select_files')}
            </label>
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('ai_cofounder.documents.table.name')}</TableHead>
              <TableHead>{t('ai_cofounder.documents.table.size')}</TableHead>
              <TableHead>{t('ai_cofounder.documents.table.status')}</TableHead>
              <TableHead>{t('ai_cofounder.documents.table.uploaded')}</TableHead>
              <TableHead className="w-[100px]">{t('ai_cofounder.documents.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {documents.map((doc) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(doc.size)}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>{doc.uploadedAt.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        // TODO: Implement delete
                        console.log('Delete document:', doc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 