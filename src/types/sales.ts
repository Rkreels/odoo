export type SalesOrderStatus = 
  | 'Quotation' 
  | 'Order Confirmed' 
  | 'Delivery' 
  | 'Invoiced' 
  | 'Done' 
  | 'Cancelled';

export interface SalesOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  attributes?: string; // New: For simple product attributes like "Color: Red, Size: L"
  discount?: number; // New: Fixed discount amount for this item
  subtotal: number; // This will be (quantity * unitPrice) - discount
}

export type SalesOrderDeliveryStatus = 'Pending Delivery' | 'Partially Shipped' | 'Shipped' | 'Delivered';
export type SalesOrderPaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded';
export type Currency = 'USD' | 'EUR' | 'GBP'; // Add more as needed

export interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  salesperson: string;
  salesTeam?: string;
  items?: SalesOrderItem[];
  subtotalBeforeTax: number; // Sum of item subtotals
  taxRate: number; // Percentage, e.g., 10 for 10%
  taxAmount: number; // Calculated tax
  total: number; // This will be subtotalBeforeTax + taxAmount
  status: SalesOrderStatus;
  version?: number; // For quotation versioning
  deliveryStatus?: SalesOrderDeliveryStatus;
  paymentStatus?: SalesOrderPaymentStatus;
  currency?: Currency;
  linkedInvoiceIds?: string[]; // For linking to invoices
  // notes?: string; // Consider adding if detailed notes per order are needed
}

export interface SalesOrderTemplate {
  id: string;
  name: string;
  customer: string;
  salesperson: string;
  salesTeam?: string;
  items: SalesOrderItem[]; // Store item structure
  taxRate: number;
  currency: Currency;
}
