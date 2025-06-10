
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Edit,
  Archive,
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: 'new' | 'qualified' | 'proposition' | 'won' | 'lost';
  value: number;
  probability: number;
  salesperson: string;
  source: string;
  country: string;
  createdDate: string;
  nextActivity?: {
    type: 'call' | 'meeting' | 'email';
    date: string;
    summary: string;
  };
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

const CRMEnhanced = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Smith',
      company: 'Tech Corp',
      email: 'john@techcorp.com',
      phone: '+1 234 567 8900',
      stage: 'qualified',
      value: 15000,
      probability: 60,
      salesperson: 'Sarah Johnson',
      source: 'Website',
      country: 'USA',
      createdDate: '2024-01-15',
      nextActivity: {
        type: 'meeting',
        date: '2024-01-25',
        summary: 'Product demo'
      },
      tags: ['enterprise', 'hot'],
      priority: 'high'
    },
    {
      id: '2',
      name: 'Emily Davis',
      company: 'StartupXYZ',
      email: 'emily@startupxyz.com',
      phone: '+1 234 567 8901',
      stage: 'proposition',
      value: 8500,
      probability: 40,
      salesperson: 'Mike Wilson',
      source: 'Referral',
      country: 'Canada',
      createdDate: '2024-01-10',
      nextActivity: {
        type: 'call',
        date: '2024-01-24',
        summary: 'Follow up on proposal'
      },
      tags: ['startup'],
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      company: 'Global Industries',
      email: 'robert@global.com',
      phone: '+1 234 567 8902',
      stage: 'new',
      value: 25000,
      probability: 20,
      salesperson: 'Sarah Johnson',
      source: 'Trade Show',
      country: 'USA',
      createdDate: '2024-01-20',
      tags: ['enterprise'],
      priority: 'medium'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const stages = [
    { key: 'new', name: 'New', color: 'bg-gray-500' },
    { key: 'qualified', name: 'Qualified', color: 'bg-blue-500' },
    { key: 'proposition', name: 'Proposition', color: 'bg-yellow-500' },
    { key: 'won', name: 'Won', color: 'bg-green-500' },
    { key: 'lost', name: 'Lost', color: 'bg-red-500' }
  ];

  const filters = [
    { label: 'My Pipeline', value: 'my', count: 5 },
    { label: 'New', value: 'new', count: 3 },
    { label: 'Qualified', value: 'qualified', count: 8 },
    { label: 'Won This Month', value: 'won', count: 12 },
    { label: 'Overdue Activities', value: 'overdue', count: 2 }
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || lead.stage === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const expectedRevenue = leads.reduce((sum, lead) => sum + (lead.value * lead.probability / 100), 0);

  const renderKanbanView = () => (
    <div className="flex space-x-4 p-6 overflow-x-auto">
      {stages.map(stage => {
        const stageLeads = filteredLeads.filter(lead => lead.stage === stage.key);
        const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
        
        return (
          <div key={stage.key} className="flex-shrink-0 w-80">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-medium">{stage.name}</h3>
                  <Badge variant="secondary">{stageLeads.length}</Badge>
                </div>
                <span className="text-sm text-gray-600">${stageValue.toLocaleString()}</span>
              </div>
              
              <div className="space-y-3">
                {stageLeads.map(lead => (
                  <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{lead.name}</h4>
                          <p className="text-xs text-gray-600">{lead.company}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">${lead.value.toLocaleString()}</span>
                          <Badge variant={lead.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {lead.probability}%
                          </Badge>
                        </div>
                        
                        {lead.nextActivity && (
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{lead.nextActivity.date} - {lead.nextActivity.summary}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" />
                            <span>{lead.salesperson}</span>
                          </div>
                          {lead.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Lead</div>
          <div className="col-span-2">Company</div>
          <div className="col-span-1">Stage</div>
          <div className="col-span-1">Expected Revenue</div>
          <div className="col-span-1">Probability</div>
          <div className="col-span-2">Next Activity</div>
          <div className="col-span-2">Salesperson</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {filteredLeads.map(lead => (
          <div key={lead.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                {lead.priority === 'high' && <Star className="h-4 w-4 text-yellow-500" />}
                <div>
                  <p className="font-medium text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-600">{lead.email}</p>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm">{lead.company}</p>
              <p className="text-xs text-gray-600">{lead.country}</p>
            </div>
            <div className="col-span-1">
              <Badge variant="secondary">{stages.find(s => s.key === lead.stage)?.name}</Badge>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-sm">${lead.value.toLocaleString()}</p>
            </div>
            <div className="col-span-1">
              <Badge variant={lead.probability > 50 ? 'default' : 'secondary'}>
                {lead.probability}%
              </Badge>
            </div>
            <div className="col-span-2">
              {lead.nextActivity ? (
                <div className="text-xs">
                  <p className="font-medium">{lead.nextActivity.summary}</p>
                  <p className="text-gray-600">{lead.nextActivity.date}</p>
                </div>
              ) : (
                <span className="text-xs text-gray-400">No activity</span>
              )}
            </div>
            <div className="col-span-2">
              <p className="text-sm">{lead.salesperson}</p>
            </div>
            <div className="col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <OdooMainLayout currentApp="CRM">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Pipeline"
          subtitle="Track leads and opportunities"
          searchPlaceholder="Search opportunities..."
          onSearch={setSearchTerm}
          onCreateNew={() => console.log('Create new lead')}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredLeads.length}
          actions={[
            { label: 'Import', onClick: () => console.log('Import') },
            { label: 'Export', onClick: () => console.log('Export') }
          ]}
        />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">${totalValue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Expected Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">${expectedRevenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">{leads.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">24%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {viewType === 'kanban' && renderKanbanView()}
          {viewType === 'list' && renderListView()}
          {viewType === 'calendar' && (
            <div className="p-6 text-center text-gray-500">
              Calendar view coming soon...
            </div>
          )}
        </div>
      </div>
    </OdooMainLayout>
  );
};

export default CRMEnhanced;
