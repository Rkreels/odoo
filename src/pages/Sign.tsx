
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { PenLine } from 'lucide-react'; // Make sure PenLine is a valid import or choose another
import { Button } from '@/components/ui/button';

const Sign = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Sign">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <PenLine className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Electronic Signatures</h1>
          </div>
          <p className="text-odoo-gray">Send, sign, and manage documents electronically for faster turnarounds.</p>
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">Upload & Send Document</Button>
              <Button variant="outline">Track Documents</Button>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};
export default Sign;
