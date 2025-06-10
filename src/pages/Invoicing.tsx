
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  DollarSign,
  Clock,
  Send,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Building,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  amountDue: number;
  currency: string;
  paymentTerms: string;
  salesPerson: string;
  reference?: string;
  items: InvoiceItem[];
  notes?: string;
  paymentMethod?: string;
  lastSentDate?: string;
  viewedDate?: string;
  paidDate?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  product?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  address: string;
  paymentTerms: string;
  creditLimit: number;
  totalOutstanding: number;
}

const Invoicing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invoices');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-2024-001',
      customer: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      issueDate: '2024-06-01',
      dueDate: '2024-06-30',
      status: 'sent',
      subtotal: 5000,
      tax: 500,
      total: 5500,
      amountDue: 5500,
      currency: 'USD',
      paymentTerms: 'Net 30',
      salesPerson: 'John Smith',
      reference: 'SO-2024-001',
      items: [
        {
          id: '1',
          description: 'Software License - Annual',
          quantity: 1,
          unitPrice: 5000,
          discount: 0,
          tax: 500,
          total: 5500,
          product: 'Software License'
        }
      ],
      lastSentDate: '2024-06-01'
    },
    {
      id: '2',
      number: 'INV-2024-002',
      customer: 'Tech Solutions Ltd',
      customerEmail: 'finance@techsolutions.com',
      issueDate: '2024-05-15',
      dueDate: '2024-05-30',
      status: 'overdue',
      subtotal: 2500,
      tax: 250,
      total: 2750,
      amountDue: 2750,
      currency: 'USD',
      paymentTerms: 'Net 15',
      salesPerson: 'Sarah Davis',
      items: [
        {
          id: '1',
          description: 'Consulting Services',
          quantity: 25,
          unitPrice: 100,
          discount: 0,
          tax: 250,
          total: 2750,
          product: 'Consulting'
        }
      ]
    },
    {
      id: '3',
      number: 'INV-2024-003',
      customer: 'Digital Agency Pro',
      customerEmail: 'accounts@digitalagency.com',
      issueDate: '2024-05-20',
      dueDate: '2024-06-20',
      status: 'paid',
      subtotal: 1200,
      tax: 120,
      total: 1320,
      amountDue: 0,
      currency: 'USD',
      paymentTerms: 'Net 30',
      salesPerson: 'Mike Johnson',
      paidDate: '2024-05-25',
      items: [
        {
          id: '1',
          description: 'Web Development',
          quantity: 12,
          unitPrice: 100,
          discount: 0,
          tax: 120,
          total: 1320,
          product: 'Development'
        }
      ]
    }
  ]);

  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      company: 'Acme Corporation',
      address: '123 Business Ave, New York, NY 10001',
      paymentTerms: 'Net 30',
      creditLimit: 50000,
      totalOutstanding: 5500
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const invoiceFilters = [
    { label: 'Draft', value: 'draft', count: invoices.filter(i => i.status === 'draft').length },
    { label: 'Sent', value: 'sent', count: invoices.filter(i => i.status === 'sent').length },
    { label: 'Paid', value: 'paid', count: invoices.filter(i => i.status === 'paid').length },
    { label: 'Overdue', value: 'overdue', count: invoices.filter(i => i.status === 'overdue').length }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || invoice.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      viewed: 'bg-indigo-500',
      partial: 'bg-yellow-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.amountDue, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amountDue, 0);

  const renderInvoicesList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Invoice #</div>
        <div className="col-span-2">Customer</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Issue Date</div>
        <div className="col-span-1">Due Date</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-1">Amount Due</div>
        <div className="col-span-1">Sales Person</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredInvoices.map(invoice => (
        <div key={invoice.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{invoice.number}</p>
                {invoice.reference && (
                  <p className="text-xs text-gray-500">{invoice.reference}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{invoice.customer}</p>
                <p className="text-xs text-gray-500">{invoice.customerEmail}</p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-sm">{invoice.issueDate}</span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}`}>
                {invoice.dueDate}
              </span>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-semibold">{invoice.currency} {invoice.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{invoice.paymentTerms}</p>
            </div>
          </div>
          <div className="col-span-1">
            <span className={`font-medium ${invoice.amountDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {invoice.currency} {invoice.amountDue.toLocaleString()}
            </span>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-sm">{invoice.salesPerson}</span>
            </div>
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
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                {invoice.status !== 'paid' && (
                  <DropdownMenuItem>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustomersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Customer</div>
        <div className="col-span-3">Address</div>
        <div className="col-span-2">Payment Terms</div>
        <div className="col-span-2">Credit Limit</div>
        <div className="col-span-2">Outstanding</div>
      </div>
      
      {customers.map(customer => (
        <div key={customer.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600 bg-blue-100 p-1.5 rounded-md" />
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <p className="text-sm">{customer.address}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{customer.paymentTerms}</Badge>
          </div>
          <div className="col-span-2">
            <span className="font-medium">USD {customer.creditLimit.toLocaleString()}</span>
          </div>
          <div className="col-span-2">
            <span className={`font-medium ${customer.totalOutstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
              USD {customer.totalOutstanding.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Invoicing">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'invoices' ? 'Invoices' : 'Customers'}
          subtitle={activeTab === 'invoices' ? 'Customer invoicing and payment tracking' : 'Customer billing information'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'invoices' ? invoiceFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'invoices' ? filteredInvoices.length : customers.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Invoiced</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">USD {totalInvoiced.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">USD {totalPaid.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">USD {totalOutstanding.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">USD {overdueAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderInvoicesList()}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="flex-1 p-6">
            {renderCustomersList()}
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Invoicing;
