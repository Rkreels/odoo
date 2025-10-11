import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { FileText, Plus, Send, DollarSign, Clock, AlertTriangle, CheckCircle, Eye, Edit, Download, MoreVertical, Upload, Calculator, CreditCard, Users, TrendingUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { LOCAL_STORAGE_KEYS, getStoredData, addRecord, updateRecord, deleteRecord, generateId, getStoredCustomers } from '@/lib/localStorageUtils';

interface InvoiceFormItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  issueDate: string;
  items: InvoiceItem[];
  notes?: string;
  tax: number;
  subtotal: number;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: '1',
    number: 'INV-001',
    customer: 'Acme Corporation',
    customerEmail: 'contact@acme.com',
    total: 5400,
    status: 'paid',
    dueDate: '2024-02-01',
    issueDate: '2024-01-01',
    items: [
      { id: '1', description: 'Consulting Services', quantity: 10, unitPrice: 500, total: 5000 }
    ],
    notes: 'Thank you for your business',
    tax: 400,
    subtotal: 5000
  },
  {
    id: '2',
    number: 'INV-002',
    customer: 'Tech Solutions Inc.',
    customerEmail: 'billing@techsolutions.com',
    total: 2160,
    status: 'sent',
    dueDate: '2024-02-15',
    issueDate: '2024-01-15',
    items: [
      { id: '2', description: 'Software License', quantity: 1, unitPrice: 2000, total: 2000 }
    ],
    notes: 'Payment due within 30 days',
    tax: 160,
    subtotal: 2000
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 5400,
    date: '2024-01-15',
    method: 'Credit Card',
    reference: 'CC-12345',
    status: 'completed'
  }
];

