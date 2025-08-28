
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Eye,
  Edit,
  Send,
  Download,
  MoreVertical,
  Calendar,
  User,
  Package,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SalesOrder {
  id: string;
  number: string;
  customer: string;
  customerEmail: string;
  date: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  salesperson: string;
  paymentTerms: string;
  deliveryDate: string;
  items: SalesOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  margin: number;
  source: string;
  tags: string[];
}

interface SalesOrderItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  type: 'storable' | 'consumable' | 'service';
  status: 'active' | 'inactive';
}

const Sales = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    {
      id: '1',
      number: 'SO001',
      customer: 'Tech Solutions Inc.',
      customerEmail: 'contact@techsolutions.com',
      date: '2024-01-15',
      validUntil: '2024-02-15',
      status: 'confirmed',
      salesperson: 'Sarah Johnson',
      paymentTerms: 'Net 30',
      deliveryDate: '2024-01-25',
      items: [
        {
          id: '1',
          product: 'Professional Software License',
          description: 'Annual subscription',
          quantity: 5,
          unitPrice: 1200,
          discount: 10,
          tax: 12,
          total: 5400
        }
      ],
      subtotal: 6000,
      tax: 600,
      discount: 600,
      total: 6000,
      margin: 25,
      source: 'Website',
      tags: ['enterprise', 'recurring']
    },
    {
      id: '2',
      number: 'SO002',
      customer: 'Global Manufacturing Corp',
      customerEmail: 'procurement@globalmanuf.com',
      date: '2024-01-20',
      validUntil: '2024-02-20',
      status: 'sent',
      salesperson: 'Mike Wilson',
      paymentTerms: 'Net 15',
      deliveryDate: '2024-02-01',
      items: [
        {
          id: '1',
          product: 'Industrial Equipment',
          description: 'Heavy duty machinery',
          quantity: 2,
          unitPrice: 15000,
          discount: 0,
          tax: 15,
          total: 30000
        }
      ],
      subtotal: 30000,
      tax: 4500,
      discount: 0,
      total: 34500,
      margin: 35,
      source: 'Referral',
      tags: ['manufacturing', 'high-value']
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Professional Software License',
      sku: 'PSL-001',
      category: 'Software',
      price: 1200,
      cost: 400,
      stock: 0,
      type: 'service',
      status: 'active'
    },
    {
      id: '2',
      name: 'Industrial Equipment',
      sku: 'IE-002',
      category: 'Machinery',
      price: 15000,
      cost: 9750,
      stock: 5,
      type: 'storable',
      status: 'active'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const orderFilters = [
    { label: 'Quotations', value: 'draft', count: 8 },
    { label: 'Sales Orders', value: 'confirmed', count: 15 },
    { label: 'To Invoice', value: 'to_invoice', count: 5 },
    { label: 'Fully Invoiced', value: 'invoiced', count: 23 }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      confirmed: 'bg-green-500',
      delivered: 'bg-purple-500',
      cancelled: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = salesOrders.filter(o => o.status === 'confirmed').reduce((sum, o) => sum + o.total, 0);
  const totalQuotations = salesOrders.filter(o => o.status === 'draft' || o.status === 'sent').reduce((sum, o) => sum + o.total, 0);

  const renderOrdersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Number</div>
        <div className="col-span-2">Customer</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Total</div>
        <div className="col-span-2">Salesperson</div>
        <div className="col-span-2">Delivery Date</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredOrders.map(order => (
        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{order.number}</p>
            <div className="flex space-x-1 mt-1">
              {order.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium">{order.customer}</p>
            <p className="text-xs text-gray-600">{order.customerEmail}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{order.date}</p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${order.total.toLocaleString()}</p>
            <p className="text-xs text-green-600">{order.margin}% margin</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="text-sm">{order.salesperson}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span className="text-sm">{order.deliveryDate}</span>
            </div>
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
                <DropdownMenuItem>
                  <Send className="h-4 w-4 mr-2" />
                  Send by Email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Product</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Price</div>
        <div className="col-span-1">Cost</div>
        <div className="col-span-1">Stock</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {products.map(product => (
        <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{product.name}</p>
            <p className="text-xs text-gray-600">{product.sku}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${product.price}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">${product.cost}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{product.stock > 0 ? product.stock : 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="secondary">{product.type}</Badge>
          </div>
          <div className="col-span-1">
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status}
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
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Package className="h-4 w-4 mr-2" />
                  View Stock
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Sales">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'orders' ? 'Sales Orders' : 'Products'}
          subtitle={activeTab === 'orders' ? 'Manage quotations and sales orders' : 'Product catalog and pricing'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'orders' ? orderFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'orders' ? filteredOrders.length : products.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
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
                  <CardTitle className="text-sm font-medium text-gray-600">Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${totalQuotations.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Orders Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{salesOrders.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">
                      ${salesOrders.length > 0 ? Math.round(totalRevenue / salesOrders.length).toLocaleString() : '0'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderOrdersList()}
            </div>
          </TabsContent>

          <TabsContent value="products" className="flex-1 p-6">
            {renderProductsList()}
          </TabsContent>

          <TabsContent value="customers" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Customer Management</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">Total Customers</h4>
                    <p className="text-2xl font-bold text-blue-600">432</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Active This Month</h4>
                    <p className="text-2xl font-bold text-green-600">89</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900">Average Order Value</h4>
                    <p className="text-2xl font-bold text-purple-600">$1,245</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Last Order</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1,2,3,4,5].map(customer => (
                        <TableRow key={customer}>
                          <TableCell>Customer {customer}</TableCell>
                          <TableCell>customer{customer}@example.com</TableCell>
                          <TableCell>{Math.floor(Math.random() * 20) + 1}</TableCell>
                          <TableCell>${(Math.random() * 10000).toFixed(2)}</TableCell>
                          <TableCell>2024-01-{String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">View</Button>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Sales;
