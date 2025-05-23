
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EcommerceOrder } from '@/types/ecommerce';
import { Package, User, Mail, Calendar } from 'lucide-react';

interface OrderCardProps {
  order: EcommerceOrder;
  onUpdate: (order: EcommerceOrder) => void;
}

const OrderCard = ({ order, onUpdate }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    const statuses: Array<EcommerceOrder['status']> = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onUpdate({ ...order, status: nextStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Order {order.id}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">{order.customer}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span>{order.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Package className="h-4 w-4 mr-2 text-gray-500" />
              <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
            </div>
            <div className="text-lg font-semibold text-green-600">
              ${order.total.toFixed(2)}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStatusChange}
              disabled={order.status === 'delivered' || order.status === 'cancelled'}
            >
              Update Status
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
