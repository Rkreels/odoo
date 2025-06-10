
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  FileText,
  CreditCard,
  Banknote,
  PieChart,
  MoreVertical,
  Eye,
  Edit,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JournalEntry {
  id: string;
  reference: string;
  date: string;
  journal: string;
  partner?: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  state: 'draft' | 'posted' | 'cancelled';
}

interface Invoice {
  id: string;
  number: string;
  partner: string;
  type: 'customer' | 'supplier';
  date: string;
  dueDate: string;
  amount: number;
  amountDue: number;
  state: 'draft' | 'open' | 'paid' | 'cancelled';
  paymentTerms: string;
}

interface Payment {
  id: string;
  reference: string;
  partner: string;
  date: string;
  amount: number;
  method: 'bank' | 'cash' | 'check' | 'credit_card';
  state: 'draft' | 'posted' | 'reconciled';
  memo: string;
}

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  balance: number;
  parent?: string;
}

const Accounting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('journal');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      reference: 'BILL/2024/0001',
      date: '2024-01-15',
      journal: 'Vendor Bills',
      partner: 'Office Supplies Co.',
      description: 'Office supplies purchase',
      debit: 0,
      credit: 1500,
      balance: -1500,
      state: 'posted'
    },
    {
      id: '2',
      reference: 'INV/2024/0001',
      date: '2024-01-16',
      journal: 'Customer Invoices',
      partner: 'Tech Corp',
      description: 'Software license',
      debit: 5000,
      credit: 0,
      balance: 5000,
      state: 'posted'
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV/2024/0001',
      partner: 'Tech Corp',
      type: 'customer',
      date: '2024-01-16',
      dueDate: '2024-02-15',
      amount: 5000,
      amountDue: 5000,
      state: 'open',
      paymentTerms: 'Net 30'
    },
    {
      id: '2',
      number: 'BILL/2024/0001',
      partner: 'Office Supplies Co.',
      type: 'supplier',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 1500,
      amountDue: 1500,
      state: 'open',
      paymentTerms: 'Net 30'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      reference: 'PAY/2024/0001',
      partner: 'Tech Corp',
      date: '2024-01-20',
      amount: 2500,
      method: 'bank',
      state: 'posted',
      memo: 'Partial payment for invoice INV/2024/0001'
    }
  ]);

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      code: '1000',
      name: 'Cash',
      type: 'asset',
      balance: 25000
    },
    {
      id: '2',
      code: '1100',
      name: 'Accounts Receivable',
      type: 'asset',
      balance: 15000
    },
    {
      id: '3',
      code: '2000',
      name: 'Accounts Payable',
      type: 'liability',
      balance: 8000
    },
    {
      id: '4',
      code: '4000',
      name: 'Revenue',
      type: 'income',
      balance: 50000
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const journalFilters = [
    { label: 'All Entries', value: 'all', count: journalEntries.length },
    { label: 'Posted', value: 'posted', count: journalEntries.filter(j => j.state === 'posted').length },
    { label: 'Draft', value: 'draft', count: journalEntries.filter(j => j.state === 'draft').length }
  ];

  const getStateColor = (state: string) => {
    const colors = {
      draft: 'bg-gray-500',
      open: 'bg-blue-500',
      posted: 'bg-green-500',
      paid: 'bg-green-600',
      cancelled: 'bg-red-500',
      reconciled: 'bg-purple-500'
    };
    return colors[state as keyof typeof colors] || 'bg-gray-500';
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      asset: 'text-blue-600',
      liability: 'text-red-600',
      equity: 'text-purple-600',
      income: 'text-green-600',
      expense: 'text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const filteredJournalEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.partner?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || entry.state === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.type === 'income').reduce((sum, a) => sum + a.balance, 0);
  const pendingPayments = payments.filter(p => p.state === 'draft').length;

  const renderJournalEntries = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-1">Reference</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-2">Journal</div>
        <div className="col-span-2">Partner</div>
        <div className="col-span-2">Description</div>
        <div className="col-span-1">Debit</div>
        <div className="col-span-1">Credit</div>
        <div className="col-span-1">State</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredJournalEntries.map(entry => (
        <div key={entry.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-1">
            <p className="font-medium text-sm">{entry.reference}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{entry.date}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{entry.journal}</Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{entry.partner || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{entry.description}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm text-green-600">
              {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '-'}
            </p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm text-red-600">
              {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '-'}
            </p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStateColor(entry.state)}`}>
              {entry.state}
            </Badge>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInvoices = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Number</div>
        <div className="col-span-2">Partner</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Due Date</div>
        <div className="col-span-1">Amount</div>
        <div className="col-span-1">Amount Due</div>
        <div className="col-span-2">Payment Terms</div>
        <div className="col-span-1">State</div>
      </div>
      
      {invoices.map(invoice => (
        <div key={invoice.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{invoice.number}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{invoice.partner}</p>
          </div>
          <div className="col-span-1">
            <Badge variant={invoice.type === 'customer' ? 'default' : 'secondary'}>
              {invoice.type}
            </Badge>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{invoice.date}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{invoice.dueDate}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${invoice.amount.toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm text-red-600">${invoice.amountDue.toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{invoice.paymentTerms}</p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStateColor(invoice.state)}`}>
              {invoice.state}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAccounts = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-1">Code</div>
        <div className="col-span-4">Account Name</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Balance</div>
        <div className="col-span-3">Actions</div>
      </div>
      
      {accounts.map(account => (
        <div key={account.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-1">
            <p className="font-medium text-sm">{account.code}</p>
          </div>
          <div className="col-span-4">
            <p className="font-medium text-sm">{account.name}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline" className={getAccountTypeColor(account.type)}>
              {account.type}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className={`font-medium text-sm ${getAccountTypeColor(account.type)}`}>
              ${account.balance.toLocaleString()}
            </p>
          </div>
          <div className="col-span-3">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-3 w-3 mr-1" />
                Reports
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Accounting">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={
            activeTab === 'journal' ? 'Journal Entries' :
            activeTab === 'invoices' ? 'Invoices' :
            activeTab === 'payments' ? 'Payments' :
            'Chart of Accounts'
          }
          subtitle={
            activeTab === 'journal' ? 'Record and track financial transactions' :
            activeTab === 'invoices' ? 'Manage customer and vendor invoices' :
            activeTab === 'payments' ? 'Track payments and receipts' :
            'Manage your chart of accounts'
          }
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'journal' ? journalFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={
            activeTab === 'journal' ? filteredJournalEntries.length :
            activeTab === 'invoices' ? invoices.length :
            activeTab === 'payments' ? payments.length :
            accounts.length
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="journal" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${totalAssets.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Liabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">${totalLiabilities.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{pendingPayments}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderJournalEntries()}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="flex-1 p-6">
            {renderInvoices()}
          </TabsContent>

          <TabsContent value="payments" className="flex-1 p-6">
            <div className="text-center text-gray-500">
              Payment management coming soon...
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="flex-1 p-6">
            {renderAccounts()}
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Accounting;
