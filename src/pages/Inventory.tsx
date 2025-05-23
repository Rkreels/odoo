
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Package, Plus, Filter, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, StockMove, StockValuation } from '@/types/inventory';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import { toast } from "@/components/ui/use-toast";

const Inventory = () => {
  const navigate = useNavigate();
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PROD001',
      name: 'Office Chair Premium',
      sku: 'OCP-001',
      category: 'Furniture',
      type: 'storable',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: 'pcs',
      cost: 150,
      salePrice: 299,
      location: 'Warehouse A'
    },
    {
      id: 'PROD002',
      name: 'Laptop Stand',
      sku: 'LS-002',
      category: 'Accessories',
      type: 'storable',
      currentStock: 5,
      minStock: 15,
      maxStock: 50,
      unit: 'pcs',
      cost: 25,
      salePrice: 49,
      location: 'Warehouse B'
    },
    {
      id: 'PROD003',
      name: 'Conference Table',
      sku: 'CT-003',
      category: 'Furniture',
      type: 'storable',
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      unit: 'pcs',
      cost: 800,
      salePrice: 1599,
      location: 'Warehouse A'
    }
  ]);

  const [stockMoves, setStockMoves] = useState<StockMove[]>([
    {
      id: 'SM001',
      product: 'Office Chair Premium',
      type: 'in',
      quantity: 20,
      date: '2025-05-20',
      location: 'Warehouse A',
      reference: 'PO001',
      responsible: 'John Smith'
    },
    {
      id: 'SM002',
      product: 'Laptop Stand',
      type: 'out',
      quantity: 10,
      date: '2025-05-21',
      location: 'Warehouse B',
      reference: 'SO001',
      responsible: 'Alice Brown'
    },
    {
      id: 'SM003',
      product: 'Conference Table',
      type: 'out',
      quantity: 2,
      date: '2025-05-22',
      location: 'Warehouse A',
      reference: 'SO002',
      responsible: 'Mike Wilson'
    }
  ]);

  const valuation: StockValuation = {
    totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.cost), 0),
    totalProducts: products.length,
    lowStockItems: products.filter(p => p.currentStock < p.minStock && p.currentStock > 0).length,
    outOfStockItems: products.filter(p => p.currentStock === 0).length
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleStockAdjustment = (productId: string, adjustment: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, currentStock: Math.max(0, product.currentStock + adjustment) }
          : product
      )
    );
    
    const newMove: StockMove = {
      id: `SM${Date.now()}`,
      product: products.find(p => p.id === productId)?.name || '',
      type: adjustment > 0 ? 'in' : 'out',
      quantity: Math.abs(adjustment),
      date: new Date().toISOString().split('T')[0],
      location: 'Manual Adjustment',
      reference: 'ADJ001',
      responsible: 'Current User'
    };
    
    setStockMoves(prev => [newMove, ...prev]);
    
    toast({
      title: "Stock adjusted",
      description: `Stock ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)} units.`,
    });
  };

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (product.currentStock < product.minStock) return { status: 'Low Stock', variant: 'secondary' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  return (
    <TopbarDashboardLayout currentApp="Inventory">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Inventory Management</h1>
                <p className="text-odoo-gray">
                  Track stock levels, manage products, and monitor inventory movements.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowVoiceTrainer(!showVoiceTrainer)}
                className="border-odoo-primary text-odoo-primary hover:bg-odoo-primary hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Voice Guide
              </Button>
              <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold">${valuation.totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-2xl font-semibold">{valuation.totalProducts}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold text-orange-500">{valuation.lowStockItems}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-semibold text-red-500">{valuation.outOfStockItems}</p>
            </div>
          </div>

          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="flex items-center justify-between mb-6">
                <div className="w-64">
                  <Input placeholder="Search products..." />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {products.map(product => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <Card key={product.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <p className="text-gray-500">SKU: {product.sku} | Category: {product.category}</p>
                          </div>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Current Stock</p>
                            <p className="text-lg font-semibold">{product.currentStock} {product.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Min/Max Stock</p>
                            <p className="text-lg">{product.minStock}/{product.maxStock} {product.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Value</p>
                            <p className="text-lg font-semibold">${(product.currentStock * product.cost).toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStockAdjustment(product.id, -1)}
                              disabled={product.currentStock === 0}
                            >
                              <TrendingDown className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStockAdjustment(product.id, 1)}
                            >
                              <TrendingUp className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="movements">
              <div className="space-y-4">
                {stockMoves.map(move => (
                  <Card key={move.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{move.product}</h4>
                          <p className="text-sm text-gray-500">{move.reference} | {move.responsible}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {move.type === 'in' ? (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className="font-medium">
                              {move.type === 'in' ? '+' : '-'}{move.quantity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{move.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="locations">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Warehouse A', 'Warehouse B', 'Store Front'].map(location => (
                  <Card key={location}>
                    <CardHeader>
                      <CardTitle className="text-base">{location}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500">
                        <p>Products: {products.filter(p => p.location === location).length}</p>
                        <p>Total Value: ${products.filter(p => p.location === location).reduce((sum, p) => sum + (p.currentStock * p.cost), 0).toLocaleString()}</p>
                        <p>Capacity: 80%</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Voice Trainer */}
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="inventory"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default Inventory;
