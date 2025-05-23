
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import PurchaseOrderCard from '@/components/purchase/PurchaseOrderCard';
import { ShoppingCart as PurchaseIcon, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PurchaseOrder } from '@/types/purchase';

const Purchase = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      number: 'PO-001',
      supplier: 'Office Supplies Co.',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      status: 'confirmed',
      items: [
        { id: '1', product: 'Laptops', description: 'Dell Latitude 5520', quantity: 10, unitPrice: 1200, total: 12000 }
      ],
      subtotal: 12000,
      tax: 1200,
      total: 13200
    },
    {
      id: '2',
      number: 'PO-002',
      supplier: 'Tech Hardware Ltd',
      orderDate: '2024-01-20',
      deliveryDate: '2024-02-01',
      status: 'sent',
      items: [
        { id: '1', product: 'Monitors', description: '24" LED Monitors', quantity: 20, unitPrice: 300, total: 6000 }
      ],
      subtotal: 6000,
      tax: 600,
      total: 6600
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateOrder = (updatedOrder: PurchaseOrder) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const handleCreateOrder = () => {
    const newOrder: PurchaseOrder = {
      id: Date.now().toString(),
      number: `PO-${String(orders.length + 1).padStart(3, '0')}`,
      supplier: 'New Supplier',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const totalOrdered = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => ['sent', 'confirmed'].includes(o.status)).length;
  const receivedOrders = orders.filter(o => o.status === 'received').length;

  return (
    <TopbarDashboardLayout currentApp="Purchase">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <PurchaseIcon className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Purchase Management</h1>
          </div>
          <p className="text-odoo-gray">
            Keep track of suppliers, purchase orders, and incoming products. Streamline your procurement process.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Ordered</h3>
              <p className="text-2xl font-bold text-blue-900">${totalOrdered.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Pending Orders</h3>
              <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Received</h3>
              <p className="text-2xl font-bold text-green-900">{receivedOrders}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={handleCreateOrder}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Purchase Order
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Suppliers
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-odoo-dark mb-4">Purchase Orders</h2>
          {orders.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <PurchaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-odoo-gray">No purchase orders yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <PurchaseOrderCard
                  key={order.id}
                  order={order}
                  onUpdate={handleUpdateOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Purchase;
