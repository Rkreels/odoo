
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLM = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="PLM">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <ClipboardList className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Product Lifecycle Management</h1>
          </div>
          <p className="text-odoo-gray">Manage your product lifecycle from concept through design, manufacturing, and service.</p>
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">Create Engineering Change Order</Button>
              <Button variant="outline">Manage BoMs</Button>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};
export default PLM;
