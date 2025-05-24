
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { SalesOrder, SalesOrderStatus } from '@/types/sales';
import { toast } from "@/components/ui/use-toast";

interface CreateSalesOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreate: (newOrder: SalesOrder) => void;
}

const CreateSalesOrderForm: React.FC<CreateSalesOrderFormProps> = ({ isOpen, onClose, onOrderCreate }) => {
  const [customer, setCustomer] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [total, setTotal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!customer || !salesperson || !total || isNaN(parseFloat(total))) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields correctly. Total must be a number.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const newOrder: SalesOrder = {
      id: `SO-${Date.now().toString()}`, // Simple unique ID
      customer,
      date: new Date().toISOString().split('T')[0], // Today's date
      salesperson,
      total: parseFloat(total),
      status: 'Quotation' as SalesOrderStatus, // Default status
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
    setTotal('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Sales Order</DialogTitle>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total" className="text-right">
                Total
              </Label>
              <Input
                id="total"
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="col-span-3"
                required
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalesOrderForm;

