import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Rental = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [products] = useState([
    {
      id: '1',
      name: 'Professional Camera Kit',
      category: 'Photography',
      image: '/placeholder.svg',
      dailyRate: '$50',
      weeklyRate: '$300',
      monthlyRate: '$1000',
      status: 'available',
      features: ['4K Recording', 'Stabilizer', 'Extra Batteries'],
      location: 'Warehouse A',
      description: 'Complete professional camera setup with accessories',
      utilization: 85,
      revenue: 12500,
      timesRented: 45
    },
    {
      id: '2',
      name: 'Sound System',
      category: 'Audio',
      image: '/placeholder.svg',
      dailyRate: '$80',
      weeklyRate: '$500',
      monthlyRate: '$1800',
      status: 'rented',
      features: ['Wireless Mics', 'Speakers', 'Mixing Board'],
      location: 'Warehouse B',
      description: 'Professional sound system for events',
      utilization: 92,
      revenue: 18400,
      timesRented: 28
    },
    {
      id: '3',
      name: 'Drone Set',
      category: 'Technology',
      image: '/placeholder.svg',
      dailyRate: '$120',
      weeklyRate: '$750',
      monthlyRate: '$2500',
      status: 'maintenance',
      features: ['4K Camera', 'GPS', 'Extended Battery'],
      location: 'Service Center',
      description: 'Professional aerial photography drone',
      utilization: 76,
      revenue: 9800,
      timesRented: 22
    }
  ]);

  const [bookings] = useState([
    {
      id: '1',
      productId: '1',
      productName: 'Professional Camera Kit',
      customer: 'John Doe Photography',
      customerEmail: 'john@doephoto.com',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      totalPrice: '$250',
      status: 'confirmed',
      paymentStatus: 'paid',
      deposit: 100,
      notes: 'Special handling required'
    },
    {
      id: '2',
      productId: '2',
      productName: 'Sound System',
      customer: 'Event Masters Inc',
      customerEmail: 'events@masters.com',
      startDate: '2024-06-18',
      endDate: '2024-06-25',
      totalPrice: '$560',
      status: 'in-progress',
      paymentStatus: 'pending',
      deposit: 200,
      notes: 'Delivery to venue required'
    },
    {
      id: '3',
      productId: '1',
      productName: 'Professional Camera Kit',
      customer: 'Creative Studios',
      customerEmail: 'booking@creative.com',
      startDate: '2024-06-25',
      endDate: '2024-06-30',
      totalPrice: '$300',
      status: 'reserved',
      paymentStatus: 'pending',
      deposit: 150,
      notes: 'Extended rental period'
    }
  ]);

  const [customers] = useState([
    {
      id: '1',
      name: 'John Doe Photography',
      email: 'john@doephoto.com',
      phone: '+1 234 567 8900',
      totalBookings: 12,
      totalSpent: 3200,
      rating: 4.8,
      lastBooking: '2024-06-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Event Masters Inc',
      email: 'events@masters.com',
      phone: '+1 234 567 8901',
      totalBookings: 8,
      totalSpent: 5600,
      rating: 4.5,
      lastBooking: '2024-06-18',
      status: 'active'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const productFilters = [
    { label: 'Available', value: 'available', count: products.filter(p => p.status === 'available').length },
    { label: 'Rented', value: 'rented', count: products.filter(p => p.status === 'rented').length },
    { label: 'Maintenance', value: 'maintenance', count: products.filter(p => p.status === 'maintenance').length },
    { label: 'High Utilization', value: 'high-util', count: products.filter(p => p.utilization > 80).length }
  ];

  const bookingFilters = [
    { label: 'Confirmed', value: 'confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { label: 'In Progress', value: 'in-progress', count: bookings.filter(b => b.status === 'in-progress').length },
    { label: 'Reserved', value: 'reserved', count: bookings.filter(b => b.status === 'reserved').length },
    { label: 'Payment Pending', value: 'payment-pending', count: bookings.filter(b => b.paymentStatus === 'pending').length }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      rented: 'bg-blue-500',
      maintenance: 'bg-orange-500',
      reserved: 'bg-purple-500',
      confirmed: 'bg-green-500',
      'in-progress': 'bg-blue-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'high-util' ? product.utilization > 80 : product.status === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'payment-pending' ? booking.paymentStatus === 'pending' : booking.status === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const avgUtilization = products.length > 0 ? products.reduce((sum, p) => sum + p.utilization, 0) / products.length : 0;

  const renderProductsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Product</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Daily Rate</div>
        <div className="col-span-1">Utilization</div>
        <div className="col-span-2">Revenue</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredProducts.map(product => (
        <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{product.name}</p>
            <p className="text-xs text-gray-600">{product.location}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(product.status)}`}>
              {product.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-sm">{product.dailyRate}</p>
            <p className="text-xs text-gray-600">{product.monthlyRate}/month</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${product.utilization > 80 ? 'bg-green-500' : product.utilization > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-sm">{product.utilization}%</span>
            </div>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-sm">${product.revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-600">{product.timesRented} rentals</p>
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
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge className={`text-white ${getStatusColor(product.status)}`}>
                {product.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{product.category}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Daily:</span>
                  <span className="font-semibold">{product.dailyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly:</span>
                  <span className="font-semibold">{product.weeklyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly:</span>
                  <span className="font-semibold">{product.monthlyRate}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {product.utilization}% utilization
                </div>
              </div>
              
              <div className="text-sm">
                <p className="font-medium mb-1">Features:</p>
                <ul className="list-disc list-inside text-gray-600">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderBookingsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Product</div>
        <div className="col-span-2">Customer</div>
        <div className="col-span-2">Duration</div>
        <div className="col-span-1">Total</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Payment</div>
        <div className="col-span-2">Notes</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredBookings.map(booking => (
        <div key={booking.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{booking.productName}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{booking.customer}</p>
            <p className="text-xs text-gray-600">{booking.customerEmail}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{booking.startDate}</p>
            <p className="text-xs text-gray-600">to {booking.endDate}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">{booking.totalPrice}</p>
            <p className="text-xs text-gray-600">${booking.deposit} deposit</p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(booking.status)}`}>
              {booking.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'destructive'}>
              {booking.paymentStatus}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-600">{booking.notes}</p>
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
                  View Booking
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Booking
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustomersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Customer</div>
        <div className="col-span-2">Contact</div>
        <div className="col-span-2">Bookings</div>
        <div className="col-span-2">Total Spent</div>
        <div className="col-span-1">Rating</div>
        <div className="col-span-1">Last Booking</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {customers.map(customer => (
        <div key={customer.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{customer.name}</p>
            <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
              {customer.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{customer.email}</p>
            <p className="text-xs text-gray-600">{customer.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-sm">{customer.totalBookings} bookings</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-sm">${customer.totalSpent.toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{customer.rating}</span>
              <span className="text-yellow-500">★</span>
            </div>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{customer.lastBooking}</p>
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
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Customer
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  New Booking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Rental">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={
            activeTab === 'products' ? 'Rental Products' :
            activeTab === 'bookings' ? 'Bookings' :
            activeTab === 'customers' ? 'Customers' :
            'Calendar'
          }
          subtitle={
            activeTab === 'products' ? 'Manage your rental inventory and rates' :
            activeTab === 'bookings' ? 'Track reservations and rental periods' :
            activeTab === 'customers' ? 'Customer management and history' :
            'View rental schedule and availability'
          }
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'products' ? productFilters : activeTab === 'bookings' ? bookingFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={
            activeTab === 'products' ? filteredProducts.length :
            activeTab === 'bookings' ? filteredBookings.length :
            customers.length
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="flex-1 flex flex-col">
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
                  <CardTitle className="text-sm font-medium text-gray-600">Available Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{products.filter(p => p.status === 'available').length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{Math.round(avgUtilization)}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{bookings.filter(b => b.status === 'in-progress').length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderProductsList() : renderProductsGrid()}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{bookings.filter(b => b.status === 'in-progress').length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">{bookings.filter(b => b.paymentStatus === 'pending').length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">This Month Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">$8,450</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">4.6★</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderBookingsList()}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="flex-1 p-6">
            {renderCustomersList()}
          </TabsContent>

          <TabsContent value="calendar" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Rental Calendar</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Today</Button>
                    <Button variant="outline" size="sm">Week</Button>
                    <Button variant="outline" size="sm">Month</Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center font-medium text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({length: 35}, (_, i) => {
                    const day = Math.floor(i/7) * 7 + (i%7) + 1;
                    const hasBooking = Math.random() > 0.7;
                    return (
                      <div key={i} className="min-h-[120px] border rounded-lg p-2 hover:bg-gray-50 cursor-pointer">
                        <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                        {hasBooking && (
                          <div className="space-y-1">
                            <div className="p-1 bg-blue-100 text-blue-800 text-xs rounded truncate">
                              Property A - Booked
                            </div>
                            {Math.random() > 0.5 && (
                              <div className="p-1 bg-green-100 text-green-800 text-xs rounded truncate">
                                Property B - Available
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Rental;