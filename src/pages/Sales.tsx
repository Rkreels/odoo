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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Plus,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { LOCAL_STORAGE_KEYS, getStoredData, addRecord, updateRecord, deleteRecord, generateId, getStoredCustomers, getStoredProducts } from '@/lib/localStorageUtils';

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

const INITIAL_SALES_ORDERS: SalesOrder[] = [
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
];

const Sales = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Dialog states
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Form states
  const [orderForm, setOrderForm] = useState({
    customer: '',
    customerEmail: '',
    validUntil: '',
    deliveryDate: '',
    salesperson: '',
    paymentTerms: 'Net 30',
    source: 'Direct',
    tags: '',
    items: [{ product: '', description: '', quantity: 1, unitPrice: 0, discount: 0 }]
  });

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    cost: 0,
    stock: 0,
    type: 'storable' as 'storable' | 'consumable' | 'service',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Load data
    setSalesOrders(getStoredData(LOCAL_STORAGE_KEYS.SALES_ORDERS, INITIAL_SALES_ORDERS));
    const loadedProducts = getStoredProducts();
    // Ensure product types are properly typed
    setProducts(loadedProducts.map(p => ({
      ...p,
      type: (p.type as 'storable' | 'consumable' | 'service') || 'storable',
      status: (p.status as 'active' | 'inactive') || 'active'
    })));
    setCustomers(getStoredCustomers());
  }, [navigate]);

  const orderFilters = [
    { label: 'All Orders', value: 'all', count: salesOrders.length },
    { label: 'Quotations', value: 'draft', count: salesOrders.filter(o => o.status === 'draft').length },
    { label: 'Sales Orders', value: 'confirmed', count: salesOrders.filter(o => o.status === 'confirmed').length },
    { label: 'Delivered', value: 'delivered', count: salesOrders.filter(o => o.status === 'delivered').length }
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
    const matchesSearch = (order.number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customer?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = salesOrders.filter(o => o.status === 'confirmed' || o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const totalQuotations = salesOrders.filter(o => o.status === 'draft' || o.status === 'sent').reduce((sum, o) => sum + o.total, 0);

  const calculateOrderTotal = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice - (item.discount || 0)) * 0.1), 0);
    return {
      subtotal,
      discount: totalDiscount,
      tax: totalTax,
      total: subtotal - totalDiscount + totalTax
    };
  };

  const handleCreateOrder = () => {
    const orderTotals = calculateOrderTotal(orderForm.items);
    
    const newOrder: SalesOrder = {
      id: generateId(),
      number: `SO${String(salesOrders.length + 1).padStart(3, '0')}`,
      customer: orderForm.customer,
      customerEmail: orderForm.customerEmail,
      date: new Date().toISOString().split('T')[0],
      validUntil: orderForm.validUntil,
      status: 'draft',
      salesperson: orderForm.salesperson,
      paymentTerms: orderForm.paymentTerms,
      deliveryDate: orderForm.deliveryDate,
      items: orderForm.items.map((item: any) => ({
        id: generateId(),
        product: item.product,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: (item.quantity * item.unitPrice - item.discount) * 0.1,
        total: item.quantity * item.unitPrice - item.discount
      })),
      subtotal: orderTotals.subtotal,
      tax: orderTotals.tax,
      discount: orderTotals.discount,
      total: orderTotals.total,
      margin: 20, // Default margin
      source: orderForm.source,
      tags: orderForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    const updatedOrders = addRecord(LOCAL_STORAGE_KEYS.SALES_ORDERS, newOrder);
    setSalesOrders(updatedOrders);
    setIsCreateOrderOpen(false);
    
    // Reset form
    setOrderForm({
      customer: '',
      customerEmail: '',
      validUntil: '',
      deliveryDate: '',
      salesperson: '',
      paymentTerms: 'Net 30',
      source: 'Direct',
      tags: '',
      items: [{ product: '', description: '', quantity: 1, unitPrice: 0, discount: 0 }]
    });

    toast({
      title: "Sales Order Created",
      description: `Order ${newOrder.number} has been created successfully.`,
    });
  };

  const handleEditOrder = () => {
    if (!selectedOrder) return;

    const orderTotals = calculateOrderTotal(orderForm.items);
    
    const updates = {
      customer: orderForm.customer,
      customerEmail: orderForm.customerEmail,
      validUntil: orderForm.validUntil,
      deliveryDate: orderForm.deliveryDate,
      salesperson: orderForm.salesperson,
      paymentTerms: orderForm.paymentTerms,
      source: orderForm.source,
      tags: orderForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      items: orderForm.items.map((item: any) => ({
        id: item.id || generateId(),
        product: item.product,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: (item.quantity * item.unitPrice - item.discount) * 0.1,
        total: item.quantity * item.unitPrice - item.discount
      })),
      subtotal: orderTotals.subtotal,
      tax: orderTotals.tax,
      discount: orderTotals.discount,
      total: orderTotals.total
    };

    const updatedOrders = updateRecord<SalesOrder>(LOCAL_STORAGE_KEYS.SALES_ORDERS, selectedOrder.id, updates);
    setSalesOrders(updatedOrders);
    setIsEditOrderOpen(false);
    setSelectedOrder(null);

    toast({
      title: "Sales Order Updated",
      description: `Order ${selectedOrder.number} has been updated successfully.`,
    });
  };

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: generateId(),
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      price: productForm.price,
      cost: productForm.cost,
      stock: productForm.stock,
      type: productForm.type,
      status: productForm.status
    };

    const updatedProducts = addRecord(LOCAL_STORAGE_KEYS.PRODUCTS, newProduct);
    setProducts(updatedProducts);
    setIsCreateProductOpen(false);
    
    // Reset form
    setProductForm({
      name: '',
      sku: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      type: 'storable',
      status: 'active'
    });

    toast({
      title: "Product Created",
      description: `Product ${newProduct.name} has been created successfully.`,
    });
  };

  const handleDeleteOrder = (id: string) => {
    const updatedOrders = deleteRecord<SalesOrder>(LOCAL_STORAGE_KEYS.SALES_ORDERS, id);
    setSalesOrders(updatedOrders);
    
    toast({
      title: "Sales Order Deleted",
      description: "Sales order has been deleted successfully.",
    });
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = deleteRecord<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, id);
    setProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: "Product has been deleted successfully.",
    });
  };

  const handleSendOrder = (order: SalesOrder) => {
    const updatedOrders = updateRecord<SalesOrder>(LOCAL_STORAGE_KEYS.SALES_ORDERS, order.id, { status: 'sent' });
    setSalesOrders(updatedOrders);
    
    toast({
      title: "Order Sent",
      description: `Order ${order.number} has been sent to ${order.customer}.`,
    });
  };

  const handleConfirmOrder = (order: SalesOrder) => {
    const updatedOrders = updateRecord<SalesOrder>(LOCAL_STORAGE_KEYS.SALES_ORDERS, order.id, { status: 'confirmed' });
    setSalesOrders(updatedOrders);
    
    toast({
      title: "Order Confirmed",
      description: `Order ${order.number} has been confirmed.`,
    });
  };

  const openEditDialog = (order: SalesOrder) => {
    setSelectedOrder(order);
    setOrderForm({
      customer: order.customer,
      customerEmail: order.customerEmail,
      validUntil: order.validUntil,
      deliveryDate: order.deliveryDate,
      salesperson: order.salesperson,
      paymentTerms: order.paymentTerms,
      source: order.source,
      tags: order.tags.join(', '),
      items: order.items.map(item => ({
        product: item.product,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount
      }))
    });
    setIsEditOrderOpen(true);
  };

  const addOrderItem = () => {
    setOrderForm({
      ...orderForm,
      items: [...orderForm.items, { product: '', description: '', quantity: 1, unitPrice: 0, discount: 0 }]
    });
  };

  const removeOrderItem = (index: number) => {
    const newItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm({ ...orderForm, items: newItems });
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const newItems = [...orderForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderForm({ ...orderForm, items: newItems });
  };

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
                <DropdownMenuItem onClick={() => openEditDialog(order)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSendOrder(order)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send by Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleConfirmOrder(order)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Confirm Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: 'Download', description: 'PDF downloaded successfully' })}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
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
                <DropdownMenuItem onClick={() => toast({ title: 'Edit Product', description: `Editing ${product.name}` })}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: 'View Stock', description: `Current stock: ${product.stock}` })}>
                  <Package className="h-4 w-4 mr-2" />
                  View Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
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
          onCreateNew={() => {
            if (activeTab === 'orders') {
              setIsCreateOrderOpen(true);
            } else if (activeTab === 'products') {
              setIsCreateProductOpen(true);
            }
          }}
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
                  <Button onClick={() => toast({ title: 'Add Customer', description: 'Customer creation form would open here.' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">Total Customers</h4>
                    <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Active This Month</h4>
                    <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'Active').length}</p>
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
                        <TableHead>Type</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map(customer => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{customer.type}</Badge>
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>
                            <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Customer Details', description: `Viewing ${customer.name}` })}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
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

        {/* Create Order Dialog */}
        <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sales Order</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={orderForm.customer} onValueChange={(value) => {
                  const customer = customers.find(c => c.name === value);
                  setOrderForm({
                    ...orderForm,
                    customer: value,
                    customerEmail: customer?.email || ''
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  value={orderForm.customerEmail}
                  onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  type="date"
                  value={orderForm.validUntil}
                  onChange={(e) => setOrderForm({ ...orderForm, validUntil: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  type="date"
                  value={orderForm.deliveryDate}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="salesperson">Salesperson</Label>
                <Input
                  value={orderForm.salesperson}
                  onChange={(e) => setOrderForm({ ...orderForm, salesperson: e.target.value })}
                  placeholder="Enter salesperson name"
                />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={orderForm.paymentTerms} onValueChange={(value) => setOrderForm({ ...orderForm, paymentTerms: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Select value={orderForm.source} onValueChange={(value) => setOrderForm({ ...orderForm, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  value={orderForm.tags}
                  onChange={(e) => setOrderForm({ ...orderForm, tags: e.target.value })}
                  placeholder="e.g., enterprise, urgent"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {orderForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                  <Select value={item.product} onValueChange={(value) => {
                    const product = products.find(p => p.name === value);
                    updateOrderItem(index, 'product', value);
                    if (product) {
                      updateOrderItem(index, 'description', product.name);
                      updateOrderItem(index, 'unitPrice', product.price);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateOrderItem(index, 'unitPrice', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Discount"
                    value={item.discount}
                    onChange={(e) => updateOrderItem(index, 'discount', Number(e.target.value))}
                  />
                  <div className="flex items-center">
                    <span>${((item.quantity * item.unitPrice) - item.discount).toFixed(2)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderForm.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder}>
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Sales Order {selectedOrder?.number}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={orderForm.customer} onValueChange={(value) => {
                  const customer = customers.find(c => c.name === value);
                  setOrderForm({
                    ...orderForm,
                    customer: value,
                    customerEmail: customer?.email || ''
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  value={orderForm.customerEmail}
                  onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  type="date"
                  value={orderForm.validUntil}
                  onChange={(e) => setOrderForm({ ...orderForm, validUntil: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  type="date"
                  value={orderForm.deliveryDate}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="salesperson">Salesperson</Label>
                <Input
                  value={orderForm.salesperson}
                  onChange={(e) => setOrderForm({ ...orderForm, salesperson: e.target.value })}
                  placeholder="Enter salesperson name"
                />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={orderForm.paymentTerms} onValueChange={(value) => setOrderForm({ ...orderForm, paymentTerms: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Select value={orderForm.source} onValueChange={(value) => setOrderForm({ ...orderForm, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  value={orderForm.tags}
                  onChange={(e) => setOrderForm({ ...orderForm, tags: e.target.value })}
                  placeholder="e.g., enterprise, urgent"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {orderForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                  <Select value={item.product} onValueChange={(value) => {
                    const product = products.find(p => p.name === value);
                    updateOrderItem(index, 'product', value);
                    if (product) {
                      updateOrderItem(index, 'description', product.name);
                      updateOrderItem(index, 'unitPrice', product.price);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateOrderItem(index, 'unitPrice', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Discount"
                    value={item.discount}
                    onChange={(e) => updateOrderItem(index, 'discount', Number(e.target.value))}
                  />
                  <div className="flex items-center">
                    <span>${((item.quantity * item.unitPrice) - item.discount).toFixed(2)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderForm.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOrderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditOrder}>
                Update Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Product Dialog */}
        <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={productForm.type} onValueChange={(value) => setProductForm({ ...productForm, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="storable">Storable Product</SelectItem>
                    <SelectItem value="consumable">Consumable</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Sales Price</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input
                  type="number"
                  value={productForm.cost}
                  onChange={(e) => setProductForm({ ...productForm, cost: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={productForm.status} onValueChange={(value) => setProductForm({ ...productForm, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateProductOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProduct}>
                Create Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OdooMainLayout>
  );
};

export default Sales;