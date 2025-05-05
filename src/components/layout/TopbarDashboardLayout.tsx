
import { useState, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem,
  MenubarSeparator
} from '@/components/ui/menubar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, Bell, MessageSquare, Plus, HelpCircle, Settings, ChevronDown } from 'lucide-react';
import VoiceTrainer from '@/components/voice/VoiceTrainer';

interface TopbarDashboardLayoutProps {
  children: ReactNode;
  currentApp?: string;
}

const TopbarDashboardLayout = ({ children, currentApp = 'Dashboard' }: TopbarDashboardLayoutProps) => {
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const navigate = useNavigate();

  const apps = [
    { name: 'Discuss', icon: '💬', path: '/apps/discuss' },
    { name: 'CRM', icon: '🔰', path: '/apps/crm' },
    { name: 'Sales', icon: '📊', path: '/apps/sales' },
    { name: 'Inventory', icon: '📦', path: '/apps/inventory' },
    { name: 'Accounting', icon: '📝', path: '/apps/accounting' },
    { name: 'Human Resources', icon: '👥', path: '/apps/hr' },
    { name: 'Marketing', icon: '📧', path: '/apps/marketing' },
    { name: 'Manufacturing', icon: '🏭', path: '/apps/manufacturing' },
    { name: 'Services', icon: '🎫', path: '/apps/services' }
  ];
  
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-odoo-primary shadow-sm">
        <div className="px-4 flex h-14 items-center justify-between">
          {/* Logo and App Selector */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center">
              <img
                className="h-7 w-auto"
                src="https://www.odoo.com/web/image/website/1/logo/Odoo?unique=af51af9"
                alt="Odoo Logo"
              />
              <span className="ml-2 font-bold text-white">
                odoo
              </span>
            </Link>
            
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="text-white flex items-center">
                  <span className="mr-1">{currentApp}</span>
                  <ChevronDown className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent className="max-h-[70vh] overflow-y-auto">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-odoo-primary"
                      />
                    </div>
                  </div>
                  
                  <MenubarSeparator />
                  
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">APPS</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {apps.map((app) => (
                        <MenubarItem 
                          key={app.name} 
                          className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate(app.path)}
                        >
                          <div className="text-2xl mb-1">{app.icon}</div>
                          <span className="text-xs text-center">{app.name}</span>
                        </MenubarItem>
                      ))}
                    </div>
                  </div>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            <button className="p-1.5 rounded-md text-white hover:bg-white/10">
              <Search className="h-5 w-5" />
            </button>
            
            <button className="p-1.5 rounded-md text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </button>
            
            <button className="p-1.5 rounded-md text-white hover:bg-white/10">
              <MessageSquare className="h-5 w-5" />
            </button>
            
            <button 
              className="p-1.5 rounded-md text-white hover:bg-white/10"
              onClick={() => setShowVoiceTrainer(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <Avatar className="h-8 w-8 bg-white/30">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="text-white">U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      {/* Secondary Navigation */}
      <div className="bg-white border-b">
        <div className="px-4 flex h-10 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="font-medium text-odoo-dark">{currentApp}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-full text-odoo-primary border-odoo-primary">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
            
            <Button variant="outline" size="sm" className="rounded-full">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-odoo-light">
        {children}
      </main>
      
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen={currentApp.toLowerCase()}
        />
      )}
    </div>
  );
};

export default TopbarDashboardLayout;
