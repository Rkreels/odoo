
import React, { ReactNode, useState } from 'react';
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
  Plus
} from 'lucide-react';

interface TopbarDashboardLayoutProps {
  children: ReactNode;
  currentApp?: string;
}

const TopbarDashboardLayout = ({ children, currentApp = 'Dashboard' }: TopbarDashboardLayoutProps) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleSearch = (value: string) => {
    console.log('Global search:', value);
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
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="font-semibold text-gray-900 hidden sm:block">OdooEcho</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  {currentApp}
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
                    All Applications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search across all apps..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
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
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default TopbarDashboardLayout;
