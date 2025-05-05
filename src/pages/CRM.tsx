
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/navigation/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AppStats from '@/components/dashboard/AppStats';
import LeadsList from '@/components/crm/LeadsList';
import VoiceTrainer from '@/components/voice/VoiceTrainer';

const CRM = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAppSelect = (app: string) => {
    if (app !== 'CRM') {
      if (app === 'Dashboard') {
        navigate('/dashboard');
      } else {
        navigate(`/apps/${app.toLowerCase()}`);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen bg-odoo-light overflow-hidden">
      {sidebarVisible && (
        <div className="flex-shrink-0">
          <Sidebar onAppSelect={handleAppSelect} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Customer Relationship Management" 
          toggleSidebar={toggleSidebar} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="app-stats">
            <AppStats appName="CRM" />
          </div>
          
          <div className="mt-6 leads-list">
            <LeadsList />
          </div>
        </main>
      </div>
      
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="crm"
        />
      )}
    </div>
  );
};

export default CRM;
