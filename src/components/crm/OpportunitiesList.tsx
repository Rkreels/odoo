
import { useState } from 'react';
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
import { Plus, Filter, TrendingUp } from 'lucide-react';
import { Opportunity, OpportunityStage } from '@/types/crm';

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
    description: 'Complete website redesign with modern UI/UX',
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
    description: 'Annual software license renewal',
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
    description: 'Complete digital marketing strategy and implementation',
  },
];

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [filterStage, setFilterStage] = useState<string>('all');

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

  const totalRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.expectedRevenue, 0);
  const weightedRevenue = filteredOpportunities.reduce((sum, opp) => sum + (opp.expectedRevenue * opp.probability / 100), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-odoo-dark">Opportunities</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total: {formatCurrency(totalRevenue)}</span>
              <span>•</span>
              <span>Weighted: {formatCurrency(weightedRevenue)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              New Opportunity
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="proposition">Proposition</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            More Filters
          </Button>
          
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            Reports
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Expected Revenue</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Expected Closing</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpportunities.map((opportunity) => (
              <TableRow key={opportunity.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedOpportunities.includes(opportunity.id)}
                    onCheckedChange={() => {
                      setSelectedOpportunities(prev => 
                        prev.includes(opportunity.id)
                          ? prev.filter(id => id !== opportunity.id)
                          : [...prev, opportunity.id]
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{opportunity.name}</div>
                    {opportunity.description && (
                      <div className="text-sm text-gray-500">{opportunity.description}</div>
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
                <TableCell>{formatCurrency(opportunity.expectedRevenue)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-odoo-primary h-2 rounded-full"
                        style={{ width: `${opportunity.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{opportunity.probability}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStageColor(opportunity.stage)} variant="outline">
                    {opportunity.stage}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(opportunity.expectedClosing).toLocaleDateString()}</TableCell>
                <TableCell>{opportunity.assignedTo}</TableCell>
                <TableCell>{opportunity.lastActivity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredOpportunities.length} of {opportunities.length} opportunities
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesList;