const Invoicing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  // Dialog states
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Form states
  const [invoiceForm, setInvoiceForm] = useState<{
    customer: string;
    customerEmail: string;
    dueDate: string;
    items: InvoiceFormItem[];
    notes: string;
    taxRate: number;
  }>({
    customer: '',
    customerEmail: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    taxRate: 8
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: 'Credit Card',
    reference: ''
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
    
    // Load data
    setInvoices(getStoredData(LOCAL_STORAGE_KEYS.INVOICES, INITIAL_INVOICES));
    setPayments(getStoredData(LOCAL_STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
    setCustomers(getStoredCustomers());
  }, [navigate]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = (invoice.number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (invoice.customer?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || invoice.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const calculateInvoiceTotal = (items: any[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * (taxRate / 100);
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleCreateInvoice = () => {
    const { subtotal, tax, total } = calculateInvoiceTotal(invoiceForm.items, invoiceForm.taxRate);
    
    const newInvoice: Invoice = {
      id: generateId(),
      number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: invoiceForm.customer,
      customerEmail: invoiceForm.customerEmail,
      dueDate: invoiceForm.dueDate,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      items: invoiceForm.items.map((item: any) => ({
        id: generateId(),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      })),
      notes: invoiceForm.notes,
      subtotal,
      tax,
      total
    };

    const updatedInvoices = addRecord(LOCAL_STORAGE_KEYS.INVOICES, newInvoice);
    setInvoices(updatedInvoices);
    setIsCreateInvoiceOpen(false);
    
    // Reset form
    setInvoiceForm({
      customer: '',
      customerEmail: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
      taxRate: 8
    });

    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.number} has been created successfully.`,
    });
  };

  const handleEditInvoice = () => {
    if (!selectedInvoice) return;

    const { subtotal, tax, total } = calculateInvoiceTotal(invoiceForm.items, invoiceForm.taxRate);
    
    const updates = {
      customer: invoiceForm.customer,
      customerEmail: invoiceForm.customerEmail,
      dueDate: invoiceForm.dueDate,
      items: invoiceForm.items.map((item: any) => ({
        id: item.id || generateId(),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      })),
      notes: invoiceForm.notes,
      subtotal,
      tax,
      total
    };

    const updatedInvoices = updateRecord<Invoice>(LOCAL_STORAGE_KEYS.INVOICES, selectedInvoice.id, updates);
    setInvoices(updatedInvoices);
    setIsEditInvoiceOpen(false);
    setSelectedInvoice(null);

    toast({
      title: "Invoice Updated",
      description: `Invoice ${selectedInvoice.number} has been updated successfully.`,
    });
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = deleteRecord<Invoice>(LOCAL_STORAGE_KEYS.INVOICES, id);
    setInvoices(updatedInvoices);
    
    toast({
      title: "Invoice Deleted",
      description: "Invoice has been deleted successfully.",
    });
  };

  const handleSendInvoice = (invoice: Invoice) => {
    const updatedInvoices = updateRecord<Invoice>(LOCAL_STORAGE_KEYS.INVOICES, invoice.id, { status: 'sent' });
    setInvoices(updatedInvoices);
    
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoice.number} has been sent to ${invoice.customer}.`,
    });
  };

  const handleRecordPayment = () => {
    if (!selectedInvoice) return;

    const newPayment: Payment = {
      id: generateId(),
      invoiceId: selectedInvoice.id,
      amount: paymentForm.amount,
      date: new Date().toISOString().split('T')[0],
      method: paymentForm.method,
      reference: paymentForm.reference,
      status: 'completed'
    };

    const updatedPayments = addRecord(LOCAL_STORAGE_KEYS.PAYMENTS, newPayment);
    setPayments(updatedPayments);

    // Update invoice status to paid if full amount is paid
    const totalPaid = updatedPayments
      .filter(p => p.invoiceId === selectedInvoice.id)
      .reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= selectedInvoice.total) {
      const updatedInvoices = updateRecord<Invoice>(LOCAL_STORAGE_KEYS.INVOICES, selectedInvoice.id, { status: 'paid' });
      setInvoices(updatedInvoices);
    }

    setIsPaymentOpen(false);
    setSelectedInvoice(null);
    setPaymentForm({ amount: 0, method: 'Credit Card', reference: '' });

    toast({
      title: "Payment Recorded",
      description: `Payment of $${paymentForm.amount} has been recorded.`,
    });
  };

  const openEditDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceForm({
      customer: invoice.customer,
      customerEmail: invoice.customerEmail,
      dueDate: invoice.dueDate,
      items: (invoice.items || []).map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      notes: invoice.notes || '',
      taxRate: (invoice.tax / invoice.subtotal) * 100 || 8
    });
    setIsEditInvoiceOpen(true);
  };

  const openPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({ ...paymentForm, amount: invoice.total });
    setIsPaymentOpen(true);
  };

  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeInvoiceItem = (index: number) => {
    const newItems = invoiceForm.items.filter((_, i) => i !== index);
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const newItems = [...invoiceForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const invoiceFilters = [
    { label: 'All', value: 'all', count: invoices.length },
    { label: 'Draft', value: 'draft', count: invoices.filter(i => i.status === 'draft').length },
    { label: 'Sent', value: 'sent', count: invoices.filter(i => i.status === 'sent').length },
    { label: 'Paid', value: 'paid', count: invoices.filter(i => i.status === 'paid').length },
    { label: 'Overdue', value: 'overdue', count: invoices.filter(i => i.status === 'overdue').length }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  return (
    <OdooMainLayout currentApp="Invoicing">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Invoices"
          subtitle="Create and manage customer invoices"
          searchPlaceholder="Search invoices..."
          onSearch={setSearchTerm}
          onCreateNew={() => setIsCreateInvoiceOpen(true)}
          filters={invoiceFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredInvoices.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
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
                    <span className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</span>
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
                    <span className="text-2xl font-bold">${totalPaid.toLocaleString()}</span>
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
                    <span className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{invoices.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.customer}</p>
                            <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.issueDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell className="font-medium">${invoice.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`text-white ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openEditDialog(invoice)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send by Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openPaymentDialog(invoice)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Record Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ title: 'Download', description: 'PDF downloaded successfully' })}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Customer Management</h3>
                  <Button onClick={() => toast({ title: 'Feature Coming Soon', description: 'Customer management features will be available soon.' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">Total Customers</h4>
                    <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Active Invoices</h4>
                    <p className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status !== 'paid').length}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-red-900">Overdue</h4>
                    <p className="text-2xl font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Invoices</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map(customer => {
                      const customerInvoices = invoices.filter(i => i.customer === customer.name);
                      const totalDue = customerInvoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.total, 0);
                      
                      return (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customerInvoices.length}</TableCell>
                          <TableCell>${totalDue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Customer Details', description: `Viewing details for ${customer.name}` })}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Payment Tracking</h3>
                  <Button onClick={() => toast({ title: 'Record Payment', description: 'Select an invoice to record a payment.' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Received Today</h4>
                    <p className="text-2xl font-bold text-green-600">$0</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">This Month</h4>
                    <p className="text-2xl font-bold text-blue-600">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-900">Pending</h4>
                    <p className="text-2xl font-bold text-yellow-600">${totalOutstanding.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-red-900">Overdue</h4>
                    <p className="text-2xl font-bold text-red-600">$0</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map(payment => {
                      const invoice = invoices.find(i => i.id === payment.invoiceId);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{invoice?.customer || 'Unknown'}</TableCell>
                          <TableCell>{invoice?.number || 'Unknown'}</TableCell>
                          <TableCell>${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Invoice Dialog */}
        <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={invoiceForm.customer} onValueChange={(value) => {
                  const customer = customers.find(c => c.name === value);
                  setInvoiceForm({
                    ...invoiceForm,
                    customer: value,
                    customerEmail: customer?.email || ''
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  value={invoiceForm.customerEmail}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={invoiceForm.taxRate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Invoice Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {invoiceForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateInvoiceItem(index, 'unitPrice', Number(e.target.value))}
                  />
                  <div className="flex items-center">
                    <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInvoiceItem(index)}
                    disabled={invoiceForm.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={invoiceForm.notes}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                placeholder="Additional notes for the invoice"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInvoice}>
                Create Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Invoice Dialog */}
        <Dialog open={isEditInvoiceOpen} onOpenChange={setIsEditInvoiceOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Invoice {selectedInvoice?.number}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={invoiceForm.customer} onValueChange={(value) => {
                  const customer = customers.find(c => c.name === value);
                  setInvoiceForm({
                    ...invoiceForm,
                    customer: value,
                    customerEmail: customer?.email || ''
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  value={invoiceForm.customerEmail}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={invoiceForm.taxRate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Invoice Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {invoiceForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateInvoiceItem(index, 'unitPrice', Number(e.target.value))}
                  />
                  <div className="flex items-center">
                    <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInvoiceItem(index)}
                    disabled={invoiceForm.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={invoiceForm.notes}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                placeholder="Additional notes for the invoice"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditInvoiceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditInvoice}>
                Update Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Record Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment for {selectedInvoice?.number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={paymentForm.method} onValueChange={(value) => setPaymentForm({ ...paymentForm, method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="Transaction reference"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRecordPayment}>
                Record Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OdooMainLayout>
  );
};

export default Invoicing;