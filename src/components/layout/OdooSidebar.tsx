
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Search, Plus, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface AppModule {
  id: string;
  name: string;
  icon: string;
  path: string;
  children?: AppModule[];
}

const appModules: AppModule[] = [
  {
    id: 'discuss',
    name: 'Discuss',
    icon: '💬',
    path: '/apps/discuss'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: '📅',
    path: '/apps/calendar'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: '👥',
    path: '/apps/contacts'
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: '🤝',
    path: '/apps/crm'
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: '💰',
    path: '/apps/sales',
    children: [
      { id: 'quotations', name: 'Quotations', icon: '📋', path: '/apps/sales/quotations' },
      { id: 'orders', name: 'Sales Orders', icon: '📦', path: '/apps/sales/orders' },
      { id: 'customers', name: 'Customers', icon: '👥', path: '/apps/sales/customers' },
      { id: 'products', name: 'Products', icon: '📦', path: '/apps/sales/products' }
    ]
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    icon: '🧾',
    path: '/apps/invoicing'
  },
  {
    id: 'point-of-sale',
    name: 'Point of Sale',
    icon: '🏪',
    path: '/apps/point-of-sale'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: '📦',
    path: '/apps/inventory'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    path: '/apps/manufacturing'
  },
  {
    id: 'purchase',
    name: 'Purchase',
    icon: '🛒',
    path: '/apps/purchase'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    icon: '💵',
    path: '/apps/accounting'
  },
  {
    id: 'hr',
    name: 'Human Resources',
    icon: '👥',
    path: '/apps/hr'
  },
  {
    id: 'website',
    name: 'Website',
    icon: '🌐',
    path: '/apps/website'
  },
  {
    id: 'ecommerce',
    name: 'eCommerce',
    icon: '🛍️',
    path: '/apps/ecommerce'
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: '📝',
    path: '/apps/blog'
  },
  {
    id: 'forum',
    name: 'Forum',
    icon: '💭',
    path: '/apps/forum'
  },
  {
    id: 'elearning',
    name: 'eLearning',
    icon: '🎓',
    path: '/apps/elearning'
  },
  {
    id: 'live-chat',
    name: 'Live Chat',
    icon: '💬',
    path: '/apps/live-chat'
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: '🔄',
    path: '/apps/subscriptions'
  },
  {
    id: 'rental',
    name: 'Rental',
    icon: '🏠',
    path: '/apps/rental'
  },
  {
    id: 'expenses',
    name: 'Expenses',
    icon: '💳',
    path: '/apps/expenses'
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: '📄',
    path: '/apps/documents'
  },
  {
    id: 'spreadsheets',
    name: 'Spreadsheets',
    icon: '📊',
    path: '/apps/spreadsheets'
  },
  {
    id: 'sign',
    name: 'Sign',
    icon: '✍️',
    path: '/apps/sign'
  },
  {
    id: 'plm',
    name: 'PLM',
    icon: '⚙️',
    path: '/apps/plm'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: '🔧',
    path: '/apps/maintenance'
  },
  {
    id: 'quality',
    name: 'Quality',
    icon: '🛡️',
    path: '/apps/quality'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📢',
    path: '/apps/marketing'
  },
  {
    id: 'services',
    name: 'Services',
    icon: '💼',
    path: '/apps/services'
  }
];

const OdooSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const filteredModules = appModules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'} flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        {!collapsed && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Apps</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(true)}
                className="text-gray-400 hover:text-white"
              >
                ←
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(false)}
            className="text-gray-400 hover:text-white w-full"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <nav className="p-2">
            {filteredModules.map((module) => (
              <div key={module.id} className="mb-1">
                <div className="flex items-center">
                  <Link
                    to={module.path}
                    className={`flex-1 flex items-center px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === module.path ? 'bg-odoo-primary text-white' : 'text-gray-300'
                    }`}
                  >
                    <span className="mr-3 text-lg">{module.icon}</span>
                    <span className="truncate">{module.name}</span>
                  </Link>
                  {module.children && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModule(module.id)}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {module.children && expandedModules.includes(module.id) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {module.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.path}
                        className={`block px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors ${
                          location.pathname === child.path ? 'bg-odoo-primary text-white' : 'text-gray-400'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="text-xs text-gray-400 text-center">
            Odoo Echo v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default OdooSidebar;
