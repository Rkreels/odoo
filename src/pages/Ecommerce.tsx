
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { ShoppingBag, Plus, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import ProductCard from '@/components/ecommerce/ProductCard';
import CreateProductForm from '@/components/ecommerce/CreateProductForm';
import OrderCard from '@/components/ecommerce/OrderCard';
import { EcommerceProduct, EcommerceOrder } from '@/types/ecommerce';
import { toast } from "@/components/ui/use-toast";

const Ecommerce = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [products, setProducts] = useState<EcommerceProduct[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      salePrice: 249.99,
      category: 'Electronics',
      stock: 25,
      image: '/placeholder.svg',
      status: 'active',
      sku: 'WH-001',
    },
    {
      id: '2',
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 399.99,
      category: 'Electronics',
      stock: 15,
      image: '/placeholder.svg',
      status: 'active',
      sku: 'SW-002',
    },
  ]);

  const [orders, setOrders] = useState<EcommerceOrder[]>([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 249.99,
      status: 'pending',
      items: 1,
      date: '2025-01-23',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 399.99,
      status: 'shipped',
      items: 1,
      date: '2025-01-22',
    },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateProduct = (newProduct: EcommerceProduct) => {
    setProducts([newProduct, ...products]);
    toast({
      title: "Product created",
      description: "New product has been successfully added to your store.",
    });
  };

  const handleUpdateProduct = (updatedProduct: EcommerceProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast({
      title: "Product updated",
      description: "Product has been successfully updated.",
    });
  };

  const handleUpdateOrder = (updatedOrder: EcommerceOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    toast({
      title: "Order updated",
      description: "Order status has been successfully updated.",
    });
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <TopbarDashboardLayout currentApp="eCommerce">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">eCommerce</h1>
                <p className="text-odoo-gray">
                  Manage your online store, products, and orders all in one place.
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
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-green-700">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-600">Products</p>
                  <p className="text-2xl font-semibold text-blue-700">{totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-yellow-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-yellow-700">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-600">Pending Orders</p>
                  <p className="text-2xl font-semibold text-red-700">{pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onUpdate={handleUpdateProduct}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-4 mt-4">
                {orders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdate={handleUpdateOrder}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateProductForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onProductCreate={handleCreateProduct}
      />

      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="ecommerce"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default Ecommerce;
