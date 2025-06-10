
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Plus, 
  BarChart3,
  CreditCard,
  Clock,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';

interface POSSession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  status: 'open' | 'closed' | 'paused';
  cashRegister: string;
  startingCash: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  transactions: number;
  averageTicket: number;
  cashier: string;
  location: string;
}

interface POSProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode: string;
  image?: string;
  margin: number;
}

interface POSOrder {
  id: string;
  sessionId: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  timestamp: string;
  customer?: string;
  status: 'draft' | 'paid' | 'cancelled';
}

const PointOfSale = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sessions');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [sessions] = useState<POSSession[]>([
    {
      id: '1',
      name: 'Main Store Session',
      startTime: '2024-06-10T08:00:00',
      status: 'open',
      cashRegister: 'Register 001',
      startingCash: 200,
      totalSales: 2450,
      totalCash: 1200,
      totalCard: 1250,
      transactions: 45,
      averageTicket: 54.44,
      cashier: 'John Smith',
      location: 'Main Store'
    },
    {
      id: '2',
      name: 'Express Checkout',
      startTime: '2024-06-10T09:30:00',
      status: 'open',
      cashRegister: 'Register 002',
      startingCash: 150,
      totalSales: 1890,
      totalCash: 890,
      totalCard: 1000,
      transactions: 32,
      averageTicket: 59.06,
      cashier: 'Sarah Davis',
      location: 'Main Store'
    }
  ]);

  const [products] = useState<POSProduct[]>([
    {
      id: '1',
      name: 'Coffee - Espresso',
      price: 3.50,
      category: 'Beverages',
      stock: 150,
      barcode: '1234567890123',
      margin: 65
    },
    {
      id: '2',
      name: 'Sandwich - Club',
      price: 8.99,
      category: 'Food',
      stock: 25,
      barcode: '1234567890124',
      margin: 45
    }
  ]);

  const [orders] = useState<POSOrder[]>([
    {
      id: '1',
      sessionId: '1',
      orderNumber: 'POS-001',
      items: [
        { productId: '1', productName: 'Coffee - Espresso', quantity: 2, unitPrice: 3.50, total: 7.00 },
        { productId: '2', productName: 'Sandwich - Club', quantity: 1, unitPrice: 8.99, total: 8.99 }
      ],
      subtotal: 15.99,
      tax: 1.60,
      total: 17.59,
      paymentMethod: 'card',
      timestamp: '2024-06-10T10:15:00',
      customer: 'Walk-in Customer',
      status: 'paid'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const sessionFilters = [
    { label: 'Open Sessions', value: 'open', count: sessions.filter(s => s.status === 'open').length },
    { label: 'Closed Sessions', value: 'closed', count: sessions.filter(s => s.status === 'closed').length },
    { label: 'Today\'s Sessions', value: 'today', count: sessions.length }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || session.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalSales = sessions.reduce((sum, s) => sum + s.totalSales, 0);
  const totalTransactions = sessions.reduce((sum, s) => sum + s.transactions, 0);
  const avgTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  const activeSessions = sessions.filter(s => s.status === 'open').length;

  const renderSessionsList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSessions.map(session => (
        <Card key={session.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{session.name}</CardTitle>
              <Badge 
                variant={session.status === 'open' ? 'default' : session.status === 'paused' ? 'secondary' : 'outline'}
                className={session.status === 'open' ? 'bg-green-500' : ''}
              >
                {session.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {session.cashRegister} • {session.cashier}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sales</span>
                <span className="font-semibold">${session.totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transactions</span>
                <span className="font-medium">{session.transactions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Ticket</span>
                <span className="font-medium">${session.averageTicket.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Started</span>
                <span className="text-sm">{new Date(session.startTime).toLocaleTimeString()}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex space-x-2">
                  {session.status === 'open' && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <StopCircle className="h-4 w-4 mr-1" />
                        Close
                      </Button>
                    </>
                  )}
                  {session.status === 'paused' && (
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderProductsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Product</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Stock</div>
        <div className="col-span-2">Margin</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {products.map(product => (
        <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">{product.barcode}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <div className="col-span-2">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <span className={product.stock > 20 ? 'text-green-600' : product.stock > 5 ? 'text-yellow-600' : 'text-red-600'}>
                {product.stock}
              </span>
              <span className="text-sm text-gray-500">units</span>
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-green-600 font-medium">{product.margin}%</span>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Point of Sale">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'sessions' ? 'POS Sessions' : activeTab === 'products' ? 'Products' : 'Orders'}
          subtitle={activeTab === 'sessions' ? 'Manage point of sale sessions' : activeTab === 'products' ? 'Product catalog and inventory' : 'Sales transactions and receipts'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'sessions' ? sessionFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'sessions' ? filteredSessions.length : activeTab === 'products' ? products.length : orders.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sessions" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Store className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{activeSessions}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${totalSales.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{totalTransactions}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">${avgTicket.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderSessionsList()}
            </div>
          </TabsContent>

          <TabsContent value="products" className="flex-1 p-6">
            {renderProductsList()}
          </TabsContent>

          <TabsContent value="orders" className="flex-1 p-6">
            <div className="text-center text-gray-500">
              Order history and receipts management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default PointOfSale;
