
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import InvoiceCard from '@/components/invoicing/InvoiceCard';
import { Receipt, Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types/invoicing';

const Invoicing = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-001',
      customer: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'sent',
      items: [
        { id: '1', description: 'Web Development', quantity: 1, rate: 5000, amount: 5000 }
      ],
      subtotal: 5000,
      tax: 500,
      total: 5500
    },
    {
      id: '2',
      number: 'INV-002',
      customer: 'Tech Solutions Ltd',
      customerEmail: 'accounts@techsolutions.com',
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'paid',
      items: [
        { id: '1', description: 'Consulting Services', quantity: 40, rate: 150, amount: 6000 }
      ],
      subtotal: 6000,
      tax: 600,
      total: 6600
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ));
  };

  const handleCreateInvoice = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: 'New Customer',
      customerEmail: 'customer@example.com',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  return (
    <TopbarDashboardLayout currentApp="Invoicing">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Receipt className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Invoicing</h1>
          </div>
          <p className="text-odoo-gray">
            Create and send professional invoices. Track payments and manage customer billing efficiently.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Pending</h3>
              <p className="text-2xl font-bold text-blue-900">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Overdue</h3>
              <p className="text-2xl font-bold text-red-900">${overdueAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={handleCreateInvoice}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Invoice
              </Button>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Manage Payments
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-odoo-dark mb-4">Recent Invoices</h2>
          {invoices.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-odoo-gray">No invoices created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onUpdate={handleUpdateInvoice}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Invoicing;
