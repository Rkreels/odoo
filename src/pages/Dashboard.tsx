
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import AppStats from '@/components/dashboard/AppStats';
import VoiceTrainer from '@/components/voice/VoiceTrainer';

const Dashboard = () => {
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const navigate = useNavigate();

  return (
    <OdooMainLayout currentApp="Dashboard">
      <div className="p-6">
        <div className="app-stats">
          <AppStats appName="Dashboard" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-odoo-dark mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[
                { label: 'New lead created', time: '15 minutes ago' },
                { label: 'Meeting scheduled', time: '2 hours ago' },
                { label: 'Task completed', time: 'Yesterday at 4:30 PM' },
                { label: 'Invoice paid', time: '2 days ago' },
              ].map((item, index) => (
                <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-odoo-dark">{item.label}</p>
                    <p className="text-xs text-odoo-gray">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-odoo-dark mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Create Lead', icon: 'user-plus', color: 'bg-blue-100 text-blue-600', path: '/apps/crm' },
                { name: 'Schedule Meeting', icon: 'calendar', color: 'bg-green-100 text-green-600', path: '/apps/calendar' },
                { name: 'Create Invoice', icon: 'document', color: 'bg-purple-100 text-purple-600', path: '/apps/invoicing' },
                { name: 'Add Contact', icon: 'user', color: 'bg-yellow-100 text-yellow-600', path: '/apps/contacts' },
              ].map((action, index) => (
                <button 
                  key={index}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:bg-odoo-light transition-colors"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`h-10 w-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      {action.icon === 'user-plus' && <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />}
                      {action.icon === 'calendar' && <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />}
                      {action.icon === 'document' && <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />}
                      {action.icon === 'user' && <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />}
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-odoo-dark">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-odoo-dark mb-4">Getting Started with BOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Explore Apps', description: 'Discover all the applications BOS offers for your business needs.' },
              { title: 'Setup Your Profile', description: 'Complete your profile information and preferences for a personalized experience.' },
              { title: 'Voice Training', description: 'Use our voice guide to learn how to navigate the system effectively.' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col p-4 border rounded-lg hover:bg-odoo-light transition-colors cursor-pointer"
                onClick={() => {
                  if (item.title === 'Explore Apps') navigate('/apps');
                  else if (item.title === 'Voice Training') setShowVoiceTrainer(true);
                }}
              >
                <div className="h-10 w-10 rounded-full bg-odoo-primary/10 text-odoo-primary flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-odoo-dark mb-2">{item.title}</h3>
                <p className="text-sm text-odoo-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="dashboard"
        />
      )}
    </OdooMainLayout>
  );
};

export default Dashboard;
