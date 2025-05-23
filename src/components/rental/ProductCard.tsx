
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { RentalProduct } from '@/types/rental';

interface ProductCardProps {
  product: RentalProduct;
  onRent: (product: RentalProduct) => void;
  onViewDetails: (product: RentalProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRent, onViewDetails }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'rented':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      case 'reserved':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={product.image || "https://via.placeholder.com/400x200?text=Product+Image"} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <Badge 
          variant={getStatusBadgeVariant(product.status)} 
          className="absolute top-2 right-2"
        >
          {product.status}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div>
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-3">Category: {product.category}</p>
          
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            {product.location}
          </div>
          
          <div className="grid grid-cols-3 gap-1 mb-4 text-center">
            <div className="p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-500">Day</p>
              <p className="font-medium">{product.dailyRate}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-500">Week</p>
              <p className="font-medium">{product.weeklyRate}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-500">Month</p>
              <p className="font-medium">{product.monthlyRate}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm" 
              onClick={() => onViewDetails(product)}
            >
              Details
            </Button>
            <Button 
              className="flex-1 bg-odoo-primary hover:bg-odoo-primary/90" 
              size="sm" 
              disabled={product.status !== 'available'}
              onClick={() => onRent(product)}
            >
              {product.status === 'available' ? 'Rent Now' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
