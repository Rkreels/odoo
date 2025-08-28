
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import LeadsList from '@/components/crm/LeadsList';
import ActivitiesList from '@/components/crm/ActivitiesList';
import OpportunitiesList from '@/components/crm/OpportunitiesList';
import ContactsList from '@/components/crm/ContactsList';
import DragDropPipelineView from '@/components/crm/DragDropPipelineView';
import ReportsView from '@/components/crm/ReportsView';
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
import { Opportunity, OpportunityStage } from '@/types/crm'; // Added OpportunityStage
import { getStoredOpportunities } from '@/lib/localStorageUtils';

const CRM = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState("pipeline");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    setOpportunities(getStoredOpportunities());
  }, [navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate dynamic "My Pipeline" value
  const myPipelineValue = opportunities
    .filter(opp => opp.stage.toLowerCase() !== 'won' && opp.stage.toLowerCase() !== 'lost')
    .reduce((sum, opp) => sum + opp.expectedRevenue, 0);

  const dashboardStats = [
    {
      title: 'My Pipeline',
      value: formatCurrency(myPipelineValue),
      change: '+12.5%', // Placeholder, make dynamic later
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Recurring Revenue', // Static for now
      value: '$45,230',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'New Leads', // Static for now
      value: '23',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Activities Due', // Static for now
      value: '8',
      change: '-5.1%',
      trend: 'down',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Calculate dynamic pipeline overview
  const pipelineStageNames: OpportunityStage[] = ['New', 'Qualified', 'Proposition', 'Won']; // Removed 'Lost' for overview
  const pipelineColors: { [key in OpportunityStage]?: string } = {
      'New': 'bg-blue-500',
      'Qualified': 'bg-purple-500',
      'Proposition': 'bg-yellow-500',
      'Won': 'bg-green-500'
  };

  const pipelineOverview = pipelineStageNames.map(stageName => {
    const stageOpps = opportunities.filter(opp => opp.stage === stageName);
    return {
      name: stageName,
      count: stageOpps.length,
      amount: formatCurrency(stageOpps.reduce((sum, opp) => sum + opp.expectedRevenue, 0)),
      color: pipelineColors[stageName] || 'bg-gray-500',
    };
  });

  return (
    <OdooMainLayout currentApp="CRM">
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
              <Button variant="outline" size="sm" onClick={() => setActiveTab("reports")}>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
                {[
                  { value: "pipeline", label: "Pipeline", icon: Target },
                  { value: "leads", label: "Leads", icon: Users },
                  { value: "opportunities", label: "Opportunities", icon: TrendingUp },
                  { value: "activities", label: "Activities", icon: Activity },
                  { value: "contacts", label: "Contacts", icon: Building },
                  { value: "reports", label: "Reports", icon: TrendingUp }
                ].map(tab => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="data-[state=active]:bg-odoo-primary data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-odoo-primary py-3"
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value="pipeline" className="mt-0 p-0">
              <DragDropPipelineView />
            </TabsContent>
            
            <TabsContent value="leads" className="mt-0 p-4">
              <LeadsList />
            </TabsContent>
            
            <TabsContent value="opportunities" className="mt-0 p-0">
              <OpportunitiesList />
            </TabsContent>
            
            <TabsContent value="activities" className="mt-0 p-4">
              <ActivitiesList />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0 p-4">
              <ContactsList />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0 p-0">
              <ReportsView />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </OdooMainLayout>
  );
};

export default CRM;
