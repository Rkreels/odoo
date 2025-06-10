
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooSidebar from './OdooSidebar';
import TopbarDashboardLayout from './TopbarDashboardLayout';

interface OdooMainLayoutProps {
  children: ReactNode;
  currentApp?: string;
  showSidebar?: boolean;
}

const OdooMainLayout = ({ children, currentApp = 'Dashboard', showSidebar = true }: OdooMainLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && <OdooSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopbarDashboardLayout currentApp={currentApp}>
          {children}
        </TopbarDashboardLayout>
      </div>
    </div>
  );
};

export default OdooMainLayout;
