
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { FileText } from 'lucide-react'; // Using FileText for Blog
import { Button } from '@/components/ui/button';

const Blog = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="Blog">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Blog Management</h1>
          </div>
          <p className="text-odoo-gray">
            Publish articles, manage categories, and engage with your readers. Your content hub starts here.
          </p>
          {/* Placeholder for Blog features */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
                Create New Post
              </Button>
              <Button variant="outline">Manage Categories</Button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Recent Posts</h2>
            {/* Placeholder for list of posts */}
            <div className="border rounded-lg p-4">
              <p className="text-odoo-gray">No posts yet. Start by creating a new post!</p>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Blog;
