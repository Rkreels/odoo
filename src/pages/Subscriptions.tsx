
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Repeat, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Subscription, SubscriptionPlan } from '@/types/subscriptions';
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard';
import PlanCard from '@/components/subscriptions/PlanCard';
import { toast } from "@/components/ui/use-toast";

const Subscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      customer: 'Acme Corporation',
      plan: 'Enterprise Plan',
      status: 'active',
      startDate: '2025-01-15',
      nextBilling: '2025-07-15',
      amount: '$599',
      interval: 'quarterly',
      autoRenew: true,
    },
    {
      id: '2',
      customer: 'Startup Solutions',
      plan: 'Standard Plan',
      status: 'trial',
      startDate: '2025-05-10',
      endDate: '2025-06-10',
      amount: '$49',
      interval: 'monthly',
      autoRenew: false,
    },
    {
      id: '3',
      customer: 'Global Industries',
      plan: 'Premium Plan',
      status: 'expired',
      startDate: '2025-03-01',
      endDate: '2025-05-01',
      amount: '$999',
      interval: 'annual',
      autoRenew: false,
    },
    {
      id: '4',
      customer: 'Tech Innovations',
      plan: 'Basic Plan',
      status: 'canceled',
      startDate: '2025-02-20',
      endDate: '2025-05-20',
      amount: '$19',
      interval: 'monthly',
      autoRenew: false,
    }
  ]);
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Basic Plan',
      description: 'Perfect for small businesses and startups',
      price: {
        monthly: '$19',
        quarterly: '$54',
        annual: '$190',
      },
      features: [
        '1 User',
        'Basic features',
        'Email support',
        '5GB storage',
        'Limited API access'
      ],
    },
    {
      id: '2',
      name: 'Standard Plan',
      description: 'Great for growing companies',
      price: {
        monthly: '$49',
        quarterly: '$139',
        annual: '$490',
      },
      features: [
        '5 Users',
        'All basic features',
        'Priority email support',
        '20GB storage',
        'Full API access',
        'Advanced reporting'
      ],
      isPopular: true,
    },
    {
      id: '3',
      name: 'Premium Plan',
      description: 'For established businesses with advanced needs',
      price: {
        monthly: '$99',
        quarterly: '$279',
        annual: '$999',
      },
      features: [
        'Unlimited users',
        'All standard features',
        '24/7 phone support',
        '100GB storage',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
    }
  ]);
  
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleViewSubscriptionDetails = (subscription: Subscription) => {
    toast({
      title: "Viewing subscription details",
      description: `${subscription.plan} for ${subscription.customer}`,
    });
  };
  
  const handleRenewSubscription = (id: string) => {
    setSubscriptions(subs => 
      subs.map(sub => 
        sub.id === id 
          ? { 
              ...sub, 
              status: 'active', 
              startDate: new Date().toISOString().split('T')[0], 
              endDate: undefined,
              nextBilling: '2026-05-23', // Example date
              autoRenew: true,
            } 
          : sub
      )
    );
    
    toast({
      title: "Subscription renewed",
      description: "The subscription has been successfully renewed.",
    });
  };
  
  const handleCancelSubscription = (id: string) => {
    setSubscriptions(subs => 
      subs.map(sub => 
        sub.id === id 
          ? { 
              ...sub, 
              status: 'canceled', 
              endDate: new Date().toISOString().split('T')[0],
              nextBilling: undefined,
              autoRenew: false,
            } 
          : sub
      )
    );
    
    toast({
      title: "Subscription canceled",
      description: "The subscription has been canceled.",
      variant: "destructive",
    });
  };
  
  const handleSubscribeToPlan = (plan: SubscriptionPlan) => {
    toast({
      title: "Plan selected",
      description: `You selected the ${plan.name} with ${selectedInterval} billing.`,
    });
  };

  return (
    <TopbarDashboardLayout currentApp="Subscriptions">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Repeat className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Subscriptions</h1>
                <p className="text-odoo-gray">
                  Manage recurring billing, subscription plans, and customers.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Subscription
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
              <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="space-y-4 mt-4">
                {subscriptions.length > 0 ? (
                  subscriptions.map(subscription => (
                    <SubscriptionCard 
                      key={subscription.id} 
                      subscription={subscription} 
                      onViewDetails={handleViewSubscriptionDetails}
                      onRenew={handleRenewSubscription}
                      onCancel={handleCancelSubscription}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No subscriptions found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="plans">
              <div className="flex justify-center mb-8">
                <ToggleGroup 
                  type="single" 
                  value={selectedInterval}
                  onValueChange={(value) => {
                    if (value) setSelectedInterval(value as 'monthly' | 'quarterly' | 'annual');
                  }}
                >
                  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                  <ToggleGroupItem value="quarterly">Quarterly</ToggleGroupItem>
                  <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    selectedInterval={selectedInterval}
                    onSubscribe={handleSubscribeToPlan}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Subscriptions;
