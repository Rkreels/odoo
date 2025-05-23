
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'canceled';

export interface Subscription {
  id: string;
  customer: string;
  plan: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  nextBilling?: string;
  amount: string;
  interval: 'monthly' | 'quarterly' | 'annual';
  autoRenew: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: string;
    quarterly: string;
    annual: string;
  };
  features: string[];
  isPopular?: boolean;
}
