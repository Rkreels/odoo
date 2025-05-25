
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { SalesOrder, SalesOrderStatus, SalesOrderItem } from '@/types/sales';
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, X } from 'lucide-react';

interface CreateSalesOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreate: (newOrder: SalesOrder) => void;
}

const CreateSalesOrderForm: React.FC<CreateSalesOrderFormProps> = ({ isOpen, onClose, onOrderCreate }) => {
  const [customer, setCustomer] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [orderItems, setOrderItems] = useState<SalesOrderItem[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    setCalculatedTotal(total);
  }, [orderItems]);

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { id: `item-${Date.now()}`, productName: '', quantity: 1, unitPrice: 0, subtotal: 0 },
    ]);
  };

  const handleItemChange = (index: number, field: keyof SalesOrderItem, value: string | number) => {
    const newItems = [...orderItems];
    const item = { ...newItems[index] };

    if (field === 'productName') {
      item.productName = value as string;
    } else if (field === 'quantity') {
      item.quantity = Math.max(0, Number(value));
    } else if (field === 'unitPrice') {
      item.unitPrice = Math.max(0, parseFloat(value as string));
    }
    
    item.subtotal = item.quantity * item.unitPrice;
    newItems[index] = item;
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!customer || !salesperson || orderItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill customer, salesperson, and add at least one order item.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (orderItems.some(item => !item.productName || item.quantity <= 0 || item.unitPrice < 0)) {
       toast({
        title: "Validation Error",
        description: "Please ensure all order items have a product name, valid quantity, and unit price.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const newOrder: SalesOrder = {
      id: `SO-${Date.now().toString()}`,
      customer,
      date: new Date().toISOString().split('T')[0],
      salesperson,
      items: orderItems,
      total: calculatedTotal,
      status: 'Quotation' as SalesOrderStatus,
    };

    onOrderCreate(newOrder);
    toast({
      title: "Sales Order Created",
      description: `Order ${newOrder.id} for ${newOrder.customer} has been created.`,
    });
    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setCustomer('');
    setSalesperson('');
    setOrderItems([]);
    setCalculatedTotal(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Sales Order</DialogTitle>
          <DialogDescription>Add customer details and order items to create a new sales order.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salesperson" className="text-right">
                Salesperson
              </Label>
              <Input
                id="salesperson"
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>

          <div className="my-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            {orderItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No items added yet.</p>
            )}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {orderItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center border p-2 rounded-md">
                  <div className="col-span-5">
                    <Label htmlFor={`productName-${index}`} className="sr-only">Product Name</Label>
                    <Input
                      id={`productName-${index}`}
                      placeholder="Product Name"
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                     <Label htmlFor={`quantity-${index}`} className="sr-only">Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="text-sm"
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`unitPrice-${index}`} className="sr-only">Unit Price</Label>
                    <Input
                      id={`unitPrice-${index}`}
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.subtotal)}
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4 mt-6 mb-2">
            <Label className="text-right col-span-3 font-semibold text-lg">
              Total
            </Label>
            <div className="col-span-1 text-lg font-bold text-right pr-2">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculatedTotal)}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || orderItems.length === 0}>
              {isLoading ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalesOrderForm;
