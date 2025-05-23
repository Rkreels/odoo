
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EcommerceProduct } from '@/types/ecommerce';
import { Edit, Package, DollarSign } from 'lucide-react';

interface ProductCardProps {
  product: EcommerceProduct;
  onUpdate: (product: EcommerceProduct) => void;
}

const ProductCard = ({ product, onUpdate }: ProductCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    onUpdate({ ...product, status: newStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge className={getStatusColor(product.status)}>
            {product.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{product.category}</p>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price:</span>
            <div className="flex items-center space-x-2">
              {product.salePrice && (
                <span className="text-sm line-through text-gray-500">${product.price}</span>
              )}
              <span className="font-semibold text-lg">
                ${product.salePrice || product.price}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stock:</span>
            <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
              {product.stock} units
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">SKU:</span>
            <span className="text-sm font-mono">{product.sku}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleStatusToggle}
            className="flex-1"
          >
            {product.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
