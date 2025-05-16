
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem,
  MenubarSeparator
} from '@/components/ui/menubar';
import { Search, ChevronDown, Globe, ShoppingCart, FileText, MessagesSquare as MessagesSquareIcon } from 'lucide-react';

interface AppSwitcherProps {
  currentApp: string;
}

// Define app structure
interface AppItem {
  name: string;
  icon: string | React.ReactNode; // Allow emoji or Lucide component
  path: string;
  lucideIcon?: React.ElementType; // Optional Lucide icon component
}

const apps: AppItem[] = [
  { name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { name: 'Discuss', icon: '💬', path: '/apps/discuss' },
  { name: 'CRM', icon: '🤝', path: '/apps/crm' },
  { name: 'Sales', icon: '💰', path: '/apps/sales' },
  { name: 'Point of Sale', icon: '🛒', path: '/apps/point-of-sale' },
  { name: 'Accounting', icon: '💵', path: '/apps/accounting' },
  { name: 'Invoicing', icon: '💰', path: '/apps/invoicing' },
  { name: 'Inventory', icon: '📦', path: '/apps/inventory' },
  { name: 'Purchase', icon: '🛒', path: '/apps/purchase' },
  { name: 'Manufacturing', icon: '🏭', path: '/apps/manufacturing' },
  { name: 'Human Resources', icon: '👥', path: '/apps/hr' },
  { name: 'Marketing', icon: '📧', path: '/apps/marketing' },
  { name: 'Services', icon: '🎫', path: '/apps/services' },
  { name: 'Website', icon: <Globe className="h-7 w-7 text-odoo-primary" />, path: '/apps/website' },
  { name: 'eCommerce', icon: <ShoppingCart className="h-7 w-7 text-odoo-primary" />, path: '/apps/ecommerce' },
  { name: 'Blog', icon: <FileText className="h-7 w-7 text-odoo-primary" />, path: '/apps/blog' },
  { name: 'Forum', icon: <MessagesSquareIcon className="h-7 w-7 text-odoo-primary" />, path: '/apps/forum' },
  { name: 'eLearning', icon: '🎓', path: '/apps/elearning' },
  // New Apps to be added here
  { name: 'Live Chat', icon: '💻', path: '/apps/live-chat'},
  { name: 'Subscriptions', icon: '🔄', path: '/apps/subscriptions'},
  { name: 'Rental', icon: '🏠', path: '/apps/rental'},
  { name: 'Expenses', icon: '💸', path: '/apps/expenses'},
  { name: 'Documents', icon: '📄', path: '/apps/documents'},
  { name: 'Spreadsheets', icon: '📊', path: '/apps/spreadsheets'},
  { name: 'Sign', icon: '✍️', path: '/apps/sign'},
  { name: 'PLM', icon: '📋', path: '/apps/plm'},
  { name: 'Maintenance', icon: '🔧', path: '/apps/maintenance'},
  { name: 'Quality', icon: '✅', path: '/apps/quality'}, // Using check emoji
];


const AppSwitcher: React.FC<AppSwitcherProps> = ({ currentApp }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentApp = (path: string) => location.pathname === path;

  // Simple search filter (can be enhanced)
  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="text-white flex items-center hover:bg-white/10 data-[state=open]:bg-white/10 px-3 py-1.5 rounded-md">
          <span className="mr-1">{currentApp}</span>
          <ChevronDown className="h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent className="max-h-[80vh] overflow-y-auto w-96">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search apps..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-odoo-primary"
              />
            </div>
          </div>
          <MenubarSeparator />
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">APPS</h3>
            <div className="grid grid-cols-4 gap-2">
              {filteredApps.map((app) => (
                <MenubarItem 
                  key={app.name} 
                  className={`flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 cursor-pointer h-20 ${isCurrentApp(app.path) ? 'bg-odoo-primary/10 ring-1 ring-odoo-primary' : ''}`}
                  onClick={() => navigate(app.path)}
                >
                  <div className="text-3xl mb-1">
                    {typeof app.icon === 'string' ? app.icon : app.icon}
                  </div>
                  <span className="text-xs text-center text-odoo-dark font-medium">{app.name}</span>
                </MenubarItem>
              ))}
            </div>
          </div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default AppSwitcher;

