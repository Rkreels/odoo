
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, User, CheckCircle, XCircle } from 'lucide-react';
import { Subscription } from '@/types/subscriptions';

interface SubscriptionCardProps {
  subscription: Subscription;
  onViewDetails: (subscription: Subscription) => void;
  onRenew: (id: string) => void;
  onCancel: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onViewDetails,
  onRenew,
  onCancel,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'outline';
      case 'expired':
        return 'secondary';
      case 'canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1 space-x-2">
              <h3 className="font-medium">{subscription.plan}</h3>
              <Badge variant={getStatusBadgeVariant(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">
              {subscription.customer}
            </p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <CreditCard className="h-3 w-3 mr-1" />
                {subscription.amount} / {subscription.interval}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Started: {subscription.startDate}
              </div>
              <div className="flex items-center">
                {subscription.autoRenew ? (
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1 text-red-500" />
                )}
                Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}
              </div>
              {subscription.nextBilling && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Next billing: {subscription.nextBilling}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(subscription)}
            >
              Details
            </Button>
            {subscription.status !== 'canceled' && (
              subscription.status === 'expired' ? (
                <Button 
                  className="bg-odoo-primary hover:bg-odoo-primary/90" 
                  size="sm"
                  onClick={() => onRenew(subscription.id)}
                >
                  Renew
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onCancel(subscription.id)}
                >
                  Cancel
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
