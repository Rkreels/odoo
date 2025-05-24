
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Settings, Eye, Edit, Trash } from 'lucide-react';
import { Opportunity, OpportunityStage } from '@/types/crm';
import CreateOpportunityForm from './CreateOpportunityForm';
import EditOpportunityForm from './EditOpportunityForm';
import ViewOpportunityDialog from './ViewOpportunityDialog';
import ConfigurePipelineDialog from './ConfigurePipelineDialog';
import { getStoredOpportunities, storeOpportunities, generateId } from '@/lib/localStorageUtils';

// pipelineStages can be made dynamic later from ConfigurePipelineDialog
const pipelineStages = [
  { id: 'new', name: 'New', color: 'bg-blue-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposition', name: 'Proposition', color: 'bg-yellow-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Lost', color: 'bg-red-500' },
];

const DragDropPipelineView = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    setOpportunities(getStoredOpportunities());
  }, []);

  useEffect(() => {
    // Persist to local storage whenever opportunities change, but only if it's not the initial empty array
    if (opportunities.length > 0 || localStorage.getItem('crmOpportunities')) {
       storeOpportunities(opportunities);
    }
  }, [opportunities]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage.toLowerCase() === stage.toLowerCase());
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

  const handleDrop = (e: React.DragEvent, newStageName: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetStage = pipelineStages.find(s => s.id === newStageName);
    if (!targetStage) return;

    setOpportunities(prev => prev.map(opp => 
      opp.id === draggedItem 
        ? { ...opp, stage: targetStage.name as OpportunityStage }
        : opp
    ));
    setDraggedItem(null);
  };

  const handleOpportunityCreate = (newOpportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newOpportunity: Opportunity = {
      ...newOpportunityData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toLocaleDateString(),
    };
    setOpportunities(prev => [newOpportunity, ...prev]);
  };

  const handleOpportunityUpdate = (updatedOpportunity: Opportunity) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === updatedOpportunity.id ? { ...updatedOpportunity, lastActivity: new Date().toLocaleDateString() } : opp
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
  
  const totalRevenue = opportunities.reduce((sum, opp) => opp.stage.toLowerCase() !== 'lost' ? sum + opp.expectedRevenue : sum, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-odoo-dark">Pipeline</h2>
            <div className="text-sm text-gray-600">
              Total Expected Revenue: {formatCurrency(totalRevenue)}
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

      <div className="p-4 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {pipelineStages.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div 
                key={stage.id} 
                className="bg-gray-50 p-3 rounded-lg w-72 flex-shrink-0" // Adjusted width and added flex-shrink-0
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
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-odoo-dark">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">
                    {formatCurrency(stageTotal)}
                  </div>
                </div>

                <div className="space-y-3 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                  {stageOpportunities.map((opportunity) => (
                    <Card 
                      key={opportunity.id} 
                      className="cursor-grab hover:shadow-lg transition-shadow bg-white"
                      draggable
                      onDragStart={(e) => handleDragStart(e, opportunity.id)}
                      onClick={() => handleView(opportunity)} // Open view dialog on click
                    >
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-semibold leading-tight text-odoo-link hover:underline">
                            {opportunity.name}
                          </CardTitle>
                           {/* Actions moved to a dropdown or a context menu if too cluttered */}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="space-y-1.5">
                          <div className="text-xs text-gray-700 font-medium">
                            {opportunity.customer}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-odoo-primary">
                              {formatCurrency(opportunity.expectedRevenue)}
                            </span>
                            <Badge variant="outline" className="text-xs py-0.5 px-1.5">
                              {opportunity.probability}%
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Closing: {new Date(opportunity.expectedClosing).toLocaleDateString()}
                          </div>
                          
                          {opportunity.tags && opportunity.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {opportunity.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs py-0.5 px-1.5">
                                  {tag}
                                </Badge>
                              ))}
                              {opportunity.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs py-0.5 px-1.5">
                                  +{opportunity.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                            <span>{opportunity.assignedTo}</span>
                            <span>{opportunity.lastActivity}</span>
                          </div>
                           <div className="flex items-center space-x-1 justify-end mt-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleView(opportunity); }}>
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleEdit(opportunity); }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleOpportunityDelete(opportunity.id); }}>
                                <Trash className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full border-2 border-dashed border-gray-300 hover:border-odoo-primary hover:bg-odoo-primary/5 text-odoo-dark hover:text-odoo-primary mt-2"
                    onClick={() => {
                      setSelectedOpportunity(null); // Ensure no selected opp for create
                      setIsCreateModalOpen(true);
                    }}
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
            onClose={() => { setIsEditModalOpen(false); setSelectedOpportunity(null);}}
            opportunity={selectedOpportunity}
            onOpportunityUpdate={handleOpportunityUpdate}
          />

          <ViewOpportunityDialog 
            isOpen={isViewModalOpen}
            onClose={() => { setIsViewModalOpen(false); setSelectedOpportunity(null);}}
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
