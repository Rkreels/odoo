
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
  MoreVertical
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
  category: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  location: string;
  cost: number;
  value: number;
  lastMoveDate: string;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface StockMove {
  id: string;
  product: string;
  sku: string;
  type: 'receipt' | 'delivery' | 'internal' | 'adjustment';
  quantity: number;
  from: string;
  to: string;
  date: string;
  reference: string;
  state: 'draft' | 'confirmed' | 'done' | 'cancelled';
}

interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'customer' | 'supplier' | 'internal';
  parent?: string;
  products: number;
  totalValue: number;
}

const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProducts] = useState<InventoryProduct[]>([
    {
      id: '1',
      name: 'Professional Laptop',
      sku: 'LAP-001',
      category: 'Electronics',
      onHand: 45,
      reserved: 5,
      available: 40,
      reorderLevel: 10,
      location: 'Main Warehouse',
      cost: 800,
      value: 36000,
      lastMoveDate: '2024-01-20',
      supplier: 'Tech Supplier Co.',
      status: 'in_stock'
    },
    {
      id: '2',
      name: 'Office Chair',
      sku: 'CHR-002',
      category: 'Furniture',
      onHand: 8,
      reserved: 2,
      available: 6,
      reorderLevel: 15,
      location: 'Main Warehouse',
      cost: 150,
      value: 1200,
      lastMoveDate: '2024-01-18',
      supplier: 'Furniture Plus',
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Wireless Mouse',
      sku: 'MOU-003',
      category: 'Electronics',
      onHand: 0,
      reserved: 0,
      available: 0,
      reorderLevel: 20,
      location: 'Main Warehouse',
      cost: 25,
      value: 0,
      lastMoveDate: '2024-01-15',
      supplier: 'Electronics Hub',
      status: 'out_of_stock'
    }
  ]);

  const [stockMoves, setStockMoves] = useState<StockMove[]>([
    {
      id: '1',
      product: 'Professional Laptop',
      sku: 'LAP-001',
      type: 'receipt',
      quantity: 20,
      from: 'Vendors',
      to: 'Main Warehouse',
      date: '2024-01-20',
      reference: 'PO001',
      state: 'done'
    },
    {
      id: '2',
      product: 'Office Chair',
      sku: 'CHR-002',
      type: 'delivery',
      quantity: 5,
      from: 'Main Warehouse',
      to: 'Customers',
      date: '2024-01-18',
      reference: 'SO001',
      state: 'done'
    }
  ]);

  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Main Warehouse',
      type: 'warehouse',
      products: 156,
      totalValue: 485000
    },
    {
      id: '2',
      name: 'Secondary Storage',
      type: 'warehouse',
      products: 89,
      totalValue: 125000
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
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="moves">Stock Moves</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
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
            <div className="text-center text-gray-500">
              Location management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Inventory;
