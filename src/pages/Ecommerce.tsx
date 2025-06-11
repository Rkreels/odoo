
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
  Package, 
  DollarSign, 
  Users, 
  TrendingUp,
  Star,
  Eye,
  Edit,
  Plus
} from 'lucide-react';

interface EcommerceOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  date: string;
  paymentMethod: string;
  shippingAddress: string;
}

interface EcommerceProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'out-of-stock';
  rating: number;
  reviews: number;
  sales: number;
  image: string;
}

const Ecommerce = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [orders] = useState<EcommerceOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'John Smith',
      email: 'john@example.com',
      total: 299.99,
      status: 'processing',
      items: 3,
      date: '2024-06-11',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, New York, NY'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      total: 159.50,
      status: 'shipped',
      items: 2,
      date: '2024-06-10',
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Los Angeles, CA'
    }
  ]);

  const [products] = useState<EcommerceProduct[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      sku: 'WH-001',
      price: 99.99,
      stock: 45,
      category: 'Electronics',
      status: 'active',
      rating: 4.5,
      reviews: 128,
      sales: 342,
      image: '/headphones.jpg'
    },
    {
      id: '2',
      name: 'Smart Watch',
      sku: 'SW-002',
      price: 199.99,
      stock: 0,
      category: 'Electronics',
      status: 'out-of-stock',
      rating: 4.2,
      reviews: 89,
      sales: 156,
      image: '/smartwatch.jpg'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const orderFilters = [
    { label: 'Pending', value: 'pending', count: orders.filter(o => o.status === 'pending').length },
    { label: 'Processing', value: 'processing', count: orders.filter(o => o.status === 'processing').length },
    { label: 'Shipped', value: 'shipped', count: orders.filter(o => o.status === 'shipped').length }
  ];

  const productFilters = [
    { label: 'Active', value: 'active', count: products.filter(p => p.status === 'active').length },
    { label: 'Out of Stock', value: 'out-of-stock', count: products.filter(p => p.status === 'out-of-stock').length },
    { label: 'Electronics', value: 'electronics', count: products.filter(p => p.category === 'Electronics').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'electronics' ? product.category === 'Electronics' : product.status === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const renderOrdersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Order</div>
        <div className="col-span-3">Customer</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredOrders.map(order => (
        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{order.items} items</p>
            </div>
          </div>
          <div className="col-span-3">
            <div>
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.email}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{order.paymentMethod}</p>
            </div>
          </div>
          <div className="col-span-2">
            <Badge 
              variant={
                order.status === 'delivered' ? 'default' : 
                order.status === 'shipped' ? 'secondary' : 
                order.status === 'processing' ? 'outline' : 
                'destructive'
              }
            >
              {order.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <span className="text-sm">{order.date}</span>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductsList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map(product => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge 
                variant={product.status === 'active' ? 'default' : product.status === 'out-of-stock' ? 'destructive' : 'secondary'}
              >
                {product.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">SKU: {product.sku}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${product.price}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{product.rating} ({product.reviews})</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                <span className="text-sm text-gray-600">Sales: {product.sales}</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="eCommerce">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'orders' ? 'Orders' : activeTab === 'products' ? 'Products' : 'Customers'}
          subtitle={activeTab === 'orders' ? 'Manage online orders and fulfillment' : activeTab === 'products' ? 'Product catalog and inventory' : 'Customer database and analytics'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          filters={activeTab === 'orders' ? orderFilters : productFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'orders' ? filteredOrders.length : filteredProducts.length}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalOrders}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{totalProducts}</span>
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
            <div className="text-center text-gray-500">
              Customer management and analytics coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Ecommerce;
