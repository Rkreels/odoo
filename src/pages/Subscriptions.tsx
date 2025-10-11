
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RefreshCw, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { LOCAL_STORAGE_KEYS, getStoredData, addRecord, updateRecord, deleteRecord, generateId } from '@/lib/localStorageUtils';

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

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
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
];

const INITIAL_PLANS: SubscriptionPlan[] = [
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
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<{
    customer: string;
    plan: string;
    status: 'active' | 'cancelled' | 'past_due' | 'paused';
    amount: number;
    interval: 'monthly' | 'yearly';
    startDate: string;
    nextBilling: string;
    paymentMethod: string;
  }>({
    customer: '',
    plan: '',
    status: 'active',
    amount: 0,
    interval: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    nextBilling: new Date().toISOString().split('T')[0],
    paymentMethod: ''
  });

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
    loadData();
  }, [navigate]);

  const loadData = () => {
    const loadedSubs = getStoredData<Subscription>(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    const loadedPlans = getStoredData<SubscriptionPlan>(LOCAL_STORAGE_KEYS.SUBSCRIPTION_PLANS, INITIAL_PLANS);
    setSubscriptions(loadedSubs);
    setPlans(loadedPlans);
  };

  const handleCreate = () => {
    const newSubscription: Subscription = {
      id: generateId(),
      ...formData,
      renewals: 0,
      mrr: formData.interval === 'monthly' ? formData.amount : formData.amount / 12
    };
    
    const updated = addRecord<Subscription>(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, newSubscription);
    setSubscriptions(updated);
    setShowCreateDialog(false);
    resetForm();
    toast({ title: 'Success', description: 'Subscription created successfully' });
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      customer: subscription.customer,
      plan: subscription.plan,
      status: subscription.status,
      amount: subscription.amount,
      interval: subscription.interval,
      startDate: subscription.startDate,
      nextBilling: subscription.nextBilling,
      paymentMethod: subscription.paymentMethod
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    if (!selectedSubscription) return;
    
    const updated = updateRecord<Subscription>(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, selectedSubscription.id, {
      ...formData,
      mrr: formData.interval === 'monthly' ? formData.amount : formData.amount / 12
    });
    setSubscriptions(updated);
    setShowEditDialog(false);
    setSelectedSubscription(null);
    resetForm();
    toast({ title: 'Success', description: 'Subscription updated successfully' });
  };

  const handleDelete = (id: string) => {
    const updated = deleteRecord<Subscription>(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, id);
    setSubscriptions(updated);
    toast({ title: 'Success', description: 'Subscription deleted' });
  };

  const handleStatusChange = (id: string, newStatus: Subscription['status']) => {
    const updated = updateRecord<Subscription>(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, id, { status: newStatus });
    setSubscriptions(updated);
    toast({ title: 'Success', description: `Subscription ${newStatus}` });
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      plan: '',
      status: 'active',
      amount: 0,
      interval: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      nextBilling: new Date().toISOString().split('T')[0],
      paymentMethod: ''
    });
  };

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
  const churnRate = 3.2;
  const growthRate = 15.5;

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
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(subscription)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(subscription.id)}>
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Subscriptions">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Subscriptions"
          subtitle="Manage recurring subscriptions and billing"
          searchPlaceholder="Search subscriptions..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateDialog(true)}
          filters={subscriptionFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredSubscriptions.length}
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
                      <span className="font-medium">${totalSubscribers > 0 ? (totalMRR / totalSubscribers).toFixed(2) : '0.00'}</span>
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

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer</label>
                <Input value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Plan</label>
                <Select value={formData.plan} onValueChange={(value) => setFormData({...formData, plan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={plan.name}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-sm font-medium">Interval</label>
                <Select value={formData.interval} onValueChange={(value: any) => setFormData({...formData, interval: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Input value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer</label>
                <Input value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Plan</label>
                <Input value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdate}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OdooMainLayout>
  );
};

export default Subscriptions;