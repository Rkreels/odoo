
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseOrder } from '@/types/purchase';
import { Calendar, DollarSign, Package, Truck } from 'lucide-react';

interface PurchaseOrderCardProps {
  order: PurchaseOrder;
  onUpdate: (order: PurchaseOrder) => void;
}

const PurchaseOrderCard = ({ order, onUpdate }: PurchaseOrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    const statuses: Array<PurchaseOrder['status']> = ['draft', 'sent', 'confirmed', 'received'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onUpdate({ ...order, status: nextStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{order.number}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{order.supplier}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            Total: ${order.total.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            Items: {order.items.length}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Truck className="h-4 w-4 mr-1" />
            Track
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

export default PurchaseOrderCard;
