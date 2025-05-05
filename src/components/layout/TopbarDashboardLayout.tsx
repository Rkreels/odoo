
import { useState, ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem,
  MenubarSeparator
} from '@/components/ui/menubar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Search, Bell, MessageSquare, Plus, HelpCircle, Settings, ChevronDown, LogOut, User } from 'lucide-react';
import VoiceTrainer from '@/components/voice/VoiceTrainer';

interface TopbarDashboardLayoutProps {
  children: ReactNode;
  currentApp?: string;
}

const TopbarDashboardLayout = ({ children, currentApp = 'Dashboard' }: TopbarDashboardLayoutProps) => {
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, title: string, message: string, time: string, read: boolean}>>([
    {id: '1', title: 'New Invoice', message: 'Invoice #INV001 has been created', time: '5 mins ago', read: false},
    {id: '2', title: 'Meeting Reminder', message: 'Meeting with Client XYZ in 30 minutes', time: '30 mins ago', read: false},
    {id: '3', title: 'Task Completed', message: 'Project milestone #3 completed', time: '2 hours ago', read: true},
    {id: '4', title: 'System Update', message: 'System will be updated tonight at 2 AM', time: 'Yesterday', read: true},
  ]);
  const [messages, setMessages] = useState<Array<{id: string, sender: string, message: string, time: string, read: boolean}>>([
    {id: '1', sender: 'John Doe', message: 'Can you review the latest proposal?', time: '10 mins ago', read: false},
    {id: '2', sender: 'Sarah Brown', message: 'The client approved the design', time: '1 hour ago', read: false},
    {id: '3', sender: 'Technical Support', message: 'Your ticket #45678 has been resolved', time: '3 hours ago', read: true},
  ]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const apps = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Discuss', icon: '💬', path: '/apps/discuss' },
    { name: 'CRM', icon: '🤝', path: '/apps/crm' },
    { name: 'Sales', icon: '💰', path: '/apps/sales' },
    { name: 'Inventory', icon: '📦', path: '/apps/inventory' },
    { name: 'Accounting', icon: '💵', path: '/apps/accounting' },
    { name: 'Human Resources', icon: '👥', path: '/apps/hr' },
    { name: 'Marketing', icon: '📧', path: '/apps/marketing' },
    { name: 'Manufacturing', icon: '🏭', path: '/apps/manufacturing' },
    { name: 'Services', icon: '🎫', path: '/apps/services' }
  ];

  // Handle notification read
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  // Handle message read
  const markMessageAsRead = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id ? {...message, read: true} : message
    ));
    toast({
      title: "Message marked as read",
      description: "The message has been marked as read.",
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  // Count unread notifications and messages
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  // Check if current path matches app path
  const isCurrentApp = (path: string) => {
    return location.pathname === path;
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
                          className={`flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 cursor-pointer ${isCurrentApp(app.path) ? 'bg-gray-100' : ''}`}
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md text-white hover:bg-white/10 relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-odoo-primary"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <span className="text-sm text-gray-600">{notification.message}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">No notifications</div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center text-blue-600">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md text-white hover:bg-white/10 relative">
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-odoo-primary"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <DropdownMenuItem 
                      key={message.id} 
                      className={`cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markMessageAsRead(message.id)}
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{message.sender}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <span className="text-sm text-gray-600 truncate">{message.message}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">No messages</div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center text-blue-600">
                  View all messages
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button 
              className="p-1.5 rounded-md text-white hover:bg-white/10"
              onClick={() => setShowVoiceTrainer(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 bg-white/30 cursor-pointer">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="text-white">JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
