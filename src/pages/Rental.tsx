import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  MoreVertical,
  Plus,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { LOCAL_STORAGE_KEYS, getStoredData, addRecord, updateRecord, deleteRecord, generateId } from '@/lib/localStorageUtils';

interface RentalProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  status: string;
  features: string[];
  location: string;
  description: string;
  utilization: number;
  revenue: number;
  timesRented: number;
}

interface RentalBooking {
  id: string;
  productId: string;
  productName: string;
  customer: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  status: string;
  paymentStatus: string;
  deposit: number;
  notes: string;
}

const INITIAL_PRODUCTS: RentalProduct[] = [
  {
    id: '1',
    name: 'Professional Camera Kit',
    category: 'Photography',
    image: '/placeholder.svg',
    dailyRate: 50,
    weeklyRate: 300,
    monthlyRate: 1000,
    status: 'available',
    features: ['4K Recording', 'Stabilizer', 'Extra Batteries'],
    location: 'Warehouse A',
    description: 'Complete professional camera setup with accessories',
    utilization: 85,
    revenue: 12500,
    timesRented: 45
  }
];

const INITIAL_BOOKINGS: RentalBooking[] = [
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
  }
];

const Rental = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<RentalProduct[]>([]);
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    dailyRate: 0,
    weeklyRate: 0,
    monthlyRate: 0,
    location: '',
    description: '',
    features: ''
  });

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
    const loadedProducts = getStoredData<RentalProduct>(LOCAL_STORAGE_KEYS.RENTAL_PRODUCTS, INITIAL_PRODUCTS);
    const loadedBookings = getStoredData<RentalBooking>(LOCAL_STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setProducts(loadedProducts);
    setBookings(loadedBookings);
  }, [navigate]);

  const handleCreateProduct = () => {
    const newProduct: RentalProduct = {
      id: generateId(),
      ...formData,
      features: formData.features.split(',').map(f => f.trim()),
      image: '/placeholder.svg',
      status: 'available',
      utilization: 0,
      revenue: 0,
      timesRented: 0
    };
    const updated = addRecord<RentalProduct>(LOCAL_STORAGE_KEYS.RENTAL_PRODUCTS, newProduct);
    setProducts(updated);
    setShowCreateDialog(false);
    resetForm();
    toast({ title: 'Success', description: 'Product created successfully' });
  };

  const handleUpdateProduct = () => {
    if (!selectedItem) return;
    const updated = updateRecord<RentalProduct>(LOCAL_STORAGE_KEYS.RENTAL_PRODUCTS, selectedItem.id, {
      ...formData,
      features: formData.features.split(',').map(f => f.trim())
    });
    setProducts(updated);
    setShowEditDialog(false);
    setSelectedItem(null);
    resetForm();
    toast({ title: 'Success', description: 'Product updated successfully' });
  };

  const handleDeleteProduct = (id: string) => {
    const updated = deleteRecord<RentalProduct>(LOCAL_STORAGE_KEYS.RENTAL_PRODUCTS, id);
    setProducts(updated);
    toast({ title: 'Success', description: 'Product deleted' });
  };

  const handleEditProduct = (product: RentalProduct) => {
    setSelectedItem(product);
    setFormData({
      name: product.name,
      category: product.category,
      dailyRate: product.dailyRate,
      weeklyRate: product.weeklyRate,
      monthlyRate: product.monthlyRate,
      location: product.location,
      description: product.description,
      features: product.features.join(', ')
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      dailyRate: 0,
      weeklyRate: 0,
      monthlyRate: 0,
      location: '',
      description: '',
      features: ''
    });
  };

  const productFilters = [
    { label: 'Available', value: 'available', count: products.filter(p => p.status === 'available').length },
    { label: 'Rented', value: 'rented', count: products.filter(p => p.status === 'rented').length },
    { label: 'Maintenance', value: 'maintenance', count: products.filter(p => p.status === 'maintenance').length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || product.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const avgUtilization = products.length > 0 ? products.reduce((sum, p) => sum + p.utilization, 0) / products.length : 0;

  return (
    <OdooMainLayout currentApp="Rental">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Rental Management"
          subtitle="Manage rental products and bookings"
          searchPlaceholder="Search products..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateDialog(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={productFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredProducts.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="flex-1 flex flex-col">
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
                  <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{products.length}</span>
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
                    <span className="text-2xl font-bold">{avgUtilization.toFixed(0)}%</span>
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
                    <span className="text-2xl font-bold">{bookings.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant={product.status === 'available' ? 'default' : product.status === 'rented' ? 'secondary' : 'destructive'}>
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
                              <span className="font-semibold">${product.dailyRate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weekly:</span>
                              <span className="font-semibold">${product.weeklyRate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly:</span>
                              <span className="font-semibold">${product.monthlyRate}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {product.location}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                    <div className="col-span-3">Product</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2">Daily Rate</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {filteredProducts.map(product => (
                    <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                      <div className="col-span-3">
                        <p className="font-medium text-sm">{product.name}</p>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="col-span-1">
                        <Badge variant={product.status === 'available' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium text-sm">${product.dailyRate}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm">{product.location}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="flex-1 p-6">
            <div className="bg-white rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-2">Product</div>
                <div className="col-span-2">Customer</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Actions</div>
              </div>
              {bookings.map(booking => (
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
                  <div className="col-span-2">
                    <p className="font-medium text-sm">{booking.totalPrice}</p>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="default">{booking.status}</Badge>
                  </div>
                  <div className="col-span-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="flex justify-between items-center">
                        <span className="text-sm">{product.name}</span>
                        <span className="font-medium">${product.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Utilization Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="flex justify-between items-center">
                        <span className="text-sm">{product.name}</span>
                        <span className="font-medium">{product.utilization}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-sm font-medium">Daily Rate</label>
                  <Input type="number" value={formData.dailyRate} onChange={(e) => setFormData({...formData, dailyRate: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Weekly Rate</label>
                  <Input type="number" value={formData.weeklyRate} onChange={(e) => setFormData({...formData, weeklyRate: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Rate</label>
                  <Input type="number" value={formData.monthlyRate} onChange={(e) => setFormData({...formData, monthlyRate: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Features (comma-separated)</label>
                <Input value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateProduct}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-sm font-medium">Daily Rate</label>
                  <Input type="number" value={formData.dailyRate} onChange={(e) => setFormData({...formData, dailyRate: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Weekly Rate</label>
                  <Input type="number" value={formData.weeklyRate} onChange={(e) => setFormData({...formData, weeklyRate: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Rate</label>
                  <Input type="number" value={formData.monthlyRate} onChange={(e) => setFormData({...formData, monthlyRate: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Features (comma-separated)</label>
                <Input value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdateProduct}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OdooMainLayout>
  );
};

export default Rental;