
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Sheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Spreadsheets = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Spreadsheets">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Sheet className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Spreadsheets</h1>
          </div>
          <p className="text-odoo-gray">Create collaborative spreadsheets integrated with your business data for analysis and reporting.</p>
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">Create New Spreadsheet</Button>
              <Button variant="outline">View Templates</Button>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};
export default Spreadsheets;
