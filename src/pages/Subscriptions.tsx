
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Subscription {
  id: string;
  customer: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due' | 'paused';
  amount: number;
  interval: 'monthly' | 'yearly';
  startDate: string;
  nextBilling: string;
  paymentMethod: string;
  renewals: number;
  mrr: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  subscribers: number;
  revenue: number;
  status: 'active' | 'inactive';
}

const Subscriptions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [subscriptions] = useState<Subscription[]>([
    {
      id: '1',
      customer: 'Acme Corp',
      plan: 'Business Pro',
      status: 'active',
      amount: 99.99,
      interval: 'monthly',
      startDate: '2024-01-15',
      nextBilling: '2024-07-15',
      paymentMethod: '**** 1234',
      renewals: 6,
      mrr: 99.99
    },
    {
      id: '2',
      customer: 'Tech Solutions Ltd',
      plan: 'Enterprise',
      status: 'active',
      amount: 299.99,
      interval: 'monthly',
      startDate: '2024-03-01',
      nextBilling: '2024-07-01',
      paymentMethod: '**** 5678',
      renewals: 4,
      mrr: 299.99
    },
    {
      id: '3',
      customer: 'Startup Inc',
      plan: 'Basic',
      status: 'past_due',
      amount: 29.99,
      interval: 'monthly',
      startDate: '2024-02-10',
      nextBilling: '2024-06-10',
      paymentMethod: '**** 9012',
      renewals: 5,
      mrr: 29.99
    }
  ]);

  const [plans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Basic',
      price: 29.99,
      interval: 'monthly',
      features: ['Up to 10 users', 'Basic support', '10GB storage'],
      subscribers: 45,
      revenue: 1349.55,
      status: 'active'
    },
    {
      id: '2',
      name: 'Business Pro',
      price: 99.99,
      interval: 'monthly',
      features: ['Up to 50 users', 'Priority support', '100GB storage', 'Advanced analytics'],
      subscribers: 23,
      revenue: 2299.77,
      status: 'active'
    },
    {
      id: '3',
      name: 'Enterprise',
      price: 299.99,
      interval: 'monthly',
      features: ['Unlimited users', '24/7 support', 'Unlimited storage', 'Custom integrations'],
      subscribers: 8,
      revenue: 2399.92,
      status: 'active'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const subscriptionFilters = [
    { label: 'Active', value: 'active', count: subscriptions.filter(s => s.status === 'active').length },
    { label: 'Past Due', value: 'past_due', count: subscriptions.filter(s => s.status === 'past_due').length },
    { label: 'Cancelled', value: 'cancelled', count: subscriptions.filter(s => s.status === 'cancelled').length }
  ];

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || subscription.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalMRR = subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.mrr, 0);
  const totalSubscribers = subscriptions.filter(s => s.status === 'active').length;
  const churnRate = 3.2; // percentage
  const growthRate = 15.5; // percentage

  const renderSubscriptionsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Customer</div>
        <div className="col-span-2">Plan</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Next Billing</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredSubscriptions.map(subscription => (
        <div key={subscription.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div>
              <p className="font-medium">{subscription.customer}</p>
              <p className="text-sm text-gray-500">{subscription.paymentMethod}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-medium">{subscription.plan}</p>
              <p className="text-sm text-gray-500">{subscription.interval}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-semibold">${subscription.amount}/mo</p>
              <p className="text-sm text-gray-500">{subscription.renewals} renewals</p>
            </div>
          </div>
          <div className="col-span-2">
            <Badge 
              variant={
                subscription.status === 'active' ? 'default' : 
                subscription.status === 'past_due' ? 'destructive' : 
                subscription.status === 'paused' ? 'secondary' : 
                'outline'
              }
            >
              {subscription.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
              {subscription.status === 'past_due' && <AlertCircle className="h-3 w-3 mr-1" />}
              {subscription.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
              {subscription.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <span className="text-sm">{subscription.nextBilling}</span>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPlansList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <Card key={plan.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                {plan.status}
              </Badge>
            </div>
            <div className="text-3xl font-bold">
              ${plan.price}
              <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subscribers</span>
                  <p className="font-semibold">{plan.subscribers}</p>
                </div>
                <div>
                  <span className="text-gray-600">Revenue</span>
                  <p className="font-semibold">${plan.revenue.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Edit Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Subscriptions">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'subscriptions' ? 'Subscriptions' : 'Plans'}
          subtitle={activeTab === 'subscriptions' ? 'Manage recurring subscriptions and billing' : 'Subscription plans and pricing'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          filters={activeTab === 'subscriptions' ? subscriptionFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'subscriptions' ? filteredSubscriptions.length : plans.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="subscriptions" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalMRR.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalSubscribers}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{growthRate}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Churn Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{churnRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderSubscriptionsList()}
            </div>
          </TabsContent>

          <TabsContent value="plans" className="flex-1 p-6">
            {renderPlansList()}
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plans.map(plan => (
                      <div key={plan.id} className="flex items-center justify-between">
                        <span className="text-sm">{plan.name}</span>
                        <span className="font-medium">${plan.revenue.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Revenue Per User</span>
                      <span className="font-medium">${(totalMRR / totalSubscribers).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Lifetime Value</span>
                      <span className="font-medium">$2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-medium">12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Subscriptions;
