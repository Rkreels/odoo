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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { Lead, LeadStatus } from '@/types/crm';
import CreateLeadForm from './CreateLeadForm';

const initialLeadsData: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Acme Corporation',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    status: 'New',
    assignedTo: 'Jane Doe',
    lastActivity: '1 day ago',
    expectedRevenue: '$5,000',
    address: { city: 'New York', country: 'USA' },
    leadSource: 'Website',
    priority: 'High',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'XYZ Industries',
    email: 'sarah.j@xyz.com',
    phone: '+1 (555) 987-6543',
    status: 'Qualified',
    assignedTo: 'Mike Wilson',
    lastActivity: '3 days ago',
    expectedRevenue: '$12,000',
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Robert Davis',
    company: 'Globex Corporation',
    email: 'rdavis@globex.com',
    phone: '+1 (555) 456-7890',
    status: 'Proposition',
    assignedTo: 'Jane Doe',
    lastActivity: '2 hours ago',
    expectedRevenue: '$8,750',
    priority: 'Medium',
  },
  {
    id: '4',
    name: 'Emily Chen',
    company: 'Tech Innovators',
    email: 'emily@techinnovators.com',
    phone: '+1 (555) 234-5678',
    status: 'Won',
    assignedTo: 'Mike Wilson',
    lastActivity: '1 week ago',
    expectedRevenue: '$15,000',
    priority: 'Low',
  },
  {
    id: '5',
    name: 'Michael Brown',
    company: 'Summit Enterprises',
    email: 'mbrown@summit.com',
    phone: '+1 (555) 345-6789',
    status: 'Lost',
    assignedTo: 'Jane Doe',
    lastActivity: '5 days ago',
    expectedRevenue: '$0',
    priority: 'Medium',
  },
];

const LeadsList = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);

  const handleLeadCreate = (newLead: Lead) => {
    setLeads(prevLeads => [newLead, ...prevLeads]);
    console.log('New Lead Created:', newLead);
    // Future: Add toast notification for success
  };
  
  const filteredLeads = filterStatus === 'all' 
    ? leads 
    : leads.filter(lead => lead.status.toLowerCase() === filterStatus.toLowerCase());

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Qualified':
        return 'bg-purple-100 text-purple-800';
      case 'Proposition':
        return 'bg-yellow-100 text-yellow-800';
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="mr-2 bg-odoo-primary text-white hover:bg-odoo-primary/90"
            onClick={() => setIsCreateLeadModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
          <Button variant="outline" className="mr-2" disabled={selectedLeads.length === 0}>
            Mass Action
          </Button>
          <div className="relative ml-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-odoo-primary focus:border-odoo-primary w-full sm:w-auto"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <select 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="proposition">Proposition</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          
          <Button variant="outline" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
          </Button>
          
          <Button variant="outline" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Group By
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} 
                  onCheckedChange={toggleSelectAll} 
                  aria-label="Select all leads"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Lead Source</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Expected Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)} 
                      onCheckedChange={() => toggleSelectLead(lead.id)} 
                      aria-label={`Select ${lead.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)} variant="outline">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.priority || '-'}</TableCell>
                  <TableCell>{lead.leadSource || '-'}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>{lead.lastActivity}</TableCell>
                  <TableCell>{lead.expectedRevenue}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  No leads found matching your filters. Try adjusting your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-odoo-gray">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      <CreateLeadForm 
        isOpen={isCreateLeadModalOpen}
        onClose={() => setIsCreateLeadModalOpen(false)}
        onLeadCreate={handleLeadCreate}
      />
    </div>
  );
};

export default LeadsList;
