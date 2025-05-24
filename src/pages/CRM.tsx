
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import LeadsList from '@/components/crm/LeadsList';
import ActivitiesList from '@/components/crm/ActivitiesList';
import OpportunitiesList from '@/components/crm/OpportunitiesList';
import ContactsList from '@/components/crm/ContactsList';
import PipelineView from '@/components/crm/PipelineView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Calendar,
  DollarSign,
  Activity,
  Building
} from 'lucide-react';

const CRM = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const dashboardStats = [
    {
      title: 'My Pipeline',
      value: '$124,750',
      change: '+12.5%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '$45,230',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'New Leads',
      value: '23',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Activities Due',
      value: '8',
      change: '-5.1%',
      trend: 'down',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const pipelineOverview = [
    { name: 'New', count: 12, amount: '$48,500', color: 'bg-blue-500' },
    { name: 'Qualified', count: 8, amount: '$67,200', color: 'bg-purple-500' },
    { name: 'Proposition', count: 5, amount: '$125,750', color: 'bg-yellow-500' },
    { name: 'Won', count: 3, amount: '$89,300', color: 'bg-green-500' },
  ];

  return (
    <TopbarDashboardLayout currentApp="CRM">
      <div className="p-6 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-odoo-dark">{stat.value}</div>
                <div className="flex items-center text-sm">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-odoo-dark">
                Pipeline Overview
              </CardTitle>
              <Button variant="outline" size="sm">
                View Reports
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {pipelineOverview.map((stage) => (
                <div key={stage.name} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
                    <h3 className="font-medium text-odoo-dark">{stage.name}</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-odoo-dark">{stage.count}</p>
                    <p className="text-sm text-gray-600">Opportunities</p>
                    <p className="text-lg font-semibold text-odoo-primary">{stage.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main CRM Tabs */}
        <Card>
          <Tabs defaultValue="pipeline" className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="pipeline" 
                  className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Pipeline
                </TabsTrigger>
                <TabsTrigger 
                  value="leads"
                  className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Leads
                </TabsTrigger>
                <TabsTrigger 
                  value="opportunities"
                  className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Opportunities
                </TabsTrigger>
                <TabsTrigger 
                  value="activities"
                  className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Activities
                </TabsTrigger>
                <TabsTrigger 
                  value="contacts"
                  className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger 
                  value="reports"
                  className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pipeline" className="mt-0">
              <PipelineView />
            </TabsContent>
            
            <TabsContent value="leads" className="mt-0">
              <LeadsList />
            </TabsContent>
            
            <TabsContent value="opportunities" className="mt-0">
              <OpportunitiesList />
            </TabsContent>
            
            <TabsContent value="activities" className="mt-0">
              <ActivitiesList />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0">
              <ContactsList />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <div className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
                <p className="text-gray-500">Advanced reporting features coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </TopbarDashboardLayout>
  );
};

export default CRM;
