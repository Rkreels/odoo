
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  TrendingDown, 
  AlertTriangle, 
  ArrowUpRight,
  ArrowDownLeft,
  Truck,
  Warehouse,
  BarChart3,
  Eye,
  Edit,
  MoreVertical,
  QrCode,
  Barcode,
  Calculator,
  FileText,
  Settings,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Filter,
  Download,
  Upload,
  Scan,
  Tag,
  Target,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  brand: string;
  onHand: number;
  reserved: number;
  available: number;
  forecasted: number;
  reorderLevel: number;
  maxStock: number;
  location: string;
  alternativeLocations: string[];
  cost: number;
  standardPrice: number;
  value: number;
  lastMoveDate: string;
  supplier: string;
  alternativeSuppliers: string[];
  leadTime: number;
  weight: number;
  volume: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'obsolete';
  trackingMethod: 'none' | 'lot' | 'serial';
  expirationDate?: string;
  qualityChecks: QualityCheck[];
  tags: string[];
  image?: string;
  notes?: string;
}

interface StockMove {
  id: string;
  product: string;
  sku: string;
  lotNumber?: string;
  serialNumber?: string;
  type: 'receipt' | 'delivery' | 'internal' | 'adjustment' | 'return' | 'scrap';
  quantity: number;
  quantityDone: number;
  uom: string;
  from: string;
  to: string;
  date: string;
  scheduledDate: string;
  reference: string;
  origin?: string;
  pickingType: string;
  partner?: string;
  state: 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancelled';
  priority: 'normal' | 'urgent';
  responsible: string;
  notes?: string;
  cost: number;
  value: number;
}

interface QualityCheck {
  id: string;
  type: 'incoming' | 'outgoing' | 'internal';
  status: 'todo' | 'passed' | 'failed';
  date: string;
  responsible: string;
  notes?: string;
}

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  company: string;
  locations: Location[];
  routes: Route[];
}

interface Route {
  id: string;
  name: string;
  active: boolean;
  sequence: number;
  rules: RouteRule[];
}

interface RouteRule {
  id: string;
  action: 'pull' | 'push';
  pickingType: string;
  locationSrc: string;
  locationDest: string;
  delay: number;
}

interface InventoryAdjustment {
  id: string;
  reference: string;
  date: string;
  state: 'draft' | 'confirmed' | 'done' | 'cancelled';
  responsible: string;
  location: string;
  reason: string;
  lines: AdjustmentLine[];
}

interface AdjustmentLine {
  id: string;
  product: string;
  theoreticalQty: number;
  realQty: number;
  difference: number;
  lotNumber?: string;
  reason?: string;
}

interface Location {
  id: string;
  name: string;
  completeName: string;
  type: 'warehouse' | 'customer' | 'supplier' | 'internal' | 'inventory' | 'production' | 'transit';
  usage: 'supplier' | 'view' | 'internal' | 'customer' | 'inventory' | 'procurement' | 'production' | 'transit';
  parent?: string;
  children: string[];
  products: number;
  totalValue: number;
  barcode?: string;
  active: boolean;
  scrapLocation: boolean;
  returnLocation: boolean;
  replenishLocation: boolean;
  removalStrategy: 'fifo' | 'lifo' | 'fefo';
  putawayStrategy?: string;
  cycleCountFreq: number;
  lastInventoryDate?: string;
  company: string;
  notes?: string;
}

