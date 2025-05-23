
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import SessionCard from '@/components/pos/SessionCard';
import { Store, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { POSSession } from '@/types/pointofsale';

const PointOfSale = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<POSSession[]>([
    {
      id: '1',
      name: 'Main Counter Session',
      startTime: '2024-01-15T08:00:00Z',
      status: 'open',
      cashRegister: 'Register 001',
      startingCash: 200,
      totalSales: 1250.50,
      transactions: 23
    },
    {
      id: '2',
      name: 'Express Lane Session',
      startTime: '2024-01-15T09:30:00Z',
      endTime: '2024-01-15T17:30:00Z',
      status: 'closed',
      cashRegister: 'Register 002',
      startingCash: 150,
      totalSales: 850.25,
      transactions: 18
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateSession = (updatedSession: POSSession) => {
    setSessions(prev => prev.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const handleCreateSession = () => {
    const newSession: POSSession = {
      id: Date.now().toString(),
      name: `Session ${Date.now()}`,
      startTime: new Date().toISOString(),
      status: 'open',
      cashRegister: `Register ${sessions.length + 1}`,
      startingCash: 200,
      totalSales: 0,
      transactions: 0
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const activeSessions = sessions.filter(s => s.status === 'open');
  const totalSalestoday = sessions.reduce((sum, s) => sum + s.totalSales, 0);

  return (
    <TopbarDashboardLayout currentApp="Point of Sale">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Store className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Point of Sale</h1>
          </div>
          <p className="text-odoo-gray">
            Modern point of sale for retailers. Manage sales, inventory, and customer interactions in your physical stores.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Active Sessions</h3>
              <p className="text-2xl font-bold text-blue-900">{activeSessions.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Today's Sales</h3>
              <p className="text-2xl font-bold text-green-900">${totalSalestoday.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Total Transactions</h3>
              <p className="text-2xl font-bold text-purple-900">{sessions.reduce((sum, s) => sum + s.transactions, 0)}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={handleCreateSession}
              >
                <Plus className="h-4 w-4 mr-2" />
                Open New Session
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Sales Reports
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-odoo-dark mb-4">POS Sessions</h2>
          {sessions.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-odoo-gray">No POS sessions available. Create your first session to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onUpdate={handleUpdateSession}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default PointOfSale;
