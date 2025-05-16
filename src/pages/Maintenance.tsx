
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Maintenance = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Maintenance">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Wrench className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Maintenance Management</h1>
          </div>
          <p className="text-odoo-gray">Track equipment maintenance, schedule preventive actions, and manage repair requests.</p>
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">Create Maintenance Request</Button>
              <Button variant="outline">View Equipment</Button>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};
export default Maintenance;
