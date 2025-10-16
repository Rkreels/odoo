
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import CampaignCard from '@/components/marketing/CampaignCard';
import { Megaphone, Plus, BarChart3, Mail, Share2, Target, TrendingUp, Users, Eye, Edit, Trash, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MarketingCampaign } from '@/types/marketing';
import { toast } from '@/components/ui/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  assignedTo: string;
  createdDate: string;
  lastActivity?: string;
  tags: string[];
}

interface MarketingSegment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  size: number;
  growth: number;
  lastUpdated: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  timesTriggered: number;
  lastTriggered?: string;
}

const Marketing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateSegment, setShowCreateSegment] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    {
      id: '1',
      name: 'Summer Sale Campaign',
      type: 'email',
      status: 'running',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 5000,
      spent: 3200,
      impressions: 45000,
      clicks: 1350,
      conversions: 85,
      targetAudience: 'Previous customers'
    },
    {
      id: '2',
      name: 'New Product Launch',
      type: 'social',
      status: 'scheduled',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      budget: 8000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      targetAudience: 'Tech enthusiasts'
    },
    {
      id: '3',
      name: 'Newsletter Automation',
      type: 'email',
      status: 'running',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 12000,
      spent: 4800,
      impressions: 120000,
      clicks: 8400,
      conversions: 420,
      targetAudience: 'All subscribers'
    }
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0123',
      company: 'Tech Solutions Inc',
      source: 'Website',
      status: 'qualified',
      value: 15000,
      assignedTo: 'Sarah Johnson',
      createdDate: '2024-01-20',
      lastActivity: '2024-01-25',
      tags: ['enterprise', 'hot-lead']
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily@startup.com',
      company: 'Innovation Startup',
      source: 'Social Media',
      status: 'new',
      value: 8500,
      assignedTo: 'Mike Wilson',
      createdDate: '2024-01-22',
      tags: ['startup', 'software']
    }
  ]);

  const [segments, setSegments] = useState<MarketingSegment[]>([
    {
      id: '1',
      name: 'Enterprise Customers',
      description: 'Large companies with 100+ employees',
      criteria: 'Company size > 100 AND Revenue > $1M',
      size: 1250,
      growth: 15.5,
      lastUpdated: '2024-01-20'
    },
    {
      id: '2',
      name: 'Tech Enthusiasts',
      description: 'Users interested in technology products',
      criteria: 'Tags contain "tech" OR Industry = "Technology"',
      size: 3400,
      growth: 22.8,
      lastUpdated: '2024-01-18'
    }
  ]);

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Welcome Email Series',
      trigger: 'New subscriber',
      action: 'Send welcome email sequence',
      active: true,
      timesTriggered: 156,
      lastTriggered: '2024-01-25T10:30:00'
    },
    {
      id: '2',
      name: 'Abandoned Cart Recovery',
      trigger: 'Cart abandoned for 24 hours',
      action: 'Send recovery email with discount',
      active: true,
      timesTriggered: 89,
      lastTriggered: '2024-01-25T14:15:00'
    }
  ]);

  useEffect(() => {
    // Auth check handled by context
  }, []);

  const handleUpdateCampaign = (updatedCampaign: MarketingCampaign) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign: MarketingCampaign = {
      id: Date.now().toString(),
      ...campaignData,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowCreateCampaign(false);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    ));
  };

  const handleEditCampaign = (campaign: MarketingCampaign) => {
    setSelectedCampaign(campaign);
    setShowCreateCampaign(true);
  };

  const handleDuplicateCampaign = (campaign: MarketingCampaign) => {
    const duplicated: MarketingCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: campaign.name + ' (Copy)',
      status: 'draft',
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0
    };
    setCampaigns(prev => [duplicated, ...prev]);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const campaignFilters = [
    { label: 'All Campaigns', value: 'all', count: campaigns.length },
    { label: 'Running', value: 'running', count: campaigns.filter(c => c.status === 'running').length },
    { label: 'Scheduled', value: 'scheduled', count: campaigns.filter(c => c.status === 'scheduled').length },
    { label: 'Draft', value: 'draft', count: campaigns.filter(c => c.status === 'draft').length },
    { label: 'Completed', value: 'completed', count: campaigns.filter(c => c.status === 'completed').length }
  ];

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const conversionRate = campaigns.length > 0 ? Math.round((totalConversions / campaigns.reduce((sum, c) => sum + c.clicks, 0)) * 100) : 0;

  const renderCampaignsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Campaign</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Budget</div>
        <div className="col-span-1">Spent</div>
        <div className="col-span-1">Clicks</div>
        <div className="col-span-1">Conversions</div>
        <div className="col-span-1">ROI</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {filteredCampaigns.map(campaign => {
        const roi = campaign.spent > 0 ? Math.round(((campaign.conversions * 100) - campaign.spent) / campaign.spent * 100) : 0;
        return (
          <div key={campaign.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
            <div className="col-span-3">
              <p className="font-medium text-sm">{campaign.name}</p>
              <p className="text-xs text-gray-600">{campaign.targetAudience}</p>
            </div>
            <div className="col-span-1">
              <Badge variant="outline">{campaign.type}</Badge>
            </div>
            <div className="col-span-1">
              <Badge variant={
                campaign.status === 'running' ? 'default' : 
                campaign.status === 'scheduled' ? 'secondary' :
                campaign.status === 'completed' ? 'outline' : 'destructive'
              }>
                {campaign.status}
              </Badge>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-sm">${campaign.budget.toLocaleString()}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm">${campaign.spent.toLocaleString()}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm">{campaign.clicks.toLocaleString()}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm">{campaign.conversions}</p>
            </div>
            <div className="col-span-1">
              <p className={`text-sm font-medium ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roi}%
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => setSelectedCampaign(campaign)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditCampaign(campaign)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">⋮</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white z-50">
                    <DropdownMenuItem onClick={() => handleDuplicateCampaign(campaign)}>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCampaign(campaign.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Marketing">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'campaigns' ? 'Marketing Campaigns' : activeTab === 'leads' ? 'Lead Management' : activeTab === 'segments' ? 'Customer Segments' : 'Automation'}
          subtitle={
            activeTab === 'campaigns' ? 'Create and manage marketing campaigns' :
            activeTab === 'leads' ? 'Track and nurture leads through the sales funnel' :
            activeTab === 'segments' ? 'Define and manage customer segments' :
            'Set up marketing automation workflows'
          }
          searchPlaceholder="Search campaigns..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateCampaign(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={campaignFilters}
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          recordCount={filteredCampaigns.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="segments">Segments</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="campaigns" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalBudget.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${totalSpent.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{totalConversions}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{conversionRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderCampaignsList() : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onUpdate={handleUpdateCampaign}
                    />
                  ))}
                </div>
              )}
              
              {filteredCampaigns.length === 0 && (
                <div className="text-center py-8">
                  <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No campaigns found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="leads" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalLeads}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Qualified Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{qualifiedLeads}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pipeline Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">${leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{Math.round((qualifiedLeads / totalLeads) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-3">Lead</div>
                <div className="col-span-2">Company</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Value</div>
                <div className="col-span-2">Assigned To</div>
                <div className="col-span-1">Created</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {leads.map(lead => (
                <div key={lead.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                  <div className="col-span-3">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-600">{lead.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">{lead.company || 'N/A'}</p>
                  </div>
                  <div className="col-span-1">
                    <Badge variant="outline">{lead.source}</Badge>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={
                      lead.status === 'won' ? 'default' : 
                      lead.status === 'qualified' ? 'secondary' :
                      lead.status === 'lost' ? 'destructive' : 'outline'
                    }>
                      {lead.status}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <p className="font-medium text-sm">${lead.value.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">{lead.assignedTo}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm">{lead.createdDate}</p>
                  </div>
                  <div className="col-span-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="segments" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map(segment => (
                <Card key={segment.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Size:</span>
                        <span className="font-medium">{segment.size.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth:</span>
                        <span className="font-medium text-green-600">+{segment.growth}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Updated:</span>
                        <span className="font-medium">{segment.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>Criteria: {segment.criteria}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="flex-1 p-6">
            <div className="space-y-4">
              {automationRules.map(rule => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{rule.action}</p>
                      </div>
                      <Badge variant={rule.active ? 'default' : 'secondary'}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Trigger</p>
                        <p className="font-medium">{rule.trigger}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Times Triggered</p>
                        <p className="font-medium">{rule.timesTriggered}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Triggered</p>
                        <p className="font-medium">{rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Campaign Dialog */}
        <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Campaign name" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="display">Display Ads</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Budget" />
              <Textarea placeholder="Target audience description" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>Cancel</Button>
              <Button onClick={() => handleCreateCampaign({
                name: 'New Campaign',
                type: 'email',
                status: 'draft',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: 1000,
                targetAudience: 'All customers'
              })}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OdooMainLayout>
  );
};

export default Marketing;
