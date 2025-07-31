import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
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
  StopCircle,
  Edit,
  Trash,
  Search,
  Filter,
  Calculator,
  Minus,
  X,
  Receipt,
  Terminal,
  Smartphone,
  Monitor
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
  config: {
    allowDiscounts: boolean;
    requireCustomer: boolean;
    printReceipts: boolean;
    enableBarcode: boolean;
  };
}

interface POSProduct {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  barcode: string;
  image?: string;
  margin: number;
  taxRate: number;
  isActive: boolean;
  variants?: { name: string; price: number }[];
}

interface POSOrder {
  id: string;
  sessionId: string;
  orderNumber: string;
  items: POSOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  paymentDetails?: any;
  timestamp: string;
  customer?: POSCustomer;
  status: 'draft' | 'paid' | 'cancelled';
  receipt?: string;
}

interface POSOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  notes?: string;
}

interface POSCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
}

interface CashRegister {
  id: string;
  name: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
  currentCash: number;
  lastCounted: string;
  ip?: string;
  printer?: string;
}

const PointOfSale = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sessions');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPOSTerminal, setShowPOSTerminal] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<POSOrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<POSCustomer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [searchProducts, setSearchProducts] = useState('');

  const [sessions, setSessions] = useState<POSSession[]>([
    {
      id: '1',
      name: 'Main Store Session',
      startTime: '2024-01-31T08:00:00',
      status: 'open',
      cashRegister: 'Register 001',
      startingCash: 200,
      totalSales: 2450,
      totalCash: 1200,
      totalCard: 1250,
      transactions: 45,
      averageTicket: 54.44,
      cashier: 'John Smith',
      location: 'Main Store',
      config: {
        allowDiscounts: true,
        requireCustomer: false,
        printReceipts: true,
        enableBarcode: true
      }
    },
    {
      id: '2',
      name: 'Express Checkout',
      startTime: '2024-01-31T09:30:00',
      status: 'open',
      cashRegister: 'Register 002',
      startingCash: 150,
      totalSales: 1890,
      totalCash: 890,
      totalCard: 1000,
      transactions: 32,
      averageTicket: 59.06,
      cashier: 'Sarah Davis',
      location: 'Main Store',
      config: {
        allowDiscounts: false,
        requireCustomer: false,
        printReceipts: true,
        enableBarcode: true
      }
    }
  ]);

  const [products, setProducts] = useState<POSProduct[]>([
    {
      id: '1',
      name: 'Premium Coffee Blend',
      price: 12.99,
      cost: 6.50,
      category: 'Beverages',
      stock: 150,
      barcode: '1234567890123',
      margin: 50,
      taxRate: 8.5,
      isActive: true
    },
    {
      id: '2',
      name: 'Artisan Sandwich',
      price: 8.99,
      cost: 4.50,
      category: 'Food',
      stock: 25,
      barcode: '1234567890124',
      margin: 50,
      taxRate: 8.5,
      isActive: true
    },
    {
      id: '3',
      name: 'Fresh Pastry',
      price: 4.99,
      cost: 2.00,
      category: 'Food',
      stock: 40,
      barcode: '1234567890125',
      margin: 60,
      taxRate: 8.5,
      isActive: true
    },
    {
      id: '4',
      name: 'Organic Tea',
      price: 3.99,
      cost: 1.50,
      category: 'Beverages',
      stock: 80,
      barcode: '1234567890126',
      margin: 62,
      taxRate: 8.5,
      isActive: true
    }
  ]);

  const [orders, setOrders] = useState<POSOrder[]>([
    {
      id: '1',
      sessionId: '1',
      orderNumber: 'POS-001',
      items: [
        { productId: '1', productName: 'Premium Coffee Blend', quantity: 2, unitPrice: 12.99, discount: 0, total: 25.98 },
        { productId: '2', productName: 'Artisan Sandwich', quantity: 1, unitPrice: 8.99, discount: 0, total: 8.99 }
      ],
      subtotal: 34.97,
      tax: 2.97,
      discount: 0,
      total: 37.94,
      paymentMethod: 'card',
      timestamp: '2024-01-31T10:15:00',
      status: 'paid'
    }
  ]);

  const [customers, setCustomers] = useState<POSCustomer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      loyaltyPoints: 120,
      totalSpent: 450.00
    }
  ]);

  const [registers, setRegisters] = useState<CashRegister[]>([
    {
      id: '1',
      name: 'Register 001',
      location: 'Main Store',
      status: 'in-use',
      currentCash: 850.00,
      lastCounted: '2024-01-31T08:00:00'
    },
    {
      id: '2',
      name: 'Register 002',
      location: 'Main Store',
      status: 'available',
      currentCash: 200.00,
      lastCounted: '2024-01-31T07:30:00'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateSession = (sessionData: any) => {
    const newSession: POSSession = {
      id: Date.now().toString(),
      ...sessionData,
      startTime: new Date().toISOString(),
      status: 'open' as const,
      totalSales: 0,
      totalCash: 0,
      totalCard: 0,
      transactions: 0,
      averageTicket: 0
    };
    setSessions([newSession, ...sessions]);
    setShowCreateSession(false);
    toast({
      title: "Session created",
      description: "New POS session has been started.",
    });
  };

  const handleAddToCart = (product: POSProduct) => {
    const existingItem = currentOrder.find(item => item.productId === product.id);
    if (existingItem) {
      setCurrentOrder(currentOrder.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setCurrentOrder([...currentOrder, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        total: product.price
      }]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCurrentOrder(currentOrder.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCurrentOrder(currentOrder.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const calculateOrderTotal = () => {
    const subtotal = currentOrder.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.085; // 8.5% tax
    return { subtotal, tax, total: subtotal + tax };
  };

  const handlePayment = (method: 'cash' | 'card') => {
    const { subtotal, tax, total } = calculateOrderTotal();
    
    const newOrder: POSOrder = {
      id: Date.now().toString(),
      sessionId: sessions.find(s => s.status === 'open')?.id || '1',
      orderNumber: `POS-${Date.now().toString().slice(-6)}`,
      items: currentOrder,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      customer: selectedCustomer || undefined,
      status: 'paid'
    };

    setOrders([newOrder, ...orders]);
    setCurrentOrder([]);
    setSelectedCustomer(null);
    setPaymentAmount('');
    
    toast({
      title: "Payment processed",
      description: `Order ${newOrder.orderNumber} completed successfully.`,
    });
  };

  const sessionFilters = [
    { label: 'Open Sessions', value: 'open', count: sessions.filter(s => s.status === 'open').length },
    { label: 'Closed Sessions', value: 'closed', count: sessions.filter(s => s.status === 'closed').length },
    { label: "Today's Sessions", value: 'today', count: sessions.length }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || session.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
    product.category.toLowerCase().includes(searchProducts.toLowerCase()) ||
    product.barcode.includes(searchProducts)
  );

  const totalSales = sessions.reduce((sum, s) => sum + s.totalSales, 0);
  const totalTransactions = sessions.reduce((sum, s) => sum + s.transactions, 0);
  const avgTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  const activeSessions = sessions.filter(s => s.status === 'open').length;

  const categories = Array.from(new Set(products.map(p => p.category)));

  // POS Terminal Component
  const POSTerminal = () => {
    const { subtotal, tax, total } = calculateOrderTotal();

    return (
      <Dialog open={showPOSTerminal} onOpenChange={setShowPOSTerminal}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <span>POS Terminal</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-12 gap-4 h-[calc(90vh-100px)]">
            {/* Product Grid */}
            <div className="col-span-8 flex flex-col">
              <div className="mb-4">
                <Input
                  placeholder="Search products by name, category, or barcode..."
                  value={searchProducts}
                  onChange={(e) => setSearchProducts(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {filteredProducts.map(product => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAddToCart(product)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                        <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-4 border-l pl-4 flex flex-col">
              <h3 className="font-semibold mb-4">Current Order</h3>
              
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {currentOrder.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.5%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="mt-4 space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handlePayment('cash')}
                  disabled={currentOrder.length === 0}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Cash Payment
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={() => handlePayment('card')}
                  disabled={currentOrder.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Payment
                </Button>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => setCurrentOrder([])}
                  disabled={currentOrder.length === 0}
                >
                  Clear Order
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
        <div className="col-span-1">Stock</div>
        <div className="col-span-2">Margin</div>
        <div className="col-span-1">Status</div>
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
            <div>
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              <p className="text-xs text-gray-500">Cost: ${product.cost.toFixed(2)}</p>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-2">
              <span className={product.stock > 20 ? 'text-green-600' : product.stock > 5 ? 'text-yellow-600' : 'text-red-600'}>
                {product.stock}
              </span>
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-green-600 font-medium">{product.margin}%</span>
          </div>
          <div className="col-span-1">
            <Badge variant={product.isActive ? 'default' : 'secondary'}>
              {product.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrdersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Order #</div>
        <div className="col-span-2">Customer</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-2">Payment</div>
        <div className="col-span-2">Time</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {orders.map(order => (
        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium">{order.orderNumber}</p>
            <p className="text-xs text-gray-500">{order.items.length} items</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{order.customer?.name || 'Walk-in'}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">${order.total.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Tax: ${order.tax.toFixed(2)}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{order.paymentMethod}</Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{new Date(order.timestamp).toLocaleTimeString()}</p>
          </div>
          <div className="col-span-1">
            <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Receipt className="h-4 w-4 mr-2" />
                  Print Receipt
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Refund
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Point of Sale">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'sessions' ? 'POS Sessions' : activeTab === 'products' ? 'Products' : activeTab === 'orders' ? 'Orders' : 'Registers'}
          subtitle={activeTab === 'sessions' ? 'Manage point of sale sessions' : activeTab === 'products' ? 'Product catalog and inventory' : activeTab === 'orders' ? 'Sales transactions and receipts' : 'Cash register management'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => {
            if (activeTab === 'sessions') setShowCreateSession(true);
            else if (activeTab === 'products') setShowCreateProduct(true);
          }}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'sessions' ? sessionFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'sessions' ? filteredSessions.length : activeTab === 'products' ? products.length : orders.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="registers">Registers</TabsTrigger>
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
            {/* Product Category Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category);
                const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                return (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-2">{category}</h3>
                      <p className="text-2xl font-bold">{categoryProducts.length}</p>
                      <p className="text-xs text-gray-600">Value: ${totalValue.toFixed(0)}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {renderProductsList()}
          </TabsContent>

          <TabsContent value="orders" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Today's Orders</h3>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Total Revenue</h3>
                  <p className="text-2xl font-bold">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Cash Payments</h3>
                  <p className="text-2xl font-bold">{orders.filter(o => o.paymentMethod === 'cash').length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Card Payments</h3>
                  <p className="text-2xl font-bold">{orders.filter(o => o.paymentMethod === 'card').length}</p>
                </CardContent>
              </Card>
            </div>
            {renderOrdersList()}
          </TabsContent>

          <TabsContent value="registers" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registers.map(register => (
                <Card key={register.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{register.name}</CardTitle>
                      <Badge 
                        variant={register.status === 'available' ? 'default' : register.status === 'in-use' ? 'secondary' : 'destructive'}
                      >
                        {register.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span>{register.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Cash:</span>
                        <span className="font-medium">${register.currentCash.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Counted:</span>
                        <span className="text-sm">{new Date(register.lastCounted).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Calculator className="h-4 w-4 mr-1" />
                            Count
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-4">Add New Register</p>
                  <Button variant="outline" size="sm">
                    <Calculator className="h-4 w-4 mr-2" />
                    Setup Register
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <POSTerminal />
    </OdooMainLayout>
  );
};

export default PointOfSale;