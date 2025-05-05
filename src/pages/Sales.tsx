
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus } from 'lucide-react';

const Sales = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const salesOrders = [
    {
      id: 'SO001',
      customer: 'Acme Corporation',
      date: '2025-05-01',
      salesperson: 'Jane Doe',
      total: '$5,000.00',
      status: 'Quotation',
    },
    {
      id: 'SO002',
      customer: 'XYZ Industries',
      date: '2025-05-02',
      salesperson: 'Mike Wilson',
      total: '$12,000.00',
      status: 'Order Confirmed',
    },
    {
      id: 'SO003',
      customer: 'Globex Corporation',
      date: '2025-04-28',
      salesperson: 'Jane Doe',
      total: '$8,750.00',
      status: 'Delivery',
    },
    {
      id: 'SO004',
      customer: 'Tech Innovators',
      date: '2025-04-25',
      salesperson: 'Mike Wilson',
      total: '$15,000.00',
      status: 'Invoiced',
    },
    {
      id: 'SO005',
      customer: 'Summit Enterprises',
      date: '2025-04-20',
      salesperson: 'Jane Doe',
      total: '$3,200.00',
      status: 'Done',
    },
  ];

  const filteredOrders = filterStatus === 'all' 
    ? salesOrders 
    : salesOrders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredOrders.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredOrders.map(order => order.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Quotation':
        return 'bg-blue-100 text-blue-800';
      case 'Order Confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'Delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'Invoiced':
        return 'bg-green-100 text-green-800';
      case 'Done':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TopbarDashboardLayout currentApp="Sales">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">Sales Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Quotations', count: 12, color: 'bg-blue-500' },
              { name: 'Orders', count: 8, color: 'bg-yellow-500' },
              { name: 'To Invoice', count: 5, color: 'bg-green-500' },
              { name: 'Revenue', count: '$45,950', color: 'bg-purple-500' },
            ].map((metric) => (
              <div key={metric.name} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${metric.color} mr-2`}></div>
                  <h3 className="font-medium text-odoo-dark">{metric.name}</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-odoo-dark">{metric.count}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Button variant="outline" className="mr-2">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
              <Button variant="outline" className="mr-2" disabled={selectedItems.length === 0}>
                Mass Action
              </Button>
              <div className="relative ml-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search orders..."
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
                <option value="quotation">Quotation</option>
                <option value="order confirmed">Order Confirmed</option>
                <option value="delivery">Delivery</option>
                <option value="invoiced">Invoiced</option>
                <option value="done">Done</option>
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
                      checked={selectedItems.length === filteredOrders.length && filteredOrders.length > 0} 
                      onCheckedChange={toggleSelectAll} 
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Salesperson</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(order.id)} 
                          onCheckedChange={() => toggleSelectItem(order.id)} 
                          aria-label={`Select ${order.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.salesperson}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No orders found matching your filters. Try adjusting your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-odoo-gray">
              Showing {filteredOrders.length} of {salesOrders.length} orders
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
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Sales;
