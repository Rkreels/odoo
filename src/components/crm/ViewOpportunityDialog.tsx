
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, User, Target, Building, Tag } from 'lucide-react';
import { Opportunity } from '@/types/crm';

interface ViewOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
}

const ViewOpportunityDialog: React.FC<ViewOpportunityDialogProps> = ({ 
  isOpen, 
  onClose, 
  opportunity 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-purple-100 text-purple-800';
      case 'Proposition': return 'bg-yellow-100 text-yellow-800';
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{opportunity.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="font-medium">{opportunity.customer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Stage</label>
                <div className="mt-1">
                  <Badge className={getStageColor(opportunity.stage)} variant="outline">
                    {opportunity.stage}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expected Revenue</label>
                <p className="font-medium text-green-600">{formatCurrency(opportunity.expectedRevenue)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Probability</label>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-odoo-primary h-2 rounded-full"
                      style={{ width: `${opportunity.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{opportunity.probability}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p>{new Date(opportunity.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expected Closing</label>
                <p>{new Date(opportunity.expectedClosing).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Activity</label>
                <p>{opportunity.lastActivity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{opportunity.assignedTo}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {opportunity.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{opportunity.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOpportunityDialog;
