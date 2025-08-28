
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Grid3X3,
  MessageSquare,
  Calendar,
  Star,
  Plus,
  ExternalLink
} from 'lucide-react';

interface TopbarDashboardLayoutProps {
  children: ReactNode;
  currentApp?: string;
}

const TopbarDashboardLayout = ({ children, currentApp = 'Dashboard' }: TopbarDashboardLayoutProps) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // All available apps for search
  const allApps = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', description: 'Main dashboard overview' },
    { name: 'Discuss', path: '/apps/discuss', icon: '💬', description: 'Team communication and channels' },
    { name: 'CRM', path: '/apps/crm', icon: '🤝', description: 'Customer relationship management' },
    { name: 'Sales', path: '/apps/sales', icon: '💰', description: 'Sales orders and quotations' },
    { name: 'Point of Sale', path: '/apps/point-of-sale', icon: '🛒', description: 'In-store sales management' },
    { name: 'Accounting', path: '/apps/accounting', icon: '💵', description: 'Financial management' },
    { name: 'Invoicing', path: '/apps/invoicing', icon: '🧾', description: 'Create and track invoices' },
    { name: 'Inventory', path: '/apps/inventory', icon: '📦', description: 'Stock and warehouse management' },
    { name: 'Purchase', path: '/apps/purchase', icon: '🛒', description: 'Purchase orders and suppliers' },
    { name: 'Manufacturing', path: '/apps/manufacturing', icon: '🏭', description: 'Production and work orders' },
    { name: 'Human Resources', path: '/apps/hr', icon: '👥', description: 'Employee management' },
    { name: 'Marketing', path: '/apps/marketing', icon: '📢', description: 'Marketing campaigns and automation' },
    { name: 'Services', path: '/apps/services', icon: '💼', description: 'Project and task management' },
    { name: 'Website', path: '/apps/website', icon: '🌐', description: 'Website builder and management' },
    { name: 'eCommerce', path: '/apps/ecommerce', icon: '🛍️', description: 'Online store management' },
    { name: 'Blog', path: '/apps/blog', icon: '📝', description: 'Content management and blogging' },
    { name: 'Forum', path: '/apps/forum', icon: '💭', description: 'Community discussions' },
    { name: 'eLearning', path: '/apps/elearning', icon: '🎓', description: 'Online courses and training' },
    { name: 'Live Chat', path: '/apps/live-chat', icon: '💬', description: 'Customer support chat' },
    { name: 'Subscriptions', path: '/apps/subscriptions', icon: '🔄', description: 'Recurring billing management' },
    { name: 'Rental', path: '/apps/rental', icon: '🏠', description: 'Asset rental management' },
    { name: 'Expenses', path: '/apps/expenses', icon: '💳', description: 'Employee expense management' },
    { name: 'Documents', path: '/apps/documents', icon: '📄', description: 'Document management system' },
    { name: 'Spreadsheets', path: '/apps/spreadsheets', icon: '📊', description: 'Collaborative spreadsheets' },
    { name: 'Sign', path: '/apps/sign', icon: '✍️', description: 'Electronic signatures' },
    { name: 'PLM', path: '/apps/plm', icon: '⚙️', description: 'Product lifecycle management' },
    { name: 'Maintenance', path: '/apps/maintenance', icon: '🔧', description: 'Equipment maintenance' },
    { name: 'Quality', path: '/apps/quality', icon: '🛡️', description: 'Quality control and assurance' }
  ];

  // Filter apps based on search
  const filteredApps = allApps.filter(app =>
    searchValue && (
      app.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      app.description.toLowerCase().includes(searchValue.toLowerCase())
    )
  ).slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setShowSearchResults(value.length > 0);
  };

  const handleAppSelect = (path: string) => {
    navigate(path);
    setSearchValue('');
    setShowSearchResults(false);
  };

  const favoriteApps = [
    { name: 'CRM', path: '/apps/crm', icon: '🤝' },
    { name: 'Sales', path: '/apps/sales', icon: '💰' },
    { name: 'Inventory', path: '/apps/inventory', icon: '📦' },
    { name: 'Accounting', path: '/apps/accounting', icon: '💵' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4">
        <div className="flex items-center flex-1">
          {/* Logo and App Switcher */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-odoo-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-gray-900 hidden sm:block">BOS</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  {currentApp === 'Dashboard' ? 'All Apps' : currentApp}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Favorites</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {favoriteApps.map((app) => (
                      <Link
                        key={app.name}
                        to={app.path}
                        className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 text-center"
                      >
                        <span className="text-2xl mb-1">{app.icon}</span>
                        <span className="text-xs text-gray-600">{app.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/apps" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    All Apps
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-lg mx-8" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search across all apps..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchValue && setShowSearchResults(true)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredApps.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2 px-2">Apps</div>
                    {filteredApps.map((app) => (
                      <button
                        key={app.name}
                        onClick={() => handleAppSelect(app.path)}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-left"
                      >
                        <span className="text-xl">{app.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{app.name}</div>
                          <div className="text-xs text-gray-600">{app.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Master Dashboard Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('https://skillsim.vercel.app/dashboard', '_self')}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:block">Master Dashboard</span>
            </Button>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <div className="p-4">
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <div className="space-y-2">
                    <div className="p-2 rounded-md bg-blue-50 text-sm">
                      <p className="font-medium text-blue-900">New lead assigned</p>
                      <p className="text-blue-700">John Doe - Tech Corp</p>
                    </div>
                    <div className="p-2 rounded-md bg-green-50 text-sm">
                      <p className="font-medium text-green-900">Invoice paid</p>
                      <p className="text-green-700">INV-001 - $5,500</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>

            {/* Calendar */}
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default TopbarDashboardLayout;
