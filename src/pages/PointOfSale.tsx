import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import SessionCard from '@/components/pos/SessionCard';
import ActivePOSSessionModal from '@/components/pos/ActivePOSSessionModal'; // Import the modal
import { Store, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { POSSession } from '@/types/pointofsale';
import { getStoredPOSSessions, storePOSSessions, getStoredPOSProducts } from '@/lib/localStorageUtils';

const PointOfSale = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<POSSession[]>(getStoredPOSSessions());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<POSSession | null>(null);

  // Preload products once if needed by the modal or other components
  useEffect(() => {
    getStoredPOSProducts(); // Ensures products are in local storage if not already
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateSession = (updatedSession: POSSession) => {
    const newSessions = sessions.map(session =>
      session.id === updatedSession.id ? updatedSession : session
    );
    setSessions(newSessions);
    storePOSSessions(newSessions);
    // If the updated session is the one in the modal, update selectedSession
    if (selectedSession && selectedSession.id === updatedSession.id) {
      setSelectedSession(updatedSession);
    }
  };

  const handleCreateSession = () => {
    const newSession: POSSession = {
      id: Date.now().toString(),
      name: `Session ${Date.now().toString().slice(-4)}`,
      startTime: new Date().toISOString(),
      status: 'open',
      cashRegister: `Register ${String(sessions.length + 1).padStart(3, '0')}`,
      startingCash: 200,
      totalSales: 0,
      transactions: 0,
      currentOrderItems: [], // Initialize with empty order items
    };
    const newSessions = [newSession, ...sessions];
    setSessions(newSessions);
    storePOSSessions(newSessions);
    // Optionally open the new session in the modal directly
    // handleResumeSession(newSession); 
  };

  const handleResumeSession = (session: POSSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
    // Refresh sessions from storage to reflect any changes made in modal if not passed up directly
    // For better reactivity, ensure onSessionUpdate in modal updates parent state.
    setSessions(getStoredPOSSessions()); 
  };

  const activeSessions = sessions.filter(s => s.status === 'open');
  const totalSalestoday = sessions
    .filter(s => new Date(s.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.totalSales, 0);
  
  const totalTransactionsToday = sessions
    .filter(s => new Date(s.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.transactions, 0);

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
              <p className="text-2xl font-bold text-green-900">${totalSalestoday.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Today's Transactions</h3>
              <p className="text-2xl font-bold text-purple-900">{totalTransactionsToday}</p>
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
                  onResume={handleResumeSession} // Pass the resume handler
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedSession && (
        <ActivePOSSessionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          session={selectedSession}
          onSessionUpdate={handleUpdateSession}
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default PointOfSale;
