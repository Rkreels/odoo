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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, DollarSign, TrendingUp, Package, Truck, Eye, Edit, Send, Download, MoreVertical, Calendar, User, Trash2, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generateId } from '@/lib/localStorageUtils';

interface PurchaseOrder {
  id: string; reference: string; vendor: string; vendorEmail: string; orderDate: string; deliveryDate: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled'; purchaseRep: string; paymentTerms: string;
  items: { id: string; product: string; description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number; tax: number; total: number; priority: 'low' | 'medium' | 'high';
}

interface Vendor {
  id: string; name: string; email: string; phone: string; address: string; country: string; category: string;
  rating: number; totalOrders: number; totalSpent: number; status: 'active' | 'inactive'; paymentTerms: string;
}

const Purchase = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateVendorOpen, setIsCreateVendorOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { id: '1', reference: 'PO00001', vendor: 'Tech Supplies Ltd', vendorEmail: 'orders@techsupplies.com', orderDate: '2024-01-15', deliveryDate: '2024-01-25', status: 'confirmed', purchaseRep: 'John Smith', paymentTerms: 'Net 30', items: [{ id: '1', product: 'Office Desk', description: 'Ergonomic office desk', quantity: 10, unitPrice: 450, total: 4500 }], subtotal: 4500, tax: 450, total: 4950, priority: 'medium' },
    { id: '2', reference: 'PO00002', vendor: 'Industrial Components Inc', vendorEmail: 'sales@industrial.com', orderDate: '2024-01-20', deliveryDate: '2024-02-05', status: 'sent', purchaseRep: 'Sarah Johnson', paymentTerms: 'Net 15', items: [{ id: '1', product: 'Steel Components', description: 'High-grade steel parts', quantity: 100, unitPrice: 25, total: 2500 }], subtotal: 2500, tax: 200, total: 2700, priority: 'high' },
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: '1', name: 'Tech Supplies Ltd', email: 'orders@techsupplies.com', phone: '+1 234 567 8900', address: '123 Business Ave', country: 'USA', category: 'Office Supplies', rating: 4.5, totalOrders: 25, totalSpent: 125000, status: 'active', paymentTerms: 'Net 30' },
    { id: '2', name: 'Industrial Components Inc', email: 'sales@industrial.com', phone: '+1 234 567 8901', address: '456 Industrial Blvd', country: 'USA', category: 'Manufacturing', rating: 4.8, totalOrders: 15, totalSpent: 75000, status: 'active', paymentTerms: 'Net 15' },
  ]);

  const [orderForm, setOrderForm] = useState({ vendor: '', vendorEmail: '', deliveryDate: '', purchaseRep: '', paymentTerms: 'Net 30', priority: 'medium' as 'low' | 'medium' | 'high', product: '', description: '', quantity: 1, unitPrice: 0 });
  const [vendorForm, setVendorForm] = useState({ name: '', email: '', phone: '', address: '', country: '', category: '', paymentTerms: 'Net 30' });

  const handleCreateOrder = () => {
    const subtotal = orderForm.quantity * orderForm.unitPrice;
    const tax = subtotal * 0.1;
    const newOrder: PurchaseOrder = {
      id: generateId(), reference: `PO${String(purchaseOrders.length + 1).padStart(5, '0')}`,
      vendor: orderForm.vendor, vendorEmail: orderForm.vendorEmail, orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: orderForm.deliveryDate, status: 'draft', purchaseRep: orderForm.purchaseRep, paymentTerms: orderForm.paymentTerms,
      items: [{ id: generateId(), product: orderForm.product, description: orderForm.description, quantity: orderForm.quantity, unitPrice: orderForm.unitPrice, total: subtotal }],
      subtotal, tax, total: subtotal + tax, priority: orderForm.priority
    };
    setPurchaseOrders(prev => [newOrder, ...prev]);
    setIsCreateOpen(false);
    setOrderForm({ vendor: '', vendorEmail: '', deliveryDate: '', purchaseRep: '', paymentTerms: 'Net 30', priority: 'medium', product: '', description: '', quantity: 1, unitPrice: 0 });
  };

  const handleUpdateOrder = () => {
    if (!selectedOrder) return;
    const subtotal = orderForm.quantity * orderForm.unitPrice;
    const tax = subtotal * 0.1;
    setPurchaseOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
      ...o, vendor: orderForm.vendor, vendorEmail: orderForm.vendorEmail, deliveryDate: orderForm.deliveryDate,
      purchaseRep: orderForm.purchaseRep, paymentTerms: orderForm.paymentTerms, priority: orderForm.priority,
      items: [{ id: generateId(), product: orderForm.product, description: orderForm.description, quantity: orderForm.quantity, unitPrice: orderForm.unitPrice, total: subtotal }],
      subtotal, tax, total: subtotal + tax
    } : o));
    setIsEditOpen(false); setSelectedOrder(null);
  };

  const handleDeleteOrder = (id: string) => setPurchaseOrders(prev => prev.filter(o => o.id !== id));
  const handleStatusChange = (id: string, status: PurchaseOrder['status']) => setPurchaseOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const handleCreateVendor = () => {
    const newVendor: Vendor = { id: generateId(), ...vendorForm, rating: 0, totalOrders: 0, totalSpent: 0, status: 'active' };
    setVendors(prev => [newVendor, ...prev]);
    setIsCreateVendorOpen(false);
    setVendorForm({ name: '', email: '', phone: '', address: '', country: '', category: '', paymentTerms: 'Net 30' });
  };

  const handleUpdateVendor = () => {
    if (!selectedVendor) return;
    setVendors(prev => prev.map(v => v.id === selectedVendor.id ? { ...v, ...vendorForm } : v));
    setIsEditVendorOpen(false); setSelectedVendor(null);
  };

  const handleDeleteVendor = (id: string) => setVendors(prev => prev.filter(v => v.id !== id));

  const openEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setOrderForm({ vendor: order.vendor, vendorEmail: order.vendorEmail, deliveryDate: order.deliveryDate, purchaseRep: order.purchaseRep, paymentTerms: order.paymentTerms, priority: order.priority, product: order.items[0]?.product || '', description: order.items[0]?.description || '', quantity: order.items[0]?.quantity || 1, unitPrice: order.items[0]?.unitPrice || 0 });
    setIsEditOpen(true);
  };

  const openEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setVendorForm({ name: vendor.name, email: vendor.email, phone: vendor.phone, address: vendor.address, country: vendor.country, category: vendor.category, paymentTerms: vendor.paymentTerms });
    setIsEditVendorOpen(true);
  };

  const orderFilters = [
    { label: 'All', value: 'all', count: purchaseOrders.length },
    { label: 'Draft', value: 'draft', count: purchaseOrders.filter(o => o.status === 'draft').length },
    { label: 'Confirmed', value: 'confirmed', count: purchaseOrders.filter(o => o.status === 'confirmed').length },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { draft: 'bg-gray-500', sent: 'bg-blue-500', confirmed: 'bg-green-500', received: 'bg-purple-500', cancelled: 'bg-red-500' };
    return colors[status] || 'bg-gray-500';
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.reference.toLowerCase().includes(searchTerm.toLowerCase()) || order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalSpent = purchaseOrders.reduce((sum, o) => sum + o.total, 0);

  const renderOrderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Vendor</Label><Input value={orderForm.vendor} onChange={e => setOrderForm({ ...orderForm, vendor: e.target.value })} placeholder="Vendor name" /></div>
        <div><Label>Email</Label><Input value={orderForm.vendorEmail} onChange={e => setOrderForm({ ...orderForm, vendorEmail: e.target.value })} placeholder="Email" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Delivery Date</Label><Input type="date" value={orderForm.deliveryDate} onChange={e => setOrderForm({ ...orderForm, deliveryDate: e.target.value })} /></div>
        <div><Label>Purchase Rep</Label><Input value={orderForm.purchaseRep} onChange={e => setOrderForm({ ...orderForm, purchaseRep: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Payment Terms</Label><Select value={orderForm.paymentTerms} onValueChange={v => setOrderForm({ ...orderForm, paymentTerms: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Net 15">Net 15</SelectItem><SelectItem value="Net 30">Net 30</SelectItem><SelectItem value="Net 60">Net 60</SelectItem></SelectContent></Select></div>
        <div><Label>Priority</Label><Select value={orderForm.priority} onValueChange={v => setOrderForm({ ...orderForm, priority: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
      </div>
      <hr />
      <h4 className="font-medium">Line Item</h4>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Product</Label><Input value={orderForm.product} onChange={e => setOrderForm({ ...orderForm, product: e.target.value })} /></div>
        <div><Label>Description</Label><Input value={orderForm.description} onChange={e => setOrderForm({ ...orderForm, description: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Quantity</Label><Input type="number" value={orderForm.quantity} onChange={e => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })} /></div>
        <div><Label>Unit Price</Label><Input type="number" value={orderForm.unitPrice} onChange={e => setOrderForm({ ...orderForm, unitPrice: Number(e.target.value) })} /></div>
      </div>
    </div>
  );

  return (
    <OdooMainLayout currentApp="Purchase">
      <div className="flex flex-col h-full">
        <OdooControlPanel title={activeTab === 'orders' ? 'Purchase Orders' : 'Vendors'} subtitle="Manage purchases" searchPlaceholder={`Search ${activeTab}...`} onSearch={setSearchTerm}
          onCreateNew={() => activeTab === 'orders' ? setIsCreateOpen(true) : setIsCreateVendorOpen(true)}
          viewType={viewType} onViewChange={v => setViewType(v as any)} filters={orderFilters} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'orders' ? filteredOrders.length : vendors.length} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-2"><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="vendors">Vendors</TabsTrigger></TabsList>
          </div>

          <TabsContent value="orders" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white border-b">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle></CardHeader><CardContent><div className="flex items-center space-x-2"><DollarSign className="h-5 w-5 text-green-600" /><span className="text-2xl font-bold">${totalSpent.toLocaleString()}</span></div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle></CardHeader><CardContent><div className="flex items-center space-x-2"><ShoppingCart className="h-5 w-5 text-blue-600" /><span className="text-2xl font-bold">{purchaseOrders.length}</span></div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Vendors</CardTitle></CardHeader><CardContent><div className="flex items-center space-x-2"><Truck className="h-5 w-5 text-orange-600" /><span className="text-2xl font-bold">{vendors.length}</span></div></CardContent></Card>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-white rounded-lg border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                  <div className="col-span-2">Reference</div><div className="col-span-2">Vendor</div><div className="col-span-1">Date</div><div className="col-span-1">Status</div><div className="col-span-1">Total</div><div className="col-span-2">Delivery</div><div className="col-span-1">Rep</div><div className="col-span-2">Actions</div>
                </div>
                {filteredOrders.map(order => (
                  <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                    <div className="col-span-2"><p className="font-medium text-sm">{order.reference}</p><Badge variant={order.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs mt-1">{order.priority}</Badge></div>
                    <div className="col-span-2"><p className="text-sm font-medium">{order.vendor}</p></div>
                    <div className="col-span-1"><p className="text-sm">{order.orderDate}</p></div>
                    <div className="col-span-1"><Badge className={`text-white ${getStatusColor(order.status)}`}>{order.status}</Badge></div>
                    <div className="col-span-1"><p className="font-medium text-sm">${order.total.toLocaleString()}</p></div>
                    <div className="col-span-2"><p className="text-sm">{order.deliveryDate}</p></div>
                    <div className="col-span-1"><p className="text-sm">{order.purchaseRep}</p></div>
                    <div className="col-span-2">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(order); setIsViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditOrder(order)}><Edit className="h-4 w-4" /></Button>
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'sent')}><Send className="h-4 w-4 mr-2" />Send</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'confirmed')}><TrendingUp className="h-4 w-4 mr-2" />Confirm</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'received')}><Package className="h-4 w-4 mr-2" />Mark Received</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && <div className="p-8 text-center text-gray-500">No purchase orders found. Click "New" to create one.</div>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-3">Vendor</div><div className="col-span-2">Category</div><div className="col-span-1">Rating</div><div className="col-span-2">Orders</div><div className="col-span-2">Total Spent</div><div className="col-span-2">Actions</div>
              </div>
              {vendors.map(vendor => (
                <div key={vendor.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                  <div className="col-span-3"><p className="font-medium text-sm">{vendor.name}</p><p className="text-xs text-gray-600">{vendor.email}</p></div>
                  <div className="col-span-2"><Badge variant="outline">{vendor.category}</Badge></div>
                  <div className="col-span-1"><span className="text-sm">{vendor.rating} ★</span></div>
                  <div className="col-span-2"><p className="text-sm">{vendor.totalOrders} orders</p></div>
                  <div className="col-span-2"><p className="font-medium text-sm">${vendor.totalSpent.toLocaleString()}</p></div>
                  <div className="col-span-2">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditVendor(vendor)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Order Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          {renderOrderForm()}
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreateOrder}>Create Order</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Purchase Order</DialogTitle></DialogHeader>
          {renderOrderForm()}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleUpdateOrder}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Purchase Order Details</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-500">Reference</Label><p className="font-medium">{selectedOrder.reference}</p></div>
                <div><Label className="text-gray-500">Status</Label><Badge className={`text-white ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</Badge></div>
                <div><Label className="text-gray-500">Vendor</Label><p>{selectedOrder.vendor}</p></div>
                <div><Label className="text-gray-500">Purchase Rep</Label><p>{selectedOrder.purchaseRep}</p></div>
                <div><Label className="text-gray-500">Order Date</Label><p>{selectedOrder.orderDate}</p></div>
                <div><Label className="text-gray-500">Delivery Date</Label><p>{selectedOrder.deliveryDate}</p></div>
              </div>
              <hr />
              <h4 className="font-medium">Items</h4>
              {selectedOrder.items.map(item => (
                <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                  <div><p className="font-medium">{item.product}</p><p className="text-sm text-gray-500">{item.description}</p></div>
                  <div className="text-right"><p>{item.quantity} × ${item.unitPrice}</p><p className="font-medium">${item.total.toLocaleString()}</p></div>
                </div>
              ))}
              <div className="text-right space-y-1">
                <p>Subtotal: ${selectedOrder.subtotal.toLocaleString()}</p>
                <p>Tax: ${selectedOrder.tax.toLocaleString()}</p>
                <p className="font-bold text-lg">Total: ${selectedOrder.total.toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Vendor Dialog */}
      <Dialog open={isCreateVendorOpen} onOpenChange={setIsCreateVendorOpen}>
        <DialogContent><DialogHeader><DialogTitle>Add Vendor</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input value={vendorForm.email} onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} /></div>
            </div>
            <div><Label>Address</Label><Input value={vendorForm.address} onChange={e => setVendorForm({ ...vendorForm, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Country</Label><Input value={vendorForm.country} onChange={e => setVendorForm({ ...vendorForm, country: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={vendorForm.category} onChange={e => setVendorForm({ ...vendorForm, category: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateVendorOpen(false)}>Cancel</Button><Button onClick={handleCreateVendor}>Add Vendor</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditVendorOpen} onOpenChange={setIsEditVendorOpen}>
        <DialogContent><DialogHeader><DialogTitle>Edit Vendor</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input value={vendorForm.email} onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} /></div>
            </div>
            <div><Label>Address</Label><Input value={vendorForm.address} onChange={e => setVendorForm({ ...vendorForm, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Country</Label><Input value={vendorForm.country} onChange={e => setVendorForm({ ...vendorForm, country: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={vendorForm.category} onChange={e => setVendorForm({ ...vendorForm, category: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsEditVendorOpen(false)}>Cancel</Button><Button onClick={handleUpdateVendor}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </OdooMainLayout>
  );
};

export default Purchase;
