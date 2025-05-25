
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { POSSession, POSProduct, POSOrderItem } from '@/types/pointofsale';
import { getStoredPOSProducts, storePOSSessions, getStoredPOSSessions } from '@/lib/localStorageUtils';
import { PlusCircle, Trash2, ShoppingCart, X } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface ActivePOSSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: POSSession | null;
  onSessionUpdate: (updatedSession: POSSession) => void;
}

const ActivePOSSessionModal: React.FC<ActivePOSSessionModalProps> = ({ isOpen, onClose, session: initialSession, onSessionUpdate }) => {
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [currentSession, setCurrentSession] = useState<POSSession | null>(initialSession);
  const [currentOrderItems, setCurrentOrderItems] = useState<POSOrderItem[]>(initialSession?.currentOrderItems || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts(getStoredPOSProducts());
  }, []);

  useEffect(() => {
    setCurrentSession(initialSession);
    setCurrentOrderItems(initialSession?.currentOrderItems || []);
  }, [initialSession]);

  const currentOrderTotal = currentOrderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddProductToOrder = (product: POSProduct) => {
    const existingItemIndex = currentOrderItems.findIndex(item => item.productId === product.id);
    let newOrderItems: POSOrderItem[];

    if (existingItemIndex > -1) {
      newOrderItems = currentOrderItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice } : item
      );
    } else {
      newOrderItems = [
        ...currentOrderItems,
        {
          id: `orderitem-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      ];
    }
    setCurrentOrderItems(newOrderItems);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const newOrderItems = currentOrderItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unitPrice } : item
    );
    setCurrentOrderItems(newOrderItems);
  };

  const handleRemoveItem = (itemId: string) => {
    setCurrentOrderItems(currentOrderItems.filter(item => item.id !== itemId));
  };
  
  const handleSaveChanges = () => {
    if (currentSession) {
      const updatedSession = { ...currentSession, currentOrderItems };
      // Note: totalSales and transactions on the session are for COMPLETED sales.
      // We'll handle completing an order later.
      onSessionUpdate(updatedSession);
      toast({ title: "Order Updated", description: "Current order items saved." });
      // onClose(); // Optionally close after save, or let user continue.
    }
  };

  const handleCompleteOrder = () => {
    if (!currentSession || currentOrderItems.length === 0) {
      toast({ title: "Cannot Complete Order", description: "Add items to the order first.", variant: "destructive" });
      return;
    }
    // This is a mock completion. In a real scenario, this would create a POSTransaction,
    // clear currentOrderItems, update session.totalSales and session.transactions.
    const updatedSession: POSSession = {
      ...currentSession,
      totalSales: currentSession.totalSales + currentOrderTotal,
      transactions: currentSession.transactions + 1,
      currentOrderItems: [], // Clear items after completion
    };
    onSessionUpdate(updatedSession);
    setCurrentOrderItems([]); // Clear local state too
    toast({ title: "Order Completed (Mock)", description: `Paid ${formatCurrency(currentOrderTotal)}` });
    // Potentially close modal or allow new order.
  };


  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isOpen || !currentSession) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Active Session: {currentSession.name}</DialogTitle>
          <DialogDescription>Add products to the current order. Current order total: {formatCurrency(currentOrderTotal)}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow grid grid-cols-3 gap-4 overflow-hidden py-4">
          {/* Product List Section */}
          <div className="col-span-2 flex flex-col h-full">
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="flex-grow border rounded-md p-2">
              {filteredProducts.length === 0 && <p className="text-center text-muted-foreground py-4">No products found.</p>}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center p-2 text-center hover:bg-accent"
                    onClick={() => handleAddProductToOrder(product)}
                  >
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover mb-2 rounded"/>}
                    <span className="text-xs font-medium leading-tight block truncate w-full">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(product.price)}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Current Order Section */}
          <div className="col-span-1 flex flex-col h-full border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center"><ShoppingCart className="mr-2 h-5 w-5"/>Current Order</h3>
            <ScrollArea className="flex-grow mb-3">
              {currentOrderItems.length === 0 && <p className="text-center text-muted-foreground py-4">No items in order.</p>}
              <div className="space-y-2">
                {currentOrderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.unitPrice)} x 
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                          className="h-6 w-12 inline-block ml-1 mr-1 text-xs p-1"
                          min="1"
                        />
                         = {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-auto border-t pt-3">
              <div className="flex justify-between items-center font-bold text-lg mb-3">
                <span>Total:</span>
                <span>{formatCurrency(currentOrderTotal)}</span>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={handleCompleteOrder} disabled={currentOrderItems.length === 0}>
                Complete Order & Pay
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Close Window
          </Button>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes to Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivePOSSessionModal;
