
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { ShoppingCart } from 'lucide-react'; // Using Lucide icon

const Ecommerce = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="eCommerce">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <ShoppingCart className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">eCommerce Management</h1>
          </div>
          <p className="text-odoo-gray">
            Sell your products online with a fully featured store. Manage products, orders, customers, and payment gateways.
          </p>
          {/* Placeholder for eCommerce features */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-odoo-dark">Total Products</h3>
                <p className="text-2xl font-bold">150</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-odoo-dark">Pending Orders</h3>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-odoo-dark">Total Sales</h3>
                <p className="text-2xl font-bold">$5,670</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Ecommerce;
