
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import { RentalBooking } from '@/types/rental';

interface BookingCardProps {
  booking: RentalBooking;
  onViewDetails: (booking: RentalBooking) => void;
  onCancelBooking?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onViewDetails, 
  onCancelBooking 
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'in-progress':
        return 'outline';
      case 'completed':
        return 'secondary';
      case 'canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium">{booking.productName}</h3>
              <Badge variant={getStatusBadgeVariant(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <User className="h-3 w-3 mr-1" />
              {booking.customer}
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                From: {booking.startDate}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                To: {booking.endDate}
              </div>
            </div>
            
            <p className="text-sm font-medium">
              Total: {booking.totalPrice}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(booking)}
            >
              Details
            </Button>
            {booking.status === 'confirmed' && onCancelBooking && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onCancelBooking(booking.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
