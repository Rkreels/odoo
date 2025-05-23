
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import CampaignCard from '@/components/marketing/CampaignCard';
import { Megaphone, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingCampaign } from '@/types/marketing';

const Marketing = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    {
      id: '1',
      name: 'Summer Sale Campaign',
      type: 'email',
      status: 'running',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 5000,
      spent: 3200,
      impressions: 45000,
      clicks: 1350,
      conversions: 85,
      targetAudience: 'Previous customers'
    },
    {
      id: '2',
      name: 'New Product Launch',
      type: 'social',
      status: 'scheduled',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      budget: 8000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      targetAudience: 'Tech enthusiasts'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateCampaign = (updatedCampaign: MarketingCampaign) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const handleCreateCampaign = () => {
    const newCampaign: MarketingCampaign = {
      id: Date.now().toString(),
      name: 'New Campaign',
      type: 'email',
      status: 'draft',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 1000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      targetAudience: 'All customers'
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'running').length;

  return (
    <TopbarDashboardLayout currentApp="Marketing">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Megaphone className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Marketing Automation</h1>
          </div>
          <p className="text-odoo-gray">Manage marketing campaigns, track leads, and automate marketing tasks to grow your business.</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Active Campaigns</h3>
              <p className="text-2xl font-bold text-blue-900">{activeCampaigns}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Total Budget</h3>
              <p className="text-2xl font-bold text-green-900">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Spent</h3>
              <p className="text-2xl font-bold text-purple-900">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800">Conversions</h3>
              <p className="text-2xl font-bold text-orange-900">{totalConversions}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={handleCreateCampaign}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-odoo-dark mb-4">Marketing Campaigns</h2>
          {campaigns.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-odoo-gray">No campaigns created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onUpdate={handleUpdateCampaign}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Marketing;
