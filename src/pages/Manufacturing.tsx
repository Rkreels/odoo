
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus } from 'lucide-react';

const Manufacturing = () => {
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

  const manufacturingOrders = [
    {
      id: 'MO001',
      product: 'Office Desk',
      quantity: 10,
      deadline: '2025-05-15',
      responsible: 'Jane Doe',
      status: 'Confirmed',
    },
    {
      id: 'MO002',
      product: 'Ergonomic Chair',
      quantity: 15,
      deadline: '2025-05-20',
      responsible: 'Mike Wilson',
      status: 'In Progress',
    },
    {
      id: 'MO003',
      product: 'Acoustic Guitar',
      quantity: 5,
      deadline: '2025-06-01',
      responsible: 'Jane Doe',
      status: 'Planned',
    },
    {
      id: 'MO004',
      product: 'Smartphone Case',
      quantity: 100,
      deadline: '2025-05-10',
      responsible: 'Mike Wilson',
      status: 'Done',
    },
    {
      id: 'MO005',
      product: 'Wireless Keyboard',
      quantity: 20,
      deadline: '2025-05-25',
      responsible: 'Jane Doe',
      status: 'In Progress',
    },
  ];

  const filteredOrders = filterStatus === 'all' 
    ? manufacturingOrders 
    : manufacturingOrders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());

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
      case 'Planned':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TopbarDashboardLayout currentApp="Manufacturing">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">Manufacturing Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Planned', count: 1, color: 'bg-blue-500' },
              { name: 'Confirmed', count: 1, color: 'bg-purple-500' },
              { name: 'In Progress', count: 2, color: 'bg-yellow-500' },
              { name: 'Done', count: 1, color: 'bg-green-500' },
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
                  placeholder="Search manufacturing orders..."
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
                <option value="planned">Planned</option>
                <option value="confirmed">Confirmed</option>
                <option value="in progress">In Progress</option>
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
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Responsible</TableHead>
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
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.deadline}</TableCell>
                      <TableCell>{order.responsible}</TableCell>
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
              Showing {filteredOrders.length} of {manufacturingOrders.length} orders
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

export default Manufacturing;
