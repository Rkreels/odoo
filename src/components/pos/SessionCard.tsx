
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { POSSession } from '@/types/pointofsale';
import { Clock, DollarSign, Receipt } from 'lucide-react';

interface SessionCardProps {
  session: POSSession;
  onUpdate: (session: POSSession) => void;
}

const SessionCard = ({ session, onUpdate }: SessionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    const newStatus = session.status === 'open' ? 'closed' : 'open';
    onUpdate({
      ...session,
      status: newStatus,
      endTime: newStatus === 'closed' ? new Date().toISOString() : undefined
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.name}</CardTitle>
          <Badge className={getStatusColor(session.status)}>
            {session.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{session.cashRegister}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Started: {new Date(session.startTime).toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            Total Sales: ${session.totalSales.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Receipt className="h-4 w-4 mr-2" />
            Transactions: {session.transactions}
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStatusChange}
          className="w-full"
        >
          {session.status === 'open' ? 'Close Session' : 'Reopen Session'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
