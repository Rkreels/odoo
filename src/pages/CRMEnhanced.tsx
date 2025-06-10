
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, DollarSign, Target, TrendingUp, Phone, Mail, 
  Calendar, MessageSquare, FileText, MapPin, Star,
  Activity, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  stage: string;
  expectedRevenue: number;
  probability: number;
  salesperson: string;
  country: string;
  tags: string[];
  activities: Activity[];
  createdDate: string;
  lastActivity: string;
  priority: 'low' | 'medium' | 'high';
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  date: string;
  completed: boolean;
  description?: string;
}

const CRMEnhanced = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'list' | 'kanban' | 'calendar'>('kanban');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 234 567 8901',
      company: 'Tech Corp',
      source: 'Website',
      stage: 'New',
      expectedRevenue: 15000,
      probability: 10,
      salesperson: 'Alice Johnson',
      country: 'USA',
      tags: ['enterprise', 'hot'],
      activities: [
        { id: '1', type: 'call', subject: 'Initial call', date: '2024-01-15', completed: true },
        { id: '2', type: 'email', subject: 'Follow up email', date: '2024-01-20', completed: false }
      ],
      createdDate: '2024-01-10',
      lastActivity: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@startup.com',
      phone: '+1 234 567 8902',
      company: 'Startup Inc',
      source: 'Referral',
      stage: 'Qualified',
      expectedRevenue: 8000,
      probability: 30,
      salesperson: 'Bob Chen',
      country: 'Canada',
      tags: ['startup', 'warm'],
      activities: [
        { id: '3', type: 'meeting', subject: 'Demo presentation', date: '2024-01-18', completed: true }
      ],
      createdDate: '2024-01-08',
      lastActivity: '2024-01-18',
      priority: 'medium'
    }
  ];

  const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  
  const filters = [
    { label: 'My Pipeline', value: 'my', count: 12 },
    { label: 'New', value: 'new', count: 5 },
    { label: 'Qualified', value: 'qualified', count: 8 },
    { label: 'Won This Month', value: 'won_month', count: 3 },
    { label: 'Lost', value: 'lost', count: 2 }
  ];

  const actions = [
    { label: 'Import', icon: <FileText className="h-4 w-4" />, onClick: () => {} },
    { label: 'Export', icon: <FileText className="h-4 w-4" />, onClick: () => {} }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Proposal': 'bg-yellow-100 text-yellow-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Won': 'bg-emerald-100 text-emerald-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const renderKanbanView = () => (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = leads.filter(lead => lead.stage === stage);
        const stageRevenue = stageLeads.reduce((sum, lead) => sum + lead.expectedRevenue, 0);
        
        return (
          <div key={stage} className="min-w-80 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{stage}</h3>
                <p className="text-sm text-gray-600">
                  {stageLeads.length} leads • ${stageRevenue.toLocaleString()}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Star className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {stageLeads.map((lead) => (
                <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className={`h-3 w-3 ${getPriorityColor(lead.priority)}`} />
                        <span className="text-xs text-gray-500">{lead.probability}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expected Revenue</span>
                        <span className="font-medium">${lead.expectedRevenue.toLocaleString()}</span>
                      </div>
                      
                      <Progress value={lead.probability} className="h-2" />
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{lead.country}</span>
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{lead.lastActivity}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salesperson
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-odoo-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {lead.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStageColor(lead.stage)}>
                    {lead.stage}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${lead.expectedRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Progress value={lead.probability} className="w-16 h-2 mr-2" />
                    <span className="text-sm text-gray-600">{lead.probability}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lead.salesperson}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.lastActivity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <OdooMainLayout currentApp="CRM">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Pipeline"
          subtitle="Track your sales opportunities"
          onCreateNew={() => console.log('Create new lead')}
          viewType={activeView}
          onViewChange={(view) => setActiveView(view as any)}
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          actions={actions}
          recordCount={leads.length}
          onSearch={setSearchTerm}
        />

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pipeline</p>
                  <p className="text-2xl font-bold text-gray-900">$127K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Won This Month</p>
                  <p className="text-2xl font-bold text-gray-900">$45K</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">24%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-6">
          {activeView === 'kanban' && renderKanbanView()}
          {activeView === 'list' && renderListView()}
          {activeView === 'calendar' && (
            <div className="bg-white rounded-lg border p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Calendar View</h3>
              <p className="text-gray-600">Calendar view coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </OdooMainLayout>
  );
};

export default CRMEnhanced;
