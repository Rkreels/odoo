
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { ShoppingCart as PurchaseIcon } from 'lucide-react'; // Renaming to avoid conflict if ShoppingCart is used elsewhere
import { Button } from '@/components/ui/button';

const Purchase = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

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
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
                Create Purchase Order
              </Button>
              <Button variant="outline">Manage Suppliers</Button>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Pending Orders</h2>
            <div className="border rounded-lg p-4">
              <p className="text-odoo-gray">No pending purchase orders.</p>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Purchase;
