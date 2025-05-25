
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalesOrder, SalesOrderStatus, SalesOrderItem, SalesOrderDeliveryStatus, SalesOrderPaymentStatus, Currency, SalesOrderTemplate } from '@/types/sales';
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Save, Download } from 'lucide-react';
import { getStoredSalesTeams, getStoredSalesOrderTemplates, storeSalesOrderTemplates, generateId } from '@/lib/localStorageUtils';

interface CreateSalesOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreate: (newOrder: SalesOrder) => void;
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP'];

const CreateSalesOrderForm: React.FC<CreateSalesOrderFormProps> = ({ isOpen, onClose, onOrderCreate }) => {
  const [customer, setCustomer] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const salesTeams = getStoredSalesTeams();
  const [salesTeam, setSalesTeam] = useState<string>(salesTeams[0] || 'Not Assigned');
  const [orderItems, setOrderItems] = useState<SalesOrderItem[]>([]);
  
  const [taxRate, setTaxRate] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>('USD');
  
  const [calculatedSubtotalBeforeTax, setCalculatedSubtotalBeforeTax] = useState(0);
  const [calculatedTaxAmount, setCalculatedTaxAmount] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [templates, setTemplates] = useState<SalesOrderTemplate[]>(getStoredSalesOrderTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [newTemplateName, setNewTemplateName] = useState<string>('');


  useEffect(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * (taxRate / 100);
    const totalAmount = subtotal + tax;
    setCalculatedSubtotalBeforeTax(subtotal);
    setCalculatedTaxAmount(tax);
    setCalculatedTotal(totalAmount);
  }, [orderItems, taxRate]);

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { id: `item-${Date.now()}`, productName: '', quantity: 1, unitPrice: 0, discount: 0, attributes: '', subtotal: 0 },
    ]);
  };

  const handleItemChange = (index: number, field: keyof SalesOrderItem | 'attributes', value: string | number) => {
    const newItems = [...orderItems];
    const item = { ...newItems[index] };

    if (field === 'productName') item.productName = value as string;
    else if (field === 'quantity') item.quantity = Math.max(0, Number(value));
    else if (field === 'unitPrice') item.unitPrice = Math.max(0, parseFloat(value as string));
    else if (field === 'discount') item.discount = Math.max(0, parseFloat(value as string));
    else if (field === 'attributes') item.attributes = value as string;
    
    const unitPrice = isNaN(item.unitPrice) ? 0 : item.unitPrice;
    const discount = isNaN(item.discount!) ? 0 : item.discount!;
    item.subtotal = Math.max(0, (item.quantity * unitPrice) - discount); // Ensure subtotal is not negative

    newItems[index] = item;
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCustomer('');
    setSalesperson('');
    setSalesTeam(salesTeams[0] || 'Not Assigned');
    setOrderItems([]);
    setTaxRate(0);
    setCurrency('USD');
    setCalculatedSubtotalBeforeTax(0);
    setCalculatedTaxAmount(0);
    setCalculatedTotal(0);
    setSelectedTemplateId('');
    setNewTemplateName('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!customer || !salesperson || !salesTeam || orderItems.length === 0) {
      toast({ title: "Validation Error", description: "Customer, salesperson, sales team, and at least one item are required.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (orderItems.some(item => !item.productName || item.quantity <= 0 || item.unitPrice < 0 || (item.discount || 0) < 0 || item.subtotal < 0)) {
       toast({ title: "Validation Error", description: "Ensure all order items have product name, valid quantity, unit price, and discount (item subtotal cannot be negative).", variant: "destructive" });
       setIsLoading(false);
       return;
    }
    if (taxRate < 0) {
        toast({ title: "Validation Error", description: "Tax rate cannot be negative.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    const newOrder: SalesOrder = {
      id: `SO-${generateId()}`,
      customer,
      date: new Date().toISOString().split('T')[0],
      salesperson,
      salesTeam,
      items: orderItems,
      taxRate,
      currency,
      subtotalBeforeTax: calculatedSubtotalBeforeTax,
      taxAmount: calculatedTaxAmount,
      total: calculatedTotal,
      status: 'Quotation' as SalesOrderStatus,
      version: 1,
      deliveryStatus: 'Pending Delivery' as SalesOrderDeliveryStatus,
      paymentStatus: 'Unpaid' as SalesOrderPaymentStatus,
      linkedInvoiceIds: [],
    };

    onOrderCreate(newOrder);
    toast({ title: "Sales Order Created", description: `Order ${newOrder.id} for ${newOrder.customer} created.` });
    setIsLoading(false);
    handleClose();
  };
  
  const handleSaveAsTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({ title: "Template Error", description: "Please provide a name for the template.", variant: "destructive" });
      return;
    }
    if (orderItems.length === 0 && !customer && !salesperson && !salesTeam && taxRate === 0) {
      toast({ title: "Template Error", description: "Cannot save an empty order as template. Add some details.", variant: "destructive" });
      return;
    }
    const newTemplate: SalesOrderTemplate = {
      id: `tpl-${generateId()}`,
      name: newTemplateName.trim(),
      customer,
      salesperson,
      salesTeam: salesTeam || (salesTeams[0] || 'Not Assigned'),
      items: orderItems.map(item => ({...item, id: `item-${generateId()}`})), // Give new IDs to items for template
      taxRate,
      currency,
    };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    storeSalesOrderTemplates(updatedTemplates);
    setNewTemplateName('');
    toast({ title: "Template Saved", description: `Template "${newTemplate.name}" saved successfully.` });
  };

  const handleLoadTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomer(template.customer);
      setSalesperson(template.salesperson);
      setSalesTeam(template.salesTeam || (salesTeams[0] || 'Not Assigned'));
      // Ensure items from template get unique IDs if they are to be modified independently later in this new order form
      setOrderItems(template.items.map(item => ({ ...item, id: `item-${generateId()}`, subtotal: (item.quantity * item.unitPrice) - (item.discount || 0) })));
      setTaxRate(template.taxRate);
      setCurrency(template.currency);
      toast({ title: "Template Loaded", description: `Template "${template.name}" loaded.` });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-4xl"> {/* Increased width for more fields */}
        <DialogHeader>
          <DialogTitle>Create Sales Order</DialogTitle>
          <DialogDescription>Add details to create a new sales order. You can also save or load order templates.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Customer, Salesperson, Sales Team - existing inputs */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">Customer</Label>
              <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salesperson" className="text-right">Salesperson</Label>
              <Input id="salesperson" value={salesperson} onChange={(e) => setSalesperson(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salesTeam" className="text-right">Sales Team</Label>
              <Select value={salesTeam} onValueChange={setSalesTeam}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select team" /></SelectTrigger>
                <SelectContent>{salesTeams.map(team => (<SelectItem key={team} value={team}>{team}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {/* Currency and Tax Rate */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">Currency</Label>
              <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                <SelectTrigger className="col-span-1"><SelectValue placeholder="Select currency" /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
              </Select>
              <Label htmlFor="taxRate" className="text-right col-start-3">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="col-span-1" step="0.01" min="0" />
            </div>
          </div>

          {/* Quotation Templates Section */}
          <div className="my-4 p-4 border rounded-md">
            <h4 className="text-md font-medium mb-2">Quotation Templates</h4>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="loadTemplate" className="text-xs">Load Template</Label>
                <Select value={selectedTemplateId} onValueChange={handleLoadTemplate}>
                  <SelectTrigger id="loadTemplate"><SelectValue placeholder="Select a template to load" /></SelectTrigger>
                  <SelectContent>
                    {templates.length === 0 && <SelectItem value="no-templates" disabled>No templates saved</SelectItem>}
                    {templates.map(t => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Label htmlFor="newTemplateName" className="text-xs">New Template Name</Label>
                  <Input id="newTemplateName" placeholder="Enter template name" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleSaveAsTemplate} disabled={!newTemplateName.trim()}>
                  <Save className="mr-2 h-4 w-4" /> Save Current
                </Button>
              </div>
            </div>
          </div>

          {/* Order Items - existing section */}
          <div className="my-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
            </div>
            {orderItems.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No items added.</p>}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {orderItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start border p-3 rounded-md">
                  <div className="col-span-12 sm:col-span-4"><Label htmlFor={`productName-${index}`} className="text-xs mb-1 block">Product Name</Label><Input id={`productName-${index}`} placeholder="Product Name" value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} className="text-sm"/></div>
                  <div className="col-span-6 sm:col-span-4"><Label htmlFor={`attributes-${index}`} className="text-xs mb-1 block">Attributes</Label><Input id={`attributes-${index}`} placeholder="e.g. Color: Red" value={item.attributes || ''} onChange={(e) => handleItemChange(index, 'attributes', e.target.value)} className="text-sm"/></div>
                  <div className="col-span-6 sm:col-span-1"><Label htmlFor={`quantity-${index}`} className="text-xs mb-1 block">Qty</Label><Input id={`quantity-${index}`} type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="text-sm" min="1"/></div>
                  <div className="col-span-6 sm:col-span-2"><Label htmlFor={`unitPrice-${index}`} className="text-xs mb-1 block">Unit Price</Label><Input id={`unitPrice-${index}`} type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} className="text-sm" step="0.01" min="0"/></div>
                  <div className="col-span-6 sm:col-span-2"><Label htmlFor={`discount-${index}`} className="text-xs mb-1 block">Discount</Label><Input id={`discount-${index}`} type="number" placeholder="Discount" value={item.discount || 0} onChange={(e) => handleItemChange(index, 'discount', e.target.value)} className="text-sm" step="0.01" min="0"/></div>
                  <div className="col-span-10 sm:col-span-2 text-right text-sm self-end pb-1">{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(item.subtotal)}</div>
                  <div className="col-span-2 sm:col-span-1 self-center"><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive hover:text-destructive/80 h-8 w-8 mt-4 sm:mt-0"><Trash2 className="h-4 w-4" /></Button></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Totals section */}
          <div className="mt-6 mb-2 space-y-1 text-right pr-2">
            <div className="grid grid-cols-4 items-center">
              <Label className="col-span-3 font-medium">Subtotal:</Label>
              <div className="col-span-1 font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(calculatedSubtotalBeforeTax)}</div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <Label className="col-span-3 font-medium">Tax ({taxRate}%):</Label>
              <div className="col-span-1 font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(calculatedTaxAmount)}</div>
            </div>
            <div className="grid grid-cols-4 items-center text-lg">
              <Label className="col-span-3 font-semibold">Total:</Label>
              <div className="col-span-1 font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(calculatedTotal)}</div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" onClick={handleClose}>Cancel</Button></DialogClose>
            <Button type="submit" disabled={isLoading || orderItems.length === 0}>{isLoading ? 'Creating...' : 'Create Order'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalesOrderForm;
