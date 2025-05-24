
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
import { Plus, Filter, Building, User } from 'lucide-react';
import { Contact } from '@/types/crm';

const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'info@acme.com',
    phone: '+1 (555) 123-4567',
    isCompany: true,
    address: { city: 'New York', country: 'USA' },
    tags: ['Customer', 'Enterprise'],
    createdAt: '2024-01-15',
    lastActivity: '2 days ago',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4568',
    company: 'Acme Corporation',
    jobTitle: 'CEO',
    isCompany: false,
    address: { city: 'New York', country: 'USA' },
    tags: ['Decision Maker'],
    createdAt: '2024-01-15',
    lastActivity: '1 day ago',
  },
  {
    id: '3',
    name: 'XYZ Industries',
    email: 'contact@xyz.com',
    phone: '+1 (555) 987-6543',
    isCompany: true,
    address: { city: 'Los Angeles', country: 'USA' },
    tags: ['Prospect'],
    createdAt: '2024-01-20',
    lastActivity: '3 days ago',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.j@xyz.com',
    phone: '+1 (555) 987-6544',
    company: 'XYZ Industries',
    jobTitle: 'Marketing Director',
    isCompany: false,
    address: { city: 'Los Angeles', country: 'USA' },
    tags: ['Contact'],
    createdAt: '2024-01-22',
    lastActivity: '1 day ago',
  },
];

const ContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredContacts = filterType === 'all' 
    ? contacts 
    : contacts.filter(contact => 
        filterType === 'companies' ? contact.isCompany : !contact.isCompany
      );

  const companiesCount = contacts.filter(c => c.isCompany).length;
  const individualsCount = contacts.filter(c => !c.isCompany).length;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-odoo-dark">Contacts</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                Companies: {companiesCount}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Individuals: {individualsCount}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Create Contact
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Contacts</option>
            <option value="companies">Companies</option>
            <option value="individuals">Individuals</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            More Filters
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => {
                      setSelectedContacts(prev => 
                        prev.includes(contact.id)
                          ? prev.filter(id => id !== contact.id)
                          : [...prev, contact.id]
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {contact.isCompany ? (
                      <Building className="h-4 w-4 text-gray-500" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      {!contact.isCompany && contact.company && (
                        <div className="text-sm text-gray-500">{contact.company}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={contact.isCompany ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
                    {contact.isCompany ? 'Company' : 'Individual'}
                  </Badge>
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.jobTitle || '-'}</TableCell>
                <TableCell>
                  {contact.address && (
                    <div className="text-sm">
                      {contact.address.city && `${contact.address.city}, `}
                      {contact.address.country}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>{contact.lastActivity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default ContactsList;
