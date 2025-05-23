
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscriptions';

interface PlanCardProps {
  plan: SubscriptionPlan;
  selectedInterval: 'monthly' | 'quarterly' | 'annual';
  onSubscribe: (plan: SubscriptionPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selectedInterval, onSubscribe }) => {
  const getPriceForInterval = () => {
    switch (selectedInterval) {
      case 'monthly':
        return plan.price.monthly;
      case 'quarterly':
        return plan.price.quarterly;
      case 'annual':
        return plan.price.annual;
      default:
        return plan.price.monthly;
    }
  };

  return (
    <Card className={`flex flex-col h-full ${plan.isPopular ? 'border-odoo-primary shadow-md' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{plan.name}</CardTitle>
          {plan.isPopular && (
            <Badge className="bg-odoo-primary">Popular</Badge>
          )}
        </div>
        <p className="text-gray-500 text-sm">{plan.description}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-6">
          <div className="flex items-end">
            <span className="text-3xl font-bold">{getPriceForInterval()}</span>
            <span className="text-gray-500 ml-1">/{selectedInterval}</span>
          </div>
        </div>
        
        <div className="space-y-3 flex-1 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-4 w-4 text-odoo-primary shrink-0 mt-0.5 mr-2" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          className={`w-full ${plan.isPopular ? 'bg-odoo-primary hover:bg-odoo-primary/90' : ''}`}
          onClick={() => onSubscribe(plan)}
        >
          Subscribe Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
