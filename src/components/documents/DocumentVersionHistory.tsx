
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentVersion } from '@/types/documents';
import { History, Download, Eye, RotateCcw, User, Calendar } from 'lucide-react';

interface DocumentVersionHistoryProps {
  versions: DocumentVersion[];
  onDownload: (version: DocumentVersion) => void;
  onPreview: (version: DocumentVersion) => void;
  onRestore: (version: DocumentVersion) => void;
}

const DocumentVersionHistory = ({ versions, onDownload, onPreview, onRestore }: DocumentVersionHistoryProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" />
          Version History
        </CardTitle>
        <p className="text-sm text-gray-600">
          {versions.length} version{versions.length !== 1 ? 's' : ''} available
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedVersions.map((version) => (
            <div key={version.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={version.isActive ? "default" : "outline"}>
                    v{version.version}
                  </Badge>
                  {version.isActive && (
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatFileSize(version.size)}
                </span>
              </div>

              <h4 className="font-medium mb-2">{version.name}</h4>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {version.uploadedBy}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {version.uploadedAt}
                </div>
              </div>

              {version.changes && (
                <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                  <span className="font-medium">Changes: </span>
                  {version.changes}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(version)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(version)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                {!version.isActive && (
                  <Button
                    size="sm"
                    onClick={() => onRestore(version)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionHistory;
