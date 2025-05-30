
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QualityCheck } from '@/types/quality';
import { Calendar, User, Package, AlertTriangle } from 'lucide-react';

interface QualityCheckCardProps {
  check: QualityCheck;
  onStatusUpdate: (checkId: string, newStatus: QualityCheck['status']) => void;
}

const QualityCheckCard = ({ check, onStatusUpdate }: QualityCheckCardProps) => {
  const getStatusColor = (status: QualityCheck['status']) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: QualityCheck['priority']) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{check.id}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(check.priority)} variant="outline">
              {check.priority}
            </Badge>
            <Badge className={getStatusColor(check.status)} variant="outline">
              {check.status}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">{check.controlPointName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{check.productName}</span>
            {check.batchNumber && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Batch: {check.batchNumber}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{check.assignedTo}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Due: {check.scheduledDate}</span>
          </div>

          {check.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {check.notes}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {check.status === 'Pending' && (
              <Button 
                size="sm" 
                onClick={() => onStatusUpdate(check.id, 'In Progress')}
              >
                Start Check
              </Button>
            )}
            {check.status === 'In Progress' && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onStatusUpdate(check.id, 'Passed')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Passed
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onStatusUpdate(check.id, 'Failed')}
                >
                  Mark Failed
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityCheckCard;
