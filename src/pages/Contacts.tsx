
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  Tag,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobile?: string;
  website?: string;
  isCompany: boolean;
  company?: string;
  jobTitle?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  tags: string[];
  category: string;
  source: string;
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  totalSales: number;
  opportunities: number;
  isFavorite: boolean;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
}

const Contacts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contacts');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Tech Solutions Inc.',
      email: 'info@techsolutions.com',
      phone: '+1 555-0123',
      mobile: '+1 555-0124',
      website: 'www.techsolutions.com',
      isCompany: true,
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      tags: ['Customer', 'Enterprise', 'Technology'],
      category: 'Customer',
      source: 'Website',
      assignedTo: 'John Smith',
      createdAt: '2024-01-15',
      lastActivity: '2 days ago',
      totalSales: 125000,
      opportunities: 3,
      isFavorite: true,
      status: 'active'
    },
    {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice.johnson@techsolutions.com',
      phone: '+1 555-0125',
      mobile: '+1 555-0126',
      isCompany: false,
      company: 'Tech Solutions Inc.',
      jobTitle: 'CTO',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      tags: ['Decision Maker', 'Technical'],
      category: 'Customer',
      source: 'Referral',
      assignedTo: 'Sarah Davis',
      createdAt: '2024-01-20',
      lastActivity: '1 day ago',
      totalSales: 0,
      opportunities: 1,
      isFavorite: false,
      status: 'active'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const contactFilters = [
    { label: 'Companies', value: 'companies', count: contacts.filter(c => c.isCompany).length },
    { label: 'Individuals', value: 'individuals', count: contacts.filter(c => !c.isCompany).length },
    { label: 'Customers', value: 'customers', count: contacts.filter(c => c.category === 'Customer').length },
    { label: 'Vendors', value: 'vendors', count: contacts.filter(c => c.category === 'Vendor').length }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    
    if (selectedFilter === 'companies') matchesFilter = contact.isCompany;
    else if (selectedFilter === 'individuals') matchesFilter = !contact.isCompany;
    else if (selectedFilter === 'customers') matchesFilter = contact.category === 'Customer';
    else if (selectedFilter === 'vendors') matchesFilter = contact.category === 'Vendor';
    
    return matchesSearch && matchesFilter;
  });

  const totalContacts = contacts.length;
  const companies = contacts.filter(c => c.isCompany).length;
  const individuals = contacts.filter(c => !c.isCompany).length;
  const totalSalesValue = contacts.reduce((sum, c) => sum + c.totalSales, 0);

  const renderContactsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Name</div>
        <div className="col-span-2">Email</div>
        <div className="col-span-2">Phone</div>
        <div className="col-span-2">Address</div>
        <div className="col-span-1">Sales</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredContacts.map(contact => (
        <div key={contact.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              {contact.isCompany ? (
                <Building2 className="h-8 w-8 text-blue-600 bg-blue-100 p-1.5 rounded-md" />
              ) : (
                <User className="h-8 w-8 text-green-600 bg-green-100 p-1.5 rounded-md" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{contact.name}</p>
                  {contact.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>
                {!contact.isCompany && contact.company && (
                  <p className="text-sm text-gray-500">{contact.jobTitle} at {contact.company}</p>
                )}
                {contact.isCompany && (
                  <p className="text-sm text-gray-500">Company</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{contact.email}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{contact.phone}</span>
              </div>
              {contact.mobile && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{contact.mobile}</span>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div className="text-sm">
                {contact.address.city && `${contact.address.city}, `}
                {contact.address.country}
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-sm">
              <p className="font-medium">${contact.totalSales.toLocaleString()}</p>
              <p className="text-xs text-gray-600">{contact.opportunities} opps</p>
            </div>
          </div>
          <div className="col-span-1">
            <Badge 
              variant={contact.status === 'active' ? 'default' : contact.status === 'inactive' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {contact.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  {contact.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Contacts">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Contacts"
          subtitle="Manage customers, vendors, and partners"
          searchPlaceholder="Search contacts..."
          onSearch={setSearchTerm}
          onCreateNew={() => console.log('Create new contact')}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={contactFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredContacts.length}
        />

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{totalContacts}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">{companies}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Individuals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{individuals}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-lg">💰</span>
                <span className="text-2xl font-bold">${totalSalesValue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 p-6">
          {renderContactsList()}
        </div>
      </div>
    </OdooMainLayout>
  );
};

export default Contacts;
