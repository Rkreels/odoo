import React, { useState } from 'react';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Package, DollarSign, Users, TrendingUp, Star, Eye, Edit, Plus, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generateId } from '@/lib/localStorageUtils';

interface EcommerceOrder {
  id: string; orderNumber: string; customer: string; email: string; total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; items: number; date: string; paymentMethod: string; shippingAddress: string;
}

interface EcommerceProduct {
  id: string; name: string; sku: string; price: number; stock: number; category: string;
  status: 'active' | 'inactive' | 'out-of-stock'; rating: number; reviews: number; sales: number;
}

const Ecommerce = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<EcommerceOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<EcommerceProduct | null>(null);

  const [orders, setOrders] = useState<EcommerceOrder[]>([
    { id: '1', orderNumber: 'ORD-001', customer: 'John Smith', email: 'john@example.com', total: 299.99, status: 'processing', items: 3, date: '2024-06-11', paymentMethod: 'Credit Card', shippingAddress: '123 Main St, New York, NY' },
    { id: '2', orderNumber: 'ORD-002', customer: 'Sarah Johnson', email: 'sarah@example.com', total: 159.50, status: 'shipped', items: 2, date: '2024-06-10', paymentMethod: 'PayPal', shippingAddress: '456 Oak Ave, Los Angeles, CA' },
  ]);

  const [products, setProducts] = useState<EcommerceProduct[]>([
    { id: '1', name: 'Wireless Headphones', sku: 'WH-001', price: 99.99, stock: 45, category: 'Electronics', status: 'active', rating: 4.5, reviews: 128, sales: 342 },
    { id: '2', name: 'Smart Watch', sku: 'SW-002', price: 199.99, stock: 0, category: 'Electronics', status: 'out-of-stock', rating: 4.2, reviews: 89, sales: 156 },
  ]);

  const [productForm, setProductForm] = useState({ name: '', sku: '', price: 0, stock: 0, category: '', status: 'active' as EcommerceProduct['status'] });

  const handleCreateProduct = () => {
    const newProduct: EcommerceProduct = { id: generateId(), ...productForm, rating: 0, reviews: 0, sales: 0 };
    setProducts(prev => [newProduct, ...prev]);
    setIsCreateProductOpen(false);
    setProductForm({ name: '', sku: '', price: 0, stock: 0, category: '', status: 'active' });
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...productForm } : p));
    setIsEditProductOpen(false); setSelectedProduct(null);
  };

  const handleDeleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const handleOrderStatusChange = (id: string, status: EcommerceOrder['status']) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  const handleDeleteOrder = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));

  const openEditProduct = (product: EcommerceProduct) => {
    setSelectedProduct(product);
    setProductForm({ name: product.name, sku: product.sku, price: product.price, stock: product.stock, category: product.category, status: product.status });
    setIsEditProductOpen(true);
  };

  const orderFilters = [
    { label: 'All', value: 'all', count: orders.length },
    { label: 'Processing', value: 'processing', count: orders.filter(o => o.status === 'processing').length },
    { label: 'Shipped', value: 'shipped', count: orders.filter(o => o.status === 'shipped').length },
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || o.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const renderProductForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Name</Label><Input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} /></div>
        <div><Label>SKU</Label><Input value={productForm.sku} onChange={e => setProductForm({ ...productForm, sku: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Price</Label><Input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} /></div>
        <div><Label>Stock</Label><Input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Category</Label><Input value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={productForm.status} onValueChange={v => setProductForm({ ...productForm, status: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="out-of-stock">Out of Stock</SelectItem></SelectContent></Select></div>
      </div>
    </div>
  );

  return (
    <OdooMainLayout currentApp="eCommerce">
      <div className="flex flex-col h-full">
        <OdooControlPanel title={activeTab === 'orders' ? 'Orders' : 'Products'} subtitle="Manage your online store" searchPlaceholder={`Search ${activeTab}...`} onSearch={setSearchTerm}
          onCreateNew={() => activeTab === 'products' ? setIsCreateProductOpen(true) : undefined}
          filters={orderFilters} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} recordCount={activeTab === 'orders' ? filteredOrders.length : filteredProducts.length} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6"><TabsList className="grid w-full max-w-md grid-cols-2"><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="products">Products</TabsTrigger></TabsList></div>

          <TabsContent value="orders" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white border-b">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle></CardHeader><CardContent><span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle></CardHeader><CardContent><span className="text-2xl font-bold">{orders.length}</span></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle></CardHeader><CardContent><span className="text-2xl font-bold">{products.length}</span></CardContent></Card>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-white rounded-lg border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                  <div className="col-span-2">Order</div><div className="col-span-3">Customer</div><div className="col-span-2">Total</div><div className="col-span-2">Status</div><div className="col-span-1">Date</div><div className="col-span-2">Actions</div>
                </div>
                {filteredOrders.map(order => (
                  <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                    <div className="col-span-2"><p className="font-medium">{order.orderNumber}</p><p className="text-sm text-gray-500">{order.items} items</p></div>
                    <div className="col-span-3"><p className="font-medium">{order.customer}</p><p className="text-sm text-gray-500">{order.email}</p></div>
                    <div className="col-span-2"><p className="font-semibold">${order.total.toFixed(2)}</p><p className="text-sm text-gray-500">{order.paymentMethod}</p></div>
                    <div className="col-span-2"><Badge variant={order.status === 'delivered' ? 'default' : order.status === 'shipped' ? 'secondary' : 'outline'}>{order.status}</Badge></div>
                    <div className="col-span-1"><span className="text-sm">{order.date}</span></div>
                    <div className="col-span-2">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(order); setIsViewOrderOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'processing')}>Mark Processing</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'shipped')}>Mark Shipped</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'delivered')}>Mark Delivered</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'cancelled')} className="text-red-600">Cancel Order</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between"><CardTitle className="text-lg">{product.name}</CardTitle><Badge variant={product.status === 'active' ? 'default' : product.status === 'out-of-stock' ? 'destructive' : 'secondary'}>{product.status}</Badge></div>
                    <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center"><span className="text-2xl font-bold">${product.price}</span><div className="flex items-center space-x-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /><span className="text-sm">{product.rating} ({product.reviews})</span></div></div>
                      <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Stock: {product.stock}</span><span className="text-sm text-gray-600">Sales: {product.sales}</span></div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditProduct(product)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent><DialogHeader><DialogTitle>Order Details</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-500">Order</Label><p className="font-medium">{selectedOrder.orderNumber}</p></div>
                <div><Label className="text-gray-500">Status</Label><Badge>{selectedOrder.status}</Badge></div>
                <div><Label className="text-gray-500">Customer</Label><p>{selectedOrder.customer}</p></div>
                <div><Label className="text-gray-500">Email</Label><p>{selectedOrder.email}</p></div>
                <div><Label className="text-gray-500">Total</Label><p className="font-bold">${selectedOrder.total.toFixed(2)}</p></div>
                <div><Label className="text-gray-500">Payment</Label><p>{selectedOrder.paymentMethod}</p></div>
                <div className="col-span-2"><Label className="text-gray-500">Shipping Address</Label><p>{selectedOrder.shippingAddress}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
        <DialogContent><DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
          {renderProductForm()}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateProductOpen(false)}>Cancel</Button><Button onClick={handleCreateProduct}>Add Product</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent><DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          {renderProductForm()}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditProductOpen(false)}>Cancel</Button><Button onClick={handleUpdateProduct}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </OdooMainLayout>
  );
};

export default Ecommerce;
