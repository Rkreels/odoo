
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Globe } from 'lucide-react'; // Using Lucide icon

const Website = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Website">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Globe className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Website Builder</h1>
          </div>
          <p className="text-odoo-gray">
            Create stunning websites with our drag & drop builder. Manage your pages, themes, and SEO settings here.
          </p>
          {/* Placeholder for Website builder features */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <button className="bg-odoo-primary text-white px-4 py-2 rounded hover:bg-odoo-primary/90">
              Create New Page
            </button>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Website;
