
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, FileText, BarChart2, Calendar, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const Accounting = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('transactions');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Mock financial data
  const transactions = [
    {
      id: 'INV001',
      date: '2025-05-01',
      partner: 'Acme Corporation',
      description: 'Invoice for Office Supplies',
      amount: 1250.00,
      status: 'Paid',
      type: 'Invoice',
    },
    {
      id: 'BILL002',
      date: '2025-05-02',
      partner: 'Tech Solutions Inc.',
      description: 'IT Services - May',
      amount: -850.00,
      status: 'Paid',
      type: 'Bill',
    },
    {
      id: 'INV003',
      date: '2025-05-04',
      partner: 'Global Enterprises',
      description: 'Consulting Services',
      amount: 3200.00,
      status: 'Pending',
      type: 'Invoice',
    },
    {
      id: 'PAY004',
      date: '2025-05-05',
      partner: 'John Smith',
      description: 'Salary Payment',
      amount: -4500.00,
      status: 'Paid',
      type: 'Payment',
    },
    {
      id: 'INV005',
      date: '2025-05-07',
      partner: 'XYZ Industries',
      description: 'Product Sales',
      amount: 7800.00,
      status: 'Draft',
      type: 'Invoice',
    },
  ];

  const accounts = [
    {
      code: '1000',
      name: 'Bank Account',
      type: 'Asset',
      balance: 54250.00,
      currency: 'USD',
    },
    {
      code: '1200',
      name: 'Accounts Receivable',
      type: 'Asset',
      balance: 12300.00,
      currency: 'USD',
    },
    {
      code: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      balance: 8750.00,
      currency: 'USD',
    },
    {
      code: '3000',
      name: 'Capital',
      type: 'Equity',
      balance: 50000.00,
      currency: 'USD',
    },
    {
      code: '4000',
      name: 'Sales Revenue',
      type: 'Revenue',
      balance: 32400.00,
      currency: 'USD',
    },
  ];

  // Filter transactions based on search and type filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterType === 'all' || transaction.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Toggle item selection
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredTransactions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredTransactions.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format amount with proper currency and color
  const formatAmount = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
    
    return {
      value: formatted,
      color: amount >= 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <TopbarDashboardLayout currentApp="Accounting">
      <div className="p-6">
        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Total Revenue', value: '$46,250.00', trend: '+5.2%', color: 'bg-green-500' },
              { name: 'Outstanding Invoices', value: '$12,300.00', trend: '-2.4%', color: 'bg-blue-500' },
              { name: 'Expenses', value: '$14,100.00', trend: '+1.8%', color: 'bg-red-500' },
              { name: 'Net Profit', value: '$32,150.00', trend: '+3.6%', color: 'bg-purple-500' },
            ].map((metric) => (
              <div key={metric.name} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${metric.color} mr-2`}></div>
                  <h3 className="font-medium text-odoo-dark">{metric.name}</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-odoo-dark">{metric.value}</p>
                <p className={`text-sm ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend} compared to last month
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <Tabs defaultValue="transactions" onValueChange={value => setActiveTab(value)} className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-5">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="reconciliation">Bank Reconciliation</TabsTrigger>
                  <TabsTrigger value="settings">Accounting Settings</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Transactions Tab */}
              <TabsContent value="transactions" className="p-0">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <Button variant="outline" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" />
                      New Transaction
                    </Button>
                    <Button variant="outline" className="mr-2" disabled={selectedItems.length === 0}>
                      <FileText className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <div className="relative ml-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="search"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-odoo-primary focus:border-odoo-primary w-full sm:w-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="invoice">Invoices</option>
                      <option value="bill">Bills</option>
                      <option value="payment">Payments</option>
                    </select>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filters
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date Range
                    </Button>
                  </div>
                </div>
                
                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedItems.length === filteredTransactions.length && filteredTransactions.length > 0} 
                            onCheckedChange={toggleSelectAll} 
                            aria-label="Select all transactions"
                          />
                        </TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Partner</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => {
                          const amount = formatAmount(transaction.amount);
                          return (
                            <TableRow key={transaction.id} className="cursor-pointer hover:bg-gray-50">
                              <TableCell>
                                <Checkbox 
                                  checked={selectedItems.includes(transaction.id)} 
                                  onCheckedChange={() => toggleSelectItem(transaction.id)} 
                                  aria-label={`Select ${transaction.id}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{transaction.id}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.partner}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className={amount.color}>
                                {amount.value}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(transaction.status)} variant="outline">
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{transaction.type}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No transactions found matching your filters. Try adjusting your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-odoo-gray">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
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
              </TabsContent>
              
              {/* Accounts Tab */}
              <TabsContent value="accounts" className="p-0">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <Button variant="outline" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" />
                      New Account
                    </Button>
                    <Button variant="outline" className="mr-2">
                      <FileText className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                
                {/* Chart of Accounts Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Currency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.code} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="font-medium">{account.code}</TableCell>
                          <TableCell>{account.name}</TableCell>
                          <TableCell>{account.type}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: account.currency,
                            }).format(account.balance)}
                          </TableCell>
                          <TableCell>{account.currency}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Profit & Loss', description: 'View your revenue and expenses for a given period', icon: <BarChart2 className="h-8 w-8 text-blue-500" /> },
                    { title: 'Balance Sheet', description: 'View your assets, liabilities and equity at a point in time', icon: <FileText className="h-8 w-8 text-green-500" /> },
                    { title: 'Cash Flow', description: 'Track your cash movements over a specified period', icon: <FileText className="h-8 w-8 text-purple-500" /> },
                    { title: 'Aged Receivables', description: 'Track unpaid customer invoices and their due dates', icon: <FileText className="h-8 w-8 text-yellow-500" /> },
                    { title: 'Aged Payables', description: 'Track unpaid vendor bills and their due dates', icon: <FileText className="h-8 w-8 text-red-500" /> },
                    { title: 'Tax Report', description: 'Summary of taxes collected and paid', icon: <FileText className="h-8 w-8 text-indigo-500" /> },
                  ].map((report, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="mr-4">
                            {report.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-odoo-dark mb-2">{report.title}</h3>
                            <p className="text-sm text-odoo-gray">{report.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Bank Reconciliation Tab */}
              <TabsContent value="reconciliation" className="p-4">
                <div className="text-center py-8">
                  <h3 className="text-xl font-medium mb-2">Bank Reconciliation</h3>
                  <p className="text-odoo-gray mb-4">Reconcile your bank statements with your accounting records</p>
                  <Button>Start Bank Reconciliation</Button>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="p-4">
                <div className="text-center py-8">
                  <h3 className="text-xl font-medium mb-2">Accounting Settings</h3>
                  <p className="text-odoo-gray mb-4">Configure your accounting system settings</p>
                  <Button>Configure Settings</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Accounting;
