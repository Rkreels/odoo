
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { MessagesSquare } from 'lucide-react'; // Using MessagesSquare for Forum
import { Button } from '@/components/ui/button';

const Forum = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Forum">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <MessagesSquare className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Community Forum</h1>
          </div>
          <p className="text-odoo-gray">
            Build and engage with your community. Manage discussions, categories, and user interactions.
          </p>
          {/* Placeholder for Forum features */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
                Create New Topic
              </Button>
              <Button variant="outline">Manage Categories</Button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Popular Topics</h2>
            {/* Placeholder for list of topics */}
            <div className="border rounded-lg p-4">
              <p className="text-odoo-gray">No topics yet. Start a new discussion!</p>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Forum;
