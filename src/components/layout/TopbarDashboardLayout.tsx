
import { useState, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Search, HelpCircle } from 'lucide-react';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import AppSwitcher from './AppSwitcher';
import NotificationMenu from './NotificationMenu';
import MessageMenu from './MessageMenu';
import UserMenu from './UserMenu';
import SecondaryNavbar from './SecondaryNavbar';

interface TopbarDashboardLayoutProps {
  children: ReactNode;
  currentApp?: string;
}

// Define structure for notifications and messages if not already globally available
interface NotificationItem {
  id: string; title: string; message: string; time: string; read: boolean;
}
interface MessageItem {
  id: string; sender: string; message: string; time: string; read: boolean;
}


const TopbarDashboardLayout = ({ children, currentApp = 'Dashboard' }: TopbarDashboardLayoutProps) => {
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  
  // Initial notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {id: '1', title: 'New Invoice', message: 'Invoice #INV001 has been created', time: '5 mins ago', read: false},
    {id: '2', title: 'Meeting Reminder', message: 'Meeting with Client XYZ in 30 minutes', time: '30 mins ago', read: false},
    {id: '3', title: 'Task Completed', message: 'Project milestone #3 completed', time: '2 hours ago', read: true},
    {id: '4', title: 'System Update', message: 'System will be updated tonight at 2 AM', time: 'Yesterday', read: true},
  ]);

  // Initial messages state
  const [messages, setMessages] = useState<MessageItem[]>([
    {id: '1', sender: 'John Doe', message: 'Can you review the latest proposal?', time: '10 mins ago', read: false},
    {id: '2', sender: 'Sarah Brown', message: 'The client approved the design', time: '1 hour ago', read: false},
    {id: '3', sender: 'Technical Support', message: 'Your ticket #45678 has been resolved', time: '3 hours ago', read: true},
  ]);
  
  const navigate = useNavigate();

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    // Toast is now handled within NotificationMenu
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? {...m, read: true} : m));
    // Toast is now handled within MessageMenu
  };
  
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
            <AppSwitcher currentApp={currentApp} />
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            <button className="p-1.5 rounded-md text-white hover:bg-white/10">
              <Search className="h-5 w-5" />
            </button>
            <NotificationMenu notifications={notifications} onMarkAsRead={markNotificationAsRead} />
            <MessageMenu messages={messages} onMarkAsRead={markMessageAsRead} />
            <button 
              className="p-1.5 rounded-md text-white hover:bg-white/10"
              onClick={() => setShowVoiceTrainer(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <UserMenu />
          </div>
        </div>
      </header>
      
      <SecondaryNavbar currentApp={currentApp} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-odoo-light">
        {children}
      </main>
      
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen={typeof currentApp === 'string' ? currentApp.toLowerCase().replace(/\s+/g, '') : 'unknown'}
        />
      )}
    </div>
  );
};

export default TopbarDashboardLayout;

