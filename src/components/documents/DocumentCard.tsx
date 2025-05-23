
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, Share, Eye } from 'lucide-react';
import { Document } from '@/types/documents';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onDownload: (document: Document) => void;
  onShare: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onShare,
  onDelete,
}) => {
  const getFileIcon = (type: string) => {
    return <FileText className="h-8 w-8 text-odoo-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getFileIcon(document.type)}
            <div>
              <h3 className="font-medium text-sm truncate">{document.name}</h3>
              <p className="text-xs text-gray-500">{formatFileSize(document.size)}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {document.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-gray-500 mb-3">
          <p>Created: {document.createdAt}</p>
          <p>Modified: {document.modifiedAt}</p>
          <p>Owner: {document.owner}</p>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => onView(document)}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownload(document)}>
            <Download className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onShare(document)}>
            <Share className="h-3 w-3" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(document.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
