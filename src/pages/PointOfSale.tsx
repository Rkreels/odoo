
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PointOfSale = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Point of Sale">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Store className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Point of Sale</h1>
          </div>
          <p className="text-odoo-gray">
            Modern point of sale for retailers. Manage sales, inventory, and customer interactions in your physical stores.
          </p>
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
                Open New Session
              </Button>
              <Button variant="outline">View Sales Reports</Button>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Active Sessions</h2>
            <div className="border rounded-lg p-4">
              <p className="text-odoo-gray">No active PoS sessions.</p>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default PointOfSale;
