
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bell, Calendar, Home, Mail, MessageSquare, Settings, User } from 'lucide-react';

interface SidebarProps {
  onAppSelect: (app: string) => void;
}

interface AppIcon {
  name: string;
  icon: React.ElementType;
  color: string;
  path: string;
}

const appIcons: AppIcon[] = [
  { name: 'Discuss', icon: MessageSquare, color: 'bg-purple-600', path: '/apps/discuss' },
  { name: 'CRM', icon: User, color: 'bg-blue-600', path: '/apps/crm' },
  { name: 'Sales', icon: Bell, color: 'bg-orange-600', path: '/apps/sales' },
  { name: 'Invoicing', icon: Mail, color: 'bg-red-600', path: '/apps/invoicing' },
  { name: 'Calendar', icon: Calendar, color: 'bg-green-600', path: '/apps/calendar' },
  { name: 'Contacts', icon: User, color: 'bg-yellow-600', path: '/apps/contacts' },
  { name: 'Settings', icon: Settings, color: 'bg-gray-600', path: '/apps/settings' },
];

const Sidebar = ({ onAppSelect }: SidebarProps) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={cn(
      "h-screen bg-odoo-light border-r flex flex-col transition-all duration-300",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="p-4 flex justify-between items-center border-b">
        <Link to="/dashboard" className="flex items-center">
          <Home className="h-6 w-6 text-odoo-primary" />
          {expanded && <span className="ml-2 font-medium text-odoo-dark">Home</span>}
        </Link>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-odoo-gray hover:text-odoo-primary"
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className={cn("grid gap-4", expanded ? "grid-cols-3 px-4" : "grid-cols-1 px-2")}>
          {appIcons.map((app) => (
            <Link
              key={app.name}
              to={app.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                "hover:bg-odoo-light hover:shadow",
                location.pathname === app.path ? "bg-odoo-light shadow" : ""
              )}
              onClick={() => onAppSelect(app.name)}
            >
              <div className={cn("odoo-app-icon mb-1", app.color)}>
                <app.icon className="h-6 w-6" />
              </div>
              {expanded && (
                <span className="text-xs text-center font-medium text-odoo-dark">
                  {app.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <Link 
          to="/profile" 
          className="flex items-center p-2 rounded-lg hover:bg-odoo-light"
        >
          <div className="h-8 w-8 rounded-full bg-odoo-primary text-white flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          {expanded && (
            <div className="ml-2">
              <div className="text-sm font-medium text-odoo-dark">John Doe</div>
              <div className="text-xs text-odoo-gray">Administrator</div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
