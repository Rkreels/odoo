
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Package, 
  DollarSign, 
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Truck
} from 'lucide-react';

interface RentalOrder {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  startDate: string;
  endDate: string;
  duration: number;
  dailyRate: number;
  totalAmount: number;
  status: 'draft' | 'confirmed' | 'picked_up' | 'returned' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'overdue';
  location: string;
  notes?: string;
}

interface RentalProduct {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  quantity: number;
  rentedQuantity: number;
  location: string;
  description: string;
  image?: string;
}

const Rental = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [orders] = useState<RentalOrder[]>([
    {
      id: '1',
      orderNumber: 'RNT-001',
      customer: 'ABC Construction',
      product: 'Excavator - CAT 320',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      duration: 7,
      dailyRate: 450,
      totalAmount: 3150,
      status: 'confirmed',
      paymentStatus: 'paid',
      location: 'Main Depot',
      notes: 'Customer requires delivery to job site'
    },
    {
      id: '2',
      orderNumber: 'RNT-002',
      customer: 'BuildTech LLC',
      product: 'Forklift - Toyota 3000lbs',
      startDate: '2024-06-12',
      endDate: '2024-06-19',
      duration: 7,
      dailyRate: 120,
      totalAmount: 840,
      status: 'picked_up',
      paymentStatus: 'paid',
      location: 'Warehouse A'
    },
    {
      id: '3',
      orderNumber: 'RNT-003',
      customer: 'MegaProjects Inc',
      product: 'Generator - 100kW',
      startDate: '2024-06-10',
      endDate: '2024-06-17',
      duration: 7,
      dailyRate: 200,
      totalAmount: 1400,
      status: 'returned',
      paymentStatus: 'paid',
      location: 'Main Depot'
    }
  ]);

  const [products] = useState<RentalProduct[]>([
    {
      id: '1',
      name: 'Excavator - CAT 320',
      category: 'Heavy Machinery',
      dailyRate: 450,
      weeklyRate: 2700,
      monthlyRate: 9500,
      status: 'rented',
      quantity: 3,
      rentedQuantity: 1,
      location: 'Main Depot',
      description: 'Heavy-duty excavator suitable for construction and excavation work'
    },
    {
      id: '2',
      name: 'Forklift - Toyota 3000lbs',
      category: 'Material Handling',
      dailyRate: 120,
      weeklyRate: 720,
      monthlyRate: 2500,
      status: 'available',
      quantity: 5,
      rentedQuantity: 2,
      location: 'Warehouse A',
      description: 'Electric forklift with 3000lbs lifting capacity'
    },
    {
      id: '3',
      name: 'Generator - 100kW',
      category: 'Power Equipment',
      dailyRate: 200,
      weeklyRate: 1200,
      monthlyRate: 4200,
      status: 'maintenance',
      quantity: 4,
      rentedQuantity: 0,
      location: 'Main Depot',
      description: 'Diesel generator providing 100kW continuous power'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const orderFilters = [
    { label: 'Confirmed', value: 'confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { label: 'Picked Up', value: 'picked_up', count: orders.filter(o => o.status === 'picked_up').length },
    { label: 'Returned', value: 'returned', count: orders.filter(o => o.status === 'returned').length }
  ];

  const productFilters = [
    { label: 'Available', value: 'available', count: products.filter(p => p.status === 'available').length },
    { label: 'Rented', value: 'rented', count: products.filter(p => p.status === 'rented').length },
    { label: 'Maintenance', value: 'maintenance', count: products.filter(p => p.status === 'maintenance').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || product.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeRentals = orders.filter(o => o.status === 'picked_up').length;
  const availableProducts = products.filter(p => p.status === 'available').length;
  const utilizationRate = (products.reduce((sum, p) => sum + p.rentedQuantity, 0) / products.reduce((sum, p) => sum + p.quantity, 0)) * 100;

  const renderOrdersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Order</div>
        <div className="col-span-3">Customer & Product</div>
        <div className="col-span-2">Duration</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredOrders.map(order => (
        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{order.location}</p>
            </div>
          </div>
          <div className="col-span-3">
            <div>
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.product}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-medium">{order.duration} days</p>
              <p className="text-sm text-gray-500">{order.startDate} - {order.endDate}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">${order.dailyRate}/day</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-1">
              <Badge 
                variant={
                  order.status === 'confirmed' ? 'secondary' :
                  order.status === 'picked_up' ? 'default' :
                  order.status === 'returned' ? 'outline' :
                  'destructive'
                }
              >
                {order.status === 'confirmed' && <Clock className="h-3 w-3 mr-1" />}
                {order.status === 'picked_up' && <Truck className="h-3 w-3 mr-1" />}
                {order.status === 'returned' && <CheckCircle className="h-3 w-3 mr-1" />}
                {order.status}
              </Badge>
              <Badge 
                variant={order.paymentStatus === 'paid' ? 'default' : order.paymentStatus === 'overdue' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
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
                variant={
                  product.status === 'available' ? 'default' :
                  product.status === 'rented' ? 'secondary' :
                  product.status === 'maintenance' ? 'destructive' :
                  'outline'
                }
              >
                {product.status === 'available' && <CheckCircle className="h-3 w-3 mr-1" />}
                {product.status === 'maintenance' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {product.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">{product.category}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">{product.description}</p>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Daily</span>
                  <p className="font-semibold">${product.dailyRate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Weekly</span>
                  <p className="font-semibold">${product.weeklyRate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Monthly</span>
                  <p className="font-semibold">${product.monthlyRate}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span>{product.quantity - product.rentedQuantity} available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{product.location}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Button size="sm" className="w-full">
                  Book Rental
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Rental">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'orders' ? 'Rental Orders' : activeTab === 'products' ? 'Rental Products' : 'Calendar'}
          subtitle={activeTab === 'orders' ? 'Manage rental orders and bookings' : activeTab === 'products' ? 'Equipment and product catalog' : 'Rental schedule and availability'}
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
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Active Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{activeRentals}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Available Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{availableProducts}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</span>
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

          <TabsContent value="calendar" className="flex-1 p-6">
            <div className="text-center text-gray-500">
              Rental calendar and schedule management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Rental;
