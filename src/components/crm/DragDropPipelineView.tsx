
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Settings, Eye, Edit, Trash } from 'lucide-react';
import { Opportunity, OpportunityStage } from '@/types/crm';
import CreateOpportunityForm from './CreateOpportunityForm';
import EditOpportunityForm from './EditOpportunityForm';
import ViewOpportunityDialog from './ViewOpportunityDialog';
import ConfigurePipelineDialog from './ConfigurePipelineDialog';

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

const pipelineStages = [
  { id: 'new', name: 'New', color: 'bg-blue-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposition', name: 'Proposition', color: 'bg-yellow-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Lost', color: 'bg-red-500' },
];

const DragDropPipelineView = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

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

  const handleDragStart = (e: React.DragEvent, opportunityId: string) => {
    setDraggedItem(opportunityId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    setOpportunities(prev => prev.map(opp => 
      opp.id === draggedItem 
        ? { ...opp, stage: newStage.charAt(0).toUpperCase() + newStage.slice(1) as OpportunityStage }
        : opp
    ));
    setDraggedItem(null);
  };

  const handleOpportunityCreate = (newOpportunity: Opportunity) => {
    setOpportunities(prev => [newOpportunity, ...prev]);
  };

  const handleOpportunityUpdate = (updatedOpportunity: Opportunity) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === updatedOpportunity.id ? updatedOpportunity : opp
    ));
  };

  const handleOpportunityDelete = (opportunityId: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
  };

  const handleView = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsViewModalOpen(true);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditModalOpen(true);
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
            <Button variant="outline" size="sm" onClick={() => setIsConfigureModalOpen(true)}>
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90" onClick={() => setIsCreateModalOpen(true)}>
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
              <div 
                key={stage.id} 
                className="min-h-[600px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
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
                    <Card 
                      key={opportunity.id} 
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, opportunity.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium leading-tight">
                            {opportunity.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleView(opportunity)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(opportunity)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleOpportunityDelete(opportunity.id)}>
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
                    onClick={() => setIsCreateModalOpen(true)}
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

      <CreateOpportunityForm 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOpportunityCreate={handleOpportunityCreate}
      />

      {selectedOpportunity && (
        <>
          <EditOpportunityForm 
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            opportunity={selectedOpportunity}
            onOpportunityUpdate={handleOpportunityUpdate}
          />

          <ViewOpportunityDialog 
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            opportunity={selectedOpportunity}
          />
        </>
      )}

      <ConfigurePipelineDialog 
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
      />
    </div>
  );
};

export default DragDropPipelineView;
