
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
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Send,
  Download,
  MoreVertical,
  Calendar,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PurchaseOrder {
  id: string;
  reference: string;
  vendor: string;
  vendorEmail: string;
  orderDate: string;
  deliveryDate: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  purchaseRep: string;
  paymentTerms: string;
  incoterm: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  source: string;
  priority: 'low' | 'medium' | 'high';
}

interface PurchaseOrderItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  receivedQty: number;
  billedQty: number;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  paymentTerms: string;
  currency: string;
}

interface Receipt {
  id: string;
  reference: string;
  purchaseOrder: string;
  vendor: string;
  receiptDate: string;
  status: 'draft' | 'done' | 'cancelled';
  responsible: string;
  location: string;
  products: ReceiptProduct[];
}

interface ReceiptProduct {
  id: string;
  product: string;
  expectedQty: number;
  receivedQty: number;
  status: 'pending' | 'partial' | 'done';
}

const Purchase = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      reference: 'PO00001',
      vendor: 'Tech Supplies Ltd',
      vendorEmail: 'orders@techsupplies.com',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      status: 'confirmed',
      purchaseRep: 'John Smith',
      paymentTerms: 'Net 30',
      incoterm: 'EXW',
      items: [
        {
          id: '1',
          product: 'Office Desk',
          description: 'Ergonomic office desk with drawers',
          quantity: 10,
          unitPrice: 450,
          tax: 10,
          total: 4500,
          receivedQty: 8,
          billedQty: 0
        }
      ],
      subtotal: 4500,
      tax: 450,
      total: 4950,
      currency: 'USD',
      source: 'Manual',
      priority: 'medium'
    },
    {
      id: '2',
      reference: 'PO00002',
      vendor: 'Industrial Components Inc',
      vendorEmail: 'sales@industrial.com',
      orderDate: '2024-01-20',
      deliveryDate: '2024-02-05',
      status: 'sent',
      purchaseRep: 'Sarah Johnson',
      paymentTerms: 'Net 15',
      incoterm: 'FOB',
      items: [
        {
          id: '1',
          product: 'Steel Components',
          description: 'High-grade steel parts for manufacturing',
          quantity: 100,
          unitPrice: 25,
          tax: 8,
          total: 2500,
          receivedQty: 0,
          billedQty: 0
        }
      ],
      subtotal: 2500,
      tax: 200,
      total: 2700,
      currency: 'USD',
      source: 'Manufacturing Order',
      priority: 'high'
    }
  ]);

  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Tech Supplies Ltd',
      email: 'orders@techsupplies.com',
      phone: '+1 234 567 8900',
      address: '123 Business Ave, Tech City',
      country: 'USA',
      category: 'Office Supplies',
      rating: 4.5,
      totalOrders: 25,
      totalSpent: 125000,
      status: 'active',
      paymentTerms: 'Net 30',
      currency: 'USD'
    },
    {
      id: '2',
      name: 'Industrial Components Inc',
      email: 'sales@industrial.com',
      phone: '+1 234 567 8901',
      address: '456 Industrial Blvd, Factory Town',
      country: 'USA',
      category: 'Manufacturing',
      rating: 4.8,
      totalOrders: 15,
      totalSpent: 75000,
      status: 'active',
      paymentTerms: 'Net 15',
      currency: 'USD'
    }
  ]);

  const [receipts] = useState<Receipt[]>([
    {
      id: '1',
      reference: 'WH/IN/00001',
      purchaseOrder: 'PO00001',
      vendor: 'Tech Supplies Ltd',
      receiptDate: '2024-01-23',
      status: 'done',
      responsible: 'Mike Wilson',
      location: 'WH/Stock',
      products: [
        {
          id: '1',
          product: 'Office Desk',
          expectedQty: 10,
          receivedQty: 8,
          status: 'partial'
        }
      ]
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const orderFilters = [
    { label: 'Purchase Orders', value: 'confirmed', count: 12 },
    { label: 'RFQs', value: 'draft', count: 5 },
    { label: 'To Receive', value: 'to_receive', count: 8 },
    { label: 'To Bill', value: 'to_bill', count: 3 }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      confirmed: 'bg-green-500',
      received: 'bg-purple-500',
      cancelled: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalSpent = purchaseOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = purchaseOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const renderOrdersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Reference</div>
        <div className="col-span-2">Vendor</div>
        <div className="col-span-1">Order Date</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Total</div>
        <div className="col-span-2">Delivery Date</div>
        <div className="col-span-2">Purchase Rep</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredOrders.map(order => (
        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{order.reference}</p>
            <Badge variant={order.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs mt-1">
              {order.priority}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium">{order.vendor}</p>
            <p className="text-xs text-gray-600">{order.vendorEmail}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{order.orderDate}</p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${order.total.toLocaleString()}</p>
            <p className="text-xs text-gray-600">{order.currency}</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span className="text-sm">{order.deliveryDate}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="text-sm">{order.purchaseRep}</span>
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

  const renderVendorsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Vendor</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Rating</div>
        <div className="col-span-2">Total Orders</div>
        <div className="col-span-2">Total Spent</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {vendors.map(vendor => (
        <div key={vendor.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{vendor.name}</p>
            <p className="text-xs text-gray-600">{vendor.email}</p>
            <p className="text-xs text-gray-600">{vendor.country}</p>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{vendor.category}</Badge>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{vendor.rating}</span>
              <span className="text-yellow-500">★</span>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{vendor.totalOrders} orders</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-sm">${vendor.totalSpent.toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
              {vendor.status}
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
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Purchase">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'orders' ? 'Purchase Orders' : activeTab === 'vendors' ? 'Vendors' : 'Receipts'}
          subtitle={activeTab === 'orders' ? 'Manage purchase orders and RFQs' : activeTab === 'vendors' ? 'Vendor management and relationships' : 'Incoming shipments and receipts'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'orders' ? orderFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'orders' ? filteredOrders.length : activeTab === 'vendors' ? vendors.length : receipts.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalSpent.toLocaleString()}</span>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">${avgOrderValue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">5</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderOrdersList()}
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="flex-1 p-6">
            {renderVendorsList()}
          </TabsContent>

          <TabsContent value="receipts" className="flex-1 p-6">
            <div className="text-center text-gray-500">
              Receipt management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Purchase;