const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [warehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'Main Warehouse',
      code: 'WH001',
      address: '123 Industrial Ave, City',
      manager: 'John Warehouse',
      company: 'Main Company',
      locations: [],
      routes: []
    }
  ]);

  const [adjustments] = useState<InventoryAdjustment[]>([
    {
      id: '1',
      reference: 'ADJ/2024/001',
      date: '2024-01-20',
      state: 'done',
      responsible: 'Inventory Manager',
      location: 'Main Warehouse',
      reason: 'Cycle Count',
      lines: [
        {
          id: '1',
          product: 'Professional Laptop',
          theoreticalQty: 45,
          realQty: 43,
          difference: -2,
          reason: 'Damaged units found'
        }
      ]
    }
  ]);

  const [products, setProducts] = useState<InventoryProduct[]>([
    {
      id: '1',
      name: 'Professional Laptop',
      sku: 'LAP-001',
      barcode: '1234567890123',
      category: 'Electronics',
      brand: 'TechBrand',
      onHand: 45,
      reserved: 5,
      available: 40,
      forecasted: 50,
      reorderLevel: 10,
      maxStock: 100,
      location: 'Main Warehouse/Stock',
      alternativeLocations: ['Secondary Warehouse'],
      cost: 800,
      standardPrice: 850,
      value: 36000,
      lastMoveDate: '2024-01-20',
      supplier: 'Tech Supplier Co.',
      alternativeSuppliers: ['Tech Alternative'],
      leadTime: 7,
      weight: 2.5,
      volume: 0.015,
      status: 'in_stock',
      trackingMethod: 'serial',
      qualityChecks: [],
      tags: ['laptop', 'electronics', 'business'],
      notes: 'High-end business laptop'
    },
    {
      id: '2',
      name: 'Office Chair',
      sku: 'CHR-002',
      barcode: '2345678901234',
      category: 'Furniture',
      brand: 'ComfortSeats',
      onHand: 8,
      reserved: 2,
      available: 6,
      forecasted: 15,
      reorderLevel: 15,
      maxStock: 50,
      location: 'Main Warehouse/Furniture',
      alternativeLocations: [],
      cost: 150,
      standardPrice: 180,
      value: 1200,
      lastMoveDate: '2024-01-18',
      supplier: 'Furniture Plus',
      alternativeSuppliers: ['Office Comfort Ltd'],
      leadTime: 14,
      weight: 15,
      volume: 0.8,
      status: 'low_stock',
      trackingMethod: 'none',
      qualityChecks: [],
      tags: ['chair', 'furniture', 'office'],
      notes: 'Ergonomic office chair with lumbar support'
    },
    {
      id: '3',
      name: 'Wireless Mouse',
      sku: 'MOU-003',
      barcode: '3456789012345',
      category: 'Electronics',
      brand: 'MouseTech',
      onHand: 0,
      reserved: 0,
      available: 0,
      forecasted: 25,
      reorderLevel: 20,
      maxStock: 100,
      location: 'Main Warehouse/Electronics',
      alternativeLocations: ['Retail Store'],
      cost: 25,
      standardPrice: 30,
      value: 0,
      lastMoveDate: '2024-01-15',
      supplier: 'Electronics Hub',
      alternativeSuppliers: ['Computer Accessories Co.'],
      leadTime: 5,
      weight: 0.1,
      volume: 0.001,
      status: 'out_of_stock',
      trackingMethod: 'lot',
      qualityChecks: [],
      tags: ['mouse', 'electronics', 'wireless'],
      notes: 'Wireless optical mouse with USB receiver'
    }
  ]);

  const [stockMoves, setStockMoves] = useState<StockMove[]>([
    {
      id: '1',
      product: 'Professional Laptop',
      sku: 'LAP-001',
      type: 'receipt',
      quantity: 20,
      quantityDone: 20,
      uom: 'Unit',
      from: 'Vendors',
      to: 'Main Warehouse',
      date: '2024-01-20',
      scheduledDate: '2024-01-20',
      reference: 'PO001',
      pickingType: 'Receipts',
      state: 'done',
      priority: 'normal',
      responsible: 'Warehouse Manager',
      cost: 800,
      value: 16000
    },
    {
      id: '2',
      product: 'Office Chair',
      sku: 'CHR-002',
      type: 'delivery',
      quantity: 5,
      quantityDone: 5,
      uom: 'Unit',
      from: 'Main Warehouse',
      to: 'Customers',
      date: '2024-01-18',
      scheduledDate: '2024-01-18',
      reference: 'SO001',
      pickingType: 'Delivery Orders',
      state: 'done',
      priority: 'normal',
      responsible: 'Delivery Team',
      cost: 150,
      value: 750
    }
  ]);

  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Main Warehouse',
      completeName: 'Main Warehouse',
      type: 'warehouse',
      usage: 'internal',
      children: [],
      products: 156,
      totalValue: 485000,
      barcode: 'WH001',
      active: true,
      scrapLocation: false,
      returnLocation: false,
      replenishLocation: true,
      removalStrategy: 'fifo',
      cycleCountFreq: 90,
      company: 'Main Company'
    },
    {
      id: '2',
      name: 'Secondary Storage',
      completeName: 'Secondary Storage',
      type: 'warehouse',
      usage: 'internal',
      children: [],
      products: 89,
      totalValue: 125000,
      barcode: 'WH002',
      active: true,
      scrapLocation: false,
      returnLocation: false,
      replenishLocation: false,
      removalStrategy: 'lifo',
      cycleCountFreq: 180,
      company: 'Main Company'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const productFilters = [
    { label: 'In Stock', value: 'in_stock', count: products.filter(p => p.status === 'in_stock').length },
    { label: 'Low Stock', value: 'low_stock', count: products.filter(p => p.status === 'low_stock').length },
    { label: 'Out of Stock', value: 'out_of_stock', count: products.filter(p => p.status === 'out_of_stock').length },
    { label: 'To Reorder', value: 'reorder', count: products.filter(p => p.available <= p.reorderLevel).length }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      in_stock: 'bg-green-500',
      low_stock: 'bg-yellow-500',
      out_of_stock: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getMoveTypeIcon = (type: string) => {
    const icons = {
      receipt: ArrowDownLeft,
      delivery: ArrowUpRight,
      internal: Package,
      adjustment: Edit
    };
    return icons[type as keyof typeof icons] || Package;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         product.status === selectedFilter ||
                         (selectedFilter === 'reorder' && product.available <= product.reorderLevel);
    return matchesSearch && matchesFilter;
  });

  const totalValue = products.reduce((sum, p) => sum + p.value, 0);
  const lowStockCount = products.filter(p => p.status === 'low_stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out_of_stock').length;

  const renderProductsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Product</div>
        <div className="col-span-1">Category</div>
        <div className="col-span-1">On Hand</div>
        <div className="col-span-1">Reserved</div>
        <div className="col-span-1">Available</div>
        <div className="col-span-1">Reorder Level</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-1">Value</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredProducts.map(product => (
        <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{product.name}</p>
            <p className="text-xs text-gray-600">{product.sku}</p>
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">{product.onHand}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-yellow-600">{product.reserved}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">{product.available}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              {product.available <= product.reorderLevel && (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
              <span className="text-sm">{product.reorderLevel}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Warehouse className="h-3 w-3" />
              <span className="text-sm">{product.location}</span>
            </div>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${product.value.toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(product.status)}`}>
              {product.status.replace('_', ' ')}
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
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Stock
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Truck className="h-4 w-4 mr-2" />
                  Reorder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStockMoves = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Product</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Quantity</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Reference</div>
        <div className="col-span-1">State</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {stockMoves.map(move => {
        const MoveIcon = getMoveTypeIcon(move.type);
        return (
          <div key={move.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
            <div className="col-span-2">
              <p className="font-medium text-sm">{move.product}</p>
              <p className="text-xs text-gray-600">{move.sku}</p>
            </div>
            <div className="col-span-1">
              <div className="flex items-center space-x-1">
                <MoveIcon className="h-4 w-4" />
                <span className="text-sm capitalize">{move.type}</span>
              </div>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-sm">{move.quantity}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm">{move.from}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm">{move.to}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm">{move.date}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm">{move.reference}</p>
            </div>
            <div className="col-span-1">
              <Badge variant={move.state === 'done' ? 'default' : 'secondary'}>
                {move.state}
              </Badge>
            </div>
            <div className="col-span-1">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Inventory">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'products' ? 'Products' : activeTab === 'moves' ? 'Stock Moves' : 'Locations'}
          subtitle={
            activeTab === 'products' ? 'Inventory levels and stock management' :
            activeTab === 'moves' ? 'Track all inventory movements' :
            'Warehouse and storage locations'
          }
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'products' ? productFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'products' ? filteredProducts.length : stockMoves.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="moves">Stock Moves</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${totalValue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{products.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl font-bold">{lowStockCount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">{outOfStockCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderProductsList()}
            </div>
          </TabsContent>

          <TabsContent value="moves" className="flex-1 p-6">
            {renderStockMoves()}
          </TabsContent>

          <TabsContent value="locations" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map(location => (
                <Card key={location.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <Badge variant={location.active ? 'default' : 'secondary'}>
                        {location.usage}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Products:</span>
                        <span className="font-medium">{location.products}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">${location.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Strategy:</span>
                        <span className="font-medium">{location.removalStrategy.toUpperCase()}</span>
                      </div>
                      {location.barcode && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Barcode className="h-4 w-4" />
                          <span>{location.barcode}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="warehouses" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {warehouses.map(warehouse => (
                <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{warehouse.name}</CardTitle>
                      <Badge variant="outline">{warehouse.code}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{warehouse.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">Manager: {warehouse.manager}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Reports
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adjustments" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-2">Reference</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Responsible</div>
                <div className="col-span-2">State</div>
                <div className="col-span-2">Actions</div>
              </div>
              
              {adjustments.map(adjustment => (
                <div key={adjustment.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                  <div className="col-span-2">
                    <p className="font-medium text-sm">{adjustment.reference}</p>
                    <p className="text-xs text-gray-600">{adjustment.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">{adjustment.date}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">{adjustment.location}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">{adjustment.responsible}</p>
                  </div>
                  <div className="col-span-2">
                    <Badge className={`text-white ${adjustment.state === 'done' ? 'bg-green-500' : 'bg-blue-500'}`}>
                      {adjustment.state}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reporting" className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Valuation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Inventory Value</span>
                      <span className="font-medium">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Unit Cost</span>
                      <span className="font-medium">$${(totalValue / products.length).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stock Turnover</span>
                      <span className="font-medium">4.2x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ABC Analysis A Items</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dead Stock Items</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Obsolete Stock Value</span>
                      <span className="font-medium">$2,400</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reorder Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.filter(p => p.available <= p.reorderLevel).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">Current: {product.available} | Min: {product.reorderLevel}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan Barcode
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calculator className="h-4 w-4 mr-2" />
                      Cycle Count
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Stock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Inventory;
