
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Search, User, Settings, Menu } from 'lucide-react';
import VoiceTrainer from '../voice/VoiceTrainer';

interface DashboardHeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const DashboardHeader = ({ title, toggleSidebar }: DashboardHeaderProps) => {
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-odoo-gray hover:text-odoo-primary">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-odoo-dark">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-odoo-primary focus:border-odoo-primary"
          />
        </div>
        
        <Button 
          variant="outline"
          onClick={() => setShowVoiceTrainer(!showVoiceTrainer)}
          className="flex items-center border-odoo-primary text-odoo-primary hover:bg-odoo-primary hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
          Voice Guide
        </Button>
        
        <button className="text-odoo-gray hover:text-odoo-primary">
          <Bell className="h-6 w-6" />
        </button>
        
        <button className="text-odoo-gray hover:text-odoo-primary">
          <Settings className="h-6 w-6" />
        </button>
        
        <button className="flex items-center text-odoo-dark hover:text-odoo-primary">
          <div className="h-8 w-8 rounded-full bg-odoo-primary text-white flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </button>
      </div>
      
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="dashboard"
        />
      )}
    </header>
  );
};

export default DashboardHeader;
