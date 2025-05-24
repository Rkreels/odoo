
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Settings } from 'lucide-react';
import { Opportunity, OpportunityStage } from '@/types/crm';

const pipelineStages = [
  { id: 'new', name: 'New', color: 'bg-blue-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposition', name: 'Proposition', color: 'bg-yellow-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Lost', color: 'bg-red-500' },
];

const initialOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Website Redesign Project',
    customer: 'Acme Corporation',
    expectedRevenue: 25000,
    probability: 75,
    stage: 'Proposition',
    expectedClosing: '2024-02-15',
    assignedTo: 'Jane Doe',
    createdAt: '2024-01-10',
    lastActivity: '2 days ago',
    tags: ['Website', 'Design'],
  },
  {
    id: '2',
    name: 'Enterprise Software License',
    customer: 'XYZ Industries',
    expectedRevenue: 50000,
    probability: 60,
    stage: 'Qualified',
    expectedClosing: '2024-03-01',
    assignedTo: 'Mike Wilson',
    createdAt: '2024-01-15',
    lastActivity: '1 day ago',
    tags: ['Software', 'Enterprise'],
  },
  {
    id: '3',
    name: 'Digital Marketing Campaign',
    customer: 'Tech Innovators',
    expectedRevenue: 15000,
    probability: 90,
    stage: 'Won',
    expectedClosing: '2024-01-30',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-05',
    lastActivity: '1 week ago',
    tags: ['Marketing', 'Digital'],
  },
  {
    id: '4',
    name: 'Mobile App Development',
    customer: 'StartupXYZ',
    expectedRevenue: 35000,
    probability: 40,
    stage: 'New',
    expectedClosing: '2024-04-01',
    assignedTo: 'Jane Doe',
    createdAt: '2024-01-22',
    lastActivity: '3 hours ago',
    tags: ['Mobile', 'Development'],
  },
];

const PipelineView = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage.toLowerCase() === stage);
  };

  const getStageTotal = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + opp.expectedRevenue, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-odoo-dark">Pipeline</h2>
            <div className="text-sm text-gray-600">
              Total Revenue: {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.expectedRevenue, 0))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              New Opportunity
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineStages.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div key={stage.id} className="min-h-[600px]">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                      <h3 className="font-medium text-odoo-dark">{stage.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {stageOpportunities.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(stageTotal)}
                  </div>
                </div>

                <div className="space-y-3">
                  {stageOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium leading-tight">
                          {opportunity.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            {opportunity.customer}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-odoo-primary">
                              {formatCurrency(opportunity.expectedRevenue)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {opportunity.probability}%
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {new Date(opportunity.expectedClosing).toLocaleDateString()}
                          </div>
                          
                          {opportunity.tags && opportunity.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {opportunity.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {opportunity.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{opportunity.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {opportunity.assignedTo}
                            </div>
                            <div className="text-xs text-gray-500">
                              {opportunity.lastActivity}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full border-2 border-dashed border-gray-300 hover:border-odoo-primary hover:bg-odoo-primary/5"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Opportunity
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelineView;
