
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Filter, TrendingUp, Eye, Edit, Trash } from 'lucide-react';
import { Opportunity, OpportunityStage } from '@/types/crm';
import { getStoredOpportunities, storeOpportunities, generateId } from '@/lib/localStorageUtils';
import CreateOpportunityForm from './CreateOpportunityForm';
import EditOpportunityForm from './EditOpportunityForm';
import ViewOpportunityDialog from './ViewOpportunityDialog';

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [filterStage, setFilterStage] = useState<string>('all');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<Opportunity | null>(null);


  useEffect(() => {
    setOpportunities(getStoredOpportunities());
  }, []);

  useEffect(() => {
     if (opportunities.length > 0 || localStorage.getItem('crmOpportunities')) {
       storeOpportunities(opportunities);
    }
  }, [opportunities]);

  const filteredOpportunities = filterStage === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.stage.toLowerCase() === filterStage.toLowerCase());

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-purple-100 text-purple-800';
      case 'Proposition': return 'bg-yellow-100 text-yellow-800';
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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
    setSelectedOpportunities(prev => prev.filter(id => id !== opportunityId));
  };
  
  const handleView = (opportunity: Opportunity) => {
    setCurrentOpportunity(opportunity);
    setIsViewModalOpen(true);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setCurrentOpportunity(opportunity);
    setIsEditModalOpen(true);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedOpportunities(filteredOpportunities.map(opp => opp.id));
    } else {
      setSelectedOpportunities([]);
    }
  };

  const isAllSelected = filteredOpportunities.length > 0 && selectedOpportunities.length === filteredOpportunities.length;
  const isIndeterminate = selectedOpportunities.length > 0 && selectedOpportunities.length < filteredOpportunities.length;


  const totalRevenue = filteredOpportunities.filter(op => op.stage.toLowerCase() !== 'lost').reduce((sum, opp) => sum + opp.expectedRevenue, 0);
  const weightedRevenue = filteredOpportunities.filter(op => op.stage.toLowerCase() !== 'lost').reduce((sum, opp) => sum + (opp.expectedRevenue * opp.probability / 100), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-odoo-dark">Opportunities</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total Expected: {formatCurrency(totalRevenue)}</span>
              <span>•</span>
              <span>Weighted Revenue: {formatCurrency(weightedRevenue)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Opportunity
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <select 
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <option value="all">All Stages</option>
              {['New', 'Qualified', 'Proposition', 'Won', 'Lost'].map(stage => (
                <option key={stage} value={stage.toLowerCase()}>{stage}</option>
              ))}
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </Button>
          </div>
           {selectedOpportunities.length > 0 && (
             <Button variant="destructive" size="sm" onClick={() => {
                selectedOpportunities.forEach(id => handleOpportunityDelete(id));
             }}>
               <Trash className="h-4 w-4 mr-1" /> Delete ({selectedOpportunities.length})
             </Button>
           )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 px-2">
                <Checkbox 
                  checked={isAllSelected || isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all opportunities"
                />
              </TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Expected Revenue</TableHead>
              <TableHead className="text-center">Probability</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Expected Closing</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpportunities.map((opportunity) => (
              <TableRow key={opportunity.id} className="hover:bg-gray-50" onClick={() => handleView(opportunity)}>
                <TableCell className="px-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedOpportunities.includes(opportunity.id)}
                    onCheckedChange={() => {
                      setSelectedOpportunities(prev => 
                        prev.includes(opportunity.id)
                          ? prev.filter(id => id !== opportunity.id)
                          : [...prev, opportunity.id]
                      );
                    }}
                    aria-label={`Select opportunity ${opportunity.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-odoo-link hover:underline">{opportunity.name}</div>
                    {opportunity.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">{opportunity.description}</div>
                    )}
                    {opportunity.tags && opportunity.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {opportunity.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{opportunity.customer}</TableCell>
                <TableCell className="text-right">{formatCurrency(opportunity.expectedRevenue)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                     <span className="text-sm">{opportunity.probability}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-odoo-primary h-1.5 rounded-full"
                        style={{ width: `${opportunity.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStageColor(opportunity.stage)} border border-current`} variant="outline">
                    {opportunity.stage}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(opportunity.expectedClosing).toLocaleDateString()}</TableCell>
                <TableCell>{opportunity.assignedTo}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleView(opportunity)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(opportunity)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpportunityDelete(opportunity.id)}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredOpportunities.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No opportunities found for the selected criteria.
        </div>
      )}

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredOpportunities.length} of {opportunities.length} opportunities
        </div>
        {/* Basic pagination (can be improved) */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>

      <CreateOpportunityForm 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOpportunityCreate={handleOpportunityCreate}
      />

      {currentOpportunity && (
        <>
          <EditOpportunityForm 
            isOpen={isEditModalOpen}
            onClose={() => { setIsEditModalOpen(false); setCurrentOpportunity(null);}}
            opportunity={currentOpportunity}
            onOpportunityUpdate={handleOpportunityUpdate}
          />

          <ViewOpportunityDialog 
            isOpen={isViewModalOpen}
            onClose={() => { setIsViewModalOpen(false); setCurrentOpportunity(null);}}
            opportunity={currentOpportunity}
          />
        </>
      )}
    </div>
  );
};

export default OpportunitiesList;
