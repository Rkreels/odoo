
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
  subtotal: number;
}

export interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  salesperson: string;
  total: number;
  status: SalesOrderStatus;
  items?: SalesOrderItem[]; // Added order items
}

