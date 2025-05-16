
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { MessageSquareText } from 'lucide-react'; // Using a more specific icon for Discuss

const Discuss = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Discuss">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <MessageSquareText className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Discuss</h1>
          </div>
          <p className="text-odoo-gray">
            Welcome to the Discuss module. Communicate with your team, manage channels, and stay updated.
          </p>
          {/* Placeholder for Discuss features */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Channels</h2>
            <ul className="space-y-2">
              <li className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">#general</li>
              <li className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">#marketing</li>
              <li className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">#sales-team</li>
            </ul>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Discuss;
