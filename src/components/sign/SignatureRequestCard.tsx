
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar, Check, X } from 'lucide-react';
import { SignatureRequest } from '@/types/sign';

interface SignatureRequestCardProps {
  request: SignatureRequest;
  onView: (request: SignatureRequest) => void;
  onRemind?: (request: SignatureRequest) => void;
  onCancel?: (id: string) => void;
}

const SignatureRequestCard: React.FC<SignatureRequestCardProps> = ({ 
  request, 
  onView, 
  onRemind, 
  onCancel 
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'outline';
      case 'sent':
        return 'default';
      case 'signed':
        return 'default';
      case 'declined':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  const completedCount = request.recipients.filter(r => r.signed).length;
  const totalCount = request.recipients.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <FileText className="h-4 w-4 text-odoo-primary" />
              <h3 className="font-medium">{request.title}</h3>
              <Badge variant={getStatusBadgeVariant(request.status)}>
                {request.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {request.documentName}
            </p>
            
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <Calendar className="h-3 w-3 mr-1" />
              Created: {request.createdAt}
              {request.expiresAt && (
                <span className="ml-4">Expires: {request.expiresAt}</span>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span>Signatures Progress</span>
                <span>{completedCount} of {totalCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-odoo-primary h-1.5 rounded-full" 
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-1">
              {request.recipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{recipient.name}</span>
                  </div>
                  {recipient.signed ? (
                    <div className="flex items-center text-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      <span>{recipient.signedAt}</span>
                    </div>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView(request)}
            >
              View
            </Button>
            
            {request.status === 'sent' && onRemind && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRemind(request)}
              >
                Remind
              </Button>
            )}
            
            {(request.status === 'draft' || request.status === 'sent') && onCancel && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onCancel(request.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureRequestCard;
