import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import { SalesOrder, SalesOrderStatus, SalesOrderDeliveryStatus, SalesOrderPaymentStatus } from '@/types/sales';
import { getStoredSalesOrders, storeSalesOrders } from '@/lib/localStorageUtils';
import CreateSalesOrderForm from '@/components/sales/CreateSalesOrderForm';
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Sales = () => {
  const navigate = useNavigate();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(getStoredSalesOrders());
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateOrderForm, setShowCreateOrderForm] = useState<boolean>(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState<boolean>(false);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Refresh sales orders from local storage if needed elsewhere, or on initial load
  useEffect(() => {
    setSalesOrders(getStoredSalesOrders());
  }, [showCreateOrderForm]); // Re-fetch when form closes, for example

  const handleCreateOrder = (newOrder: SalesOrder) => {
    const updatedOrders = [newOrder, ...salesOrders];
    setSalesOrders(updatedOrders);
    storeSalesOrders(updatedOrders); // This will store the order with new fields
    setShowCreateOrderForm(false);
  };

  const handleDeleteSelectedOrders = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No orders selected",
        description: "Please select orders to delete.",
        variant: "destructive",
      });
      return;
    }
    setShowDeleteConfirmDialog(true);
  };

  const confirmDelete = () => {
    const newOrders = salesOrders.filter(order => !selectedItems.includes(order.id));
    setSalesOrders(newOrders);
    storeSalesOrders(newOrders);
    toast({
      title: "Orders Deleted",
      description: `${selectedItems.length} order(s) have been successfully deleted.`,
    });
    setSelectedItems([]);
    setShowDeleteConfirmDialog(false);
  };

  const ordersAfterStatusFilter = filterStatus === 'all' 
    ? salesOrders 
    : salesOrders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());

  const filteredOrders = searchTerm
    ? ordersAfterStatusFilter.filter(order => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          order.id.toLowerCase().includes(lowerSearchTerm) ||
          order.customer.toLowerCase().includes(lowerSearchTerm) ||
          order.salesperson.toLowerCase().includes(lowerSearchTerm) ||
          (order.salesTeam && order.salesTeam.toLowerCase().includes(lowerSearchTerm)) ||
          order.total.toString().includes(lowerSearchTerm) ||
          (order.currency && order.currency.toLowerCase().includes(lowerSearchTerm))
        );
      })
    : ordersAfterStatusFilter;

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredOrders.map(order => order.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  const getStatusBadgeColor = (status: SalesOrderStatus | SalesOrderDeliveryStatus | SalesOrderPaymentStatus) => {
    switch (status) {
      // SalesOrderStatus
      case 'Quotation': return 'bg-blue-100 text-blue-800';
      case 'Order Confirmed': return 'bg-purple-100 text-purple-800';
      case 'Delivery': return 'bg-yellow-100 text-yellow-800'; // Note: 'Delivery' is also a SalesOrderStatus
      case 'Invoiced': return 'bg-green-100 text-green-800';
      case 'Done': return 'bg-gray-200 text-gray-800'; 
      case 'Cancelled': return 'bg-red-100 text-red-800';
      // SalesOrderDeliveryStatus
      case 'Pending Delivery': return 'bg-orange-100 text-orange-800';
      case 'Partially Shipped': return 'bg-yellow-100 text-yellow-800'; // Might clash if not careful
      case 'Shipped': return 'bg-teal-100 text-teal-800';
      // 'Delivered' is SalesOrderDeliveryStatus and also covered by SalesOrderStatus 'Done'
      // SalesOrderPaymentStatus
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Partially Paid': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Refunded': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrencyDisplay = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
  };

  const quotationCount = salesOrders.filter(o => o.status === 'Quotation').length;
  const confirmedOrdersCount = salesOrders.filter(o => o.status === 'Order Confirmed').length;
  // For "To Invoice", consider orders that are confirmed or in delivery but not yet invoiced/done.
  // This requires knowing if an invoice has been generated. We have `linkedInvoiceIds`.
  const toInvoiceCount = salesOrders.filter(o => 
    (o.status === 'Order Confirmed' || o.status === 'Delivery') && 
    (!o.linkedInvoiceIds || o.linkedInvoiceIds.length === 0)
  ).length;
  
  const totalRevenue = salesOrders // Revenue from fully paid orders
    .filter(o => o.paymentStatus === 'Paid' && (o.status === 'Invoiced' || o.status === 'Done'))
    .reduce((sum, o) => sum + o.total, 0);

  const dashboardMetrics = [
    { name: 'Quotations', count: quotationCount.toString(), color: 'bg-blue-500' },
    { name: 'Confirmed Orders', count: confirmedOrdersCount.toString(), color: 'bg-purple-500' },
    { name: 'Ready to Invoice', count: toInvoiceCount.toString(), color: 'bg-yellow-500' }, // Updated metric name
    { name: 'Total Paid Revenue', count: formatCurrencyDisplay(totalRevenue, 'USD'), color: 'bg-green-500' }, // Specify currency for primary display
  ];

  return (
    <TopbarDashboardLayout currentApp="Sales">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">Sales Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardMetrics.map((metric) => (
              <div key={metric.name} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${metric.color} mr-2`}></div>
                  <h3 className="font-medium text-odoo-dark">{metric.name}</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-odoo-dark">{metric.count}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center flex-wrap gap-2">
              <Button variant="outline" className="mr-2" onClick={() => setShowCreateOrderForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
              <Button 
                variant="outline" 
                className="mr-2" 
                onClick={handleDeleteSelectedOrders}
                disabled={selectedItems.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Sel.
              </Button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-odoo-primary focus:border-odoo-primary w-full sm:w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <select 
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Order Statuses</option>
                <option value="Quotation">Quotation</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Delivery">Delivery</option>
                <option value="Invoiced">Invoiced</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              
              <Button variant="outline" size="sm" disabled>
                <FileText className="h-4 w-4 mr-1" />Filters
              </Button>
              
              <Button variant="outline" size="sm" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Group By
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={filteredOrders.length > 0 && selectedItems.length === filteredOrders.length} 
                      onCheckedChange={toggleSelectAll} 
                      aria-label="Select all orders"
                      disabled={filteredOrders.length === 0}
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Salesperson</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Tax ({filteredOrders[0]?.taxRate || 0}%)</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(order.id)} 
                          onCheckedChange={() => toggleSelectItem(order.id)} 
                          aria-label={`Select ${order.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id} {order.version && order.version > 1 ? `(v${order.version})`:''}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.salesperson}</TableCell>
                      <TableCell>{formatCurrencyDisplay(order.total, order.currency)}</TableCell>
                      <TableCell>{formatCurrencyDisplay(order.taxAmount, order.currency)} ({order.taxRate}%)</TableCell>
                      <TableCell>{order.currency}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.deliveryStatus!)} variant="outline">
                          {order.deliveryStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.paymentStatus!)} variant="outline">
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Placeholder for "Create Invoice" button - needs navigation and logic */}
                        {(order.status === 'Order Confirmed' || order.status === 'Delivery') && (!order.linkedInvoiceIds || order.linkedInvoiceIds.length === 0) &&
                            <Button variant="outline" size="sm" onClick={() => {
                                toast({title: "Navigate to Invoicing", description: `Would create invoice for ${order.id}`});
                                // navigate(`/apps/invoicing/create?salesOrderId=${order.id}`); // Example navigation
                            }}>
                                <FileText className="h-3 w-3 mr-1" /> Invoice
                            </Button>
                        }
                        {order.linkedInvoiceIds && order.linkedInvoiceIds.length > 0 &&
                            <Button variant="ghost" size="sm" onClick={() => {
                                toast({title: "View Invoices", description: `Linked to: ${order.linkedInvoiceIds?.join(', ')}`});
                                // navigate(`/apps/invoicing?search=${order.linkedInvoiceIds[0]}`); // Example
                            }}>
                                <ExternalLink className="h-3 w-3 mr-1" /> View Inv.
                            </Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      No orders found. {searchTerm ? "Try adjusting your search criteria." : "Create a new sales order to get started."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-odoo-gray">
              Showing {filteredOrders.length} of {salesOrders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CreateSalesOrderForm 
        isOpen={showCreateOrderForm}
        onClose={() => setShowCreateOrderForm(false)}
        onOrderCreate={handleCreateOrder}
      />
      <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedItems.length} selected order(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TopbarDashboardLayout>
  );
};

export default Sales;
