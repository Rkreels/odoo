
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import LeadsList from '@/components/crm/LeadsList';

const CRM = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <TopbarDashboardLayout currentApp="CRM">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">Pipeline Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'New', count: 12, color: 'bg-blue-500' },
              { name: 'Qualified', count: 8, color: 'bg-yellow-500' },
              { name: 'Proposition', count: 5, color: 'bg-green-500' },
              { name: 'Won', count: 3, color: 'bg-purple-500' },
            ].map((stage) => (
              <div key={stage.name} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
                  <h3 className="font-medium text-odoo-dark">{stage.name}</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-odoo-dark">{stage.count}</p>
                <p className="text-sm text-odoo-gray">Opportunities</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <LeadsList />
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default CRM;
