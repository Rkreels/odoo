
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

interface SecondaryNavbarProps {
  currentApp: string;
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({ currentApp }) => {
  return (
    <div className="bg-white border-b">
      <div className="px-4 flex h-10 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="font-medium text-odoo-dark">{currentApp}</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-full text-odoo-primary border-odoo-primary hover:bg-odoo-primary/5">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
          <Button variant="outline" size="sm" className="rounded-full hover:bg-gray-100">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;

