
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EcommerceProduct } from '@/types/ecommerce';

interface CreateProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreate: (product: EcommerceProduct) => void;
}

const CreateProductForm = ({ isOpen, onClose, onProductCreate }: CreateProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    stock: '',
    sku: '',
  });

  const generateSKU = (name: string) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .substring(0, 8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: EcommerceProduct = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      category: formData.category,
      stock: parseInt(formData.stock),
      sku: formData.sku || generateSKU(formData.name),
      image: '/placeholder.svg',
      status: 'active',
    };

    onProductCreate(newProduct);
    onClose();
    setFormData({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      category: '',
      stock: '',
      sku: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Sale Price ($)</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU (optional)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-odoo-primary hover:bg-odoo-primary/90">
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;
