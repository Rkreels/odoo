import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { FileText, Plus, Send, DollarSign, Clock, AlertTriangle, CheckCircle, Eye, Edit, Download, MoreVertical, Upload, Calculator, CreditCard, Users, TrendingUp } from 'lucide-react';
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

interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  issueDate: string;
}

const Invoicing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-001',
      customer: 'Acme Corp',
      customerEmail: 'billing@acme.com',
      total: 5000,
      status: 'paid',
      dueDate: '2024-02-01',
      issueDate: '2024-01-01'
    }
  ]);

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  return (
    <OdooMainLayout currentApp="Invoicing">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Invoices"
          subtitle="Create and manage customer invoices"
          searchPlaceholder="Search invoices..."
          onSearch={() => {}}
          onCreateNew={() => toast({ title: "Create Invoice", description: "Opening invoice creation form." })}
          filters={[]}
          selectedFilter="all"
          onFilterChange={() => {}}
          recordCount={invoices.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Invoiced</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">$5,000</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(invoice => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.number}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>${invoice.total}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="flex-1 p-6">
            <div className="text-center text-gray-500">Customer management coming soon...</div>
          </TabsContent>

          <TabsContent value="payments" className="flex-1 p-6">
            <div className="text-center text-gray-500">Payment tracking coming soon...</div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Invoicing;