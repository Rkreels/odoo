
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/invoicing';
import { Calendar, DollarSign, Mail, User } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
  onUpdate: (invoice: Invoice) => void;
}

const InvoiceCard = ({ invoice, onUpdate }: InvoiceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    const statuses: Array<Invoice['status']> = ['draft', 'sent', 'paid'];
    const currentIndex = statuses.indexOf(invoice.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onUpdate({ ...invoice, status: nextStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{invoice.number}</CardTitle>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{invoice.customer}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Due: {new Date(invoice.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            Total: ${invoice.total.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {invoice.customerEmail}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="h-4 w-4 mr-1" />
            Send
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleStatusChange}
            className="flex-1"
          >
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
